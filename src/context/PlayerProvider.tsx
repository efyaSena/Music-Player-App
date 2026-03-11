import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerContext } from "./PlayerContext";
import type { PlayerContextType, Song } from "../types/player";
import { saveTrack, getTrack } from "../utils/audioCache";

const PLAYER_STORAGE_KEY = "bd-rythm-player";

const DISCOVERY_NODES = [
  "https://discoveryprovider.audius.co",
  "https://discoveryprovider2.audius.co",
];

function pickNode(exclude?: string) {
  const choices = DISCOVERY_NODES.filter((n) => n !== exclude);
  return choices[Math.floor(Math.random() * choices.length)] || DISCOVERY_NODES[0];
}

function isAudiusStreamUrl(url: string = "") {
  return url.includes("/v1/tracks/") && url.includes("/stream");
}

function getAudiusTrackId(url: string = "") {
  const m = url.match(/\/v1\/tracks\/([^/]+)\/stream/);
  return m?.[1] || null;
}

function getAudiusBase(url: string = "") {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

function buildAudiusStreamUrl(trackId: string, base?: string) {
  const b = base || DISCOVERY_NODES[0];
  return `${b}/v1/tracks/${trackId}/stream?app_name=bd-rythm`;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const nextAudioRef = useRef<HTMLAudioElement>(new Audio());

  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [repeatOne, setRepeatOne] = useState<boolean>(false);

  const CROSSFADE_TIME = 3;
  const [isCrossfading, setIsCrossfading] = useState(false);

  /* ---------- HELPERS ---------- */

  const getPlayableSrc = useCallback(async (song: Song): Promise<string> => {
    const cached = await getTrack(song.id);

    if (cached) {
      return URL.createObjectURL(cached);
    }

    return song.audio;
  }, []);

  const cacheTrackIfNeeded = useCallback(async (song: Song) => {
    try {
      const existing = await getTrack(song.id);
      if (existing) return;

      const res = await fetch(song.audio);
      const blob = await res.blob();
      await saveTrack(song.id, blob);
    } catch {
      // ignore cache errors
    }
  }, []);

  /* ---------- RESTORE PLAYER ---------- */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAYER_STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);

      if (saved.queue) setQueue(saved.queue);
      if (typeof saved.currentIndex === "number") setCurrentIndex(saved.currentIndex);
      if (saved.currentSong) setCurrentSong(saved.currentSong);
      if (typeof saved.currentTime === "number") setCurrentTime(saved.currentTime);
      if (typeof saved.isPlaying === "boolean") setIsPlaying(saved.isPlaying);

      if (saved.currentSong?.audio) {
        audioRef.current.src = saved.currentSong.audio;
        audioRef.current.currentTime = saved.currentTime || 0;

        if (saved.isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    } catch (err) {
      console.error("Failed to restore player state", err);
    }
  }, []);

  /* ---------- SET SONG ---------- */

  const setSong = useCallback((song: Song) => {
    setQueue([song]);
    setCurrentIndex(0);
    setCurrentSong(song);

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (song?.audio) {
      audioRef.current.src = song.audio;
      audioRef.current.load();
    }
  }, []);

  /* ---------- PLAY SONG (WITH CACHE) ---------- */

  const playSong = useCallback(
    async (song: Song) => {
      if (!song) return;

      setQueue([song]);
      setCurrentIndex(0);
      setCurrentSong(song);

      if (!song.audio) {
        setIsPlaying(false);
        return;
      }

      try {
        const originalUrl = song.audio;
        const audius = isAudiusStreamUrl(originalUrl);
        const trackId = audius ? getAudiusTrackId(originalUrl) : null;

        const maxAttempts = audius && trackId ? 3 : 1;
        let attemptUrl = originalUrl;
        let lastBase = audius ? getAudiusBase(originalUrl) : "";

        // Prefer cache first
        const cached = await getTrack(song.id);
        if (cached) {
          audioRef.current.src = URL.createObjectURL(cached);
          await audioRef.current.play();
          setIsPlaying(true);
          return;
        }

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          if (attempt > 1 && audius && trackId) {
            const nextBase = pickNode(lastBase);
            lastBase = nextBase;
            attemptUrl = buildAudiusStreamUrl(trackId, nextBase);
          }

          if (audioRef.current.src !== attemptUrl) {
            audioRef.current.src = attemptUrl;
          }

          try {
            // save in background
            fetch(attemptUrl)
              .then((r) => r.blob())
              .then((blob) => saveTrack(song.id, blob))
              .catch(() => {});

            await audioRef.current.play();
            setIsPlaying(true);
            return;
          } catch (e) {
            if (attempt === maxAttempts) {
              console.log("Play blocked:", e);
              setIsPlaying(false);
            }
          }
        }
      } catch (e) {
        console.log("Playback error:", e);
        setIsPlaying(false);
      }
    },
    []
  );

  /* ---------- CROSSFADE ENGINE ---------- */

  const startCrossfade = useCallback(async () => {
    if (isCrossfading) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) return;

    const nextSong = queue[nextIndex];
    if (!nextSong?.audio) return;

    setIsCrossfading(true);

    const nextAudio = nextAudioRef.current;
    nextAudio.src = await getPlayableSrc(nextSong);
    nextAudio.volume = 0;

    nextAudio.play().catch(() => {});

    let fade = 0;

    const interval = setInterval(() => {
      fade += 0.05;

      audioRef.current.volume = Math.max(0, 1 - fade);
      nextAudio.volume = Math.min(1, fade);

      if (fade >= 1) {
        clearInterval(interval);

        audioRef.current.pause();
        audioRef.current.src = nextAudio.src;
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1;

        setCurrentIndex(nextIndex);
        setCurrentSong(nextSong);
        setIsPlaying(true);
        setIsCrossfading(false);
      }
    }, 100);
  }, [queue, currentIndex, isCrossfading, getPlayableSrc]);

  /* ---------- NEXT / PREVIOUS ---------- */

const next = useCallback(() => {
  if (!queue.length) return;

  const nextIndex = currentIndex + 1;

  if (nextIndex >= queue.length) {
    setIsPlaying(false);
    return;
  }

  const song = queue[nextIndex];

  setCurrentIndex(nextIndex);
  setCurrentSong(song);

  if (song?.audio) {
    audioRef.current.src = song.audio;
    audioRef.current.currentTime = 0;

    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }
}, [queue, currentIndex]);


 const previous = useCallback(() => {
  if (!queue.length) return;

  const prevIndex = currentIndex - 1;

  if (prevIndex < 0) return;

  const song = queue[prevIndex];

  setCurrentIndex(prevIndex);
  setCurrentSong(song);

  if (song?.audio) {
    audioRef.current.src = song.audio;
    audioRef.current.currentTime = 0;

    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }
}, [queue, currentIndex]);


  /* ---------- SMART PRELOAD NEXT 2 ---------- */

  useEffect(() => {
    if (!queue.length || currentIndex < 0) return;

    const upcoming = queue.slice(currentIndex + 1, currentIndex + 3);
    upcoming.forEach((song) => {
      if (song?.audio) {
        cacheTrackIfNeeded(song);
      }
    });
  }, [queue, currentIndex, cacheTrackIfNeeded]);

  /* ---------- QUEUE MANAGEMENT ---------- */

  const removeFromQueue = useCallback((index: number) => {
    setQueue((q) => q.filter((_, i) => i !== index));

    setCurrentIndex((current) => {
      if (index < current) return current - 1;
      if (index === current) return -1;
      return current;
    });
  }, []);

  const reorderQueue = useCallback((from: number, to: number) => {
    setQueue((q) => {
      const newQueue = [...q];
      const [moved] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, moved);
      return newQueue;
    });

    setCurrentIndex((current) => {
      if (current === from) return to;
      if (from < current && to >= current) return current - 1;
      if (from > current && to <= current) return current + 1;
      return current;
    });
  }, []);

  /* ---------- PLAY / PAUSE ---------- */

  const togglePlay = useCallback(async () => {
    if (!currentSong?.audio) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (e) {
      console.log("Toggle blocked:", e);
    }
  }, [currentSong]);

  const seek = useCallback((seconds: number) => {
    const t = Number(seconds);
    if (Number.isNaN(t)) return;

    audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, []);

  /* ---------- AUDIO EVENTS ---------- */

  useEffect(() => {
    const a = audioRef.current;

    const onTime = () => {
      const t = a.currentTime || 0;
      const d = a.duration || 0;

      setCurrentTime(t);

      if (
        !isCrossfading &&
        d > 0 &&
        d - t <= CROSSFADE_TIME &&
        queue.length > currentIndex + 1
      ) {
        startCrossfade();
      }
    };

    const onMeta = () => setDuration(a.duration || 0);

    const onEnded = () => {
      if (repeatOne) return;
      next();
    };

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnded);
    };
  }, [startCrossfade, next, repeatOne, isCrossfading, queue, currentIndex]);

  useEffect(() => {
    audioRef.current.loop = repeatOne;
  }, [repeatOne]);

  /* ---------- STATE SYNC ---------- */

  useEffect(() => {
    const a = audioRef.current;
    if (!currentSong?.audio) return;

    const sync = async () => {
      try {
        if (isPlaying && a.paused) await a.play();
        if (!isPlaying && !a.paused) a.pause();
      } catch (e) {
        console.log("Sync blocked:", e);
      }
    };

    sync();
  }, [isPlaying, currentSong]);

  /* ---------- SAVE STATE ---------- */

  useEffect(() => {
    try {
      const data = {
        queue,
        currentIndex,
        currentSong,
        currentTime,
        isPlaying,
      };

      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to save player state", err);
    }
  }, [queue, currentIndex, currentSong, currentTime, isPlaying]);

  /* ---------- CONTEXT VALUE ---------- */

  const value: PlayerContextType = useMemo(
    () => ({
      currentSong,
      queue,
      currentIndex,
      isPlaying,
      setSong,
      playSong,
      next,
      previous,
      removeFromQueue,
      reorderQueue,
      togglePlay,
      audioRef,
      currentTime,
      duration,
      seek,
      repeatOne,
      setRepeatOne,
    }),
    [
      currentSong,
      queue,
      currentIndex,
      isPlaying,
      setSong,
      playSong,
      next,
      previous,
      removeFromQueue,
      reorderQueue,
      togglePlay,
      currentTime,
      duration,
      seek,
      repeatOne,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
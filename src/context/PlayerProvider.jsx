import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerContext } from "./PlayerContext";

// ✅ Audius retry helpers (silent)
const DISCOVERY_NODES = [
  "https://discoveryprovider.audius.co",
  "https://discoveryprovider2.audius.co",
];

function pickNode(exclude) {
  const choices = DISCOVERY_NODES.filter((n) => n !== exclude);
  return choices[Math.floor(Math.random() * choices.length)] || DISCOVERY_NODES[0];
}

function isAudiusStreamUrl(url = "") {
  return typeof url === "string" && url.includes("/v1/tracks/") && url.includes("/stream");
}

function getAudiusTrackId(url = "") {
  // matches: /v1/tracks/{id}/stream
  const m = String(url).match(/\/v1\/tracks\/([^/]+)\/stream/);
  return m?.[1] || null;
}

function getAudiusBase(url = "") {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

function buildAudiusStreamUrl(trackId, base) {
  const b = base || DISCOVERY_NODES[0];
  return `${b}/v1/tracks/${trackId}/stream?app_name=bd-rythm`;
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ timing + repeat
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatOne, setRepeatOne] = useState(false);

  // ✅ offline-safe: select song without trying to play audio
  const setSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(false);

    // reset timing display when selecting
    setCurrentTime(0);
    setDuration(0);

    // if song has audio, preload metadata
    if (song?.audio) {
      if (audioRef.current.src !== song.audio) {
        audioRef.current.src = song.audio;
      }
      // preload metadata if available
      if (typeof audioRef.current.load === "function") {
        audioRef.current.load();
      }
    }
  }, []);

 const playSong = useCallback(async (song) => {
  if (!song) return;

  setCurrentSong(song);

  // ✅ if no audio yet, don’t crash
  if (!song.audio) {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    return;
  }

  // ✅ Silent retry for Audius only
  const originalUrl = song.audio;
  const audius = isAudiusStreamUrl(originalUrl);
  const trackId = audius ? getAudiusTrackId(originalUrl) : null;

  // default attempts:
  const maxAttempts = audius && trackId ? 3 : 1;

  let attemptUrl = originalUrl;
  let lastBase = audius ? getAudiusBase(originalUrl) : "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // swap node on retry
    if (attempt > 1 && audius && trackId) {
      const nextBase = pickNode(lastBase);
      lastBase = nextBase;
      attemptUrl = buildAudiusStreamUrl(trackId, nextBase);
    }

    if (audioRef.current.src !== attemptUrl) {
      audioRef.current.src = attemptUrl;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      return; // ✅ success, stop retrying
    } catch (e) {
      // ✅ silent fail; only mark stopped on last attempt
      if (attempt === maxAttempts) {
        console.log("Play blocked:", e);
        setIsPlaying(false);
      }
    }
  }
}, []);


  const togglePlay = useCallback(async () => {
    // currentSong is state, so it’s safe to reference here
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

  // ✅ seek support for waveform/slider (STABLE now)
  const seek = useCallback((seconds) => {
    const t = Number(seconds);
    if (Number.isNaN(t)) return;

    audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, []);

  // ✅ keep UI updated with time + duration + ended
  useEffect(() => {
    const a = audioRef.current;

    const onTime = () => setCurrentTime(a.currentTime || 0);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnded = () => {
      // if repeat is off, mark stopped
      if (!a.loop) setIsPlaying(false);
    };

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  // ✅ wire repeatOne state to audio.loop
  useEffect(() => {
    audioRef.current.loop = !!repeatOne;
  }, [repeatOne]);

  // ✅ if isPlaying changes externally, sync audio state
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

  // ✅ keep value stable (no ESLint red)
  const value = useMemo(
    () => ({
      currentSong,
      isPlaying,
      setSong,
      playSong,
      togglePlay,

      // exports for PlayerBar UI
      audioRef,
      currentTime,
      duration,
      seek,
      repeatOne,
      setRepeatOne,
    }),
    [
      currentSong,
      isPlaying,
      setSong,
      playSong,
      togglePlay,
      currentTime,
      duration,
      seek,
      repeatOne,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

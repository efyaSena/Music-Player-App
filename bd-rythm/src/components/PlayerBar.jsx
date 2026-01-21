import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PlayerBar() {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ TEMP audio (replace later with real track URL)
  const audioUrl = "/audio/sample.mp3";
  const audioRef = useRef(null);

  // ✅ TEMP playlist (replace later with real data)
  const playlist = useMemo(
    () => [
      { id: "t1", artist: "Burna Boy", title: "Last Last" },
      { id: "t2", artist: "Wizkid", title: "Essence" },
      { id: "t3", artist: "Davido", title: "Unavailable" },
      { id: "t4", artist: "Rema", title: "Calm Down" },
    ],
    []
  );

  // track passed from Library/Home via navigate state
  const initialTrack = location.state?.track;

  // ✅ keep ONLY a manual index for prev/next clicks
  const [manualIndex, setManualIndex] = useState(0);

  // ✅ derive an index from location.state without setState-in-effect
  const derivedIndex = useMemo(() => {
    if (!initialTrack) return null;

    const found = playlist.findIndex(
      (t) =>
        t.artist?.toLowerCase() === initialTrack.artist?.toLowerCase() &&
        t.title?.toLowerCase() === initialTrack.title?.toLowerCase()
    );

    return found >= 0 ? found : 0;
  }, [initialTrack, playlist]);

  // ✅ decide which index to use:
  // - if user clicked a song (derivedIndex exists), use it
  // - else use manualIndex (for next/prev browsing)
  const currentIndex = derivedIndex ?? manualIndex;
  const currentTrack = playlist[currentIndex];

  // ✅ When track changes AND we're playing, restart playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, isPlaying]);

  // ✅ Play/Pause
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.log("Play blocked until user interaction:", e);
    }
  };

  // ✅ Next/Prev (works even without initialTrack)
  const nextTrack = () => {
    setManualIndex((i) => (i + 1) % playlist.length);
  };

  const prevTrack = () => {
    setManualIndex((i) => (i - 1 + playlist.length) % playlist.length);
  };

  // ✅ Download handler
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${currentTrack?.artist || "BD-Rythm"}-${currentTrack?.title || "track"}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  // ✅ Share handler
  const handleShare = async () => {
    const shareData = {
      title: "Listening on BD Rythm 🎧",
      text: `Check out: ${currentTrack?.artist || "BD Rythm"} - ${currentTrack?.title || "Track"}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }

    setOpen(false);
  };

  const btn =
    "transition duration-200 hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_6px_#00FFFF]";

  return (
    <div className="relative bg-[#CFFFFF] rounded-xl px-6 py-5 text-black">
      {/* ✅ hidden audio element */}
      <audio ref={audioRef} src={audioUrl} />

      {/* dots + menu */}
      <div className="absolute top-3 right-4">
        <button
          type="button"
          className={`text-lg font-black leading-none ${btn}`}
          aria-label="More options"
          onClick={() => setOpen((v) => !v)}
        >
          …
        </button>

        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            />

            <div className="absolute right-0 bottom-full mb-2 z-50 bg-[#CFFFFF] rounded-xl p-4 shadow-xl w-28">
              <button
                type="button"
                className="w-full flex flex-col items-center gap-2 py-3 rounded-lg transition hover:bg-black/10 active:scale-95"
                onClick={handleDownload}
              >
                <span className="text-xl">⬇️</span>
                <span className="text-[10px] font-bold">Download</span>
              </button>

              <button
                type="button"
                className="w-full flex flex-col items-center gap-2 py-3 rounded-lg transition hover:bg-black/10 active:scale-95"
                onClick={handleShare}
              >
                <span className="text-xl">🔗</span>
                <span className="text-[10px] font-bold">Share</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* optional: show current track */}
      <div className="text-center text-[10px] font-bold mb-2">
        {currentTrack?.artist} — {currentTrack?.title}
      </div>

      <div className="flex items-center justify-center gap-10">
        <button type="button" className={`text-sm font-black ${btn}`} onClick={prevTrack}>
          {"<<"}
        </button>

        <button type="button" className={`text-base font-black ${btn}`} onClick={togglePlay}>
          {isPlaying ? "||" : "▶"}
        </button>

        <button type="button" className={`text-sm font-black ${btn}`} onClick={nextTrack}>
          {">>"}
        </button>
      </div>
    </div>
  );
}

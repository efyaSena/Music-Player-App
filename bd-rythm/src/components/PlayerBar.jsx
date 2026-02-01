import { useMemo, useState } from "react";
import { usePlayer } from "../context/usePlayer";
import PlaylistSheet from "./PlaylistSheet";

export default function PlayerBar() {
  const player = usePlayer();

  const {
    currentSong,
    isPlaying,
    togglePlay,
    currentTime = 0,
    duration = 0,
    seek,
    repeatOne,
    setRepeatOne,
  } = player || {};

  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const hasSong = !!currentSong;
  const hasAudio = !!currentSong?.audio;

  const btn =
    "transition duration-200 hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_6px_#00FFFF]";

  const prevDisabled = true;
  const nextDisabled = true;

  const formatTime = (t) => {
    const n = Number(t);
    if (!Number.isFinite(n) || n <= 0) return "0:00";
    const m = Math.floor(n / 60);
    const s = Math.floor(n % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // per-song storage key
  const songKey = useMemo(() => {
    if (!currentSong) return "no-song";
    return `${currentSong.artist || "artist"}::${currentSong.title || "title"}`;
  }, [currentSong]);

  // compute liked directly from localStorage (no effects needed)
  const liked = useMemo(() => {
    try {
      return localStorage.getItem(`liked:${songKey}`) === "1";
    } catch {
      return false;
    }
  }, [songKey]);

 const toggleLike = () => {
  try {
    const next = !liked;
    localStorage.setItem(`liked:${songKey}`, next ? "1" : "0");
  } catch {
    // ignore storage errors
  }

  // force rerender so UI updates immediately
  setMenuOpen((v) => v);
};


  const handlePlayClick = () => {
    if (!hasSong) return;
    if (!hasAudio) return;
    togglePlay?.();
  };

  // ✅ seek ONLY through provider
  const handleSeek = (val) => {
    const seconds = Number(val);
    if (!Number.isFinite(seconds)) return;
    seek?.(seconds);
  };

  const handleDownload = () => {
    if (!hasAudio) return;

    const link = document.createElement("a");
    link.href = currentSong.audio;
    link.download = `${currentSong?.artist || "BD-Rythm"}-${currentSong?.title || "track"}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMenuOpen(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Listening on BD Rythm 🎧",
      text: currentSong
        ? `Check out: ${currentSong.artist || "BD Rythm"} - ${currentSong.title || "Track"}`
        : "Listening on BD Rythm 🎧",
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

    setMenuOpen(false);
  };

  return (
    <>
      {/* ✅ MINI PLAYER (CLEAN) */}
      <div
        className="fixed left-0 right-0 bottom-20 z-50 w-full bg-[#CFFFFF] px-6 py-4 text-black cursor-pointer"
        onClick={() => {
          setMenuOpen(false);
          setExpanded(true);
        }}
      >
        {/* dots + menu */}
        <div className="absolute top-3 right-4">
          <button
            type="button"
            className={`text-lg font-black leading-none ${btn}`}
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            …
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-50 bg-transparent"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              />

              {/* ✅ ICON-ONLY 3 DOTS MENU (Playlist + Download + Share) */}
              <div className="absolute right-0 bottom-full mb-2 z-[60] bg-[#CFFFFF] rounded-xl p-3 shadow-xl w-20 flex flex-col gap-2">
                {/* Playlist */}
                <button
                  type="button"
                  className={[
                    "w-full h-12 rounded-lg grid place-items-center transition",
                    "hover:bg-black/10 active:scale-95",
                    !hasSong ? "opacity-50 pointer-events-none" : "",
                  ].join(" ")}
                  aria-label="Add to playlist"
                  title="Add to playlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setPlaylistOpen(true);
                  }}
                >
                 <span className="relative w-6 h-6 inline-block">
  {/* 3 lines */}
  <span className="absolute left-0 top-[3px] w-4 h-[2px] bg-black rounded" />
  <span className="absolute left-0 top-[10px] w-4 h-[2px] bg-black rounded" />
  <span className="absolute left-0 top-[17px] w-4 h-[2px] bg-black rounded" />

  {/* plus */}
  <span className="absolute right-0 top-[8px] w-2.5 h-[2px] bg-black rounded" />
  <span className="absolute right-[4px] top-[5px] w-[2px] h-2.5 bg-black rounded" />
</span>

                </button>

                {/* Download */}
                <button
                  type="button"
                  className={[
                    "w-full h-12 rounded-lg grid place-items-center transition",
                    "hover:bg-black/10 active:scale-95",
                    !hasAudio ? "opacity-50 pointer-events-none" : "",
                  ].join(" ")}
                  aria-label="Download"
                  title="Download"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  <span className="text-xl">⬇️</span>
                </button>

                {/* Share */}
                <button
                  type="button"
                  className="w-full h-12 rounded-lg grid place-items-center transition hover:bg-black/10 active:scale-95"
                  aria-label="Share"
                  title="Share"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                >
                  <span className="text-xl">🔗</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* title */}
        <div className="text-center text-[10px] font-bold mb-2">
          {!hasSong ? (
            <span className="opacity-70">Select a song to start</span>
          ) : (
            <>
              {currentSong?.artist} — {currentSong?.title}
              {!hasAudio && <span className="ml-2 opacity-70">(No audio yet)</span>}
            </>
          )}
        </div>

        {/* mini controls only */}
        <div className="flex items-center justify-center gap-10">
          <button
            type="button"
            disabled={prevDisabled}
            className={[
              "text-sm font-black",
              btn,
              prevDisabled ? "opacity-40 pointer-events-none" : "",
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
          >
            {"<<"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick();
            }}
            disabled={!hasSong || !hasAudio}
            className={[
              "text-base font-black",
              btn,
              !hasSong || !hasAudio ? "opacity-40 pointer-events-none" : "",
            ].join(" ")}
          >
            {isPlaying ? "||" : "▶"}
          </button>

          <button
            type="button"
            disabled={nextDisabled}
            className={[
              "text-sm font-black",
              btn,
              nextDisabled ? "opacity-40 pointer-events-none" : "",
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* ✅ POPUP BACKDROP */}
      <div
        className={[
          "fixed inset-0 z-[70] bg-black/60 transition-opacity duration-300",
          expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setExpanded(false)}
      />

      {/* ✅ POPUP SHEET */}
      <div
        className={[
          "fixed left-0 right-0 bottom-0 z-[80] bg-black text-white rounded-t-3xl",
          "transition-transform duration-300 ease-out",
          expanded ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ height: "75vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* grab */}
        <div className="w-full flex justify-center pt-3">
          <div className="w-12 h-1.5 rounded-full bg-white/30" />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="text-sm font-bold">
            {currentSong ? `${currentSong.artist} — ${currentSong.title}` : "Nothing playing"}
          </div>

          <button
            type="button"
            className="text-white/80 text-xl"
            onClick={() => setExpanded(false)}
            aria-label="Close player"
          >
            ✕
          </button>
        </div>

        {/* ✅ Like + Repeat (icons only) */}
        <div className="px-5 mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            className={[
              "w-10 h-10 rounded-full grid place-items-center",
              "bg-white/10 hover:bg-white/15 active:scale-95 transition",
            ].join(" ")}
            aria-label="Like"
            title="Like"
          >
            <span className={liked ? "text-red-500 text-lg" : "text-lg"}>
              {liked ? "♥" : "♡"}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRepeatOne?.((v) => !v);
            }}
            className={[
              "w-10 h-10 rounded-full grid place-items-center",
              repeatOne ? "bg-[#CFFFFF] text-black" : "bg-white/10 hover:bg-white/15",
              "active:scale-95 transition",
            ].join(" ")}
            aria-label="Repeat"
            title={repeatOne ? "Repeat 1" : "Repeat"}
          >
            <span className="text-lg">🔁</span>
          </button>
        </div>

        {/* wave + time */}
        <div className="mt-6 px-5">
          <div className="relative w-full h-5 rounded-full overflow-hidden bg-white/10">
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 2px, transparent 2px 7px)",
              }}
            />
            <div
              className="absolute inset-y-0 left-0 bg-[#CFFFFF]"
              style={{
                width: duration ? `${Math.min(100, (currentTime / duration) * 100)}%` : "0%",
              }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => handleSeek(e.target.value)}
              disabled={!hasSong || !hasAudio || !duration}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold mt-2 text-white/80">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* big controls */}
        <div className="mt-10 flex items-center justify-center gap-14">
          <button disabled={prevDisabled} className={prevDisabled ? "opacity-40" : ""}>
            {"<<"}
          </button>

          <button
            type="button"
            onClick={handlePlayClick}
            disabled={!hasSong || !hasAudio}
            className={[
              "w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl",
              hasSong && hasAudio ? "bg-[#CFFFFF] text-black" : "bg-white/10 text-white/40",
              "active:scale-95 transition",
            ].join(" ")}
          >
            {isPlaying ? "||" : "▶"}
          </button>

          <button disabled={nextDisabled} className={nextDisabled ? "opacity-40" : ""}>
            {">>"}
          </button>
        </div>
      </div>

      {/* ✅ Playlist popup (opened from 3-dots) */}
      <PlaylistSheet
        isOpen={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        song={currentSong}
      />
    </>
  );
}

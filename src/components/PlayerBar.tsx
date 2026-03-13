import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { usePlayer } from "../context/usePlayer";
import PlaylistSheet from "./PlaylistSheet";
import QueuePanel from "./QueuePanel";
import WaveformSeekbar from "./WaveformSeekbar";
import ProgressBar from "./ProgressBar";

export default function PlayerBar() {
  const player = usePlayer() as any;

  const {
    currentSong,
    isPlaying,
    togglePlay,
    next,
    previous,
    queue = [],
    currentIndex = -1,
  } = player;

  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  const hasSong = !!currentSong;
  const hasAudio = !!currentSong?.audio;

  const prevDisabled = currentIndex <= 0;
  const nextDisabled = currentIndex >= queue.length - 1;

  const btn =
    "transition duration-200 hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_6px_#00FFFF]";

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => next?.(),
    onSwipedRight: () => previous?.(),
    onSwipedUp: () => setQueueOpen(true),
    onSwipedDown: () => setExpanded(false),
    trackTouch: true,
    trackMouse: true,
  });

  const songKey = useMemo(() => {
    if (!currentSong) return "no-song";
    return `${currentSong.artist || "artist"}::${currentSong.title || "title"}`;
  }, [currentSong]);

  const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!hasSong || !hasAudio) return;
    togglePlay?.();
  };

  const handleDownload = () => {
    if (!hasAudio) return;

    const link = document.createElement("a");
    link.href = currentSong?.audio;
    link.download = `${currentSong?.artist || "BD-Rythm"}-${
      currentSong?.title || "track"
    }.mp3`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMenuOpen(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Listening on BD Rythm 🎧",
      text: currentSong
        ? `Check out: ${currentSong.artist} - ${currentSong.title}`
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
      <motion.div
        {...swipeHandlers}
        layout
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
       className="fixed left-0 right-0 bottom-16 z-[60] w-full bg-[#CFFFFF]/95 backdrop-blur border-t border-black/10 px-3 py-2 text-black cursor-pointer"
        onClick={() => {
          setMenuOpen(false);
          setExpanded(true);
        }}
      >
        <div className="absolute top-3 right-4">
          <button
            type="button"
            className={`text-lg font-black leading-none ${btn}`}
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
              />

              <div className="absolute right-0 bottom-full mb-2 z-[60] bg-[#CFFFFF] rounded-xl p-3 shadow-xl w-20 flex flex-col gap-2">
                <button
                  type="button"
                  className="w-full h-12 rounded-lg hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQueueOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  📃
                </button>

                <button
                  type="button"
                  className="w-full h-12 rounded-lg hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaylistOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  📂
                </button>

                <button
                  type="button"
                  className="w-full h-12 rounded-lg hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  ⬇️
                </button>

                <button
                  type="button"
                  className="w-full h-12 rounded-lg hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                >
                  🔗
                </button>
              </div>
            </>
          )}
        </div>

        <div className="text-center text-[10px] font-bold mb-2">
          {!hasSong ? (
            <span className="opacity-70">Select a song to start</span>
          ) : (
            <>
              {currentSong.artist} — {currentSong.title}
            </>
          )}
        </div>

       

        <div className="flex items-center justify-center gap-6">
          <button
            disabled={prevDisabled}
            onClick={(e) => {
              e.stopPropagation();
              previous?.();
            }}
            className="text-sm font-black"
          >
            {"<<"}
          </button>

          <button
            onClick={handlePlayClick}
            disabled={!hasSong || !hasAudio}
            className="text-base font-black"
          >
            {isPlaying ? "||" : "▶"}
          </button>

          <button
            disabled={nextDisabled}
            onClick={(e) => {
              e.stopPropagation();
              next?.();
            }}
            className="text-sm font-black"
          >
            {">>"}
          </button>
        </div>
      </motion.div>

      {expanded && (
        <div className="fixed inset-0 z-[80] text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-60"
            style={{
              backgroundImage: `url(${currentSong?.cover || ""})`,
            }}
          />

          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div className="relative z-10 p-6 overflow-y-auto">
            <button
              className="absolute top-6 right-6 text-2xl"
              onClick={() => setExpanded(false)}
            >
              ✕
            </button>

            <div className="max-w-md mx-auto text-center mt-12">
              <motion.img
                src={currentSong?.cover}
                className="w-64 h-64 mx-auto rounded-xl shadow-2xl mb-6 object-cover"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              />

              <h2 className="text-xl font-bold">{currentSong?.title}</h2>
              <p className="opacity-70 mb-6">{currentSong?.artist}</p>

              <WaveformSeekbar />
              <ProgressBar />

              <div className="flex justify-center gap-10 mt-8 text-3xl">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previous?.();
                  }}
                >
                  ⏮
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay?.();
                  }}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next?.();
                  }}
                >
                  ⏭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PlaylistSheet
        isOpen={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        song={currentSong}
      />

      {queueOpen && <QueuePanel onClose={() => setQueueOpen(false)} />}
    </>
  );
}
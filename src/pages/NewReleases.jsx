import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { getTrackStreamUrl } from "../api/audius";

export default function NewReleases() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const player = usePlayer();

  // accept genre as string or object
  const rawGenre = state?.genre ?? "All";
  const genreName = typeof rawGenre === "string" ? rawGenre : rawGenre?.name || "All";

  // ✅ expect tracks passed from Library
  const tracks = Array.isArray(state?.tracks) ? state.tracks : [];

  const handlePlay = async (t) => {
    try {
      const song = {
        ...t,
        id: String(t?.id || ""),
        title: t?.title || "Untitled",
        artist: t?.artist || "Unknown",
        artwork: t?.artwork || "",
        audio: t?.audio || (t?.id ? getTrackStreamUrl(t.id) : ""),
      };
      await player?.playSong?.(song);
    } catch (e) {
      console.log("play failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-6 pb-24">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-[#00FFFF] text-2xl font-black transition duration-200 hover:scale-110 active:scale-95"
        aria-label="Back"
      >
        «
      </button>

      <h1 className="mt-6 text-[#00FFFF] text-2xl font-extrabold uppercase">
        New Releases
      </h1>

      <p className="mt-2 text-white/70 text-sm">
        Genre: <span className="text-[#00FFFF] font-bold">{genreName}</span>
      </p>

      {tracks.length === 0 ? (
        <div className="mt-10 text-white/60">
          No releases available yet. (This page needs <code>state.tracks</code> from Library.)
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {tracks.map((t, idx) => (
            <button
              key={t.id || `${t.artist}-${t.title}-${idx}`}
              type="button"
              onClick={() => handlePlay(t)}
              className="
                w-full flex items-center gap-3 text-left
                bg-white/5 border border-white/10 rounded-2xl p-3
                transition duration-200 hover:bg-white/10 active:scale-[0.99]
              "
              title={`${t.artist} • ${t.title}`}
            >
              <div className="w-10 text-white/40 text-[10px] font-bold">
                {String(idx + 1).padStart(2, "0")}
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#CFFFFF] overflow-hidden shrink-0">
                {t.artwork ? (
                  <img
                    src={t.artwork}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-extrabold truncate">
                  {t.title || "Untitled"}
                </p>
                <p className="text-white/60 text-[10px] font-semibold truncate">
                  {t.artist || "Unknown"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[#00FFFF] text-[10px] font-bold">
                  {t.genre || genreName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

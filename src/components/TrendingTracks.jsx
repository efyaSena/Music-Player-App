import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrendingSongs() {
  const navigate = useNavigate();

  const GENRES = useMemo(
    () => [
      "All",
      "Afrobeat",
      "Amapiano",
      "Hip-hop",
      "Trap",
      "Pop",
      "Rock",
      "R&B",
      "Gospel",
      "Reggaeton",
      "Caribbean",
      "EDM",
      "Jazz",
      "Indie",
      "Classical",
    ],
    []
  );

  const [activeGenre, setActiveGenre] = useState("All");

  const songs = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: `ts-${i}`,
        artist: "Artist",
        title: `Song Title ${i + 1}`,
        genre: GENRES[(i % (GENRES.length - 1)) + 1],
      })),
    [GENRES]
  );

  const filteredSongs = useMemo(() => {
    if (activeGenre === "All") return songs;
    return songs.filter((s) => s.genre === activeGenre);
  }, [songs, activeGenre]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 px-6 pt-6 pb-6 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[#00FFFF] text-2xl font-black transition duration-200 hover:scale-110 active:scale-95"
          aria-label="Back"
        >
          «
        </button>

        <h2 className="mt-8 text-[#00FFFF] text-sm font-bold">trending songs</h2>

        {/* Genres (scrollable) */}
        <div className="mt-6 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {GENRES.map((g) => {
            const isActive = g === activeGenre;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGenre(g)}
                className={[
                  "shrink-0 rounded-full px-6 py-2 text-[10px] font-bold transition duration-200",
                  isActive
                    ? "bg-[#00EFFF] text-black"
                    : "bg-[#00EFFF]/70 text-black hover:bg-[#00EFFF] hover:scale-105 active:scale-95",
                ].join(" ")}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Songs (scroll horizontally) */}
        <div className="mt-10 overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-10 pr-6">
            {filteredSongs.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => navigate("/home", { state: { track: s } })}
                className="shrink-0 w-[260px] flex items-center gap-4 text-left transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
              >
                <div className="w-14 h-14 bg-[#CFFFFF] rounded-xl shrink-0" />
                <div className="leading-tight">
                  <p className="text-[#00FFFF] text-xs font-bold">{s.artist}</p>
                  <p className="text-[#00FFFF] text-xs font-semibold">
                    {s.title}
                  </p>
                  <p className="text-white/50 text-[10px] font-semibold mt-1">
                    {s.genre}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {filteredSongs.length === 0 && (
            <p className="text-white/60 text-sm mt-6 text-center">
              No songs for {activeGenre}
            </p>
          )}
        </div>
      </div>

      {/* bottom nav area (placeholder because you already have your nav component) */}
      <div className="h-20 bg-[#00EFFF]" />
    </div>
  );
}

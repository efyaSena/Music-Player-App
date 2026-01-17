import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BD-RYTHM-logo.png";
import PlayerBar from "../components/PlayerBar";

export default function HomePage() {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const trendingSongs = useMemo(
    () => Array.from({ length: 10 }).map((_, i) => ({ id: `trend-${i}` })),
    []
  );

  const topAlbums = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `album-${i}`,
        name: "Genres",
      })),
    []
  );

  const viewAllBtn =
    "bg-[#CFFFFF] text-black text-[9px] font-bold px-3 py-1 rounded-full transition duration-200 hover:bg-[#00FFFF] hover:scale-105 active:scale-95";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <div className="flex-1 px-6 pt-10 pb-6">
        <div className="flex justify-center">
          <img src={logo} alt="BD Rhythm Logo" className="w-40" />
        </div>

        <div className="mt-10 max-w-md mx-auto">
          <PlayerBar />
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <p className="text-center text-[#00FFFF] text-xs font-bold">
            Trending this week
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              (trending songs)
            </p>

            <button type="button" className={viewAllBtn} onClick={() => {}}>
              view all
            </button>
          </div>

          <div className="mt-3 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {trendingSongs.map((song) => (
              <div
                key={song.id}
                className="shrink-0 w-24 h-6 bg-[#00EFFF] rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">(top albums)</p>

            <button type="button" className={viewAllBtn} onClick={() => {}}>
              view all
            </button>
          </div>

          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {topAlbums.map((album) => (
              <div
                key={album.id}
                className="shrink-0 w-16 h-20 bg-[#CFFFFF] rounded-xl flex items-center justify-center"
              >
                <p className="text-black text-[9px] font-bold">{album.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-20 bg-[#00EFFF] flex items-center justify-between px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-black text-4xl font-black leading-none"
          aria-label="Back"
        >
          ↩
        </button>

        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="text-black text-4xl font-black leading-none"
          aria-label="Open playlist drawer"
        >
          ≡+
        </button>
      </div>

      {isSheetOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsSheetOpen(false)}
            aria-label="Close playlist drawer"
          />

          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-md">
            <div className="bg-[#CFFFFF] rounded-t-3xl px-6 pt-6 pb-8 shadow-xl">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1.5 bg-black/30 rounded-full" />
              </div>

              <button
                type="button"
                className="mx-auto block bg-[#00EFFF] text-black font-black text-xs px-6 py-3 rounded-full transition duration-200 hover:scale-105 active:scale-95"
                onClick={() => {}}
              >
                create new playlist
              </button>

              <div className="mt-6 flex flex-col gap-6">
                <div className="w-16 h-16 bg-[#00EFFF] rounded-lg" />
                <div className="w-16 h-16 bg-[#00EFFF] rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

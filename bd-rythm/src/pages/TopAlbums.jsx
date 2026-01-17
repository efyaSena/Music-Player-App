import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TopAlbums() {
  const navigate = useNavigate();
  const location = useLocation();

  const GENRES = useMemo(
    () => ["All", "Afrobeat", "Amapiano", "Hip-hop", "Pop", "Rock", "R&B", "Reggae", "K-Pop"],
    []
  );

  const [activeGenre, setActiveGenre] = useState(location.state?.focus || "All");

  const albums = useMemo(
    () => [
      { id: "a1", name: "SOS", artist: "SZA", genre: "R&B" },
      { id: "a2", name: "UTOPIA", artist: "Travis Scott", genre: "Hip-hop" },
      { id: "a3", name: "Unavailable (EP)", artist: "Davido", genre: "Afrobeat" },
      { id: "a4", name: "Renaissance", artist: "Beyoncé", genre: "Pop" },
      { id: "a5", name: "After Hours", artist: "The Weeknd", genre: "Pop" },
      { id: "a6", name: "Born Pink", artist: "BLACKPINK", genre: "K-Pop" },
      { id: "a7", name: "Legend", artist: "Bob Marley", genre: "Reggae" },
      { id: "a8", name: "Dark Side", artist: "Pink Floyd", genre: "Rock" },
      { id: "a9", name: "Amapiano Hits", artist: "Various", genre: "Amapiano" },
      { id: "a10", name: "Damn.", artist: "Kendrick Lamar", genre: "Hip-hop" },
      { id: "a11", name: "Starboy", artist: "The Weeknd", genre: "Pop" },
      { id: "a12", name: "Made in Lagos", artist: "Wizkid", genre: "Afrobeat" },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (activeGenre === "All") return albums;
    return albums.filter((a) => a.genre === activeGenre);
  }, [albums, activeGenre]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 px-6 pt-6 pb-6 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[#00FFFF] text-2xl font-black transition duration-200 hover:scale-110 active:scale-95"
          aria-label="Back"
        >
          ‹
        </button>

        {/* chips like your design */}
        <div className="mt-6 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {GENRES.map((g) => {
            const isActive = g === activeGenre;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGenre(g)}
                className={[
                  "shrink-0 h-6 w-24 rounded-full transition duration-200 hover:scale-105 active:scale-95",
                  isActive ? "bg-[#00EFFF]" : "bg-[#00EFFF]/80",
                ].join(" ")}
                title={g}
                aria-label={g}
              >
                {/* keep blank to match your mock */}
              </button>
            );
          })}
        </div>

        <h2 className="mt-10 text-center text-[#00FFFF] text-sm font-bold">
          Top Albums
        </h2>

        {/* 2-column stacked cards like your mock */}
        <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-12">
          {filtered.map((a) => (
            <button
              key={a.id}
              type="button"
              className="relative w-[140px] h-[170px] transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
              title={`${a.name} • ${a.artist}`}
            >
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#00EFFF] rounded-2xl" />
              <div className="absolute inset-0 bg-[#CFFFFF] rounded-2xl flex items-end p-3">
                <div className="text-left w-full">
                  <p className="text-black text-[11px] font-black truncate">
                    {a.name}
                  </p>
                  <p className="text-black/70 text-[10px] font-bold truncate">
                    {a.artist}
                  </p>
                  <p className="text-black/60 text-[9px] font-semibold mt-1">
                    {a.genre}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-20 bg-[#00EFFF]" />
    </div>
  );
}

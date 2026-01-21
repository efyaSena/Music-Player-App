import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TopSongs() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // coming from Library via navigate(..., { state: { genre } })
  const genre = state?.genre || { id: "all", name: "All Genres" };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 active:scale-95 transition"
        aria-label="Back"
      >
        <span className="text-[#00FFFF] text-xl font-black">&lt;&lt;</span>
      </button>

      <h1 className="mt-6 text-[#00FFFF] text-2xl font-extrabold">
        TOP SONGS
      </h1>

      <p className="mt-2 text-white/70 text-sm">
        Genre: <span className="text-[#00FFFF] font-bold">{genre.name}</span>
      </p>

      <div className="mt-8 text-white/60">
        Placeholder content for now… we’ll fill this with real songs later.
      </div>
    </div>
  );
}

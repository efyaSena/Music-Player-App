import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PopularPlaylists() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // accept genre as string or object
  const rawGenre = state?.genre ?? "All";
  const genreName = typeof rawGenre === "string" ? rawGenre : rawGenre?.name || "All";

  // ✅ expect playlists passed from Library
  const playlists = Array.isArray(state?.playlists) ? state.playlists : [];

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
        Popular Playlists
      </h1>

      <p className="mt-2 text-white/70 text-sm">
        Genre: <span className="text-[#00FFFF] font-bold">{genreName}</span>
      </p>

      {playlists.length === 0 ? (
        <div className="mt-10 text-white/60">
          No playlists available yet. (This page needs <code>state.playlists</code> from Library.)
        </div>
      ) : (
       <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
  {playlists.map((p) => (
    <button
      key={p.id}
      type="button"
      className="
        group text-left
        bg-white/5 border border-white/10
        rounded-xl p-2
        transition duration-200
        hover:bg-white/10 hover:scale-[1.01]
        active:scale-[0.99]
      "
      title={p.title}
    >
      {/* artwork */}
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-white/10">
        {p.artwork ? (
          <img
            src={p.artwork}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      {/* text */}
      <p className="mt-2 text-white font-extrabold text-xs truncate group-hover:text-[#00FFFF]">
        {p.title}
      </p>
      <p className="text-white/60 text-[10px] truncate">
        {p.artist || "BD Rythm"}
      </p>
    </button>
  ))}
</div>

      )}
    </div>
  );
}

import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TopAlbums() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const rawGenre = state?.genre ?? "All";
  const genreName = typeof rawGenre === "string" ? rawGenre : rawGenre?.name || "All";

  const albumsFromState = Array.isArray(state?.albums) ? state.albums : [];

  // filter by genre (only if you want)
  const visibleAlbums = useMemo(() => {
    if (genreName === "All") return albumsFromState;
    return albumsFromState.filter(
      (a) => a?.genre === genreName || a?.genre === "All"
    );
  }, [albumsFromState, genreName]);

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-6 pb-28">
      {/* back */}
     <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[#00FFFF] text-2xl font-black transition duration-200 hover:scale-110 active:scale-95"
          aria-label="Back"
        >
          «
        </button>

      <div className="max-w-md mx-auto">
        <h1 className="mt-6 text-[#00FFFF] text-2xl font-extrabold uppercase">
          TOP ALBUMS
        </h1>

        <p className="mt-2 text-white/70 text-sm">
          Genre: <span className="text-[#00FFFF] font-bold">{genreName}</span>
        </p>

        {visibleAlbums.length === 0 ? (
          <div className="mt-10 text-white/60">
            No albums loaded. Open this page from{" "}
            <span className="text-[#00FFFF] font-bold">Home → Top Albums</span>.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {visibleAlbums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() =>
                  navigate("/playlist", {
                    state: { album }, // later we’ll use this to open album/playlist details
                  })
                }
                className="
                  rounded-2xl overflow-hidden
                  bg-white/5 border border-white/10
                  transition duration-200
                  hover:bg-white/10 hover:scale-[1.02]
                  active:scale-[0.99]
                  text-left
                "
                title={`${album.name} • ${album.artist}`}
              >
                {/* artwork */}
                <div className="w-full h-[140px] bg-white/10 overflow-hidden">
                  {album.artwork ? (
                    <img
                      src={album.artwork}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                {/* text */}
                <div className="p-3">
                  <p className="text-white font-black text-sm truncate">
                    {album.name}
                  </p>
                  <p className="text-white/70 text-xs truncate mt-1">
                    {album.artist}
                  </p>
                  <p className="text-white/50 text-[10px] mt-1 truncate">
                    {album.genre || "All"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

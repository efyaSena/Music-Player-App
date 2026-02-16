// src/pages/PopularPlaylists.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTrendingPlaylists } from "../api/audius";

export default function PopularPlaylists() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // genre can be string or object from Library
  const rawGenre = state?.genre ?? "All";
  const genreName =
    typeof rawGenre === "string" ? rawGenre : rawGenre?.name || "All";

  // playlists passed from Library (optional)
  const playlistsFromState = Array.isArray(state?.playlists) ? state.playlists : [];

  // fallback fetch
  const [fetched, setFetched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // if Library already passed playlists, no need to fetch
    if (playlistsFromState.length) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Audius trending playlists (genre filter isn't reliable on Audius,
        // so we fetch trending and display them)
        const data = await getTrendingPlaylists({ limit: 30, time: "week" });

        if (!alive) return;
        setFetched(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load playlists.");
        setFetched([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [playlistsFromState.length]);

  // normalize playlists into one shape
  const visiblePlaylists = useMemo(() => {
    const src = playlistsFromState.length ? playlistsFromState : fetched;

    return (src || []).map((p) => ({
      id: String(p?.id || p?._id || Math.random()),
      title: p?.playlist_name || p?.title || "Playlist",
      creator: p?.user?.name || p?.user?.handle || p?.artist || "Unknown",
      artwork:
        p?.artwork?.["150x150"] ||
        p?.artwork?.["480x480"] ||
        p?.artwork?.["1000x1000"] ||
        p?.artwork ||
        "",
      // keep raw if you want later for opening playlist page
      raw: p,
    }));
  }, [playlistsFromState, fetched]);

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-6 pb-24">
      {/* BACK */}
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

      {loading && <p className="text-white/40 text-[11px] mt-3">Loading playlists…</p>}
      {!loading && err && <p className="text-red-400 text-[11px] mt-3">{err}</p>}

      {visiblePlaylists.length === 0 && !loading ? (
        <div className="mt-10 text-white/60">
          No playlists available yet. Try another genre or check Audius.
        </div>
      ) : (
        // ✅ smaller cards (you said the grid was too big)
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visiblePlaylists.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                // later we’ll route to a real Playlist page when you want
                // navigate("/playlist", { state: { playlist: p.raw } })
                console.log("playlist clicked:", p);
              }}
              className="
                group text-left
                bg-white/5 border border-white/10
                rounded-2xl overflow-hidden
                transition duration-200
                hover:bg-white/10 hover:scale-[1.01]
                active:scale-[0.99]
              "
              title={p.title}
            >
              <div className="aspect-square bg-white/5">
                {p.artwork ? (
                  <img
                    src={p.artwork}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 font-black">
                    🎵
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="text-white font-extrabold text-sm truncate group-hover:text-[#00FFFF]">
                  {p.title}
                </p>
                <p className="text-white/60 text-[11px] truncate mt-1">
                  {p.creator}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// src/pages/PopularArtists.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTrendingTracks } from "../api/audius";

const pickImg = (obj) =>
  obj?.["150x150"] || obj?.["480x480"] || obj?.["1000x1000"] || "";

export default function PopularArtists() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Library might pass "K-Pop" (string). keep it simple.
  const activeGenre = state?.genre || "All";

  // If Library passed artists already, we use them.
  const passedArtists = Array.isArray(state?.artists) ? state.artists : [];

  // Self-heal state
  const [artists, setArtists] = useState(passedArtists);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // keep artists synced if user comes again with state
  useEffect(() => {
    if (passedArtists.length > 0) setArtists(passedArtists);
  }, [passedArtists]);

  useEffect(() => {
    // ✅ only fetch if nothing was passed
    if (passedArtists.length > 0) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const params =
          activeGenre === "All"
            ? { limit: 80, time: "week" }
            : { limit: 80, time: "week", genre: activeGenre };

        const tracks = await getTrendingTracks(params);

        // derive unique artists w/ real userId
        const seen = new Set();
        const derived = [];

        for (const t of tracks || []) {
          const uid = String(t?.user?.id || t?.user_id || "");
          if (!uid || seen.has(uid)) continue;
          seen.add(uid);

          const name = t?.user?.name || t?.user?.handle || "Unknown Artist";
          const artwork =
            pickImg(t?.user?.profile_picture) || pickImg(t?.artwork) || "";

          derived.push({
            id: uid,
            userId: uid,
            name,
            artwork,
            genre: activeGenre,
          });

          if (derived.length >= 30) break;
        }

        if (!alive) return;
        setArtists(derived);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load artists.");
        setArtists([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [activeGenre, passedArtists.length]);

  const heading = useMemo(() => {
    return activeGenre ? `Genre: ${activeGenre}` : "Genre: All";
  }, [activeGenre]);

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

      {/* TITLE */}
      <h1 className="mt-6 text-[#00FFFF] text-2xl font-extrabold uppercase">
        Popular Artists
      </h1>

      <p className="mt-2 text-white/70 text-sm">
        {heading.split(":")[0]}:{" "}
        <span className="text-[#00FFFF] font-bold">
          {activeGenre || "All"}
        </span>
      </p>

      {/* status */}
      {loading ? (
        <p className="mt-6 text-white/50 text-sm">Loading artists…</p>
      ) : err ? (
        <p className="mt-6 text-red-400 text-sm">{err}</p>
      ) : null}

      {/* EMPTY STATE */}
      {!loading && artists.length === 0 ? (
        <div className="mt-10 text-white/60">No artists available yet.</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((a) => {
            const userId = a.userId || a.id || "";
            const name = a.name || "Unknown Artist";
            const artwork = a.artwork || "";
            const genre = a.genre || "All";

            return (
              <button
                key={userId || name}
                type="button"
                onClick={() =>
                  navigate("/artist", {
                    state: { userId, name, artwork, genre },
                  })
                }
                className="
                  group w-full text-left
                  bg-white/5 border border-white/10
                  rounded-2xl p-4
                  transition duration-200
                  hover:bg-white/10 hover:scale-[1.01]
                  active:scale-[0.99]
                "
                title={name}
              >
                <div className="flex items-center gap-4">
                  {/* avatar */}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#CFFFFF] shrink-0">
                    {artwork ? (
                      <img
                        src={artwork}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black font-black text-lg">
                        {name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-extrabold truncate group-hover:text-[#00FFFF]">
                      {name}
                    </p>
                    <p className="text-white/60 text-xs mt-1 truncate">
                      {genre}
                    </p>
                  </div>

                  {/* chevron */}
                  <div className="text-white/30 group-hover:text-[#00FFFF] text-xl font-black">
                    ›
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

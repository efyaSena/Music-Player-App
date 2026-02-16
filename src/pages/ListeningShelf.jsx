import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getTrendingTracks, getTrackStreamUrl } from "../api/audius";
import { usePlayer } from "../context/usePlayer";

const SHELVES = {
  trending: {
    title: "TRENDING ARTISTS",
    subtitle: "What everyone is listening to right now",
  },
  "sweet-90s": {
    title: "SWEET 90’s",
    subtitle: "Throwbacks & classics",
  },
  "street-hits": {
    title: "STREET HITS",
    subtitle: "Loud ones from the streets",
  },
  "party-starters": {
    title: "PARTY STARTERS",
    subtitle: "Energy up. No dulling.",
  },
};

export default function ListeningShelf() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { slug } = useParams();
  const player = usePlayer();

  const genreObj = state?.genre;
  const genreName = typeof genreObj === "string" ? genreObj : genreObj?.name || "All";

  const shelf = SHELVES[slug] || { title: "LISTENING", subtitle: "" };

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // ✅ fetch base feed
        const params =
          genreName && genreName.toLowerCase() !== "all"
            ? { limit: 80, time: "week", genre: genreName }
            : { limit: 80, time: "week" };

        const data = await getTrendingTracks(params);

        // ✅ map
        const mapped = (data || []).map((t) => ({
          id: String(t?.id),
          title: t?.title || "Untitled",
          artist: t?.user?.name || t?.user?.handle || "Unknown",
          userId: String(t?.user?.id || t?.user_id || ""),
          artwork:
            t?.artwork?.["150x150"] ||
            t?.artwork?.["480x480"] ||
            t?.artwork?.["1000x1000"] ||
            "",
          artistArtwork:
            t?.user?.profile_picture?.["150x150"] ||
            t?.user?.profile_picture?.["480x480"] ||
            "",
          genre: t?.genre || "All",
          createdAt: t?.created_at || t?.release_date || 0,
          audio: getTrackStreamUrl(t?.id),
        }));

        // ✅ “different pages” behavior (not lazy)
        let final = mapped;

        if (slug === "sweet-90s") {
          // “older vibe” proxy: take deeper part of the list
          final = mapped.slice(20, 60);
        } else if (slug === "street-hits") {
          final = mapped.filter((t) => {
            const g = String(t.genre || "").toLowerCase();
            const a = String(t.artist || "").toLowerCase();
            return g.includes("hip") || g.includes("rap") || a.includes("lil") || a.includes("young");
          });
          if (final.length < 20) final = mapped.slice(10, 50);
        } else if (slug === "party-starters") {
          final = mapped.filter((t) => {
            const g = String(t.genre || "").toLowerCase();
            return g.includes("edm") || g.includes("dance") || g.includes("house") || g.includes("afro") || g.includes("amapiano");
          });
          if (final.length < 20) final = mapped.slice(0, 40);
        }

        if (!alive) return;
        setTracks(final);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load.");
        setTracks([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug, genreName]);

  const handlePlay = async (song) => {
    try {
      await player?.playSong?.(song);
    } catch (e) {
      console.log("play failed", e);
    }
  };

  const derivedArtists = useMemo(() => {
    const seen = new Set();
    const artists = [];
    for (const t of tracks) {
      const uid = t.userId;
      if (!uid || seen.has(uid)) continue;
      seen.add(uid);
      artists.push({
        id: uid,
        userId: uid,
        name: t.artist,
        artwork: t.artistArtwork || t.artwork || "",
        genre: genreName,
      });
      if (artists.length >= 18) break;
    }
    return artists;
  }, [tracks, genreName]);

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
        {shelf.title}
      </h1>

      <p className="mt-2 text-white/70 text-sm">
        Genre: <span className="text-[#00FFFF] font-bold">{genreName}</span>
      </p>

      {shelf.subtitle ? (
        <p className="mt-1 text-white/40 text-xs">{shelf.subtitle}</p>
      ) : null}

      {loading && <p className="text-white/40 text-[10px] mt-3">Loading…</p>}
      {!loading && err && <p className="text-red-400 text-[10px] mt-3">{err}</p>}

      {/* Special: Trending Artists can jump into Popular Artists */}
      {slug === "trending" ? (
        <button
          type="button"
          onClick={() => navigate("/popular-artists", { state: { genre: genreName, artists: derivedArtists } })}
          className="mt-6 w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-left hover:bg-white/10 transition"
        >
          <p className="text-white font-black">Open Trending Artists</p>
          <p className="text-white/50 text-xs mt-1">View artists list (real Audius userId)</p>
        </button>
      ) : null}

      {tracks.length === 0 && !loading ? (
        <div className="mt-8 text-white/60">
          Nothing loaded yet. Try another genre or check your Audius connection.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4">
          {tracks.slice(0, 40).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handlePlay(s)}
              className="
                flex items-center gap-3 text-left
                bg-white/5 border border-white/10
                rounded-2xl p-3
                transition duration-200
                hover:bg-white/10 hover:scale-[1.02]
                active:scale-[0.99]
              "
              title={`${s.artist} • ${s.title}`}
            >
              <div className="w-14 h-14 rounded-xl bg-[#CFFFFF] overflow-hidden shrink-0">
                {s.artwork ? (
                  <img src={s.artwork} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="text-[#00FFFF] text-xs font-bold truncate">{s.artist}</p>
                <p className="text-white text-sm font-black truncate">{s.title}</p>
                <p className="text-white/50 text-[10px] font-semibold mt-1 truncate">
                  {s.genre || "All"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

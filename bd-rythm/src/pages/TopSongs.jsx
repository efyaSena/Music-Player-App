import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { getTrendingTracks, getTrackStreamUrl } from "../api/audius";

export default function TopSongs() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const player = usePlayer();

  // ✅ values coming from Library/Home
  const scope = state?.scope || "global"; // global | usa | genre
  const chartTitle = state?.chart || "Top Songs";

  // ✅ genre can be string or object
  const rawGenre = state?.genre ?? "All";
  const genreName =
    typeof rawGenre === "string" ? rawGenre : rawGenre?.name || "All";

  // ✅ tracks passed in (optional)
  const tracksFromState = state?.tracks;
  const passedTracks = Array.isArray(tracksFromState) ? tracksFromState : [];

  // ✅ fetched fallback
  const [fetchedTracks, setFetchedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ genre mapping (safe + simple)
  const mapToYourGenre = useCallback((t) => {
    const g = String(t?.genre || "").toLowerCase();
    const tags = String(t?.tags || "").toLowerCase();
    const has = (...words) => words.some((w) => tags.includes(w) || g.includes(w));

    if (has("afrobeat", "afrobeats", "afro-beat", "afro beat", "afropop")) return "Afrobeat";
    if (has("amapiano", "log drum", "logdrum")) return "Amapiano";
    if (has("r&b", "rnb", "soul")) return "R&B";
    if (has("hip hop", "hip-hop", "rap")) return "Hip-hop";
    if (has("reggae")) return "Reggae";
    if (has("k-pop", "kpop")) return "K-Pop";
    if (has("rock")) return "Rock";
    if (has("pop")) return "Pop";
    return t?.genre || "All";
  }, []);

  // ✅ normalize Audius track -> your app track
  const mapTrack = useCallback(
    (t) => ({
      id: String(t?.id),
      title: t?.title || "Untitled",
      artist: t?.user?.name || t?.user?.handle || "Unknown",
      artwork:
        t?.artwork?.["150x150"] ||
        t?.artwork?.["480x480"] ||
        t?.artwork?.["1000x1000"] ||
        "",
      genre: mapToYourGenre(t),
      audio: getTrackStreamUrl(t?.id),
      // optional extras (won't break anything)
      userId: String(t?.user?.id || t?.user_id || ""),
      artistArtwork:
        t?.user?.profile_picture?.["150x150"] ||
        t?.user?.profile_picture?.["480x480"] ||
        "",
      createdAt: t?.created_at || t?.release_date || 0,
    }),
    [mapToYourGenre]
  );

  // ✅ fetch if nothing passed
  // ✅ fetch if nothing passed
useEffect(() => {
  if (passedTracks.length) return;

  let alive = true;

  (async () => {
    try {
      setLoading(true);
      setErr("");

      // ✅ IMPORTANT:
      // Audius genre filtering is unreliable for "K-Pop", "Afrobeat", etc.
      // So always fetch trending, then filter locally.
      const params = { limit: 60, time: "week" };

      const data = await getTrendingTracks(params);
      const mapped = (data || []).map(mapTrack);

      if (!alive) return;
      setFetchedTracks(mapped);
    } catch (e) {
      if (!alive) return;
      setErr(e?.message || "Failed to load songs.");
      setFetchedTracks([]);
    } finally {
      if (alive) setLoading(false);
    }
  })();

  return () => {
    alive = false;
  };
}, [passedTracks.length, mapTrack]);

  // ✅ MAIN LIST
  const visibleTracks = useMemo(() => {
    const src = passedTracks.length ? passedTracks : fetchedTracks;
    if (!src.length) return [];

    if (scope === "global") return src;

    if (scope === "usa") {
      const withCountry = src.filter((t) => {
        const c = String(t?.country || "").toLowerCase();
        return c.includes("united states") || c === "usa" || c === "us";
      });
      return withCountry.length ? withCountry : src;
    }

    if (scope === "genre") {
  if (!genreName || genreName.toLowerCase() === "all") return src;

  return src.filter((t) => {
    const tg = String(t?.genre || "All").toLowerCase();
    return tg === String(genreName).toLowerCase();
  });
}


    return src;
  }, [passedTracks, fetchedTracks, scope, genreName]);

  const handlePlay = async (song) => {
    try {
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
        {chartTitle}
      </h1>

      <p className="mt-2 text-white/70 text-sm">
        Scope:{" "}
        <span className="text-[#00FFFF] font-bold">
          {scope === "genre" ? `${scope} • ${genreName}` : scope}
        </span>
      </p>

      {loading && <p className="text-white/40 text-[10px] mt-3">Loading songs…</p>}
      {!loading && err && <p className="text-red-400 text-[10px] mt-3">{err}</p>}

      {visibleTracks.length === 0 && !loading ? (
        <div className="mt-8 text-white/60">
          No songs loaded yet. Try another genre or check your Audius connection.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4">
          {visibleTracks.map((s) => (
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
                  <img
                    src={s.artwork}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
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

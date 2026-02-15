import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { getTrendingTracks, getTrackStreamUrl } from "../api/audius";

const MOODS = {
  love: {
    title: "Love / Feel Good",
    subtitle: "Soft vibes, sweet melodies",
    // pink -> purple
    gradient: "from-pink-500/30 via-fuchsia-500/20 to-purple-600/30",
    accent: "text-pink-300",
    chip: "bg-pink-400/20 border-pink-400/30 text-pink-200",
    keywords: ["love", "baby", "sweet", "feel good", "romance", "crush", "kiss", "valentine"],
  },
  heartbreak: {
    title: "Heartbreak",
    subtitle: "Sad songs & late-night feels",
    // dark violet
    gradient: "from-violet-900/40 via-purple-900/25 to-black",
    accent: "text-violet-300",
    chip: "bg-violet-400/15 border-violet-400/25 text-violet-200",
    keywords: ["heartbreak", "broken", "sad", "tears", "lonely", "miss you", "pain", "goodbye"],
  },
  gym: {
    title: "Gym / Energy",
    subtitle: "High tempo, no excuses",
    // red -> orange
    gradient: "from-red-500/30 via-orange-500/20 to-yellow-500/20",
    accent: "text-orange-300",
    chip: "bg-orange-400/20 border-orange-400/30 text-orange-200",
    keywords: ["gym", "workout", "energy", "hype", "turn up", "rage", "run", "pump", "lift"],
  },
  relax: {
    title: "Relax / Focus",
    subtitle: "Calm sounds to reset",
    // blue -> teal
    gradient: "from-blue-500/25 via-cyan-500/15 to-teal-500/25",
    accent: "text-cyan-300",
    chip: "bg-cyan-400/15 border-cyan-400/25 text-cyan-200",
    keywords: ["relax", "calm", "focus", "chill", "study", "lofi", "peace", "sleep", "meditate"],
  },
};

export default function MoodShelf() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { slug } = useParams();
  const player = usePlayer();

  // genre can be string or object or missing
  const rawGenre = state?.genre ?? "All";
  const genreName =
    typeof rawGenre === "string" ? rawGenre : rawGenre?.name || "All";

  const mood = MOODS[slug] || MOODS.love;

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // map audius track -> your track format
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
      tags: String(t?.tags || ""),
      genre: t?.genre || "All",
      audio: getTrackStreamUrl(t?.id),
    }),
    []
  );

  // fetch real tracks when slug or genre changes
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const wantGenre = genreName && genreName.toLowerCase() !== "all";

        const params = wantGenre
          ? { limit: 80, time: "week", genre: genreName }
          : { limit: 80, time: "week" };

        const data = await getTrendingTracks(params);
        const mapped = (data || []).map(mapTrack);

        if (!alive) return;
        setTracks(mapped);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load mood tracks.");
        setTracks([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug, genreName, mapTrack]);

  // mood filtering
  const filtered = useMemo(() => {
    const kws = mood.keywords.map((k) => k.toLowerCase());
    const match = (t) => {
      const hay = `${t.title} ${t.artist} ${t.genre} ${t.tags}`.toLowerCase();
      return kws.some((k) => hay.includes(k));
    };

    const hits = tracks.filter(match);

    // if filter is too strict (Audius tags vary), fallback to a nice slice
    return hits.length >= 12 ? hits.slice(0, 40) : tracks.slice(0, 40);
  }, [tracks, mood]);

  const mosaic = useMemo(() => {
    const imgs = filtered
      .map((t) => t.artwork)
      .filter(Boolean)
      .slice(0, 4);
    return imgs;
  }, [filtered]);

  const handlePlay = async (song) => {
    try {
      await player?.playSong?.(song);
    } catch (e) {
      console.log("play failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header / Hero */}
      <div className={`relative px-6 pt-6 pb-6 overflow-hidden`}>
        <div
          className={`absolute inset-0 bg-gradient-to-br ${mood.gradient}`}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative">
          {/* back */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10
                       hover:bg-white/10 active:scale-95 transition"
            aria-label="Back"
          >
            <span className="text-[#00FFFF] text-xl font-black">«</span>
          </button>

          <div className="mt-6 flex items-start gap-4">
            {/* artwork mosaic */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
              {mosaic.length > 0 ? (
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-full h-full bg-black/20">
                      {mosaic[i] ? (
                        <img
                          src={mosaic[i]}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`text-[10px] font-extrabold tracking-widest ${mood.accent}`}>
                MOOD
              </p>
              <h1 className="mt-1 text-2xl font-black leading-tight">
                {mood.title}
              </h1>

              <p className="mt-1 text-white/70 text-sm font-semibold">
                {mood.subtitle}
              </p>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${mood.chip}`}>
                  {genreName}
                </span>

                <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
                  {loading ? "Loading…" : `${filtered.length} tracks`}
                </span>
              </div>
            </div>
          </div>

          {/* Play button */}
          <div className="mt-5">
            <button
              type="button"
              disabled={filtered.length === 0}
              onClick={() => filtered[0] && handlePlay(filtered[0])}
              className="w-full max-w-md
                         bg-[#CFFFFF] text-black font-extrabold
                         py-3 rounded-2xl
                         transition duration-200 hover:bg-[#00FFFF] active:scale-[0.99]
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Play
            </button>
          </div>

          {err ? (
            <p className="text-red-400 text-[10px] mt-3">{err}</p>
          ) : null}
        </div>
      </div>

      {/* List */}
      <div className="px-6 pb-24">
        {loading ? (
          <p className="text-white/40 text-[10px] mt-2">Loading tracks…</p>
        ) : filtered.length === 0 ? (
          <div className="mt-8 text-white/60">
            No tracks found. Try another mood or genre.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handlePlay(t)}
                className="w-full flex items-center gap-3 text-left
                           bg-white/5 border border-white/10 rounded-2xl p-3
                           transition duration-200 hover:bg-white/10 active:scale-[0.99]"
                title={`${t.artist} • ${t.title}`}
              >
                <div className="w-8 text-white/35 text-[10px] font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#CFFFFF] overflow-hidden shrink-0">
                  {t.artwork ? (
                    <img
                      src={t.artwork}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-extrabold truncate">
                    {t.title}
                  </p>
                  <p className="text-white/60 text-[10px] font-semibold truncate">
                    {t.artist}
                  </p>
                </div>

                <div className={`text-[10px] font-bold ${mood.accent}`}>
                  ▶
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

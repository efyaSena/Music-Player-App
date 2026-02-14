import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { getTrendingTracks, getTrackStreamUrl } from "../api/audius";

export default function TrendingSongs() {
  const navigate = useNavigate();
  const player = usePlayer();

  // ✅ NEW: map Audius genre/tags into YOUR pill names
  const mapToYourGenre = (t) => {
    const g = String(t?.genre || "").toLowerCase();
    const tags = String(t?.tags || "").toLowerCase();

    const has = (...words) => words.some((w) => tags.includes(w) || g.includes(w));

    if (has("afrobeat", "afrobeats", "afro-beat", "afro beat", "afropop")) return "Afrobeat";
    if (has("amapiano", "log drum", "logdrum")) return "Amapiano";
    if (has("gospel", "worship", "praise")) return "Gospel";
    if (has("r&b", "rnb", "soul")) return "R&B";
    if (has("hip hop", "hip-hop", "rap")) return "Hip-hop";
    if (has("trap")) return "Trap";
    if (has("reggaeton")) return "Reggaeton";
    if (has("dancehall", "caribbean", "afro-dancehall")) return "Caribbean";
    if (has("edm", "electronic", "house", "techno", "tech house", "trance", "dubstep")) return "EDM";
    if (has("jazz")) return "Jazz";
    if (has("indie", "alternative")) return "Indie";
    if (has("classical", "orchestral")) return "Classical";
    if (has("k-pop", "kpop")) return "K-Pop";
    if (has("rock")) return "Rock";
    if (has("pop")) return "Pop";

    // fallback:
    return t?.genre || "All";
  };

  const GENRES = useMemo(
    () => [
      "All",
      "Afrobeat",
      "Amapiano",
      "Hip-hop",
      "Trap",
      "Pop",
      "Rock",
      "R&B",
      "Gospel",
      "Reggaeton",
      "Caribbean",
      "EDM",
      "Jazz",
      "Indie",
      "Classical",
      "K-Pop",
    ],
    []
  );

  const [activeGenre, setActiveGenre] = useState("All");
  const [toast, setToast] = useState("");


  // ✅ audius state
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // ✅ play immediately (Audiomack feel)
 const handlePlay = async (track) => {
  try {
    const audio = getTrackStreamUrl(track.id);

    await player?.playSong?.({
      id: track.id,
      title: track.title,
      artist: track.artist || "Unknown",
      artwork: track.artwork || "",
      genre: track.genre || "All",
      audio,
    });
  } catch  {
    setToast("Some tracks won’t stream right now (Audius). Try another one.");
    setTimeout(() => setToast(""), 2500);
  }
};

{toast && (
  <p className="text-yellow-300 text-xs mt-3 text-center">{toast}</p>
)}


  // ✅ fetch trending from Audius
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrMsg("");

        const data = await getTrendingTracks({ limit: 80, time: "week" });

        const mapped = (data || []).map((t) => {
          const artist = t?.user?.name || t?.user?.handle || "Unknown";
          const title = t?.title || "Untitled";

          // ✅ CHANGED: use mapper instead of raw genre
          const genre = mapToYourGenre(t);

          return {
            id: String(t?.id),
            artist,
            title,
            genre,

            // keep artwork same
            artwork:
              t?.artwork?.["150x150"] ||
              t?.artwork?.["480x480"] ||
              t?.artwork?.["1000x1000"] ||
              "",
          };
        });

        if (alive) setSongs(mapped);
      } catch (e) {
        if (alive) {
          setErrMsg(e?.message || "Failed to load trending tracks.");
          setSongs([]);
        }
      } finally {
        // ✅ ESLint fix: no return inside finally
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []); // (left as-is)

  const filteredSongs = useMemo(() => {
    if (activeGenre === "All") return songs;
    return songs.filter(
      (s) => (s.genre || "").toLowerCase() === activeGenre.toLowerCase()
    );
  }, [songs, activeGenre]);

  const PAGE_SIZE = 8;
  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < filteredSongs.length; i += PAGE_SIZE) {
      out.push(filteredSongs.slice(i, i + PAGE_SIZE));
    }
    return out;
  }, [filteredSongs]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 px-6 pt-6 pb-6 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[#00FFFF] text-2xl font-black transition duration-200 hover:scale-110 active:scale-95"
          aria-label="Back"
        >
          «
        </button>

        <h2 className="mt-6 text-center text-[#00FFFF] text-sm font-bold">
          trending songs
        </h2>

        {/* Genre pills */}
        <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {GENRES.map((g) => {
            const isActive = g === activeGenre;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGenre(g)}
                className={[
                  "shrink-0 px-5 h-7 rounded-full text-[10px] font-bold transition duration-200",
                  isActive
                    ? "bg-[#00EFFF] text-black ring-2 ring-[#00FFFF]"
                    : "bg-[#00EFFF]/80 text-black hover:bg-[#00EFFF] hover:scale-105 active:scale-95",
                ].join(" ")}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* loading / error */}
        {loading && (
          <p className="text-white/60 text-sm mt-10 text-center">
            Loading trending tracks…
          </p>
        )}

        {errMsg && !loading && (
          <p className="text-red-400 text-sm mt-10 text-center">{errMsg}</p>
        )}

        {/* Songs */}
        {!loading && !errMsg && (
          <div className="mt-8 overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-10 pr-6">
              {pages.map((pageSongs, pageIndex) => (
                <div key={pageIndex} className="shrink-0 w-[320px]">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                    {pageSongs.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handlePlay(s)}
                        className="flex items-center gap-4 text-left transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
                      >
                        <div className="w-14 h-14 bg-[#CFFFFF] rounded-xl shrink-0 overflow-hidden">
                          {s.artwork ? (
                            <img
                              src={s.artwork}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>

                        <div className="leading-tight">
                          <p className="text-[#00FFFF] text-xs font-bold truncate max-w-[110px]">
                            {s.artist}
                          </p>
                          <p className="text-[#00FFFF] text-xs font-semibold truncate max-w-[110px]">
                            {s.title}
                          </p>
                          <p className="text-white/50 text-[10px] font-semibold mt-1">
                            {s.genre || "All"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {filteredSongs.length === 0 && (
                <div className="shrink-0 w-[320px]">
                  <p className="text-white/60 text-sm mt-10 text-center">
                    No songs for {activeGenre}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ❌ no BottomNav here — PlayerLayout already renders it */}
    </div>
  );
}

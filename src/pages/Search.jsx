import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { searchTracks, getTrackStreamUrl } from "../api/audius";

export default function Search() {
  const navigate = useNavigate();
  const player = usePlayer();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState("");

  // ✅ map Audius -> your UI song shape
  const mapTrack = (t) => {
    const artist = t?.user?.name || t?.user?.handle || "Unknown";
    const title = t?.title || "Untitled";

    return {
      id: String(t?.id),
      artist,
      title,
      genre: t?.genre || "All",
      artwork:
        t?.artwork?.["150x150"] ||
        t?.artwork?.["480x480"] ||
        t?.artwork?.["1000x1000"] ||
        "",
      audio: getTrackStreamUrl(t?.id),
    };
  };

  const handlePlay = async (song) => {
    try {
      // Audiomack feel: tap = play now
      await player?.playSong?.(song);
    } catch  {
      setToast("Some tracks won’t stream right now (Audius). Try another one.");
      setTimeout(() => setToast(""), 2500);
    }
  };

  // ✅ debounce search
  useEffect(() => {
    let alive = true;
    const q = query.trim();

    // reset if empty
    if (!q) {
      setResults([]);
      setErrMsg("");
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      (async () => {
        try {
          setLoading(true);
          setErrMsg("");

          const data = await searchTracks({ query: q, limit: 30 });
          const mapped = (data || []).map(mapTrack);

          if (!alive) return;
          setResults(mapped);
        } catch (e) {
          if (!alive) return;
          setErrMsg(e?.message || "Search failed. Try again.");
          setResults([]);
        } finally {
          if (alive) setLoading(false);
        }
      })();
    }, 450);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query]);

  const hasResults = useMemo(() => results.length > 0, [results]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 px-6 pt-6 pb-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#00FFFF] text-2xl font-black transition duration-200 hover:scale-110 active:scale-95"
            aria-label="Back"
          >
            «
          </button>

          <h2 className="text-[#00FFFF] text-sm font-bold">search</h2>
        </div>

        {/* Search input */}
        <div className="mt-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artist, song, vibe…"
            className="
              w-full h-12 rounded-2xl px-4
              bg-white/10 border border-white/10
              text-white placeholder:text-white/40
              outline-none
              focus:border-[#00FFFF]/60
            "
          />
          <p className="text-white/40 text-[10px] mt-2">
            Tip: try “Burna”, “Ama”, “Gospel”, “Piano”, “SZA”…
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <p className="text-yellow-300 text-xs mt-4 text-center">{toast}</p>
        )}

        {/* Loading / error (your snippet style) */}
        {loading && (
          <p className="text-white/60 text-sm mt-6 text-center">Searching…</p>
        )}

        {errMsg && !loading && (
          <p className="text-red-400 text-sm mt-6 text-center">{errMsg}</p>
        )}

        {/* Results (your 2-col grid snippet) */}
        {!loading && !errMsg && !query.trim() && (
          <p className="text-white/50 text-sm text-center mt-10">
            Type something to search.
          </p>
        )}

        {!loading && !errMsg && query.trim() && !hasResults && (
          <p className="text-white/50 text-sm text-center mt-10">
            No results for “{query.trim()}”
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {results.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handlePlay(s)}
                className="
                  flex items-center gap-3
                  text-left
                  transition
                  hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                <div className="w-14 h-14 rounded-xl bg-[#CFFFFF] overflow-hidden shrink-0">
                  {s.artwork && (
                    <img
                      src={s.artwork}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="leading-tight min-w-0">
                  <p className="text-[#00FFFF] text-xs font-bold truncate max-w-[120px]">
                    {s.artist}
                  </p>
                  <p className="text-[#00FFFF] text-xs truncate max-w-[120px]">
                    {s.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ❌ no BottomNav here — PlayerLayout already renders it */}
    </div>
  );
}

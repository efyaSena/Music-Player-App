import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { getPlaylistTracks, getTrackStreamUrl } from "../api/audius";

export default function Playlist() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const player = usePlayer();

  // ✅ support BOTH ways:
  // - state.album (from TopAlbums)
  // - state.playlistId/title/artwork/artist (manual)
  const album = state?.album || null;

  const playlistId = String(state?.playlistId || album?.id || "");
  const title = state?.title || album?.name || "Playlist";
  const artwork = state?.artwork || album?.artwork || "";
  const artist = state?.artist || album?.artist || "BD Rythm";

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // same genre mapping style as HomePage
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
    }),
    [mapToYourGenre]
  );

  useEffect(() => {
    if (!playlistId) {
      setErr("No playlist selected. Open this page from Top Albums.");
      setTracks([]);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const data = await getPlaylistTracks({ playlistId, limit: 100, offset: 0 });
        const mapped = (data || []).map(mapTrack);

        if (!alive) return;
        setTracks(mapped);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load playlist tracks.");
        setTracks([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [playlistId, mapTrack]);

  const heroBg = useMemo(() => artwork || tracks?.[0]?.artwork || "", [artwork, tracks]);

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

      {/* header */}
      <div className="mt-6 max-w-md mx-auto">
        <div className="relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          {heroBg ? (
            <div className="absolute inset-0 opacity-20">
              <img src={heroBg} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}

          <div className="relative p-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#CFFFFF] overflow-hidden shrink-0">
                {heroBg ? (
                  <img src={heroBg} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="text-white/60 text-[10px] font-semibold">ALBUM / PLAYLIST</p>
                <h1 className="mt-1 text-[#00FFFF] text-lg font-extrabold leading-tight line-clamp-2">
                  {title}
                </h1>
                <p className="mt-1 text-white/70 text-xs font-semibold truncate">{artist}</p>
                <p className="mt-2 text-white/50 text-[10px] font-semibold">
                  {loading ? "Loading…" : `${tracks.length} tracks`}
                </p>
              </div>
            </div>

            {tracks.length > 0 ? (
              <button
                type="button"
                onClick={() => handlePlay(tracks[0])}
                className="mt-4 w-full bg-[#CFFFFF] text-black font-extrabold text-xs py-3 rounded-2xl
                           transition duration-200 hover:bg-[#00FFFF] active:scale-[0.99]"
              >
                Play
              </button>
            ) : null}
          </div>
        </div>

        {loading && <p className="text-white/40 text-[10px] mt-3">Loading tracks…</p>}
        {!loading && err && <p className="text-red-400 text-[10px] mt-3">{err}</p>}

        {!loading && !err && tracks.length === 0 ? (
          <div className="mt-8 text-white/60 text-sm">
            No tracks found for this album/playlist.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {tracks.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handlePlay(s)}
                className="w-full flex items-center gap-3 text-left
                           bg-white/5 border border-white/10 rounded-2xl p-3
                           transition duration-200 hover:bg-white/10 active:scale-[0.99]"
                title={`${s.artist} • ${s.title}`}
              >
                <div className="w-10 text-white/40 text-[10px] font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#CFFFFF] overflow-hidden shrink-0">
                  {s.artwork ? (
                    <img src={s.artwork} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-extrabold truncate">{s.title}</p>
                  <p className="text-white/60 text-[10px] font-semibold truncate">{s.artist}</p>
                </div>

                <div className="text-right">
                  <p className="text-[#00FFFF] text-[10px] font-bold">{s.genre || "All"}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

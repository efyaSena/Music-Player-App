import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { getTrackStreamUrl, getUser, getUserPlaylists, getUserTracks } from "../api/audius";

export default function ArtistProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const player = usePlayer();

  // coming from PopularArtists page
  const userId = state?.userId || "";
  const fallbackName = state?.name || "Artist";
  const fallbackArtwork = state?.artwork || "";
  const fallbackGenre = state?.genre || "All";

  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [releases, setReleases] = useState([]);

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
      userId: String(t?.user?.id || ""),
      title: t?.title || "Untitled",
      artist: t?.user?.name || t?.user?.handle || "Unknown",
      artwork:
        t?.artwork?.["150x150"] ||
        t?.artwork?.["480x480"] ||
        t?.artwork?.["1000x1000"] ||
        "",
      genre: mapToYourGenre(t),
      audio: getTrackStreamUrl(t?.id),
      plays: Number(t?.play_count || 0),
    }),
    [mapToYourGenre]
  );

  useEffect(() => {
    if (!userId) {
      setErr("No artist selected. Open this page from Popular Artists.");
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // profile + tracks + playlists in parallel
        const [p, tracks, pls] = await Promise.all([
          getUser(userId),
          getUserTracks({ userId, limit: 12, offset: 0, sort: "plays" }),
          getUserPlaylists({ userId, limit: 10, offset: 0 }),
        ]);

        if (!alive) return;

        setProfile(p);
        setTopTracks((tracks || []).map(mapTrack));
        setReleases(pls || []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load artist.");
        setProfile(null);
        setTopTracks([]);
        setReleases([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [userId, mapTrack]);

  const displayName = profile?.name || profile?.handle || fallbackName;

  const displayArtwork =
    profile?.profile_picture?.["480x480"] ||
    profile?.profile_picture?.["150x150"] ||
    fallbackArtwork ||
    "";

  const displayGenre =
    fallbackGenre !== "All"
      ? fallbackGenre
      : profile?.genre || profile?.tags?.[0] || "All";

  const followers = Number(profile?.follower_count || 0);
  const following = Number(profile?.followee_count || 0);
  const totalPlays = Number(profile?.total_plays || 0);

  const bio =
    profile?.bio ||
    profile?.description ||
    "";

  const heroBg = useMemo(() => {
    const firstTrackArt = topTracks?.[0]?.artwork || "";
    return displayArtwork || firstTrackArt || "";
  }, [displayArtwork, topTracks]);

  const handlePlay = async (song) => {
    try {
      await player?.playSong?.(song);
    } catch (e) {
      console.log("play failed", e);
    }
  };

  const formatNum = (n) => {
    if (!n) return "0";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

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

      {/* HERO */}
      <div className="mt-6 max-w-md mx-auto">
        <div className="relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          {heroBg ? (
            <div className="absolute inset-0 opacity-20">
              <img src={heroBg} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}

          <div className="relative p-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#CFFFFF] overflow-hidden shrink-0 shadow-[0_0_0_3px_rgba(0,239,255,0.25)]">
                {displayArtwork ? (
                  <img src={displayArtwork} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="text-white/60 text-[10px] font-semibold uppercase">Artist</p>
                <h1 className="mt-1 text-[#00FFFF] text-xl font-extrabold truncate">
                  {displayName}
                </h1>
                <p className="mt-1 text-white/70 text-xs font-semibold truncate">
                  Genre / style: <span className="text-[#00FFFF] font-bold">{displayGenre}</span>
                </p>

                <div className="mt-3 flex gap-4 text-[10px] text-white/70">
                  <span>
                    <span className="text-white font-extrabold">{formatNum(followers)}</span>{" "}
                    followers
                  </span>
                  <span>
                    <span className="text-white font-extrabold">{formatNum(following)}</span>{" "}
                    following
                  </span>
                  <span>
                    <span className="text-white font-extrabold">{formatNum(totalPlays)}</span>{" "}
                    plays
                  </span>
                </div>
              </div>
            </div>

            {/* BIO */}
            {bio ? (
              <p className="mt-4 text-white/70 text-sm leading-relaxed line-clamp-4">
                {bio}
              </p>
            ) : null}

            {/* PLAY TOP TRACK */}
            {topTracks.length > 0 ? (
              <button
                type="button"
                onClick={() => handlePlay(topTracks[0])}
                className="mt-5 w-full bg-[#CFFFFF] text-black font-extrabold text-xs py-3 rounded-2xl
                           transition duration-200 hover:bg-[#00FFFF] active:scale-[0.99]"
              >
                Play top track
              </button>
            ) : null}
          </div>
        </div>

        {/* STATES */}
        {loading && <p className="text-white/40 text-[10px] mt-3">Loading artist…</p>}
        {!loading && err && <p className="text-red-400 text-[10px] mt-3">{err}</p>}

        {/* TOP TRACKS */}
        <h2 className="mt-8 text-[#00FFFF] text-xs font-extrabold uppercase">
          Top tracks
        </h2>

        {topTracks.length === 0 && !loading ? (
          <p className="mt-3 text-white/60 text-sm">No tracks found.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {topTracks.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handlePlay(t)}
                className="w-full flex items-center gap-3 text-left
                           bg-white/5 border border-white/10 rounded-2xl p-3
                           transition duration-200 hover:bg-white/10 active:scale-[0.99]"
                title={`${t.artist} • ${t.title}`}
              >
                <div className="w-10 text-white/40 text-[10px] font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#CFFFFF] overflow-hidden shrink-0">
                  {t.artwork ? (
                    <img src={t.artwork} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-extrabold truncate">{t.title}</p>
                  <p className="text-white/60 text-[10px] font-semibold truncate">
                    {formatNum(t.plays)} plays • {t.genre || "All"}
                  </p>
                </div>

                <span className="text-[#00FFFF] text-xs font-black">▶</span>
              </button>
            ))}
          </div>
        )}

        {/* LATEST RELEASES / PLAYLISTS */}
        <h2 className="mt-10 text-[#00FFFF] text-xs font-extrabold uppercase">
          Latest releases / playlists
        </h2>

        {releases.length === 0 && !loading ? (
          <p className="mt-3 text-white/60 text-sm">No releases found.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {releases.slice(0, 8).map((p) => {
              const art =
                p?.artwork?.["480x480"] ||
                p?.artwork?.["150x150"] ||
                p?.playlist_image?.["480x480"] ||
                p?.playlist_image?.["150x150"] ||
                "";

              const title = p?.playlist_name || p?.name || "Playlist";
              const owner = p?.user?.name || p?.user?.handle || "Unknown";

              return (
                <button
                  key={String(p?.id)}
                  type="button"
                  onClick={() =>
                    navigate("/playlist", {
                      state: {
                        playlistId: String(p?.id),
                        title,
                        artwork: art,
                        artist: owner,
                      },
                    })
                  }
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden
                             transition duration-200 hover:bg-white/10 active:scale-[0.99]"
                  title={title}
                >
                  <div className="h-[110px] bg-[#CFFFFF]/20">
                    {art ? <img src={art} alt="" className="w-full h-full object-cover" loading="lazy" /> : null}
                  </div>
                  <div className="p-3 text-left">
                    <p className="text-white font-extrabold text-sm truncate">{title}</p>
                    <p className="text-white/60 text-[10px] font-semibold truncate">{owner}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

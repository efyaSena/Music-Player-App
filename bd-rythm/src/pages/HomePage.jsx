// src/pages/HomePage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/usePlayer";
import { getTrendingAlbums, getTrendingTracks, getTrackStreamUrl } from "../api/audius";

import logo from "../assets/BD-RYTHM-logo.png";

const AlbumTile = ({ album, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 w-16 h-20 bg-[#CFFFFF] rounded-xl overflow-hidden transition duration-200 hover:scale-105 active:scale-95"
      title={`${album.name} • ${album.artist}`}
    >
      {album.artwork ? (
        <img src={album.artwork} alt="" className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-end p-2">
          <div className="text-left leading-tight w-full">
            <p className="text-black text-[9px] font-black truncate">{album.name}</p>
            <p className="text-black/70 text-[8px] font-semibold truncate">{album.artist}</p>
          </div>
        </div>
      )}
    </button>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const player = usePlayer();

  // ✅ autoplay track if another page passed it back
  useEffect(() => {
    const track = location.state?.track;
    if (!track) return;
    player?.playSong?.(track);
  }, [location.state, player]);

  const GENRES = useMemo(
    () => ["All", "Afrobeat", "Amapiano", "Hip-hop", "Pop", "Rock", "R&B", "Reggae", "K-Pop"],
    []
  );

  const [activeGenre, setActiveGenre] = useState("All");

  // ✅ REAL trending tracks
  const [realTrending, setRealTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingErr, setTrendingErr] = useState("");

  // ✅ REAL albums (fallback stays)
  const fallbackTopAlbums = useMemo(
    () => [
      { id: "a1", name: "SOS", artist: "SZA", genre: "R&B", artwork: "" },
      { id: "a2", name: "UTOPIA", artist: "Travis Scott", genre: "Hip-hop", artwork: "" },
      { id: "a3", name: "Unavailable (EP)", artist: "Davido", genre: "Afrobeat", artwork: "" },
      { id: "a4", name: "Renaissance", artist: "Beyoncé", genre: "Pop", artwork: "" },
      { id: "a5", name: "After Hours", artist: "The Weeknd", genre: "Pop", artwork: "" },
      { id: "a6", name: "Born Pink", artist: "BLACKPINK", genre: "K-Pop", artwork: "" },
      { id: "a8", name: "Amapiano Hits", artist: "Various", genre: "Amapiano", artwork: "" },
      { id: "a9", name: "Legend", artist: "Bob Marley", genre: "Reggae", artwork: "" },
      { id: "a10", name: "Dark Side", artist: "Pink Floyd", genre: "Rock", artwork: "" },
    ],
    []
  );

  const [topAlbums, setTopAlbums] = useState(fallbackTopAlbums);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [albumsErr, setAlbumsErr] = useState("");

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
      artwork: t?.artwork?.["150x150"] || t?.artwork?.["480x480"] || t?.artwork?.["1000x1000"] || "",
      genre: mapToYourGenre(t),
      audio: getTrackStreamUrl(t?.id),
    }),
    [mapToYourGenre]
  );

  // ✅ Trending this week (tracks)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setTrendingLoading(true);
        setTrendingErr("");

        const data = await getTrendingTracks({ limit: 40, time: "week" });
        const mapped = (data || []).map(mapTrack);

        if (!alive) return;
        setRealTrending(mapped);
      } catch (e) {
        if (!alive) return;
        setTrendingErr(e?.message || "Failed to load trending tracks.");
        setRealTrending([]);
      } finally {
        if (alive) setTrendingLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [mapTrack]);

  // ✅ Top Albums (week)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setAlbumsLoading(true);
        setAlbumsErr("");

        const data = await getTrendingAlbums({ limit: 20, time: "week" });

        const mapped = (data || []).map((a) => {
          const name = a?.playlist_name || a?.name || "Untitled Album";
          const artist = a?.user?.name || a?.user?.handle || "Unknown";
          const genre = a?.genre || "All";

          const artwork =
            a?.artwork?.["150x150"] ||
            a?.artwork?.["480x480"] ||
            a?.artwork?.["1000x1000"] ||
            a?.cover_art?.["150x150"] ||
            a?.cover_art?.["480x480"] ||
            a?.cover_art?.["1000x1000"] ||
            "";

          return { id: String(a?.id), name, artist, genre, artwork };
        });

        if (!alive) return;
        if (mapped.length > 0) setTopAlbums(mapped);
      } catch (e) {
        if (!alive) return;
        setAlbumsErr(e?.message || "Failed to load albums.");
      } finally {
        if (alive) setAlbumsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ✅ fallback dummy list (kept)
  const trendingSongs = useMemo(
    () => [
      { id: "t1", artist: "Burna Boy", title: "Last Last", genre: "Afrobeat" },
      { id: "t2", artist: "Ayra Starr", title: "Rush", genre: "Afrobeat" },
      { id: "t3", artist: "Tyler ICU", title: "Mnike", genre: "Amapiano" },
      { id: "t4", artist: "Kabza De Small", title: "Sponono", genre: "Amapiano" },
      { id: "t5", artist: "Drake", title: "First Person Shooter", genre: "Hip-hop" },
      { id: "t6", artist: "Travis Scott", title: "FE!N", genre: "Hip-hop" },
      { id: "t7", artist: "Taylor Swift", title: "Cruel Summer", genre: "Pop" },
      { id: "t8", artist: "The Weeknd", title: "Popular", genre: "Pop" },
      { id: "t9", artist: "SZA", title: "Kill Bill", genre: "R&B" },
      { id: "t10", artist: "Brent Faiyaz", title: "Best Time", genre: "R&B" },
      { id: "t11", artist: "Sean Paul", title: "Temperature", genre: "Reggae" },
      { id: "t12", artist: "BLACKPINK", title: "Pink Venom", genre: "K-Pop" },
      { id: "t13", artist: "Pink Floyd", title: "Time", genre: "Rock" },
    ],
    []
  );

  const trendingArtists = useMemo(
    () => [
      { id: "ta1", name: "Seyi Vibez", genre: "Afrobeat" },
      { id: "ta2", name: "Omah Lay", genre: "Afrobeat" },
      { id: "ta3", name: "Young Jonn", genre: "Afrobeat" },
      { id: "ta4", name: "Kabza De Small", genre: "Amapiano" },
      { id: "ta5", name: "Tyler ICU", genre: "Amapiano" },
      { id: "ta6", name: "Drake", genre: "Hip-hop" },
      { id: "ta7", name: "Travis Scott", genre: "Hip-hop" },
      { id: "ta8", name: "SZA", genre: "R&B" },
      { id: "ta9", name: "BLACKPINK", genre: "K-Pop" },
      { id: "ta10", name: "Bob Marley", genre: "Reggae" },
      { id: "ta11", name: "Pink Floyd", genre: "Rock" },
    ],
    []
  );

  // ✅ Daily Top 100 cards (categories) — HomePage is CARDS ONLY now.
  const dailyTop100Cards = useMemo(
    () => [
      { id: "d-global", label: "Top 100: Global", scope: "global", genre: "All" },
      { id: "d-usa", label: "Top 100: USA", scope: "usa", genre: "All" },

      { id: "d-afro", label: "Top 100: Afrobeat", scope: "genre", genre: "Afrobeat" },
      { id: "d-ama", label: "Top 100: Amapiano", scope: "genre", genre: "Amapiano" },
      { id: "d-hip", label: "Top 100: Hip-hop", scope: "genre", genre: "Hip-hop" },
      { id: "d-pop", label: "Top 100: Pop", scope: "genre", genre: "Pop" },
      { id: "d-rock", label: "Top 100: Rock", scope: "genre", genre: "Rock" },
      { id: "d-rb", label: "Top 100: R&B", scope: "genre", genre: "R&B" },
      { id: "d-reg", label: "Top 100: Reggae", scope: "genre", genre: "Reggae" },
      { id: "d-kpop", label: "Top 100: K-Pop", scope: "genre", genre: "K-Pop" },
    ],
    []
  );

 const realTrendingArtists = useMemo(() => {
  const src = Array.isArray(realTrending) ? realTrending : [];
  const seen = new Set();
  const out = [];

  for (const t of src) {
    const userId = t?.userId; // ✅ must exist on track
    const name = t?.artist || "Unknown";

    const key = userId || name;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      id: userId || `artist-${name}`,
      userId: userId || "",                 // ✅ IMPORTANT
      name,
      artwork: t?.artwork || "",
      genre: t?.genre || "All",
    });

    if (out.length >= 18) break;
  }

  return out;
}, [realTrending]);


  // ✅ FILTERS
  const filteredTrending = useMemo(() => {
    const source = realTrending.length ? realTrending : trendingSongs;
    if (activeGenre === "All") return source;
    return source.filter((s) => (s.genre || "") === activeGenre);
  }, [realTrending, trendingSongs, activeGenre]);

  const filteredAlbums = useMemo(() => {
    if (activeGenre === "All") return topAlbums;
    return topAlbums.filter((a) => a.genre === activeGenre || a.genre === "All");
  }, [topAlbums, activeGenre]);

  const filteredArtists = useMemo(() => {
    const src = realTrendingArtists.length ? realTrendingArtists : trendingArtists;
    if (activeGenre === "All") return src;
    return src.filter((a) => a.genre === activeGenre || a.genre === "All");
  }, [realTrendingArtists, trendingArtists, activeGenre]);

  const filteredDailyTop100 = useMemo(() => {
    if (activeGenre === "All") return dailyTop100Cards;

    // show Global/USA always + the selected genre card only
    return dailyTop100Cards.filter((c) => c.scope !== "genre" || c.genre === activeGenre);
  }, [dailyTop100Cards, activeGenre]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 px-6 pt-10 pb-24">
        <div className="flex justify-center">
          <img src={logo} alt="BD Rhythm Logo" className="w-40" />
        </div>

        {/* ✅ GENRE PILLS */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGenre(g)}
                className={[
                  "shrink-0 px-5 h-8 rounded-full text-[10px] font-black transition duration-200",
                  activeGenre === g
                    ? "bg-[#00EFFF] text-black"
                    : "bg-[#CFFFFF] text-black/80 hover:bg-[#00FFFF] hover:scale-105 active:scale-95",
                ].join(" ")}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* TRENDING SECTION */}
        <div className="mt-10 max-w-md mx-auto">
          <p className="text-center text-[#00FFFF] text-xs font-bold">Trending this week</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              (trending songs) {activeGenre !== "All" ? `• ${activeGenre}` : ""}
            </p>

            <button
              type="button"
              onClick={() => navigate("/trending-songs", { state: { genre: activeGenre } })}
              className="
                bg-[#CFFFFF] text-black text-[9px] font-bold px-3 py-1 rounded-full
                transition duration-200 hover:bg-[#00FFFF] hover:scale-105 active:scale-95
              "
            >
              view all
            </button>
          </div>

          {trendingLoading && <p className="text-white/40 text-[10px] mt-2">Loading trending…</p>}
          {!trendingLoading && trendingErr && <p className="text-red-400 text-[10px] mt-2">{trendingErr}</p>}

          <div className="mt-4 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-5 pr-6">
              {filteredTrending.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => navigate("/trending-songs", { state: { genre: activeGenre } })}
                  className="
                    shrink-0 w-[240px] rounded-2xl border border-white/10
                    bg-gradient-to-br from-[#0b0b0b] to-black p-4 text-left
                    transition duration-200 hover:shadow-[0_0_0_1px_rgba(0,255,255,0.15)]
                    hover:scale-[1.02] active:scale-[0.99]
                  "
                  title={`${song.artist} • ${song.title}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#CFFFFF] shrink-0 overflow-hidden">
                      {song.artwork ? (
                        <img src={song.artwork} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[#00FFFF] text-xs font-black truncate">{song.artist}</p>
                      <p className="text-white text-sm font-black truncate">{song.title}</p>
                      <p className="text-white/60 text-[10px] font-semibold mt-1">{song.genre}</p>
                    </div>
                  </div>
                </button>
              ))}

              {filteredTrending.length === 0 && (
                <div className="shrink-0 w-[240px] rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/60 text-xs">No songs for {activeGenre} yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TOP ALBUMS SECTION */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              (top albums) {activeGenre !== "All" ? `• ${activeGenre}` : ""}
            </p>

           <button
  type="button"
  onClick={() =>
    navigate("/top-albums", {
      state: {
        genre: activeGenre,
        albums: filteredAlbums,
      },
    })
  }
  className="
    bg-[#CFFFFF] text-black text-[9px] font-bold px-3 py-1 rounded-full
    transition duration-200 hover:bg-[#00FFFF] hover:scale-105 active:scale-95
  "
>
  view all
</button>

          </div>

          {albumsLoading && <p className="text-white/40 text-[10px] mt-2">Loading albums…</p>}
          {!albumsLoading && albumsErr && <p className="text-red-400 text-[10px] mt-2">{albumsErr}</p>}

          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {filteredAlbums.map((album) => (
              <AlbumTile
                key={album.id}
                album={album}
                onClick={() => navigate("/top-albums", { state: { focus: album.genre } })}
              />
            ))}

            {filteredAlbums.length === 0 && (
              <div className="text-white/60 text-xs py-2">No albums for {activeGenre} yet.</div>
            )}
          </div>
        </div>

        {/* TRENDING ARTISTS */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              (trending artists) {activeGenre !== "All" ? `• ${activeGenre}` : ""}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/popular-artists", { state: { genre: activeGenre, artists: filteredArtists } })
              }
              className="
                bg-[#CFFFFF] text-black text-[9px] font-bold px-3 py-1 rounded-full
                transition duration-200 hover:bg-[#00FFFF] hover:scale-105 active:scale-95
              "
            >
              view all
            </button>
          </div>

          <div className="mt-4 flex gap-6 overflow-x-auto scrollbar-hide pb-2">
            {filteredArtists.slice(0, 6).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() =>
                  navigate("/popular-artists", {
                    state: { focus: a.name, genre: activeGenre, artists: filteredArtists },
                  })
                }
                className="shrink-0 w-[90px] text-center"
                title={a.name}
              >
                <div className="w-[82px] h-[82px] mx-auto rounded-full bg-[#CFFFFF] overflow-hidden opacity-90 shadow-[0_0_0_3px_rgba(0,239,255,0.25)]">
                  {a.artwork ? (
                    <img src={a.artwork} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : null}
                </div>

                <p className="mt-2 text-white text-[10px] font-black truncate">{a.name}</p>
              </button>
            ))}

            {filteredArtists.length === 0 && (
              <div className="text-white/60 text-xs py-2">No artists for {activeGenre} yet.</div>
            )}
          </div>
        </div>

        {/* ✅ DAILY TOP 100 (CARDS ONLY — NO FETCH/NO PREVIEW) */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">Daily Top 100</p>

            <button
              type="button"
              onClick={() =>
                navigate("/top-songs", {
                  state: { chart: "Top 100: Global", scope: "global", genre: "All" },
                })
              }
              className="
                bg-[#CFFFFF] text-black text-[9px] font-bold px-3 py-1 rounded-full
                transition duration-200 hover:bg-[#00FFFF] hover:scale-105 active:scale-95
              "
            >
              view all
            </button>
          </div>

          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {filteredDailyTop100.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  navigate("/top-songs", {
                    state: { chart: c.label, scope: c.scope, genre: c.genre || "All" },
                  })
                }
                className="
                  shrink-0 w-[150px] rounded-2xl bg-white/10 border border-white/10
                  p-3 text-left transition duration-200 hover:bg-white/15 active:scale-[0.98]
                "
                title={c.label}
              >
                <div className="w-full h-[90px] rounded-xl bg-white/10" />
                <p className="mt-3 text-white font-black text-sm leading-tight line-clamp-2">{c.label}</p>
                <p className="text-white/60 text-xs mt-1">BD Rythm</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

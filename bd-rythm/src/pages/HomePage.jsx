import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BD-RYTHM-logo.png";

const AlbumTile = ({ title, artist, genre, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[120px] h-[90px] shrink-0 text-left transition-transform hover:scale-[1.02] active:scale-95"
    >
      {/* back cyan layer */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-[#00EFFF]" />

      {/* front card */}
      <div className="absolute inset-0 rounded-2xl bg-[#D9FFFF] px-3 py-3 flex flex-col justify-end">
        <p className="font-extrabold text-black text-[11px] leading-tight line-clamp-2">
          {title}
        </p>
        <p className="text-black text-[9px] mt-[2px] leading-tight">{artist}</p>
        <p className="text-black/70 text-[8px] mt-[1px] leading-tight">{genre}</p>
      </div>
    </button>
  );
};

export default function HomePage() {
  const navigate = useNavigate();

  // ✅ GENRES must be inside component (hooks rule)
  const GENRES = useMemo(
    () => ["All", "Afrobeat", "Amapiano", "Hip-hop", "Pop", "Rock", "R&B", "Reggae", "K-Pop"],
    []
  );

  const [activeGenre, setActiveGenre] = useState("All");

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

  const topAlbums = useMemo(
    () => [
      { id: "a1", name: "SOS", artist: "SZA", genre: "R&B" },
      { id: "a2", name: "UTOPIA", artist: "Travis Scott", genre: "Hip-hop" },
      { id: "a3", name: "Unavailable (EP)", artist: "Davido", genre: "Afrobeat" },
      { id: "a4", name: "Renaissance", artist: "Beyoncé", genre: "Pop" },
      { id: "a5", name: "After Hours", artist: "The Weeknd", genre: "Pop" },
      { id: "a6", name: "Born Pink", artist: "BLACKPINK", genre: "K-Pop" },
      { id: "a8", name: "Amapiano Hits", artist: "Various", genre: "Amapiano" },
      { id: "a9", name: "Legend", artist: "Bob Marley", genre: "Reggae" },
      { id: "a10", name: "Dark Side", artist: "Pink Floyd", genre: "Rock" },
    ],
    []
  );

  // ✅ NEW: TRENDING ARTISTS (for circles)
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

  // ✅ NEW: DAILY TOP 100 cards (boxes) – generated from GENRES
  const dailyTop100Cards = useMemo(() => {
    const picks = GENRES.filter((g) => g !== "All");
    const base = [
      { id: "d-global", label: "Top 100: Global", genre: "All" },
      { id: "d-usa", label: "Top 100: USA", genre: "All" },
    ];
    const fromGenres = picks.map((g) => ({
      id: `d-${g}`,
      label: `Top 100: ${g}`,
      genre: g,
    }));
    return [...base, ...fromGenres];
  }, [GENRES]);

  // ✅ FILTERS: same behavior as Library
  const filteredTrending = useMemo(() => {
    if (activeGenre === "All") return trendingSongs;
    return trendingSongs.filter((s) => s.genre === activeGenre);
  }, [trendingSongs, activeGenre]);

  const filteredAlbums = useMemo(() => {
    if (activeGenre === "All") return topAlbums;
    return topAlbums.filter((a) => a.genre === activeGenre);
  }, [topAlbums, activeGenre]);

  // ✅ NEW FILTERS: artists + daily top100 obey pills
  const filteredArtists = useMemo(() => {
    if (activeGenre === "All") return trendingArtists;
    return trendingArtists.filter((a) => a.genre === activeGenre);
  }, [trendingArtists, activeGenre]);

  const filteredDailyTop100 = useMemo(() => {
    if (activeGenre === "All") return dailyTop100Cards;
    // show Global + USA + the selected genre
    return dailyTop100Cards.filter((c) => c.genre === "All" || c.genre === activeGenre);
  }, [dailyTop100Cards, activeGenre]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 px-6 pt-10 pb-6">
        <div className="flex justify-center">
          <img src={logo} alt="BD Rhythm Logo" className="w-40" />
        </div>

        {/* ✅ GENRE PILLS MOVED HERE (TOP of HOME) */}
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
          <p className="text-center text-[#00FFFF] text-xs font-bold">
            Trending this week
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              (trending songs) {activeGenre !== "All" ? `• ${activeGenre}` : ""}
            </p>

            <button
              type="button"
              onClick={() => navigate("/trending-songs", { state: { genre: activeGenre } })}
              className="
                bg-[#CFFFFF]
                text-black
                text-[9px]
                font-bold
                px-3
                py-1
                rounded-full
                transition
                duration-200
                hover:bg-[#00FFFF]
                hover:scale-105
                active:scale-95
              "
            >
              view all
            </button>
          </div>

          <div className="mt-3 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {filteredTrending.map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => navigate("/home", { state: { track: song } })}
                className="
                  shrink-0
                  px-4
                  h-7
                  rounded-full
                  bg-[#00EFFF]
                  text-black
                  text-[9px]
                  font-extrabold
                  flex items-center
                  transition
                  duration-200
                  hover:scale-105
                  active:scale-95
                "
                title={`${song.artist} • ${song.title}`}
              >
                <span className="truncate max-w-[120px]">
                  {song.artist} — {song.title}
                </span>
              </button>
            ))}

            {filteredTrending.length === 0 && (
              <div className="text-white/60 text-xs py-2">
                No songs for {activeGenre} yet.
              </div>
            )}
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
              onClick={() => navigate("/top-albums", { state: { genre: activeGenre } })}
              className="
                bg-[#CFFFFF]
                text-black
                text-[9px]
                font-bold
                px-3
                py-1
                rounded-full
                transition
                duration-200
                hover:bg-[#00FFFF]
                hover:scale-105
                active:scale-95
              "
            >
              view all
            </button>
          </div>

          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {filteredAlbums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() =>
                  navigate("/top-albums", { state: { focus: album.genre } })
                }
                className="shrink-0 w-16 h-20 bg-[#CFFFFF] rounded-xl flex items-end p-2 transition duration-200 hover:scale-105 active:scale-95"
                title={`${album.name} • ${album.artist}`}
              >
                <div className="text-left leading-tight w-full">
                  <p className="text-black text-[9px] font-black truncate">
                    {album.name}
                  </p>
                  <p className="text-black/70 text-[8px] font-semibold truncate">
                    {album.artist}
                  </p>
                </div>
              </button>
            ))}

            {filteredAlbums.length === 0 && (
              <div className="text-white/60 text-xs py-2">
                No albums for {activeGenre} yet.
              </div>
            )}
          </div>
        </div>

        {/* ✅ NEW: TRENDING ARTISTS (CIRCLES) – preview only */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              (trending artists) {activeGenre !== "All" ? `• ${activeGenre}` : ""}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/popular-artists", { state: { genre: activeGenre } })
              }
              className="
                bg-[#CFFFFF]
                text-black
                text-[9px]
                font-bold
                px-3
                py-1
                rounded-full
                transition
                duration-200
                hover:bg-[#00FFFF]
                hover:scale-105
                active:scale-95
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
                    state: { focus: a.name, genre: activeGenre },
                  })
                }
                className="shrink-0 w-[90px] text-center"
                title={a.name}
              >
                <div className="w-[82px] h-[82px] mx-auto rounded-full bg-[#CFFFFF] opacity-90 shadow-[0_0_0_3px_rgba(0,239,255,0.25)]" />
                <p className="mt-2 text-white text-[10px] font-black truncate">
                  {a.name}
                </p>
              </button>
            ))}

            {filteredArtists.length === 0 && (
              <div className="text-white/60 text-xs py-2">
                No artists for {activeGenre} yet.
              </div>
            )}
          </div>
        </div>

        {/* ✅ NEW: DAILY TOP 100 (BOXES) – preview only */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              Daily Top 100 {activeGenre !== "All" ? `• ${activeGenre}` : ""}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/top-songs", { state: { top100: true, genre: activeGenre } })
              }
              className="
                bg-[#CFFFFF]
                text-black
                text-[9px]
                font-bold
                px-3
                py-1
                rounded-full
                transition
                duration-200
                hover:bg-[#00FFFF]
                hover:scale-105
                active:scale-95
              "
            >
              view all
            </button>
          </div>

          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {filteredDailyTop100.slice(0, 5).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  navigate("/top-songs", {
                    state: { top100: true, chart: c.label, genre: activeGenre },
                  })
                }
                className="
                  shrink-0
                  w-[150px]
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/10
                  p-3
                  text-left
                  transition
                  duration-200
                  hover:bg-white/15
                  active:scale-[0.98]
                "
                title={c.label}
              >
                <div className="w-full h-[90px] rounded-xl bg-white/10" />
                <p className="mt-3 text-white font-black text-sm leading-tight line-clamp-2">
                  {c.label}
                </p>
                <p className="text-white/60 text-xs mt-1">BD Rythm</p>
              </button>
            ))}

            {filteredDailyTop100.length === 0 && (
              <div className="text-white/60 text-xs py-2">
                No charts for {activeGenre} yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

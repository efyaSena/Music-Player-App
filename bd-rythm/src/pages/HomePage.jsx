import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BD-RYTHM-logo.png";
import PlayerBar from "../components/PlayerBar";
import PlaylistSheet from "../components/PlaylistSheet";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const trendingSongs = useMemo(
    () => [
      // Afro / Afrobeats
      { id: "t1", artist: "Burna Boy", title: "Last Last", genre: "Afrobeat" },
      { id: "t2", artist: "Ayra Starr", title: "Rush", genre: "Afrobeat" },

      // Amapiano
      { id: "t3", artist: "Tyler ICU", title: "Mnike", genre: "Amapiano" },
      { id: "t4", artist: "Kabza De Small", title: "Sponono", genre: "Amapiano" },

      // Hip-hop
      {
        id: "t5",
        artist: "Drake",
        title: "First Person Shooter",
        genre: "Hip-hop",
      },
      { id: "t6", artist: "Travis Scott", title: "FE!N", genre: "Hip-hop" },

      // Pop
      { id: "t7", artist: "Taylor Swift", title: "Cruel Summer", genre: "Pop" },
      { id: "t8", artist: "The Weeknd", title: "Popular", genre: "Pop" },

      // R&B
      { id: "t9", artist: "SZA", title: "Kill Bill", genre: "R&B" },
      { id: "t10", artist: "Brent Faiyaz", title: "Best Time", genre: "R&B" },

      // EDM
      { id: "t11", artist: "Calvin Harris", title: "Miracle", genre: "EDM" },

      // Reggae / Caribbean
      { id: "t12", artist: "Sean Paul", title: "Temperature", genre: "Reggae" },

      // Gospel
      { id: "t13", artist: "Maverick City", title: "Jireh", genre: "Gospel" },

      // Rock / Indie
      {
        id: "t14",
        artist: "Arctic Monkeys",
        title: "I Wanna Be Yours",
        genre: "Indie",
      },
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
      { id: "a7", name: "÷ (Divide)", artist: "Ed Sheeran", genre: "Pop" },
      { id: "a8", name: "Amapiano Hits", artist: "Various", genre: "Amapiano" },
      { id: "a9", name: "Legend", artist: "Bob Marley", genre: "Reggae" },
      { id: "a10", name: "Dark Side", artist: "Pink Floyd", genre: "Rock" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 px-6 pt-10 pb-6">
        <div className="flex justify-center">
          <img src={logo} alt="BD Rhythm Logo" className="w-40" />
        </div>

        <div className="mt-10 max-w-md mx-auto">
          <PlayerBar onOpenMenu={() => setIsSheetOpen(true)} />
        </div>

        {/* TRENDING SECTION */}
        <div className="mt-12 max-w-md mx-auto">
          <p className="text-center text-[#00FFFF] text-xs font-bold">
            Trending this week
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">
              (trending songs)
            </p>

            <button
              type="button"
              onClick={() => navigate("/trending-songs")}
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
  {trendingSongs.map((song) => (
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
</div>

        </div>

        {/* TOP ALBUMS SECTION */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-[#00FFFF] text-[10px] font-bold">(top albums)</p>

            <button
              type="button"
              onClick={() => navigate("/top-albums")}
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
            {topAlbums.map((album) => (
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
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="h-20 bg-[#00EFFF] flex items-center justify-between px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-black
            text-[#00EFFF]
            text-3xl font-black
            transition
            duration-200
            hover:scale-110
            active:scale-95
          "
        >
          ↩
        </button>

        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          aria-label="Open playlist sheet"
          className="
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-black
            text-[#00EFFF]
            text-3xl font-black
            transition
            duration-200
            hover:scale-110
            active:scale-95
          "
        >
          ≡+
        </button>
      </div>

      {/* PLAYLIST SHEET */}
      <PlaylistSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}

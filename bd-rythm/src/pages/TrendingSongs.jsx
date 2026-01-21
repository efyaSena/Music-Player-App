import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";


export default function TrendingSongs() {
  const navigate = useNavigate();

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

  // Real(ish) trending songs across genres
  const songs = useMemo(
    () => [
      { id: "s1", artist: "Burna Boy", title: "Last Last", genre: "Afrobeat" },
      { id: "s2", artist: "Wizkid", title: "Essence", genre: "Afrobeat" },
      { id: "s3", artist: "Rema", title: "Calm Down", genre: "Afrobeat" },
      { id: "s4", artist: "Ayra Starr", title: "Rush", genre: "Afrobeat" },

      { id: "s5", artist: "Tyler ICU", title: "Mnike", genre: "Amapiano" },
      { id: "s6", artist: "Kabza De Small", title: "Sponono", genre: "Amapiano" },
      { id: "s7", artist: "DJ Maphorisa", title: "Izolo", genre: "Amapiano" },
      { id: "s8", artist: "Focalistic", title: "Ke Star", genre: "Amapiano" },

      { id: "s9", artist: "Drake", title: "God's Plan", genre: "Hip-hop" },
      { id: "s10", artist: "Kendrick Lamar", title: "HUMBLE.", genre: "Hip-hop" },
      { id: "s11", artist: "J. Cole", title: "No Role Modelz", genre: "Hip-hop" },
      { id: "s12", artist: "Travis Scott", title: "SICKO MODE", genre: "Hip-hop" },

      { id: "s13", artist: "Future", title: "Mask Off", genre: "Trap" },
      { id: "s14", artist: "Migos", title: "Bad and Boujee", genre: "Trap" },
      { id: "s15", artist: "Lil Baby", title: "Yes Indeed", genre: "Trap" },
      { id: "s16", artist: "Gunna", title: "Drip Too Hard", genre: "Trap" },

      { id: "s17", artist: "Taylor Swift", title: "Anti-Hero", genre: "Pop" },
      { id: "s18", artist: "The Weeknd", title: "Blinding Lights", genre: "Pop" },
      { id: "s19", artist: "Dua Lipa", title: "Levitating", genre: "Pop" },
      { id: "s20", artist: "Ariana Grande", title: "7 rings", genre: "Pop" },

      { id: "s21", artist: "Linkin Park", title: "Numb", genre: "Rock" },
      { id: "s22", artist: "Queen", title: "Bohemian Rhapsody", genre: "Rock" },
      { id: "s23", artist: "Nirvana", title: "Teen Spirit", genre: "Rock" },
      { id: "s24", artist: "Green Day", title: "Boulevard...", genre: "Rock" },

      { id: "s25", artist: "SZA", title: "Kill Bill", genre: "R&B" },
      { id: "s26", artist: "Daniel Caesar", title: "Best Part", genre: "R&B" },
      { id: "s27", artist: "H.E.R.", title: "Damage", genre: "R&B" },
      { id: "s28", artist: "Giveon", title: "Heartbreak Anniversary", genre: "R&B" },

      { id: "s29", artist: "Maverick City", title: "Jireh", genre: "Gospel" },
      { id: "s30", artist: "Kirk Franklin", title: "I Smile", genre: "Gospel" },

      { id: "s31", artist: "Bad Bunny", title: "Tití Me Preguntó", genre: "Reggaeton" },
      { id: "s32", artist: "J Balvin", title: "Mi Gente", genre: "Reggaeton" },

      { id: "s33", artist: "Sean Paul", title: "Get Busy", genre: "Caribbean" },
      { id: "s34", artist: "Shaggy", title: "It Wasn't Me", genre: "Caribbean" },

      { id: "s35", artist: "Calvin Harris", title: "Summer", genre: "EDM" },
      { id: "s36", artist: "Avicii", title: "Wake Me Up", genre: "EDM" },

      { id: "s37", artist: "Miles Davis", title: "So What", genre: "Jazz" },
      { id: "s38", artist: "John Coltrane", title: "My Favorite Things", genre: "Jazz" },

      { id: "s39", artist: "Tame Impala", title: "The Less I Know...", genre: "Indie" },
      { id: "s40", artist: "The 1975", title: "Somebody Else", genre: "Indie" },

      { id: "s41", artist: "Beethoven", title: "Symphony No. 5", genre: "Classical" },
      { id: "s42", artist: "Mozart", title: "Eine kleine...", genre: "Classical" },

      { id: "s43", artist: "BTS", title: "Dynamite", genre: "K-Pop" },
      { id: "s44", artist: "BLACKPINK", title: "Pink Venom", genre: "K-Pop" },
    ],
    []
  );

  const filteredSongs = useMemo(() => {
    if (activeGenre === "All") return songs;
    return songs.filter((s) => s.genre === activeGenre);
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

        {/* Genre pills (like Library behavior) */}
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

        {/* Songs: 2-col grid inside horizontal pages */}
        <div className="mt-8 overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-10 pr-6">
            {pages.map((pageSongs, pageIndex) => (
              <div key={pageIndex} className="shrink-0 w-[320px]">
                <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                  {pageSongs.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => navigate("/home", { state: { track: s } })}
                      className="flex items-center gap-4 text-left transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
                    >
                      <div className="w-14 h-14 bg-[#CFFFFF] rounded-xl shrink-0" />
                      <div className="leading-tight">
                        <p className="text-[#00FFFF] text-xs font-bold truncate max-w-[110px]">
                          {s.artist}
                        </p>
                        <p className="text-[#00FFFF] text-xs font-semibold truncate max-w-[110px]">
                          {s.title}
                        </p>
                        <p className="text-white/50 text-[10px] font-semibold mt-1">
                          {s.genre}
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
      </div>

    
      <BottomNav />

    </div>
  );
}

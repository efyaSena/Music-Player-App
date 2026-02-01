import React, { useMemo, useRef, useState, useEffect } from "react";
import logo from "../assets/BD-RYTHM-logo.png";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { usePlayer } from "../context/usePlayer";


const expandSongs = (base, count = 25) =>
  Array.from({ length: count }).map((_, i) => {
    const s = base[i % base.length];
    return {
      id: `${s.artist}-${s.title}-${i}`,
      artist: s.artist,
      title: s.title,
    };
  });

const GENRES = [
  {
    id: "kpop",
    name: "K-Pop",
    songs: expandSongs([
      { artist: "BTS", title: "Dynamite" },
      { artist: "BLACKPINK", title: "Pink Venom" },
      { artist: "NewJeans", title: "Hype Boy" },
      { artist: "IVE", title: "Love Dive" },
      { artist: "TWICE", title: "Fancy" },
      { artist: "Stray Kids", title: "MANIAC" },
      { artist: "SEVENTEEN", title: "HOT" },
      { artist: "aespa", title: "Next Level" },
      { artist: "EXO", title: "Growl" },
      { artist: "Red Velvet", title: "Psycho" },
    ]),
  },
  {
    id: "amapiano",
    name: "Amapiano",
    songs: expandSongs([
      { artist: "Kabza De Small", title: "Sponono" },
      { artist: "DJ Maphorisa", title: "Izolo" },
      { artist: "Focalistic", title: "Ke Star" },
      { artist: "Young Stunna", title: "Adiwele" },
      { artist: "Sha Sha", title: "Tender Love" },
      { artist: "MFR Souls", title: "Love You Tonight" },
      { artist: "Major League DJz", title: "Amapiano Moves" },
      { artist: "DBN Gogo", title: "Khuze" },
      { artist: "Tyler ICU", title: "Mnike" },
      { artist: "Scorpion Kings", title: "Amathole" },
    ]),
  },
  {
    id: "afrosounds",
    name: "Afro Sounds",
    songs: expandSongs([
      { artist: "Aṣa", title: "Jailer" },
      { artist: "Sauti Sol", title: "Suzanna" },
      { artist: "Blick Bassy", title: "Kiki" },
      { artist: "Fatoumata Diawara", title: "Nterini" },
      { artist: "Salif Keita", title: "Yamore" },
      { artist: "Angelique Kidjo", title: "Agolo" },
      { artist: "Burna Boy", title: "Omo" },
      { artist: "Baaba Maal", title: "African Woman" },
      { artist: "Manu Dibango", title: "Soul Makossa" },
      { artist: "Sona Jobarteh", title: "Saya" },
    ]),
  },
  {
    id: "caribbean",
    name: "Caribbean / Reggaeton",
    songs: expandSongs([
      { artist: "Bad Bunny", title: "Tití Me Preguntó" },
      { artist: "Daddy Yankee", title: "Gasolina" },
      { artist: "J Balvin", title: "Mi Gente" },
      { artist: "Karol G", title: "Bichota" },
      { artist: "Ozuna", title: "Se Preparó" },
      { artist: "Rauw Alejandro", title: "Todo De Ti" },
      { artist: "Don Omar", title: "Danza Kuduro" },
      { artist: "Nicky Jam", title: "El Perdón" },
      { artist: "Sean Paul", title: "Temperature" },
      { artist: "Farruko", title: "Pepas" },
    ]),
  },
  {
    id: "gospel",
    name: "Gospel",
    songs: expandSongs([
      { artist: "Kirk Franklin", title: "I Smile" },
      { artist: "CeCe Winans", title: "Goodness of God" },
      { artist: "Tasha Cobbs Leonard", title: "Break Every Chain" },
      { artist: "Sinach", title: "Way Maker" },
      { artist: "Nathaniel Bassey", title: "Imela" },
      { artist: "William McDowell", title: "Withholding Nothing" },
      { artist: "Travis Greene", title: "Intentional" },
      { artist: "Donnie McClurkin", title: "We Fall Down" },
      { artist: "Maverick City Music", title: "Jireh" },
      { artist: "Elevation Worship", title: "Graves Into Gardens" },
    ]),
  },
  {
    id: "trap",
    name: "Trap",
    songs: expandSongs([
      { artist: "Travis Scott", title: "goosebumps" },
      { artist: "Future", title: "Mask Off" },
      { artist: "Migos", title: "Bad and Boujee" },
      { artist: "21 Savage", title: "a lot" },
      { artist: "Lil Uzi Vert", title: "XO TOUR Llif3" },
      { artist: "Playboi Carti", title: "Magnolia" },
      { artist: "Gunna", title: "Drip Too Hard" },
      { artist: "Young Thug", title: "Hot" },
      { artist: "Lil Baby", title: "Yes Indeed" },
      { artist: "Metro Boomin", title: "Space Cadet" },
    ]),
  },
  {
    id: "hiphop",
    name: "Hip-hop",
    songs: expandSongs([
      { artist: "Drake", title: "God's Plan" },
      { artist: "Kendrick Lamar", title: "HUMBLE." },
      { artist: "J. Cole", title: "No Role Modelz" },
      { artist: "Eminem", title: "Lose Yourself" },
      { artist: "Nicki Minaj", title: "Super Bass" },
      { artist: "Cardi B", title: "Bodak Yellow" },
      { artist: "Jay-Z", title: "99 Problems" },
      { artist: "Nas", title: "N.Y. State of Mind" },
      { artist: "Kanye West", title: "Stronger" },
      { artist: "Post Malone", title: "rockstar" },
    ]),
  },
  {
    id: "rock",
    name: "Rock",
    songs: expandSongs([
      { artist: "Linkin Park", title: "Numb" },
      { artist: "Nirvana", title: "Smells Like Teen Spirit" },
      { artist: "Queen", title: "Bohemian Rhapsody" },
      { artist: "Foo Fighters", title: "Everlong" },
      { artist: "Arctic Monkeys", title: "Do I Wanna Know?" },
      { artist: "Green Day", title: "Boulevard of Broken Dreams" },
      { artist: "Red Hot Chili Peppers", title: "Californication" },
      { artist: "The Killers", title: "Mr. Brightside" },
      { artist: "Metallica", title: "Enter Sandman" },
      { artist: "AC/DC", title: "Back In Black" },
    ]),
  },
  {
    id: "pop",
    name: "Pop",
    songs: expandSongs([
      { artist: "Taylor Swift", title: "Anti-Hero" },
      { artist: "The Weeknd", title: "Blinding Lights" },
      { artist: "Dua Lipa", title: "Levitating" },
      { artist: "Ariana Grande", title: "7 rings" },
      { artist: "Harry Styles", title: "As It Was" },
      { artist: "Billie Eilish", title: "bad guy" },
      { artist: "Ed Sheeran", title: "Shape of You" },
      { artist: "Rihanna", title: "Diamonds" },
      { artist: "Bruno Mars", title: "24K Magic" },
      { artist: "Adele", title: "Hello" },
    ]),
  },
  {
    id: "afrobeat",
    name: "Afrobeat",
    songs: expandSongs([
      { artist: "Burna Boy", title: "Last Last" },
      { artist: "Wizkid", title: "Essence" },
      { artist: "Davido", title: "Unavailable" },
      { artist: "Rema", title: "Calm Down" },
      { artist: "Ayra Starr", title: "Rush" },
      { artist: "Fireboy DML", title: "Peru" },
      { artist: "Tems", title: "Free Mind" },
      { artist: "Omah Lay", title: "Understand" },
      { artist: "Asake", title: "Sungba" },
      { artist: "Tiwa Savage", title: "Somebody’s Son" },
    ]),
  },
  {
    id: "rnb",
    name: "R&B",
    songs: expandSongs([
      { artist: "SZA", title: "Kill Bill" },
      { artist: "Frank Ocean", title: "Pink + White" },
      { artist: "H.E.R.", title: "Damage" },
      { artist: "Daniel Caesar", title: "Best Part" },
      { artist: "Summer Walker", title: "Playing Games" },
      { artist: "Brent Faiyaz", title: "Dead Man Walking" },
      { artist: "Chris Brown", title: "Under the Influence" },
      { artist: "Giveon", title: "Heartbreak Anniversary" },
      { artist: "Miguel", title: "Adorn" },
      { artist: "Usher", title: "Yeah!" },
    ]),
  },
  {
    id: "jazz",
    name: "Jazz",
    songs: expandSongs([
      { artist: "Miles Davis", title: "So What" },
      { artist: "John Coltrane", title: "My Favorite Things" },
      { artist: "Louis Armstrong", title: "What a Wonderful World" },
      { artist: "Duke Ellington", title: "Take the 'A' Train" },
      { artist: "Ella Fitzgerald", title: "Summertime" },
      { artist: "Billie Holiday", title: "Strange Fruit" },
      { artist: "Herbie Hancock", title: "Cantaloupe Island" },
      { artist: "Nina Simone", title: "Feeling Good" },
      { artist: "Thelonious Monk", title: "Round Midnight" },
      { artist: "Dave Brubeck", title: "Take Five" },
    ]),
  },
  {
    id: "edm",
    name: "EDM",
    songs: expandSongs([
      { artist: "Calvin Harris", title: "Summer" },
      { artist: "Avicii", title: "Wake Me Up" },
      { artist: "David Guetta", title: "Titanium" },
      { artist: "Martin Garrix", title: "Animals" },
      { artist: "The Chainsmokers", title: "Closer" },
      { artist: "Zedd", title: "Stay" },
      { artist: "Skrillex", title: "Bangarang" },
      { artist: "Marshmello", title: "Happier" },
      { artist: "Tiësto", title: "The Business" },
      { artist: "Kygo", title: "Firestone" },
    ]),
  },
  {
    id: "reggae",
    name: "Reggae",
    songs: expandSongs([
      { artist: "Bob Marley", title: "Three Little Birds" },
      { artist: "Bob Marley", title: "No Woman, No Cry" },
      { artist: "Peter Tosh", title: "Legalize It" },
      { artist: "Jimmy Cliff", title: "The Harder They Come" },
      { artist: "Toots & The Maytals", title: "Pressure Drop" },
      { artist: "Damian Marley", title: "Welcome to Jamrock" },
      { artist: "Sean Paul", title: "Get Busy" },
      { artist: "Shaggy", title: "It Wasn't Me" },
      { artist: "UB40", title: "Red Red Wine" },
      { artist: "Chronixx", title: "Skankin' Sweet" },
    ]),
  },
  {
    id: "latin",
    name: "Latin",
    songs: expandSongs([
      { artist: "Bad Bunny", title: "Tití Me Preguntó" },
      { artist: "J Balvin", title: "Mi Gente" },
      { artist: "Daddy Yankee", title: "Gasolina" },
      { artist: "Karol G", title: "PROVENZA" },
      { artist: "Rosalía", title: "DESPECHÁ" },
      { artist: "Ozuna", title: "Se Preparó" },
      { artist: "Luis Fonsi", title: "Despacito" },
      { artist: "Shakira", title: "Hips Don't Lie" },
      { artist: "Maluma", title: "Felices the 4" },
      { artist: "Don Omar", title: "Danza Kuduro" },
    ]),
  },
  {
    id: "indie",
    name: "Indie",
    songs: expandSongs([
      { artist: "Tame Impala", title: "The Less I Know the Better" },
      { artist: "Lana Del Rey", title: "Summertime Sadness" },
      { artist: "The 1975", title: "Somebody Else" },
      { artist: "Arctic Monkeys", title: "R U Mine?" },
      { artist: "Vampire Weekend", title: "A-Punk" },
      { artist: "Foster The People", title: "Pumped Up Kicks" },
      { artist: "MGMT", title: "Electric Feel" },
      { artist: "Bon Iver", title: "Holocene" },
      { artist: "Phoebe Bridgers", title: "Motion Sickness" },
      { artist: "Glass Animals", title: "Heat Waves" },
    ]),
  },
  {
    id: "classical",
    name: "Classical",
    songs: expandSongs([
      { artist: "Beethoven", title: "Symphony No. 5" },
      { artist: "Mozart", title: "Eine kleine Nachtmusik" },
      { artist: "Bach", title: "Toccata and fugue in D minor" },
      { artist: "Vivaldi", title: "The Four Seasons: Spring" },
      { artist: "Tchaikovsky", title: "Swan Lake" },
      { artist: "Chopin", title: "Nocturne Op. 9 No. 2" },
      { artist: "Handel", title: "Messiah: Hallelujah" },
      { artist: "Debussy", title: "Clair de Lune" },
      { artist: "Ravel", title: "Boléro" },
      { artist: "Schubert", title: "Ave Maria" },
    ]),
  },
];

// ✅ SECTION 2 CONFIG (pills)
const SECTION2_PILLS = [
  { id: "trending-artists", title: "Trending Artists", path: "/listening-trending" },
  { id: "sweet-90s", title: "Sweet 90’s", path: "/listening-90s" },
  { id: "street-hits", title: "Street Hits", path: "/listening-street" },
  { id: "party-starters", title: "Party Starters", path: "/listening-party" },
];

// ✅ NEW: SECTION 3 CONFIG (mood chips)
const SECTION3_MOODS = [
  { id: "love", title: "Love / Feel Good", path: "/mood-love" },
  { id: "heartbreak", title: "Heartbreak", path: "/mood-heartbreak" },
  { id: "gym", title: "Gym / Energy", path: "/mood-gym" },
  { id: "relax", title: "Relax / Focus", path: "/mood-relax" },
];

// ✅ FIX: SECTION 1 CONFIG moved OUTSIDE the component (declared ONCE)
const SECTION1_TILES = [
  { id: "top-songs", title: "TOP SONGS", path: "/top-songs" },
  { id: "popular-artists", title: "POPULAR ARTISTS AROUND THE WORLD", path: "/popular-artists" },
  { id: "popular-playlists", title: "POPULAR PLAYLISTS", path: "/popular-playlists" },
  { id: "new-releases", title: "NEW RELEASES", path: "/new-releases" },
];

export default function Library() {
  const navigate = useNavigate();
  const { setSong } = usePlayer();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollerRef = useRef(null);
  const itemRefs = useRef([]);
  const rafRef = useRef(null);

  const activeGenre = GENRES[activeIndex];

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = activeGenre?.songs ?? [];
    if (!q) return list;
    return list.filter(
      (s) =>
        s.artist.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q)
    );
  }, [query, activeGenre]);

  // ✅ Section 1 previews (genre-aware)
  const section1TilesWithPreview = useMemo(() => {
    const songs = activeGenre?.songs ?? [];

    const topSongs = songs.slice(0, 3).map((s) => `${s.artist} — ${s.title}`);
    const artists = [...new Set(songs.map((s) => s.artist))].slice(0, 3);

    const playlists = songs.slice(0, 3).map((s) => `${s.title}`);
    const newReleases = songs.slice(-3).reverse().map((s) => `${s.artist} — ${s.title}`);

    return SECTION1_TILES.map((tile) => {
      if (tile.id === "top-songs") return { ...tile, preview: topSongs };
      if (tile.id === "popular-artists") return { ...tile, preview: artists };
      if (tile.id === "popular-playlists") return { ...tile, preview: playlists };
      if (tile.id === "new-releases") return { ...tile, preview: newReleases };
      return { ...tile, preview: [] };
    });
  }, [activeGenre]);

  // ✅ Section 2 previews (genre-aware)
  const section2PillsWithPreview = useMemo(() => {
    const songs = activeGenre?.songs ?? [];
    const artists = [...new Set(songs.map((s) => s.artist))];

    return SECTION2_PILLS.map((pill) => {
      let preview = [];

      if (pill.id === "trending-artists") {
        preview = artists.slice(0, 3);
      } else if (pill.id === "sweet-90s") {
        preview = songs.slice(0, 3).map((s) => s.title);
      } else if (pill.id === "street-hits") {
        preview = songs.slice(3, 6).map((s) => s.title);
      } else if (pill.id === "party-starters") {
        preview = songs.slice(6, 9).map((s) => s.title);
      }

      return { ...pill, preview };
    });
  }, [activeGenre]);

  // ✅ Section 3 previews (genre-aware)
  const section3MoodsWithPreview = useMemo(() => {
    const songs = activeGenre?.songs ?? [];

    const love = songs.slice(0, 4).map((s) => s.title);
    const heartbreak = songs.slice(4, 8).map((s) => s.title);
    const gym = songs.slice(8, 12).map((s) => s.title);
    const relax = songs.slice(12, 16).map((s) => s.title);

    return SECTION3_MOODS.map((m) => {
      if (m.id === "love") return { ...m, preview: love };
      if (m.id === "heartbreak") return { ...m, preview: heartbreak };
      if (m.id === "gym") return { ...m, preview: gym };
      if (m.id === "relax") return { ...m, preview: relax };
      return { ...m, preview: [] };
    });
  }, [activeGenre]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const computeActiveByCenter = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const centerX = scrollerRect.left + scrollerRect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const itemCenter = r.left + r.width / 2;
      const dist = Math.abs(centerX - itemCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    setActiveIndex(bestIdx);
  };

  const onScroll = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      computeActiveByCenter();
      rafRef.current = null;
    });
  };

  const scrollToIndex = (idx) => {
    const scroller = scrollerRef.current;
    const el = itemRefs.current[idx];
    if (!scroller || !el) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const currentScrollLeft = scroller.scrollLeft;

    const scrollerCenter = scrollerRect.width / 2;
    const elCenterFromLeft =
      elRect.left - scrollerRect.left + elRect.width / 2;

    const target = currentScrollLeft + (elCenterFromLeft - scrollerCenter);
    scroller.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* content wrapper so PlayerBar can sit at bottom */}
      <div className="flex-1 px-6 pt-6 pb-28">
        <div className="flex justify-end">
          <img src={logo} alt="BD Rhythm Logo" className="w-16 md:w-20" />
        </div>

        <div className="mt-6 max-w-md mx-auto">
          <SearchBar onSearch={(q) => setQuery(q)} />
        </div>

        <div className="mt-8 max-w-md mx-auto">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="shrink-0 w-12" />

            {GENRES.map((g, idx) => {
              const isActive = idx === activeIndex;

              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className="relative shrink-0 snap-center focus:outline-none"
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                >
                  <p className="sr-only">{g.name}</p>

                  <div
                    className={[
                      "px-5 h-9 rounded-full font-bold text-[11px] whitespace-nowrap flex items-center justify-center",
                      "transition duration-200",
                      isActive
                        ? "bg-[#00EFFF] text-black scale-105"
                        : "bg-[#CFFFFF] text-black/80 hover:scale-105 active:scale-95",
                    ].join(" ")}
                  >
                    {g.name}
                  </div>
                </button>
              );
            })}

            <div className="shrink-0 w-12" />
          </div>
        </div>

        <h2 className="mt-6 text-center text-[#00FFFF] text-sm font-extrabold">
          {activeGenre?.name}
        </h2>

        {/* ✅ SONGS: horizontal scrolling columns */}
        <div className="mt-6 max-w-md mx-auto px-4">
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div
              className="
                grid grid-rows-4 grid-flow-col
                auto-cols-[220px]
                gap-x-12 gap-y-8
              "
            >
              {filteredSongs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => {
                    setSong(song);
                    navigate("/home", { state: { track: song } });
                  }}
                  className="flex items-start gap-4 text-left w-full"
                >
                  <div className="w-12 h-12 bg-[#CFFFFF] rounded-md shrink-0" />

                  <div className="leading-tight">
                    <p className="text-[#00FFFF] text-sm font-bold">
                      {song.artist}
                    </p>
                    <p className="text-[#00FFFF] text-sm font-semibold">
                      {song.title}
                    </p>

                    {"genre" in song && (
                      <p className="text-white/60 text-[10px] mt-1">
                        {song.genre}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredSongs.length === 0 && (
              <p className="text-center text-white/60 text-sm mt-6">
                No results for “{query}”
              </p>
            )}
          </div>
        </div>

        {/* ✅ SECTION 1 — AFTER songs list (tiles) */}
        <div className="mt-10 max-w-md mx-auto px-4">
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
            {section1TilesWithPreview.map((tile) => (
              <button
                key={tile.id}
                onClick={() =>
                  navigate(tile.path, { state: { genre: activeGenre } })
                }
                className="
                  min-w-[240px] h-40
                  bg-[#CFFFFF]
                  rounded-2xl
                  p-4
                  text-black
                  flex flex-col
                  justify-between
                  transition
                  hover:scale-[1.02]
                  active:scale-95
                "
              >
                <div className="text-left">
                  <p className="font-black text-[13px] leading-tight">
                    {tile.title}
                  </p>
                  <p className="text-[10px] font-bold opacity-70 mt-1">
                    {activeGenre?.name}
                  </p>
                </div>

                <div className="text-left space-y-1">
                  {(tile.preview ?? []).slice(0, 3).map((line, i) => (
                    <p key={i} className="text-[10px] font-semibold truncate">
                      • {line}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ SECTION 2 — EVERYONE IS LISTENING TO */}
        <div className="mt-10 max-w-md mx-auto px-4">
          <h2 className="text-[#00FFFF] text-sm font-extrabold mb-4">
            EVERYONE IS LISTENING TO
          </h2>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {section2PillsWithPreview.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() =>
                  navigate(pill.path, { state: { genre: activeGenre } })
                }
                className="
                  shrink-0
                  min-w-[170px]
                  rounded-xl
                  px-4 py-3
                  bg-[#CFFFFF]
                  text-black
                  text-left
                  transition
                  hover:scale-[1.02]
                  active:scale-95
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-[11px] leading-tight">
                    {pill.title}
                  </p>
                  <span className="text-[10px] font-black opacity-70">›</span>
                </div>

                <p className="text-[10px] font-semibold opacity-70 mt-2 truncate">
                  {(pill.preview ?? []).join(" • ")}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ SECTION 3 — FIND YOUR MOOD */}
        <div className="mt-10 max-w-md mx-auto px-4">
          <h2 className="text-[#00FFFF] text-sm font-extrabold mb-4">
            FIND YOUR MOOD
          </h2>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {section3MoodsWithPreview.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() =>
                  navigate(mood.path, { state: { genre: activeGenre } })
                }
                className="
                  shrink-0
                  min-w-[210px]
                  rounded-2xl
                  border border-white/10
                  bg-gradient-to-br from-[#0b0b0b] to-black
                  p-4
                  text-left
                  transition
                  hover:scale-[1.02]
                  active:scale-95
                "
              >
                <p className="text-[#CFFFFF] font-black text-[12px]">
                  {mood.title}
                </p>

                <p className="text-white/50 text-[10px] font-semibold mt-1 truncate">
                  {activeGenre?.name}
                </p>

                <div className="mt-3 space-y-1">
                  {(mood.preview ?? []).slice(0, 3).map((t, i) => (
                    <p
                      key={i}
                      className="text-[#00FFFF] text-[10px] font-semibold truncate"
                    >
                      • {t}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

   

    </div>
  );
}

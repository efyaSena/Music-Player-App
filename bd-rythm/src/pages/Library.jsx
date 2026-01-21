import React, { useMemo, useRef, useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { BiSolidMicrophone } from "react-icons/bi";
import logo from "../assets/BD-RYTHM-logo.png";
import { useNavigate } from "react-router-dom";
import PlayerBar from "../components/PlayerBar";
import SearchBar from "../components/SearchBar";


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
      { artist: "Burna Boy", title: "Ye" },
      { artist: "Wizkid", title: "Ojuelegba" },
      { artist: "Davido", title: "Fall" },
      { artist: "Rema", title: "Dumebi" },
      { artist: "Ayra Starr", title: "Away" },
      { artist: "Fireboy DML", title: "Jealous" },
      { artist: "Omah Lay", title: "Bad Influence" },
      { artist: "Asake", title: "Joha" },
      { artist: "Tekno", title: "Pana" },
      { artist: "Stonebwoy", title: "Activate" },
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

export default function Library() {
  const navigate = useNavigate();

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

        {/* ✅ SONGS: horizontal scrolling columns (your layout) */}
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
                  onClick={() => navigate("/home", { state: { track: song } })}
                  className="flex items-start gap-4 text-left w-full"
                >
                  {/* small cover */}
                  <div className="w-12 h-12 bg-[#CFFFFF] rounded-md shrink-0" />

                  {/* text */}
                  <div className="leading-tight">
                    <p className="text-[#00FFFF] text-sm font-bold">
                      {song.artist}
                    </p>
                    <p className="text-[#00FFFF] text-sm font-semibold">
                      {song.title}
                    </p>

                    {/* genre line (only shows if song has it) */}
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
      </div>

      <PlayerBar />
    </div>
  );
}

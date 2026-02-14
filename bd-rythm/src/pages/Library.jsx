import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import logo from "../assets/BD-RYTHM-logo.png";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { usePlayer } from "../context/usePlayer";
import {
  getTrendingTracks,
  getTrackStreamUrl,
  getTrendingPlaylists,
} from "../api/audius";

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

// ✅ SECTION 3 CONFIG (mood chips)
const SECTION3_MOODS = [
  { id: "love", title: "Love / Feel Good", path: "/mood-love" },
  { id: "heartbreak", title: "Heartbreak", path: "/mood-heartbreak" },
  { id: "gym", title: "Gym / Energy", path: "/mood-gym" },
  { id: "relax", title: "Relax / Focus", path: "/mood-relax" },
];

// ✅ SECTION 1 CONFIG
const SECTION1_TILES = [
  { id: "top-songs", title: "TOP SONGS", path: "/top-songs" },
  { id: "popular-artists", title: "POPULAR ARTISTS AROUND THE WORLD", path: "/popular-artists" },
  { id: "popular-playlists", title: "POPULAR PLAYLISTS", path: "/popular-playlists" },
  { id: "new-releases", title: "NEW RELEASES", path: "/new-releases" },
];

export default function Library() {
  const navigate = useNavigate();
  usePlayer();

  const [Query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ REAL Audius data state
  const [realTracks, setRealTracks] = useState([]);
  const [realPlaylists, setRealPlaylists] = useState([]);
  const [loadingReal, setLoadingReal] = useState(false);
  const [realErr, setRealErr] = useState("");

  const scrollerRef = useRef(null);
  const itemRefs = useRef([]);
  const rafRef = useRef(null);

  const activeGenre = GENRES[activeIndex];

  // ✅ REAL track mapper (safe)
  const mapTrack = useCallback(
    (t) => ({
      id: String(t?.id),
      title: t?.title || "Untitled",
      artist: t?.user?.name || t?.user?.handle || "Unknown",
      userId: String(t?.user?.id || t?.user_id || ""), // ✅ REAL user id
      artistArtwork:
        t?.user?.profile_picture?.["150x150"] ||
        t?.user?.profile_picture?.["480x480"] ||
        "",
      artwork:
        t?.artwork?.["150x150"] ||
        t?.artwork?.["480x480"] ||
        t?.artwork?.["1000x1000"] ||
        "",
      genre: t?.genre || "All",
      createdAt: t?.created_at || t?.release_date || 0,
      audio: getTrackStreamUrl(t?.id),
    }),
    []
  );

  // ✅ Fetch REAL Audius tracks + playlists when genre changes
  useEffect(() => {
    const genreName = activeGenre?.name || "All";
    let alive = true;

    (async () => {
      try {
        setLoadingReal(true);
        setRealErr("");

        const trackParams =
          genreName === "All"
            ? { limit: 60, time: "week" }
            : { limit: 60, time: "week", genre: genreName };

        const tdata = await getTrendingTracks(trackParams);
        const mappedTracks = (tdata || []).map(mapTrack);

        const pdata = await getTrendingPlaylists({ limit: 30, time: "week" });

        if (!alive) return;
        setRealTracks(mappedTracks);
        setRealPlaylists(pdata || []);
      } catch (e) {
        if (!alive) return;
        setRealErr(e?.message || "Failed to load real Audius data.");
        setRealTracks([]);
        setRealPlaylists([]);
      } finally {
        if (alive) setLoadingReal(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [activeGenre?.name, mapTrack]);

  // ✅ Section 1 previews (genre-aware) - keep your look
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

  // ✅ Section 2 previews (unchanged)
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

  // ✅ Section 3 previews (unchanged)
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
    const elCenterFromLeft = elRect.left - scrollerRect.left + elRect.width / 2;

    const target = currentScrollLeft + (elCenterFromLeft - scrollerCenter);
    scroller.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
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

        {/* ✅ TRENDING THIS WEEK */}
        <div className="mt-8 max-w-md mx-auto px-4">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="
              w-full
              rounded-2xl
              border border-white/10
              bg-gradient-to-br from-[#0b0b0b] to-black
              p-4
              text-left
              transition
              hover:scale-[1.02]
              active:scale-95
              hover:shadow-[0_0_0_1px_rgba(0,255,255,0.15)]
              active:scale-[0.99]
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#CFFFFF] font-black text-[12px] tracking-wide">
                  TRENDING THIS WEEK
                </p>
                <p className="text-white/50 text-[10px] font-semibold mt-1">
                  Tap to explore what’s hot right now
                </p>
              </div>
            </div>
          </button>

          {loadingReal ? (
            <p className="text-white/40 text-[10px] mt-2 px-1">
              Loading real Audius data…
            </p>
          ) : realErr ? (
            <p className="text-red-400 text-[10px] mt-2 px-1">{realErr}</p>
          ) : null}
        </div>

        {/* ✅ SECTION 1 — tiles */}
        <div className="mt-10 max-w-md mx-auto px-4">
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
            {section1TilesWithPreview.map((tile) => (
              <button
                key={tile.id}
                onClick={() => {
                  const genreName = activeGenre?.name || "All";

                  // if realTracks not loaded yet, still navigate (TopSongs can fetch)
                  if (tile.id === "top-songs") {
                    return navigate("/top-songs", {
                      state: {
                        scope: "genre",
                        chart: `Top Songs: ${genreName}`,
                        genre: genreName,
                        tracks: Array.isArray(realTracks) ? realTracks : [],
                      },
                    });
                  }

                  if (tile.id === "popular-artists") {
                    const seen = new Set();
                    const artists = [];

                    // ✅ if no realTracks yet, fallback to local songs so page isn’t empty
                    if (!realTracks || realTracks.length === 0) {
                      const songs = activeGenre?.songs ?? [];
                      for (const s of songs) {
                        const key = String(s.artist || "").toLowerCase();
                        if (!key || seen.has(key)) continue;
                        seen.add(key);

                        artists.push({
                          id: `local-${key}`,
                          name: s.artist,
                          artwork: "",
                          genre: genreName,
                        });

                        if (artists.length >= 18) break;
                      }
                    } else {
                      for (const t of realTracks) {
                        const uid = t.userId;
                        if (!uid || seen.has(uid)) continue;
                        seen.add(uid);

                        artists.push({
                          id: uid,
                          userId: uid,
                          name: t.artist,
                          artwork: t.artistArtwork || t.artwork || "",
                          genre: genreName,
                        });

                        if (artists.length >= 18) break;
                      }
                    }

                    return navigate("/popular-artists", {
                      state: { genre: genreName, artists },
                    });
                  }

                  if (tile.id === "popular-playlists") {
  const genreName = activeGenre?.name || "All";

  // ✅ If Audius playlists are available
  if (Array.isArray(realPlaylists) && realPlaylists.length > 0) {
    const playlists = realPlaylists.slice(0, 24).map((p) => ({
      id: String(p?.id),
      title: p?.playlist_name || p?.title || "Playlist",
      artist: p?.user?.name || p?.user?.handle || "Unknown",
      artwork:
        p?.artwork?.["150x150"] ||
        p?.artwork?.["480x480"] ||
        p?.artwork?.["1000x1000"] ||
        "",
    }));

    return navigate("/popular-playlists", {
      state: { genre: genreName, playlists },
    });
  }

  // ✅ Fallback: build “playlists” from realTracks (so page never empty)
  const fallback = (realTracks || []).slice(0, 24).map((t, i) => ({
    id: `mix-${genreName}-${t?.id || i}`,
    title: t?.title ? `${t.title} Mix` : `Playlist ${i + 1}`,
    artist: t?.artist || "BD Rythm",
    artwork: t?.artwork || t?.artistArtwork || "",
  }));

  return navigate("/popular-playlists", {
    state: { genre: genreName, playlists: fallback },
  });
}

                  if (tile.id === "new-releases") {
                    const newest =
                      realTracks && realTracks.length
                        ? [...realTracks]
                            .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                            .slice(0, 40)
                        : (activeGenre?.songs ?? []).slice(0, 30).map((s, i) => ({
                            id: `local-${s.artist}-${s.title}-${i}`,
                            artist: s.artist,
                            title: s.title,
                            artwork: "",
                            genre: genreName,
                            audio: "",
                            createdAt: 0,
                          }));

                    return navigate("/new-releases", {
                      state: { genre: genreName, tracks: newest },
                    });
                  }

                  return navigate(tile.path, { state: { genre: genreName } });
                }}
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
                  <p className="font-black text-[13px] leading-tight">{tile.title}</p>
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
                onClick={() => navigate(pill.path, { state: { genre: activeGenre } })}
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
                  <p className="font-black text-[11px] leading-tight">{pill.title}</p>
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
                onClick={() => navigate(mood.path, { state: { genre: activeGenre } })}
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
                <p className="text-[#CFFFFF] font-black text-[12px]">{mood.title}</p>

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

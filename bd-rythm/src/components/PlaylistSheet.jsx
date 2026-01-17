import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bdrythm_playlists_v1";

const defaultPlaylists = [
  { id: "p1", name: "My favorites", count: 10 },
  { id: "p2", name: "Hip-hop", count: 5 },
  { id: "p3", name: "Afrobeat", count: 12 },
];

function safeLoad() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (!Array.isArray(parsed)) return defaultPlaylists;

    return parsed
      .filter(
        (p) =>
          p &&
          typeof p.id === "string" &&
          typeof p.name === "string" &&
          typeof p.count === "number"
      )
      .slice(0, 200);
  } catch {
    return defaultPlaylists;
  }
}

export default function PlaylistSheet({ isOpen, onClose }) {
  const [mode, setMode] = useState("list"); // "list" | "create"
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");

  const [playlists, setPlaylists] = useState(() => safeLoad());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch {
      // ignore storage errors
    }
  }, [playlists]);

 useEffect(() => {
  if (!isOpen) {
    const id = setTimeout(() => {
      setMode("list");
      setSearch("");
      setName("");
    }, 0);

    return () => clearTimeout(id);
  }
}, [isOpen]);


  const canCreate = useMemo(() => name.trim().length >= 2, [name]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, playlists]);

  const closeAll = () => {
    setMode("list");
    setSearch("");
    setName("");
    onClose?.();
  };

  const createPlaylist = () => {
    const n = name.trim();
    if (!n) return;

    const exists = playlists.some(
      (p) => p.name.trim().toLowerCase() === n.toLowerCase()
    );

    if (exists) {
      setMode("list");
      setSearch(n);
      setName("");
      return;
    }

    const newItem = {
      id: `p-${Date.now()}`,
      name: n,
      count: 0,
    };

    setPlaylists((prev) => [newItem, ...prev]);
    setMode("list");
    setSearch("");
    setName("");
  };

 const addToPlaylist = (playlist) => {
  // later: add current track to this playlist
  console.log("Add to playlist:", playlist.name); // temporary so eslint stops complaining
  closeAll();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={closeAll}
        aria-label="Close playlist popup"
      />

      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-md">
        <div className="bg-black text-white rounded-t-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="flex justify-center pt-3">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          <div className="relative px-5 pt-5 pb-4 border-b border-white/10">
            {mode === "create" ? (
              <button
                type="button"
                className="absolute left-4 top-5 text-white text-2xl font-black transition hover:scale-110 active:scale-95"
                aria-label="Back"
                onClick={() => setMode("list")}
              >
                ‹
              </button>
            ) : (
              <div className="absolute left-4 top-5 w-6" />
            )}

            <h2 className="text-center font-black tracking-wide text-lg">
              ADD TO PLAYLISTS
            </h2>

            <button
              type="button"
              className="absolute right-4 top-5 text-white text-2xl font-black transition hover:scale-110 active:scale-95"
              aria-label="Close"
              onClick={closeAll}
            >
              ×
            </button>
          </div>

          {mode === "list" ? (
            <div className="px-5 pt-6 pb-8">
              <button
                type="button"
                onClick={() => setMode("create")}
                className="w-full bg-[#00EFFF] text-black font-black py-4 rounded-full transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Create new playlist
              </button>

              <p className="mt-6 text-white/90 font-extrabold text-lg">
                Or add to existing playlist
              </p>

              <div className="mt-4 bg-white/10 rounded-xl px-4 py-4 border border-white/10">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your existing playlists..."
                  className="w-full bg-transparent outline-none text-white placeholder-white/40 text-base"
                />
              </div>

              <div className="mt-6 max-h-[45vh] overflow-y-auto scrollbar-hide pr-1">
                <div className="flex flex-col gap-6">
                  {filtered.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-xl bg-[#CFFFFF] shrink-0 opacity-90" />
                        <div className="min-w-0">
                          <p className="font-extrabold text-lg truncate">
                            {p.name}
                          </p>
                          <p className="text-white/60 text-base">
                            {p.count} Songs
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToPlaylist(p)}
                        className="text-[#00FFFF] text-4xl font-light transition hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_10px_#00FFFF]"
                        aria-label={`Add to ${p.name}`}
                      >
                        +
                      </button>
                    </div>
                  ))}

                  {filtered.length === 0 && (
                    <p className="text-white/60 text-sm text-center py-6">
                      No playlists found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 pt-6 pb-10">
              <p className="text-white/90 font-extrabold text-lg">
                Enter a playlist name
              </p>

              <div className="mt-4 bg-white/10 rounded-xl px-4 py-5 border border-white/10">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none text-white text-lg"
                  placeholder="Playlist name"
                  autoFocus
                />
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={createPlaylist}
                  disabled={!canCreate}
                  className={[
                    "w-full font-black text-lg py-4 rounded-full transition duration-200",
                    canCreate
                      ? "bg-[#00EFFF] text-black hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-[#00EFFF]/30 text-white/40 cursor-not-allowed",
                  ].join(" ")}
                >
                  Create new playlist
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

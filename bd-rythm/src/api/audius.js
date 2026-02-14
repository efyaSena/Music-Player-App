// src/api/audius.js
const DISCOVERY_NODES = [
  "https://discoveryprovider.audius.co",
  "https://discoveryprovider2.audius.co",
];

let SESSION_NODE = null;

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Audius error ${res.status}${text ? `: ${text}` : ""}`);
  }
  return res.json();
}

function pickNode() {
  if (SESSION_NODE) return SESSION_NODE;
  SESSION_NODE = DISCOVERY_NODES[Math.floor(Math.random() * DISCOVERY_NODES.length)];
  return SESSION_NODE;
}

// Trending tracks
export async function getTrendingTracks({ limit = 20, time = "week" } = {}) {
  const base = pickNode();
  const url = `${base}/v1/tracks/trending?time=${time}&limit=${limit}&app_name=bd-rythm`;
  const json = await fetchJson(url);
  return json?.data || [];
}

// Stream URL
export function getTrackStreamUrl(trackId) {
  const base = pickNode();
  return `${base}/v1/tracks/${trackId}/stream?app_name=bd-rythm`;
}

// Search tracks
export async function searchTracks({ query, limit = 20 } = {}) {
  if (!query?.trim()) return [];
  const base = pickNode();
  const url = `${base}/v1/tracks/search?query=${encodeURIComponent(query.trim())}&limit=${limit}&app_name=bd-rythm`;
  const json = await fetchJson(url);
  return json?.data || [];
}

// Trending albums (fallback to playlists)
export async function getTrendingAlbums({ limit = 24, time = "week" } = {}) {
  const base = pickNode();
  const url1 = `${base}/v1/albums/trending?time=${time}&limit=${limit}&app_name=bd-rythm`;

  try {
    const json = await fetchJson(url1);
    return json?.data || [];
  } catch {
    const url2 = `${base}/v1/playlists/trending?time=${time}&limit=${limit}&app_name=bd-rythm`;
    const json2 = await fetchJson(url2);
    return json2?.data || [];
  }
}

// ✅ user profile
export async function getUser(userId) {
  const base = pickNode();
  const url = `${base}/v1/users/${userId}?app_name=bd-rythm`;
  const json = await fetchJson(url);
  return json?.data || null;
}

// ✅ tracks by user
export async function getUserTracks({ userId, limit = 12, offset = 0 } = {}) {
  const base = pickNode();
  const url = `${base}/v1/users/${userId}/tracks?limit=${limit}&offset=${offset}&app_name=bd-rythm`;
  const json = await fetchJson(url);
  return json?.data || [];
}

// ✅ playlists by user
export async function getUserPlaylists({ userId, limit = 12, offset = 0 } = {}) {
  const base = pickNode();
  const url = `${base}/v1/users/${userId}/playlists?limit=${limit}&offset=${offset}&app_name=bd-rythm`;
  const json = await fetchJson(url);
  return json?.data || [];
}

// ✅ trending playlists
export async function getTrendingPlaylists({ limit = 20, time = "week" } = {}) {
  const base = pickNode();
  const url = `${base}/v1/playlists/trending?time=${time}&limit=${limit}&app_name=bd-rythm`;
  const json = await fetchJson(url);
  return json?.data || [];
}

// ✅ playlist tracks
export async function getPlaylistTracks({ playlistId, limit = 100, offset = 0 } = {}) {
  const base = pickNode();
  const url = `${base}/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}&app_name=bd-rythm`;
  const json = await fetchJson(url);
  return json?.data || [];
}


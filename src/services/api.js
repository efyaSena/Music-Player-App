const BASE_URL = "https://api.example.com";

export const fetchTrendingTracks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trending`);
    if (!response.ok) throw new Error("Failed to fetch trending tracks");
    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchPlaylists = async () => {
  try {
    const response = await fetch(`${BASE_URL}/playlists`);
    if (!response.ok) throw new Error("Failed to fetch playlists");
    const data = await response.json();
    return data.playlists;
  } catch (error) {
    console.error(error);
    return [];
  }
};

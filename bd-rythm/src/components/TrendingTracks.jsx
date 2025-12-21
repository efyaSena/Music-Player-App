import React, { useEffect, useState } from "react";
import TrackCard from "./TrackCard";
import { fetchTrendingTracks } from "../services/api";

const TrendingTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTracks = async () => {
      const data = await fetchTrendingTracks();
      setTracks(data);
      setLoading(false);
    };
    getTracks();
  }, []);

  if (loading) return <p>Loading trending tracks...</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} size="medium" />
      ))}
    </div>
  );
};

export default TrendingTracks;

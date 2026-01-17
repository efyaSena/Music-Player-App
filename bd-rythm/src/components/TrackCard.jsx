import React from "react";

export default function TrackCard({ title = "Song Title", artist = "Artist", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 text-left"
    >
      <div className="w-12 h-12 bg-[#CFFFFF] rounded-md shrink-0" />

      <div className="leading-tight">
        <p className="text-[#00FFFF] text-sm font-bold">{artist}</p>
        <p className="text-[#00FFFF] text-sm font-semibold">{title}</p>
      </div>
    </button>
  );
}

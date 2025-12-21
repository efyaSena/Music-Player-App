import React from "react";

const TrackCard = ({ size = "medium" }) => {
  const sizeStyles = {
    large: "bg-[#00FFFF] rounded-md opacity-80 w-32 h-32",
    medium: "bg-[#00FFFF] rounded-md opacity-70 w-24 h-24",
    small: "bg-[#00FFFF] rounded-md opacity-60 w-20 h-20",
  };

  return (
    <div className={`flex flex-col items-center ${sizeStyles[size]}`}>
      <img 
        src="/assets/track.png" 
        className="rounded-md object-cover w-full h-full"
        alt="track"
      />
      <p className="text-[10px] text-gray-300 mt-1">Name</p>
      <p className="text-[10px] text-gray-300 -mt-1">Song Title</p>
    </div>
  );
};

export default TrackCard;

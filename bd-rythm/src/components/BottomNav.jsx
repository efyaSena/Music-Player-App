import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import homeIcon from "../assets/home-button.png";
import musicIcon from "../assets/music-icon.png";
import recorderIcon from "../assets/voice-recorder.png";
import searchIcon from "../assets/search-button.png";

const BottomNav = () => {
  const navigate = useNavigate();
  const [, setActive] = useState("home");

  return (
    <div className="w-full bg-[#00EFFF] px-4 h-20 flex items-center">
      <div className="w-full flex justify-around items-center text-center text-black">
        <button
          onClick={() => {
            setActive("home");
            navigate("/home");
          }}
        >
          <img src={homeIcon} className="h-6" alt="Home" />
          <p className="text-[10px] mt-1">Home</p>
        </button>

        <button
          onClick={() => {
            setActive("library");
            navigate("/library");
          }}
        >
          <img src={musicIcon} className="h-6" alt="Library" />
          <p className="text-[10px] mt-1">Library</p>
        </button>

        <button
          onClick={() => {
            setActive("record");
            navigate("/recorder"); // ✅ Audio Recorder page
          }}
        >
          <img src={recorderIcon} className="h-6" alt="Recorder" />
          <p className="text-[10px] mt-1">Recorder</p>
        </button>

        <button
          onClick={() => {
            setActive("search");
            navigate("/search"); // ✅ Search page
          }}
        >
          <img src={searchIcon} className="h-6" alt="Search" />
          <p className="text-[10px] mt-1">Search</p>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#00EFFF] px-4 h-20 flex items-center pb-[env(safe-area-inset-bottom)]">

      <div className="w-full flex justify-around items-center text-center text-black">
        <button
          type="button"
          onClick={() => {
            setActive("home");
            navigate("/home");
          }}
        >
          <img src={homeIcon} className="h-6" alt="Home" />
          <p className="text-[10px] mt-1">Home</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActive("library");
            navigate("/library");
          }}
        >
          <img src={musicIcon} className="h-6" alt="Library" />
          <p className="text-[10px] mt-1">Library</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActive("record");
            navigate("/recorder");
          }}
        >
          <img src={recorderIcon} className="h-6" alt="Recorder" />
          <p className="text-[10px] mt-1">Recorder</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActive("search");
            navigate("/search");
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

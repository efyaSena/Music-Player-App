import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BD-RYTHM-logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  const handleLoginSignup = () => {
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
      <img 
        src={logo} 
        alt="BD Rythm Logo" 
        className="w-48 mb-6"
      />

      <p className="text-center text-lg text-gray-300 px-6 mb-20">
        “Feel the sound. Play your vibe.”
      </p>

      <div className="absolute bottom-16 w-full flex justify-center">
        <button 
          onClick={handleLoginSignup} 
          className="bg-[#00F0FF] text-black font-semibold w-60 py-3 rounded-xl"
        >
          Login / Signup
        </button>
      </div>
    </div>
  );
};

export default Welcome;

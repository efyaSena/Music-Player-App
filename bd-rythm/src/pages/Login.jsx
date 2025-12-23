import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/BD-RYTHM-logo.png";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/Playlist"); 
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-6">

      
      <img 
        src={logo} 
        alt="BD Rythm Logo" 
        className="w-48 mb-10"
      />

      <div className="w-full max-w-xs flex flex-col gap-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-[#C2FFFF] text-black placeholder-gray-700"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-[#C2FFFF] text-black placeholder-gray-700"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#00F0FF] text-black font-semibold py-3 rounded-lg mt-2"
        >
          Login
        </button>
      </div>

      <p className="mt-6 text-gray-400 text-sm">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-[#00F0FF] font-semibold">
          Sign up
        </Link>
      </p>

    </div>
  );
};

export default Login;

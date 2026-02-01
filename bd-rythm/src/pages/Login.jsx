import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/BD-RYTHM-logo.png";
import AuthBackground from "../components/AuthBackground";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    // super simple email format check
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    // ✅ for now: allow login after validation
    navigate("/library"); // lowercase matches your App route
  };

  return (
    <AuthBackground>
      <div className="min-h-screen flex flex-col justify-center items-center text-white px-6">
        <img src={logo} alt="BD Rythm Logo" className="w-48 mb-10" />

        {/* form so Enter key works */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-xs flex flex-col gap-4"
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-[#C2FFFF] text-black placeholder-gray-700"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#C2FFFF] text-black placeholder-gray-700"
          />

          {error && <p className="text-red-400 text-xs -mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#00F0FF] text-black font-semibold py-3 rounded-lg mt-2 hover:opacity-90 active:scale-[0.99] transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#00F0FF] font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </AuthBackground>
  );
};

export default Login;

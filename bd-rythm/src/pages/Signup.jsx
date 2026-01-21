import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // ✅ basic validation
    if (!cleanEmail || !cleanPassword) {
      setError("Please enter both email and password.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (cleanPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // ✅ TEMP signup storage (replace later with Firebase/Supabase)
    const users = JSON.parse(localStorage.getItem("bd_users") || "[]");

    const alreadyExists = users.some((u) => u.email === cleanEmail);
    if (alreadyExists) {
      setError("This email already has an account. Please login.");
      return;
    }

    users.push({ email: cleanEmail, password: cleanPassword });
    localStorage.setItem("bd_users", JSON.stringify(users));

    // ✅ OPTIONAL: store current logged user
    localStorage.setItem("bd_current_user", cleanEmail);

    // ✅ go to login or home
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-6">
      <h1 className="text-[#00F0FF] text-2xl font-bold mb-6">
        Create Account
      </h1>

      <form onSubmit={handleSignup} className="w-full max-w-xs flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#C2FFFF] text-black placeholder-gray-700"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#C2FFFF] text-black placeholder-gray-700"
        />

        {error && (
          <p className="text-red-400 text-xs font-semibold text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-[#00F0FF] text-black font-semibold py-3 rounded-lg mt-2 transition hover:scale-[1.02] active:scale-95"
        >
          Sign up
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-6 text-sm text-[#00F0FF] font-semibold"
      >
        Already have an account? Login
      </button>
    </div>
  );
};

export default Signup;

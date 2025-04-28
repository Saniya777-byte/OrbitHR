import React, { useState } from "react";
import VideoComponents from "../VideoComponents";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video 
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/login-bg.mp4" type="video/mp4" />
        <source src="/videos/login-bg.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Video Components */}
      <div className="absolute inset-0 z-20">
        <VideoComponents />
      </div>

      {/* Login Form Container */}
      <div className="relative z-30 flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center justify-center backdrop-blur-lg bg-white/5 border border-emerald-500/30 shadow-2xl rounded-3xl p-8 w-96 transition-all duration-500 hover:shadow-emerald-500/30">
          <h2 className="text-3xl font-extrabold text-emerald-400 text-center mb-8 tracking-wide">
            Welcome Back 👋
          </h2>
          
          <form onSubmit={submitHandler} className="space-y-6 w-full">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 text-white bg-black/20 border border-emerald-500/30 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300"
              type="email"
              placeholder="Enter your email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 text-white bg-black/20 border border-emerald-500/30 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300"
              type="password"
              placeholder="Enter your password"
            />
            <div className="text-center text-sm text-gray-300">
              <p>Admin: admin@me.com | 123</p>
              <p>Employee: employee1@example.com| 123</p>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-emerald-500/30 transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
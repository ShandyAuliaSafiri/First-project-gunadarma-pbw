import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      window.location.href = "/";
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Login gagal. Silakan periksa email dan password Anda.",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-200">
      <div className="bg-white p-8 rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black">
        <h2 className="text-4xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xl font-bold mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-4 border-black rounded focus:outline-none focus:ring-4 focus:ring-yellow-300"
            />
          </div>
          <div>
            <label className="block text-xl font-bold mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-4 border-black rounded focus:outline-none focus:ring-4 focus:ring-yellow-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 px-6 rounded border-4 border-black hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

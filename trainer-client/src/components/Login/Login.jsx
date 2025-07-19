import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/loginlogo.svg"
import apiurl from "../../connectivity";
export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const[Loading,setloading]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Fill all fields");
      return;
    }
    setloading(true)

    try {
      const response = await axios.post(
        `${apiurl}/trainer/trainer-login`,
        { email, password }
      );

      if (response.status === 200 && response.data.success) {
        setloading(false)

        toast.success("Login successful!");
        const decoded = jwtDecode(response.data.token);
        localStorage.setItem("trainerToken", response.data.token);
        setTimeout(() => {
          navigate("dashboard");
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        setloading(false)

        toast.error(error.response.data.message || "Login failed!");
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-[#000814] text-white flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-lg text-gray-300 text-center max-w-md">
          Empowering trainers and admins with insights, analytics, and tools to drive results.
        </p>
        <img
          src={logo}
          alt="Analytics"
          className="mt-10 w-3/4 max-w-sm"
        />
      </div>

  
<div className="w-full md:w-1/2 bg-[#f9f9f9] flex items-center justify-center p-10">
  <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl">
    <h2 className="text-4xl font-bold text-gray-800 mb-4">Trainer Login</h2>
    <p className="text-lg text-gray-600 mb-10">Sign in to your account to continue</p>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-base font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="trainer@example.com"
        />
      </div>

      <div>
        <label className="text-base font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 cursor-pointer"
      >
        {Loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  </div>
</div>

    </div>
  );
}

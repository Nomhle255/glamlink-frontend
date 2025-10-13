"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshAuth, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [greeting, setGreeting] = useState("Welcome!");

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      await login({ email, password });
      setIsSuccess(true);

      setTimeout(() => {
        refreshAuth();
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) setError("");
  }, [email, password]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-md flex flex-col items-center transition-transform hover:scale-[1.02] duration-300">
        {/* Greeting */}
        <div className="mb-6 p-5 bg-pink-500 rounded-xl shadow text-white w-full text-center">
          <h2 className="text-xl font-bold">{greeting}</h2>
          <p className="text-pink-200">Welcome back to GlamLink!</p>
        </div>

        {/* Error / Success messages */}
        {error && (
          <p className="text-red-500 mb-3 text-sm text-center">{error}</p>
        )}
        {isSuccess && (
          <p className="text-green-600 mb-3 text-sm text-center">
            Login successful! Redirecting...
          </p>
        )}

        {/* Login Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            autoComplete="username"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl w-full hover:bg-pink-700 transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Signing In...</span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-sm text-gray-700 text-center">
          No account?{" "}
          <a
            href="/signup"
            className="text-pink-600 font-medium hover:underline"
          >
            Sign up!
          </a>
        </p>
      </div>
    </div>
  );
}

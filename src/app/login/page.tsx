
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  login,
  LoginData,
} from "@/app/api/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshAuth, isAuthenticated } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Handle login without React Query
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Validate form data
    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Execute login - this will automatically store token and stylist_id
      const data = await login({ email, password });
      
      console.log("Login completed, refreshing auth state...");
      
      // Refresh AuthContext to pick up the new login data
      setTimeout(() => {
        refreshAuth();
      }, 100);
      
      setIsSuccess(true);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [email, password]);

  // Greeting logic similar to bookings page
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  })();

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        {/* Greeting similar to bookings page */}
        <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white w-full text-center">
          <h2 className="text-lg font-bold">{greeting}</h2>
          <p className="text-pink-200">Welcome back to GlamLink!</p>
        </div>

        <h1 className="text-3xl font-bold text-pink-600 mb-6">Sign In</h1>

        {/* Error display */}
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        
        {/* Success/Loading states */}
        {isSuccess && (
          <p className="text-green-600 mb-3 text-sm">Login successful! Redirecting...</p>
        )}

        <form className="w-full flex flex-col gap-3" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            autoComplete="username"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg w-full hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-700">
          No account? <span className="text-pink-600 font-medium"><a href="/signup">Sign up!</a></span>
        </p>
      </div>
    </div>
  );
}

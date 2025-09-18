
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Dummy login handler (no backend)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo
    if (email === "demo@glamlink.com" && password === "password11") {
      setSuccess(true);
      setError("");
    } else {
      setError("Invalid email or password.");
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (success) {
      // Redirect to dashboard after a short delay
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
  <div className="flex items-center justify-center min-h-screen bg-pink-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        {/* Logo can be added here if available */}
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Sign In</h1>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 mb-3 text-sm">Login successful!</p>
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg w-full hover:bg-pink-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-700">
          No account? <span className="text-pink-600 font-medium"><a href="/signup">Sign up!</a></span>
        </p>
      </div>
    </div>
  );
}

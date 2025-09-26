"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "@/app/api/auth";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [priceRangeMin, setPriceRangeMin] = useState<number>(50);
  const [priceRangeMax, setPriceRangeMax] = useState<number>(200);
  const [selectedPlan, setSelectedPlan] = useState("Free"); // default
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Modal state
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Pick up plan from URL when page loads
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setSelectedPlan(plan);
    } else {
      setShowPlanModal(true); // show popup if no plan chosen
    }
  }, [searchParams]);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setShowPlanModal(false);
  };

  // Handle signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!fullName || !phone || !email || !location || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 10) {
      setError("Password must be at least 10 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name: fullName,
        email,
        phoneNumber: phone,
        password,
        location,
        priceRangeMin,
        priceRangeMax,
        plan: selectedPlan,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Greeting logic
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  })();

  return (
    <>
      {/* Plan Selection Modal */}
      {showPlanModal && (
<div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Choose Your Plan</h2>
            <p className="mb-6 text-gray-600">Select a subscription plan to continue:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handlePlanSelect("Free")}
                className={`p-4 rounded-xl border-2 transition 
                  ${selectedPlan === "Free" ? "border-pink-500 bg-pink-100" : "border-gray-200 hover:border-pink-300"}`}
              >
                <h3 className="font-semibold text-lg">Free</h3>
                <p className="text-sm text-gray-500">Limmited access</p>
              </button>

              <button
                onClick={() => handlePlanSelect("Premium")}
                className={`p-4 rounded-xl border-2 transition 
                  ${selectedPlan === "Premium" ? "border-pink-500 bg-pink-100" : "border-gray-200 hover:border-pink-300"}`}
              >
                <h3 className="font-semibold text-lg">Basic Plan</h3>
                <p className="text-sm text-gray-500">Full features</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Form */}
      <div className="flex items-center justify-center min-h-screen bg-pink-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
          <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white w-full text-center">
            <h2 className="text-lg font-bold">{greeting}</h2>
            <p className="text-pink-200">Join GlamLink today!</p>
          </div>

          <h1 className="text-3xl font-bold text-pink-600 mb-6">Create Account</h1>

          {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
          {isSuccess && <p className="text-green-600 mb-3 text-sm">Account created! Redirecting to login...</p>}

          {/* Show chosen plan */}
          <div className="mb-4 p-3 border rounded-lg bg-pink-50 text-center w-full">
            <p className="text-sm text-gray-700">
              You selected: <span className="font-semibold text-pink-600">{selectedPlan}</span>
            </p>
            <button
              onClick={() => setShowPlanModal(true)}
              className="mt-2 text-xs text-pink-500 hover:underline"
            >
              Change Plan
            </button>
          </div>

          <form className="w-full flex flex-col gap-3" onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
              disabled={isLoading}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  value={priceRangeMin}
                  onChange={(e) => setPriceRangeMin(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={priceRangeMax}
                  onChange={(e) => setPriceRangeMax(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <input
              type="password"
              placeholder="Password (min 10 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg w-full hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-pink-500 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

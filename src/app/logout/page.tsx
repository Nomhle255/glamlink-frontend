"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear any client-side session or user data here if needed
    // localStorage.clear(); // Uncomment if you want to clear all localStorage
    setTimeout(() => {
      router.push("/"); // Redirect to home/landing page
    }, 500);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Logging out...</h2>
        <p className="text-gray-700">Thank you for choosing GlamLink.</p>
      </div>
    </div>
  );
}
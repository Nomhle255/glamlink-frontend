import React from 'react'
import Link from "next/link";

export default function page() {
  // Hardcoded values
  const greeting = "Good morning!";
  const providerName = "Service Provider";
  const totalServices = 10;
  const totalBookings = 5;
  const todayBookings = 5;
  const previousBookings = [
    { id: 1, client_name: "Fundi", service_name: "Nails ", date: "2025-09-16", time: "10:00 AM", status: "Confirmed" },
    { id: 2, client_name: "Lintle ", service_name: "Make up ", date: "2025-09-15", time: "11:00 AM", status: "Pending" },
    { id: 3, client_name: "Nomhle", service_name: "Hairstyles", date: "2025-09-14", time: "12:00 PM", status: "Complete" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 pb-20 p-4">
      {/* Header */}
      {/* <header className="flex justify-between items-center mb-6">
        <img src="/src/assets/logo.png" alt="GlamLink Logo" className="h-10" />
        <button className="text-3xl">☰</button>
      </header> */}

      {/* Hero */}
      <div className="bg-pink-500 text-white p-10 rounded-2xl shadow mb-6 text-center w-full">
        <h2 className="text-2xl font-extrabold">{greeting}</h2>
        <p className="mt-2 text-lg">Welcome back, {providerName} 👋</p>
        <p className="mt-3 text-sm opacity-90">
          Manage your bookings and services with ease ✨
        </p>
      </div>

      {/* Stats Grid */}
      <h3 className="text-lg font-bold mb-3">Your Stats</h3>
      <div className="grid grid-cols-2 gap-3 mb-6 w-full">
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{totalServices}</p>
          <p className="text-sm">All Services Offered</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{totalBookings}</p>
          <p className="text-sm">All Bookings</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{todayBookings}</p>
          <p className="text-sm">Bookings Today</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{totalBookings - todayBookings}</p>
          <p className="text-sm">Other Bookings</p>
        </div>
      </div>

      {/* Previous Bookings */}
      <div className="mb-6 w-full"></div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Previous Bookings</h3>
          <button className="text-pink-500 text-sm">See All →</button>
        </div>

        <div className="flex flex-col gap-2">
          {previousBookings.slice(0, 3).map((b) => (
            <Link
              href="/bookings"
              key={b.id}
              className="flex justify-between items-center bg-white p-3 rounded-xl shadow hover:bg-pink-50 transition"
            >
              <div>
                <p className="font-medium">{b.client_name}</p>
                <p className="text-sm text-gray-500">
                  {b.service_name}
                </p>
                <p className="text-xs text-gray-400">
                  {b.date} {b.time}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    b.status?.toLowerCase() === "confirmed" ||
                    b.status?.toLowerCase() === "complete"
                      ? "bg-green-100 text-green-600"
                      : b.status?.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
     
  );
}



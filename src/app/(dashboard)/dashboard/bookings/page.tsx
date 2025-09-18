"use client";
import React, { useState } from "react";


export default function BookingsPage() {
  // Hardcoded bookings data
  const bookings = [
    {
      id: 1,
      service: "Hair Styling",
      client: "Jane Doe",
      date: "2025-09-18 10:00 AM",
      status: "Confirmed",
      price: "350.00",
    },
    {
      id: 2,
      service: "Nail Art",
      client: "Alice Smith",
      date: "2025-09-19 2:30 PM",
      status: "Pending",
      price: "400.00",
    },
    {
      id: 3,
      service: "Makeup",
      client: "Emily Johnson",
      date: "2025-09-20 4:00 PM",
      status: "Rescheduled",
      price: "500.00",
    },
    {
      id: 4,
      service: "Hair Styling",
      client: "Sarah Lee",
      date: "2025-09-21 11:00 AM",
      status: "Pending",
      price: "350.00",
    },
  ];

  // Get unique services
  const services = Array.from(new Set(bookings.map((b) => b.service)));
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Tabs UI for services
  const [selectedTab, setSelectedTab] = useState<string>(services[0] || "");
  const serviceBookings = bookings.filter((b) => b.service === selectedTab);

  // Simple greeting logic (e.g., based on time of day)
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  })();

  return (
    <div className="p-6">
        {/* Greeting */}
      <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">{greeting} Welcome to GlamLink!</h2>
        <p className="text-gray-700">
          View and manage your bookings below.
        </p>
      </div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      {/* Tabs */}
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 mb-4">
        {services.map((service) => (
          <li key={service} className="me-2">
            <button
              onClick={() => setSelectedTab(service)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedTab === service
                  ? "bg-pink-600 text-white"
                  : "bg-pink-100 text-pink-700 hover:bg-pink-200 hover:text-pink-900"
              }`}
            >
              {service}
            </button>
          </li>
        ))}
      </ul>
      {/* Bookings for selected tab */}
      <div className="flex flex-col gap-4">
        {serviceBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-pink-50 transition"
          >
            <div className="flex-1">
              <div className="font-bold text-lg text-pink-600 mb-1">{b.service}</div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Client:</span> {b.client}
              </div>
              <div className="text-gray-500 mb-1">
                <span className="font-medium">Date/Time:</span> {b.date}
              </div>
              <div className="mb-1">
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-sm ${
                  b.status === "Confirmed"
                    ? "bg-green-100 text-green-800"
                    : b.status === "Rescheduled"
                    ? "bg-blue-100 text-blue-800"
                    : b.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {b.status}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-2 md:flex-col md:items-end mt-2 md:mt-0">
              <button
                className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-medium disabled:opacity-50"
                disabled={b.status === "Confirmed" || b.status === "Rescheduled"}
              >
                Confirm
              </button>
              <button
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-medium disabled:opacity-50"
                disabled={b.status === "Confirmed"}
              >
                Reschedule
              </button>
              <button
                className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium disabled:opacity-50"
                disabled={b.status === "Confirmed"}
              >
                Cancel
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 font-medium disabled:opacity-50"
                disabled={!(b.status === "Confirmed" || b.status === "Rescheduled")}
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

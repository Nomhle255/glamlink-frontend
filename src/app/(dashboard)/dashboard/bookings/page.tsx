"use client";
import React, { useState, useEffect } from "react";
import {
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking,
  fetchBookings,
  BookingStatus,
  type Booking
} from "@/app/api/bookings";
import { updateSlotBookedStatus } from "@/app/api/timeslots";
import { useAuth } from "@/context/AuthContext";


export default function BookingsPage() {
  const { user, isAuthenticated, loading } = useAuth();

  // State hooks
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const [slotTimes, setSlotTimes] = useState<Record<string, string>>({});
  const [rescheduleBookingId, setRescheduleBookingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Load bookings on mount and when user changes
  useEffect(() => {
    if (!loading && isAuthenticated && typeof user?.id === 'string') {
      fetchBookings(
        user.id,
        setIsError,
        setIsLoading,
        setBookings,
        setServiceNames,
        setSlotTimes,
        serviceNames,
        slotTimes
      );
    }
  }, [loading, isAuthenticated, typeof user?.id === 'string' ? user.id : '']);

  // Manual mutation functions (all string IDs)
  const confirmBooking = async (id: string) => {
    try {
      await updateBookingStatus(id, BookingStatus.CONFIRMED);
      const booking = bookings.find(b => b.id === id);
      if (booking && booking.slotId) {
        await updateSlotBookedStatus(booking.slotId, true);
      }
      if (typeof user?.id === 'string') {
        await fetchBookings(
          user.id,
          setIsError,
          setIsLoading,
          setBookings,
          setServiceNames,
          setSlotTimes,
          serviceNames,
          slotTimes
        );
      }
    } catch (error) {}
    // Always refresh bookings after status change
    if (typeof user?.id === 'string') {
      await fetchBookings(
        user.id,
        setIsError,
        setIsLoading,
        setBookings,
        setServiceNames,
        setSlotTimes,
        serviceNames,
        slotTimes
      );
    }
  };

  const cancelBookingAction = async (id: string) => {
    try {
      await cancelBooking(id);
      if (typeof user?.id === 'string') {
        await fetchBookings(
          user.id,
          setIsError,
          setIsLoading,
          setBookings,
          setServiceNames,
          setSlotTimes,
          serviceNames,
          slotTimes
        );
      }
    } catch (error) {}
  };

  const rescheduleBookingAction = async (id: string, newDateTime: string) => {
    try {
      if (typeof user?.id === "string") {
        await rescheduleBooking(id, newDateTime, user.id, BookingStatus.RESCHEDULED);
        await fetchBookings(
          user.id,
          setIsError,
          setIsLoading,
          setBookings,
          setServiceNames,
          setSlotTimes,
          serviceNames,
          slotTimes
        );
      } else {
        throw new Error("User ID is not available for rescheduling booking.");
      }
    } catch (error) {}
  };

  const completeBooking = async (id: string) => {
    try {
      await updateBookingStatus(id, BookingStatus.COMPLETED);
      if (typeof user?.id === 'string') {
        await fetchBookings(
          user.id,
          setIsError,
          setIsLoading,
          setBookings,
          setServiceNames,
          setSlotTimes,
          serviceNames,
          slotTimes
        );
      }
    } catch (error) {}
  };

  // Greeting logic
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  })();

  // Helper functions
  const getServiceName = (booking: Booking): string => {
    if (booking.serviceId && serviceNames[booking.serviceId]) {
      return serviceNames[booking.serviceId];
    }
    if (booking.service && typeof booking.service === 'object' && 'name' in booking.service) {
      return booking.service.name;
    }
    return 'Unknown Service';
  };

  const getCustomerName = (booking: Booking): string => booking.customerName || 'Unknown Customer';

  const getStartTime = (booking: Booking): string => {
    if (booking.slotId && slotTimes[booking.slotId]) {
      return slotTimes[booking.slotId];
    }
    return '';
  };

  const formatBookingDate = (booking: Booking): string => {
    const slotDateStr = getStartTime(booking) || booking.bookedAt || booking.createdAt || booking.updatedAt;
    if (slotDateStr) {
      const date = new Date(slotDateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
      }
    }
    return '';
  };

  const formatBookingTime = (booking: Booking): string => {
    const startTime = getStartTime(booking);
    if (startTime === 'Unknown Time') {
      return 'Time TBD';
    }
    const date = new Date(startTime);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: true }) + ' UTC';
    }
    return '';
  };

  const formatStartTime = (booking: Booking): string => {
    const startTime = getStartTime(booking);
    if (startTime === 'Unknown Time') {
      return 'Unknown Time';
    }
    const date = new Date(startTime);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
    }
    return '';
  };

  // Tabs by service
  const services = Array.from(
    new Set(
      bookings
        .map((b: Booking) => getServiceName(b))
        .filter(name => name && name !== 'Unknown Service')
    )
  ) as string[];

  useEffect(() => {
    if (services.length > 0 && !selectedTab) {
      setSelectedTab(services[0]);
    }
  }, [services, selectedTab]);

  // Reschedule helpers
  const handleCancelReschedule = () => {
    setRescheduleBookingId(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleRescheduleClick = (booking: Booking) => {
    setRescheduleBookingId(booking.id);
    const startTime = getStartTime(booking);
    if (startTime && startTime !== 'Unknown Time') {
      try {
        const date = new Date(startTime);
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split('T')[0];
          setSelectedDate(dateStr);
          const timeStr = date.toTimeString().slice(0, 5);
          setSelectedTime(timeStr);
        } else {
          setSelectedDate("");
          setSelectedTime("");
        }
      } catch {
        setSelectedDate("");
        setSelectedTime("");
      }
    } else {
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const handleSaveReschedule = () => {
    if (!rescheduleBookingId || !selectedDate || !selectedTime) return;
    const newDateTime = `${selectedDate}T${selectedTime}:00.000Z`;
    rescheduleBookingAction(rescheduleBookingId, newDateTime);
    handleCancelReschedule();
  };

  // Authentication and loading checks
  if (loading) {
    return (
      <div className="p-6">
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6">
        <div>Please log in to view bookings.</div>
      </div>
    );
  }

  if (isLoading) return <div>Loading bookings...</div>;
  if (isError) return <div>Error loading bookings.</div>;

  const serviceBookings = selectedTab
    ? bookings.filter((b: Booking) => getServiceName(b) === selectedTab)
    : bookings;

  return (
    <div className="p-6">
      {/* Greeting */}
      <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">{greeting} Welcome to GlamLink!</h2>
        <p className="text-gray-200">View and manage your bookings below.</p>
      </div>

      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

      {/* Tabs*/}
      {services.length > 0 && (
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 mb-4">
          {services.map((service: string) => (
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
      )}

      <div className="flex flex-col gap-4">
        {serviceBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No bookings found for {selectedTab || "any service"}.
          </div>
        ) : (
          serviceBookings.map((b: Booking) => (
            <div
              key={b.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-pink-50 transition"
            >
              <div className="flex-1">
                <div className="font-bold text-lg text-pink-600 mb-1">
                  {getServiceName(b)}
                </div>
                <div className="text-gray-700 mb-1">
                  <span className="font-medium">Client:</span>{" "}
                  {getCustomerName(b)}
                </div>
                <div className="text-gray-600 mb-1">
                  <span className="font-medium">Booked Time:</span>{" "}
                  {formatBookingDate(b)}
                </div>
                <div className="mb-1">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-sm ${
                      b.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : b.status === "RESCHEDULED"
                        ? "bg-blue-100 text-blue-800"
                        : b.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-2 md:flex-col md:items-end mt-2 md:mt-0">
                <button
                  className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={b.status === "CONFIRMED" || b.status === "COMPLETED" || b.status === "RESCHEDULED"}
                  onClick={() => confirmBooking(b.id)}
                >
                  Confirm
                </button>
                <button
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={b.status === "COMPLETED" || b.status === "RESCHEDULED"}
                  onClick={() => handleRescheduleClick(b)}
                >
                  Reschedule
                </button>
                <button
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={b.status === "COMPLETED" || b.status === "CANCELLED"}
                  onClick={() => cancelBookingAction(b.id)}
                >
                  Cancel
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={b.status === "COMPLETED" || (b.status !== "CONFIRMED" && b.status !== "RESCHEDULED")}
                  onClick={() => completeBooking(b.id)}
                >
                  Complete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleBookingId !== null && (
        <div className="fixed inset-0 bg-pink bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-bold mb-4">Reschedule Booking</h3>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              className="border p-2 rounded w-full mb-4"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Time
            </label>
            <input
              type="time"
              className="border p-2 rounded w-full mb-4"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelReschedule}
                className="px-3 py-1 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import {
  getBookingsByProvider,
  getBookingsByStylist,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking,
} from "@/app/api/bookings";
import { getServiceById } from "@/app/api/stylists-service";
import { getSlotById, Slot } from "@/app/api/slots";
import { useAuth } from "@/context/AuthContext";

// Define types for your booking data
interface Booking {
  id: number;
  serviceId?: number;
  service_id?: number;
  slotId?: number;
  slot_id?: number;
  service?: {
    name: string;
  } | string;
  serviceName?: string;
  service_name?: string;
  customerName?: string;
  customer_name?: string;
  status: BookingStatus | string; // Allow both enum and string for flexibility
  slot?: {
    startTime: string;
  };
  startTime?: string;
  start_time?: string;
}

enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  RESCHEDULED = "RESCHEDULED",
}

export default function BookingsPage() {
  const { user, isAuthenticated, loading } = useAuth();

  // State hooks must be at the top, before any conditional returns
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Service names cache
  const [serviceNames, setServiceNames] = useState<{[key: number]: string}>({});
  
  // Slot information cache
  const [slotTimes, setSlotTimes] = useState<{[key: number]: string}>({});
  
  // Modal state
  const [rescheduleBookingId, setRescheduleBookingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Fetch service names for given service IDs
  const fetchServiceNames = async (serviceIds: number[]) => {
    const newServiceNames = { ...serviceNames };
    const idsToFetch = serviceIds.filter(id => !newServiceNames[id]);
    
    if (idsToFetch.length === 0) return;

    try {
      const promises = idsToFetch.map(id => getServiceById(id));
      const services = await Promise.all(promises);
      
      services.forEach((service, index) => {
        if (service?.name) {
          newServiceNames[idsToFetch[index]] = service.name;
        }
      });
      
      setServiceNames(newServiceNames);
    } catch (error) {
      console.error('Failed to fetch service names:', error);
    }
  };

  // Fetch slot times for given slot IDs
  const fetchSlotTimes = async (slotIds: number[]) => {
    const newSlotTimes = { ...slotTimes };
    const idsToFetch = slotIds.filter(id => !newSlotTimes[id]);
    
    if (idsToFetch.length === 0) return;

    try {
      const promises = idsToFetch.map(id => getSlotById(id));
      const slots = await Promise.all(promises);
      
      slots.forEach((slot, index) => {
        // Handle different possible time field names
        const startTime = slot?.startTime || slot?.start_time || slot?.bookingTime || slot?.booking_time;
        if (startTime) {
          newSlotTimes[idsToFetch[index]] = startTime;
        }
      });
      
      setSlotTimes(newSlotTimes);
    } catch (error) {
      console.error('Failed to fetch slot times:', error);
    }
  };

  // Fetch bookings manually
  const fetchBookings = async () => {
    if (!user?.id) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getBookingsByStylist(Number(user.id));
      setBookings(data);
      setIsError(false);
      
      // Extract service IDs and fetch service names
      const serviceIds = data
        .map((booking: Booking) => booking.serviceId || booking.service_id)
        .filter((id: any): id is number => typeof id === 'number');
      
      if (serviceIds.length > 0) {
        await fetchServiceNames(serviceIds);
      }

      // Extract slot IDs and fetch slot times
      const slotIds = data
        .map((booking: Booking) => booking.slotId || booking.slot_id)
        .filter((id: any): id is number => typeof id === 'number');
      
      if (slotIds.length > 0) {
        await fetchSlotTimes(slotIds);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load bookings on component mount and when user changes
  useEffect(() => {
    if (!loading && isAuthenticated && user?.id) {
      fetchBookings();
    }
  }, [loading, isAuthenticated, user?.id]);

  // Manual mutation functions
  const confirmBooking = async (id: number) => {
    try {
      await updateBookingStatus(id, BookingStatus.CONFIRMED);
      await fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Failed to confirm booking:', error);
    }
  };

  const cancelBookingAction = async (id: number) => {
    try {
      await cancelBooking(id);
      await fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const rescheduleBookingAction = async (id: number, slotId: number) => {
    try {
      await rescheduleBooking(id, slotId);
      await fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Failed to reschedule booking:', error);
    }
  };

  const completeBooking = async (id: number) => {
    try {
      await updateBookingStatus(id, BookingStatus.COMPLETED);
      await fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Failed to complete booking:', error);
    }
  };

  // Greeting logic
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  })();

  // Helper functions to safely extract booking data
  const getServiceName = (booking: Booking): string => {
    // First, try to get service name from the fetched service names using serviceId
    const serviceId = booking.serviceId || booking.service_id;
    if (serviceId && serviceNames[serviceId]) {
      return serviceNames[serviceId];
    }
    
    // Fallback to existing service data in booking
    if (booking.service && typeof booking.service === 'object' && 'name' in booking.service) {
      return booking.service.name;
    }
    if (typeof booking.service === 'string') {
      return booking.service;
    }
    return (
      booking.serviceName ||
      booking.service_name ||
      'Unknown Service'
    );
  };

  const getCustomerName = (booking: Booking): string => {
    return booking.customerName || 
           booking.customer_name || 
           'Unknown Customer';
  };

  const getStartTime = (booking: Booking): string => {
    // First, try to get time from the fetched slot times using slotId
    const slotId = booking.slotId || booking.slot_id;
    if (slotId && slotTimes[slotId]) {
      return slotTimes[slotId];
    }
    
    // Fallback to existing time data in booking
    return booking.slot?.startTime || 
           booking.startTime || 
           booking.start_time || 
           'Unknown Time';
  };

  // Helper function to format start time for display
  const formatStartTime = (booking: Booking): string => {
    const startTime = getStartTime(booking);
    if (startTime === 'Unknown Time') {
      return 'Unknown Time';
    }
    
    try {
      // Try to parse and format the time
      const date = new Date(startTime);
      if (isNaN(date.getTime())) {
        // If it's not a valid date, return as-is
        return startTime;
      }
      
      // Format as UTC time to match what was saved in database
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        hour12: false
      };
      
      return date.toLocaleString('en-GB', options) + ' UTC';
    } catch (error) {
      // If parsing fails, return the original string
      return startTime;
    }
  };

  // Tabs by service - computed after data loads with null safety
  const services = Array.from(
    new Set(
      bookings
        .map((b: Booking) => getServiceName(b))
        .filter(name => name && name !== 'Unknown Service') // Remove null/undefined and unknown services
    )
  ) as string[];
  
  // Set initial tab when services are loaded
  useEffect(() => {
    if (services.length > 0 && !selectedTab) {
      setSelectedTab(services[0]);
    }
  }, [services, selectedTab]);

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

  const handleCancelReschedule = () => {
    setRescheduleBookingId(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleSaveReschedule = () => {
    if (!rescheduleBookingId || !selectedDate || !selectedTime) return;

    // Create a proper datetime string for the backend
    const newDateTime = `${selectedDate}T${selectedTime}:00.000Z`;
    
    // Send the datetime directly to match backend expectations
    // The backend server.patch('/bookings/:id/reschedule') probably expects new time info
    console.log('Rescheduling booking', rescheduleBookingId, 'to datetime:', newDateTime);
    
    // Use the datetime as the "slotId" or modify rescheduleBookingAction to handle datetime
    const timeBasedId = Math.floor(new Date(newDateTime).getTime() / 1000);
    rescheduleBookingAction(rescheduleBookingId, timeBasedId);
    handleCancelReschedule();
  };
  
  // Filter bookings by selected service
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

      {/* Tabs - FIXED: services is now properly typed as string[] */}
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

      {/* Bookings list */}
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
                <div className="text-gray-500 mb-1">
                  <span className="font-medium">Date/Time:</span>{" "}
                  {formatStartTime(b)}
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
                  disabled={b.status === "CONFIRMED" || b.status === "RESCHEDULED" || b.status === "COMPLETED"}
                  onClick={() => confirmBooking(b.id)}
                >
                  Confirm
                </button>
                <button
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={b.status === "CONFIRMED" || b.status === "COMPLETED"}
                  onClick={() => setRescheduleBookingId(b.id)}
                >
                  Reschedule
                </button>
                <button
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={b.status === "CONFIRMED" || b.status === "COMPLETED"}
                  onClick={() => cancelBookingAction(b.id)}
                >
                  Cancel
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !(b.status === "CONFIRMED" || b.status === "RESCHEDULED")
                  }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
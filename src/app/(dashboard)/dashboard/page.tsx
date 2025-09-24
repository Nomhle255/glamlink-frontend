"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { getCurrentUser, getCurrentStylistId } from "@/app/api/auth";
import { useBookings } from "@/hooks/use-bookings";
import { useStylistsServices, useAllServices } from "@/hooks/use-stylists-service";
import { getSlotById } from "@/app/api/timeslots";

export default function page() {
  // Hydration-safe user and providerName
  const [providerName, setProviderName] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [mappedBookings, setMappedBookings] = useState<any[]>([]);

  // Only access localStorage/user on client
  useEffect(() => {
    setIsClient(true);
    const user = getCurrentUser();
    setProviderName(user?.name || "Service Provider");
  }, []);

  const stylistId = typeof window !== 'undefined' ? getCurrentStylistId() : null;
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings(stylistId || 0);
  const { data: stylistServices = [], isLoading: servicesLoading } = useStylistsServices(stylistId || 0);
  const { data: allServices = [], isLoading: allServicesLoading } = useAllServices();

  // Map serviceId to service name for bookings and fetch slot start time
  useEffect(() => {
    const fetchSlotsAndMap = async () => {
      if (!servicesLoading && !allServicesLoading && !bookingsLoading && Array.isArray(bookings) && Array.isArray(stylistServices) && Array.isArray(allServices)) {
        const slotPromises = bookings.map(async (b: any) => {
          let slotDate = undefined;
          if (b.slotId || b.slot_id) {
            try {
              const slot = await getSlotById(Number(b.slotId || b.slot_id));
              slotDate = slot.startTime || slot.start_time || slot.date;
            } catch (e) {
              
            }
          }
          const stylistService = stylistServices.find((s: any) => Number((s as any).serviceId ?? (s as any).service_id) === Number(b.serviceId ?? b.service_id));
          const mainServiceId = stylistService ? (stylistService as any).serviceId ?? (stylistService as any).service_id : b.serviceId ?? b.service_id;
          const service = allServices.find((s: any) => Number(s.id) === Number(mainServiceId));
          const date = b.date || b.bookingDate || slotDate;
          return {
            ...b,
            serviceDisplayName: service ? service.name : '',
            slotDate,
            date,
            bookingDate: b.bookingDate || b.date || slotDate,
            dateField: date ? new Date(date).toISOString().split('T')[0] : undefined,
          };
        });
        const mapped = await Promise.all(slotPromises);
        setMappedBookings(mapped);
      }
    };
    fetchSlotsAndMap();
  }, [bookings, stylistServices, allServices, bookingsLoading, servicesLoading, allServicesLoading]);

  // Calculate stats
  const totalServices = stylistServices.length;
  const totalBookings = bookings.length;
  const today = new Date().toISOString().slice(0, 10); 
  const todayBookings = bookings.filter((b: any) => (b.date || b.bookingDate || '').slice(0, 10) === today).length;
  // ---
  let previousBookings = mappedBookings
    .filter((b: any) => (b.slotDate || b.date || b.bookingDate || '').slice(0, 10) < today)
    .sort((a: any, b: any) => ((b.slotDate || b.date || b.bookingDate || '').localeCompare(a.slotDate || a.date || a.bookingDate || '')));
  // If all bookings have no date, show all as previous (no warning or fallback message)
  if (previousBookings.length === 0 && mappedBookings.length > 0 && mappedBookings.every(b => !b.slotDate && !b.date && !b.bookingDate)) {
    previousBookings = mappedBookings;
  }
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 pb-20 p-4">
  <div className="bg-pink-500 text-white p-10 rounded-2xl shadow mb-6 text-center w-full">
    <p className="mt-2 text-lg">
      {isClient ? (
        <>Welcome back, {providerName} 👋</>
      ) : (
        <span>&nbsp;</span>
      )}
    </p>
    <p className="mt-3 text-sm opacity-90">
      Manage your bookings and services with ease ✨
    </p>
  </div>
      {/* --- */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
      <p className="text-2xl font-bold">{servicesLoading ? '...' : totalServices}</p>
      <p className="text-sm">All Services Offered</p>
    </div>
    <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
      <p className="text-2xl font-bold">{bookingsLoading ? '...' : totalBookings}</p>
      <p className="text-sm">All Bookings</p>
    </div>
    <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
      <p className="text-2xl font-bold">{bookingsLoading ? '...' : todayBookings}</p>
      <p className="text-sm">Bookings Today</p>
    </div>
    <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
      <p className="text-2xl font-bold">{bookingsLoading ? '...' : totalBookings - todayBookings}</p>
      <p className="text-sm">Other Bookings</p>
    </div>
  </div>

      {/* Previous Bookings */}
      <div className="mb-6 w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Previous Bookings</h3>
        </div>

        <div className="flex flex-col gap-2">
          {bookingsLoading ? (
            <p>Loading...</p>
          ) : previousBookings.length === 0 ? (
            <p className="text-gray-500">No previous bookings found.</p>
          ) : previousBookings.slice(0, 3).map((b: any) => (
            <Link
              href="/bookings"
              key={b.id}
              className="flex justify-between items-center bg-white p-3 rounded-xl shadow hover:bg-pink-50 transition"
            >
              <div>
                <p className="font-medium">{b.customerName || b.customer_name || b.client_name || 'Client'}</p>
                <p className="text-sm text-gray-500">
                  Service: {b.serviceDisplayName}
                </p>
                <p className="text-xs text-gray-400">
                  {(b.slotDate || b.date || b.bookingDate || '').slice(0, 10)} {b.time || ''}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    (b.status || '').toLowerCase() === "confirmed" ||
                    (b.status || '').toLowerCase() === "complete"
                      ? "bg-green-100 text-green-600"
                      : (b.status || '').toLowerCase() === "pending"
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
    </div>
  );
}



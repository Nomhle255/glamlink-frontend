"use client";

import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventClickArg, EventContentArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createTimeSlot, getTimeSlotsByStylist, Slot } from "@/app/api/timeslots";
import { useAuth } from "@/context/AuthContext";
import { getCurrentStylistId } from "@/app/api/auth";

export default function Page() {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, loading } = useAuth();
  const [events, setEvents] = useState<EventInput[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [desc, setDesc] = useState<string>("Available");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Load existing time slots when component mounts
  useEffect(() => {
    if (!loading && isAuthenticated && user?.id) {
      loadTimeSlots();
    }
  }, [loading, isAuthenticated, user?.id]);

  const loadTimeSlots = async () => {
    try {
      setIsLoading(true);
      // Always use stylistId as string
      const stylistId = String(user?.id);
      const slots = await getTimeSlotsByStylist(stylistId);
      // Convert slots to calendar events, handle both camelCase and snake_case
      const calendarEvents: EventInput[] = slots.map((slot: Slot) => {
        // Prefer camelCase, fallback to snake_case
        const start = slot.startTime || slot.start_time || slot.bookingTime || '';
        const end = slot.endTime || slot.end_time || slot.bookingTime || start;
        return {
          id: String(slot.id),
          title: slot.isBooked ? "Booked" : "Available",
          start,
          end,
          allDay: false,
        };
      });
      setEvents(calendarEvents);
    } catch (err: any) {
      setError(`Failed to load time slots: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // When user selects a day

  // Mobile: open modal directly from button
  const handleMobileAddClick = () => {
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
    setDesc("Available");
    setModalOpen(true);
  };
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr);
    setStartTime("");
    setEndTime("");
    setDesc("Available");
    setModalOpen(true);
  };

  // For mobile: handle dateClick
  const handleDateClick = (clickInfo: any) => {
    setSelectedDate(clickInfo.dateStr);
    setStartTime("");
    setEndTime("");
    setDesc("Available");
    setModalOpen(true);
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !startTime || !endTime) return;

    try {
      setIsLoading(true);
      setError("");
      // Get the current stylist ID for the API call
      const stylistId = getCurrentStylistId();
      if (!stylistId) {
        setError('No stylist ID available. Please log in again.');
        return;
      }
      const slotData = {
        startTime,
        endTime,
        date: selectedDate,
        stylistId: stylistId
      };
      await createTimeSlot(slotData);
      // Instead of just adding the new event, reload all slots from backend
      await loadTimeSlots();
      setMessage("Time slot added successfully!");
      setModalOpen(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // When user clicks an event, allow deletion
  const handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Remove this availability?`)) {
      setEvents((prev) => prev.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  // Custom event rendering
  const renderEventContent = (eventInfo: EventContentArg) => (
    <div>
      <b>{eventInfo.timeText}</b> <span>{eventInfo.event.title}</span>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="text-center py-8">
          <p className="text-red-600">Please log in to manage your availability.</p>
        </div>
      </div>
    );
  }

  return (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 relative">
      <h2 className="text-xl font-bold mb-4 text-pink-600">Set Your Weekly Availability</h2>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
          <button 
            onClick={() => setError("")}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>{message}</p>
        </div>
      )}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: isMobile ? "timeGridDay" : "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable={true}
        select={isMobile ? undefined : handleDateSelect}
        dateClick={isMobile ? handleDateClick : undefined}
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height={isMobile ? "auto" : "auto"}
        timeZone="UTC"
      />
      <p className="mt-4 text-gray-500 text-sm">
        {isMobile
          ? "Tap a day or use the button below to add a timeslot. Tap an event to remove it."
          : "Click a day to set your available hours. Click an event to remove it."}
      </p>


      {/* Modal for setting hours */}
      {modalOpen && (
        <div className="absolute left-1/2 top-16 z-50 transform -translate-x-1/2 w-full max-w-md">
          <form
            onSubmit={handleAddAvailability}
            className="bg-pink-100 p-6 rounded shadow-lg flex flex-col gap-4 w-full"
            style={{ borderRadius: '1.5rem' }}
          >
            <h3 className="text-lg font-bold text-pink-600 mb-2">Set Available Hours</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} placeholder="YYYY-MM-DD" className="w-full border p-2 rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-pink-500 hover:bg-pink-600'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
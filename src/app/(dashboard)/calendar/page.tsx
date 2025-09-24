"use client";

import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventClickArg, EventContentArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createTimeSlot, getTimeSlotsByStylist, Slot } from "@/app/api/timeslots";
import { useAuth } from "@/context/AuthContext";
import { getCurrentStylistId } from "@/app/api/auth";

export default function Page() {
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
      // Use the getCurrentStylistId to get the correct ID for API calls
      const slots = await getTimeSlotsByStylist();
      // Convert slots to calendar events
      const calendarEvents: EventInput[] = slots.map((slot: Slot) => ({
        id: slot.id.toString(),
        title: slot.isBooked ? "Booked" : "Available",
        start: slot.startTime,
        end: slot.startTime, // If you have endTime, use it here; otherwise, use startTime for single-point events
        allDay: false,
      }));
      setEvents(calendarEvents);
    } catch (err: any) {
      setError(`Failed to load time slots: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // When user selects a day
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr);
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

      const newSlot = await createTimeSlot(slotData);
      
      // Add to calendar events
      const newEvent: EventInput = {
        id: newSlot.id.toString(),
        title: "Available",
        start: `${selectedDate}T${startTime}`,
        end: `${selectedDate}T${endTime}`,
        allDay: false,
      };
      
      setEvents((prev) => [...prev, newEvent]);
      setMessage("Time slot added successfully!");
      setModalOpen(false);
      
      // Clear message after 3 seconds
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
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
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable={true}
        select={handleDateSelect}
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
        timeZone="UTC"
      />
      <p className="mt-4 text-gray-500 text-sm">
        Click a day to set your available hours. Click an event to remove it.
      </p>

      {/* Modal for setting hours */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <form onSubmit={handleAddAvailability} className="bg-white p-6 rounded shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h3 className="text-lg font-bold text-pink-600 mb-2">Set Available Hours</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="text" value={selectedDate} disabled className="w-full border p-2 rounded bg-gray-100" />
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
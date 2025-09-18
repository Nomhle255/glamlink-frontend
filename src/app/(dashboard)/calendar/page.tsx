"use client";


import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventClickArg, EventContentArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Page() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [desc, setDesc] = useState<string>("Available");

  // When user selects a day
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr);
    setStartTime("");
    setEndTime("");
    setDesc("Available");
    setModalOpen(true);
  };

  const handleAddAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !startTime || !endTime) return;
    const start = `${selectedDate}T${startTime}`;
    const end = `${selectedDate}T${endTime}`;
    setEvents((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: desc,
        start,
        end,
        allDay: false,
      },
    ]);
    setModalOpen(false);
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-bold mb-4 text-pink-600">Set Your Weekly Availability</h2>
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
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600">Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
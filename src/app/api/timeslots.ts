// Update slot's booked status (is_available)
export const updateSlotBookedStatus = async (slotId: number, isBooked: boolean): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  try {
    await axios.patch(
      `${API_URL}/timeslots/${slotId}`,
      { is_available: !isBooked }, // If booked, set is_available to false
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update slot status');
  }
};
import axios from "axios";
import { getCurrentStylistId } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080" as string;

// Interface for slot data (simplified - start_time only)
export interface Slot {
  id: number;
  startTime?: string;  // Frontend prefers camelCase
  start_time?: string; // Backend returns snake_case
  date?: string;
  isAvailable?: boolean;
  stylistId?: number;
  createdAt?: string;
  [key: string]: any; // Allow for additional backend fields
}

// Interface for creating new time slots
export interface CreateSlotData {
  startTime: string;
  endTime: string;
  date: string;
  stylistId: number;
}

// Get slot by ID (start_time only)
// 🔄 UPDATED: Now only retrieving start_time to avoid backend schema issues
// Previous issue: end_time field doesn't exist in database
// Solution: Frontend only uses start_time from slot data
export const getSlotById = async (id: number): Promise<Slot> => {
  const token = localStorage.getItem('token');
  
  try {
    // Use the working timeslots endpoint directly
    const res = await axios.get(`${API_URL}/timeslots/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

// Get all available slots for a stylist
export const getAvailableSlots = async (stylistId: number): Promise<Slot[]> => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/slots?stylistId=${stylistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
};

// Create a new time slot
export const createTimeSlot = async (slotData: CreateSlotData): Promise<Slot> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Use the current logged-in stylist ID if not provided
  const stylistId = slotData.stylistId || getCurrentStylistId();
  if (!stylistId) {
    throw new Error('No stylist ID available. Please log in again.');
  }

  // Clean the date to be just YYYY-MM-DD format
  const cleanDate = slotData.date.split('T')[0]; // Remove time portion if present
  
  // Create datetime strings that the backend expects
  const startDateTime = `${cleanDate}T${slotData.startTime}:00`;
  const endDateTime = `${cleanDate}T${slotData.endTime}:00`;

  const requestData = {
    provider_id: stylistId,
    datetime: startDateTime, // Backend expects 'datetime' field
    start_time: slotData.startTime,
    end_time: slotData.endTime,
    date: cleanDate, // Clean date format YYYY-MM-DD
    is_available: true
  };

  try {
    const res = await axios.post(`${API_URL}/timeslots`, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.response?.status === 400) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error || JSON.stringify(error.response?.data);
      throw new Error(`Backend validation failed: ${backendMessage}. Sent data: ${JSON.stringify(requestData)}`);
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to create time slot');
  }
};

// Get all time slots for a stylist
export const getTimeSlotsByStylist = async (providedStylistId?: number): Promise<Slot[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Use the provided stylist ID or get the current logged-in stylist ID
  const stylistId = providedStylistId || getCurrentStylistId();
  if (!stylistId) {
    throw new Error('No stylist ID available. Please log in again.');
  }

  try {
    // Use the correct endpoint format: /timeslots/provider/:provider_id
    const res = await axios.get(`${API_URL}/timeslots/provider/${stylistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.response?.status === 404) {
      throw new Error('No time slots found for this stylist');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch time slots');
  }
};
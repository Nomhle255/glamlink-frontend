// Fetch slot times for given slot IDs
export const fetchSlotTimes = async (
  slotIds: string[],
  slotTimes: { [key: string]: string },
  setSlotTimes: (times: { [key: string]: string }) => void
) => {
  const newSlotTimes = { ...slotTimes };
  const idsToFetch = slotIds.filter((id) => !newSlotTimes[id]);
  if (idsToFetch.length === 0) return;
  try {
    const promises = idsToFetch.map((id) => getSlotById(id));
    const slots = await Promise.all(promises);
    slots.forEach((slot, index) => {
      const startTime = slot?.startTime || slot?.start_time || slot?.bookingTime || slot?.booking_time;
      if (startTime) {
        newSlotTimes[idsToFetch[index]] = startTime;
      }
    });
    setSlotTimes(newSlotTimes);
  } catch (error) {
    console.error('Failed to fetch slot times', error);
  }
};
import axios from "axios";
import { getCurrentStylistId } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080" as string;

export interface Slot {
  id: string;
  startTime?: string;  
  start_time?: string; 
  endTime?: string;
  end_time?: string;
  date?: string;
  isAvailable?: boolean;
  stylistId?: string;
  createdAt?: string;
  [key: string]: any; 
}

export interface CreateSlotData {
  startTime: string;
  endTime: string;
  date: string;
  stylistId: string;
}
export const updateSlotBookedStatus = async (slotId: string, isBooked: boolean): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  try {
    await axios.patch(
      `${API_URL}/timeslots/${slotId}/status`,
      { status: isBooked }, 
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
export const getSlotById = async (id: string): Promise<Slot> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  try {
    const res = await axios.get(`${API_URL}/timeslots/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch slot');
  }
};

export const getAvailableSlots = async (stylistId: string): Promise<Slot[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  const res = await axios.get(`${API_URL}/slots?stylistId=${stylistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
};

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
  
  // Create datetime strings WITHOUT timezone suffix to preserve local time
  const startDateTime = `${cleanDate}T${slotData.startTime}:00`;
  const endDateTime = `${cleanDate}T${slotData.endTime}:00`;

  const requestData = {
    provider_id: stylistId,
    datetime: startDateTime, 
    start_time: slotData.startTime,
    end_time: slotData.endTime, 
    date: cleanDate, 
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

export const getTimeSlotsByStylist = async (providedStylistId?: string): Promise<Slot[]> => {
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
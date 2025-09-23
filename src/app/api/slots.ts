import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080" as string;

// Interface for slot data
export interface Slot {
  startTime: string | undefined;
  id: number;
  start_time?: string;
  bookingTime?: string;
  booking_time?: string;
  endTime?: string;
  end_time?: string;
  isAvailable?: boolean;
  is_available?: boolean;
  isBooked?: boolean;
  is_booked?: boolean;
  date?: string;
  stylistId?: number;
  stylist_id?: number;
  createdAt?: string;
  created_at?: string;
}

// Get slot by ID
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
    console.error(`Failed to fetch slot ${id}:`, error.response?.data || error.message);
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
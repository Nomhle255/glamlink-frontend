// lib/api/bookings.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080" as string;
enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  RESCHEDULED = "RESCHEDULED",
}
export const createBooking = async (data: {
  providerId: number;
  bookingNumber: string;
  customerId: number;
  stylistId: number;
  serviceId: number;
  slotId: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "RESCHEDULED";
  customerName: string;
  customerPhone: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/bookings`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
};

export const getBookingsByProvider = async (providerId: number) => {
  const res = await axios.get(`${API_URL}/bookings/provider/${providerId}`);
  return res.data;
};

export const getBookingsByStylist = async (stylistId: number) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/bookings/provider/${stylistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
};

export const getBookingById = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/bookings/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
};

export const updateBookingStatus = async (id: number, status: BookingStatus) => {
  const token = localStorage.getItem('token');
  
  try {
    // Use the backend's expected PATCH method with request body
    const res = await axios({
      method: 'PATCH',
      url: `${API_URL}/bookings/${id}/status`,
      data: { status },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Failed to update booking status:', error);
    
    // If CORS blocks the request, the error will be ERR_NETWORK
    if (error.code === 'ERR_NETWORK') {
      throw new Error('CORS error: Backend must allow PATCH method in Access-Control-Allow-Methods');
    }
    
    // If it's a 500 error, the backend has an internal issue
    if (error.response?.status === 500) {
      throw new Error('Backend server error: Unable to update booking status');
    }
    
    // If it's a 404, the endpoint doesn't exist
    if (error.response?.status === 404) {
      throw new Error('Endpoint not found: Backend may not support status updates');
    }
    
    throw error;
  }
};

export const rescheduleBooking = async (id: number, slotId: number) => {
  const token = localStorage.getItem('token');
  
  // Convert the timestamp back to a proper datetime for the backend
  const newDateTime = new Date(slotId * 1000).toISOString();
  
  console.log('🔄 Attempting to reschedule booking:', {
    bookingId: id,
    originalSlotId: slotId,
    newDateTime: newDateTime,
    endpoint: `${API_URL}/bookings/${id}/reschedule`
  });
  
  try {
    // Try the simplest approach first - just the booking time
    console.log('📅 Trying with bookingTime field...');
    const res = await axios.patch(`${API_URL}/bookings/${id}/reschedule`, { 
      bookingTime: newDateTime
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Reschedule successful with bookingTime!');
    return res.data;
  } catch (error: any) {
    console.log('❌ bookingTime approach failed:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 500) {
      try {
        // Try with multiple datetime fields
        console.log('📅 Trying with multiple datetime fields...');
        const res = await axios.patch(`${API_URL}/bookings/${id}/reschedule`, { 
          newDateTime: newDateTime,
          newBookingTime: newDateTime,
          startTime: newDateTime,
          slot_time: newDateTime
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log('✅ Reschedule successful with multiple fields!');
        return res.data;
      } catch (secondError: any) {
        console.log('❌ Multiple datetime fields failed:', secondError.response?.status, secondError.response?.data);
        
        try {
          // Try with minimal data - just a simple update
          console.log('📅 Trying minimal approach...');
          const res = await axios.patch(`${API_URL}/bookings/${id}/reschedule`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          console.log('✅ Reschedule successful with minimal data!');
          return res.data;
        } catch (thirdError: any) {
          console.log('❌ All approaches failed. Backend error details:', {
            status: thirdError.response?.status,
            data: thirdError.response?.data,
            message: thirdError.message
          });
          throw new Error('Backend reschedule endpoint is not working properly. This needs to be fixed on the server side.');
        }
      }
    }
    
    // Handle other error types
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection and try again.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Reschedule endpoint not found. This feature may not be available.');
    }
    
    if (error.response?.status === 400) {
      throw new Error('Invalid request: The selected time slot may not be available.');
    }
    
    throw error;
  }
};

export const cancelBooking = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API_URL}/bookings/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
};
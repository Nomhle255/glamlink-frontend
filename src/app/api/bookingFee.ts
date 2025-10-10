import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function saveBookingFee(
  stylistId: string,
  bookingFee: number | null
) {
  const res = await fetch(`${API_URL}/stylist-booking-fee`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ stylistId, bookingFeePercent: bookingFee }),
  });
  if (!res.ok) throw new Error("Failed to save booking fee");
  return res.json();
}

export async function fetchStylistBookingFee(stylistId: string) {
  const res = await fetch(`${API_URL}/stylist-booking-fee/${stylistId}`, {
    headers: getAuthHeaders(),
  });
  if (res.status === 404) {
    // No booking fee found - return null instead of throwing
    return { bookingFeePercent: null };
  }
  if (!res.ok) throw new Error("Failed to fetch booking fee");
  return res.json();
}

export async function updateStylistBookingFee(
  stylistId: string,
  bookingFee: number | null
) {
  const res = await fetch(`${API_URL}/stylist-booking-fee`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ stylistId, bookingFeePercent: bookingFee }),
  });
  if (!res.ok) throw new Error("Failed to update booking fee");
  return res.json();
}

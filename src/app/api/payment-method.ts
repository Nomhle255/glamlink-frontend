import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function savePaymentMethod(userId: number, methodName: string) {
  // Save payment method for stylist using backend endpoint
  return axios.post(`${API_URL}/stylist-payment-methods`, {
    stylistId: userId,
    methodName,
  });
}

export async function fetchAllPaymentMethods() {
  const res = await axios.get(`${API_URL}/payment-methods`);
  return res.data;
}

export async function fetchStylistPaymentMethods(stylistId: number) {
  // Use the correct backend route for stylist payment methods
  const res = await axios.get(`${API_URL}/stylist-payment-methods/${stylistId}`);
  return res.data;
}

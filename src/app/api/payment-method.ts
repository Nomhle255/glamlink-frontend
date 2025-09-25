import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function savePaymentMethod(stylistId: number, methodName: string, accountNumber: string) {
  const res = await axios.post(`${API_URL}/stylist-payment-method`, {
    stylistId,
    methodName,
    accountNumber,
  });
  return res.data;
}
export async function fetchStylistPaymentMethods(stylistId: number) {
  const res = await axios.get(`${API_URL}/stylist-payment-method/${stylistId}`);
  return res.data;
}
export async function EditPaymentMethod(id: number, methodName: string, accountNumber: string) {
  const res = await axios.put(`${API_URL}/stylist-payment-method/${id}`, {
    methodName,
    accountNumber,
  });
  return res.data;
}
export async function deletePaymentMethod(id: number) {
  const res = await axios.delete(`${API_URL}/stylist-payment-method/${id}`);
  return res.data;
}
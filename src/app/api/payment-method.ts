import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function savePaymentMethod(
  stylistId: string,
  methodName: string,
  accountNumber: string
) {
  if (typeof stylistId !== "string")
    throw new Error("stylistId must be a string");
  const res = await axios.post(`${API_URL}/stylist-payment-method`, {
    stylistId,
    methodName,
    accountNumber,
  });
  return res.data;
}

export async function fetchStylistPaymentMethods(stylistId: string) {
  if (typeof stylistId !== "string")
    throw new Error("stylistId must be a string");
  const res = await axios.get(`${API_URL}/stylist-payment-method/${stylistId}`);
  return res.data;
}

export async function EditPaymentMethod(
  id: string,
  methodName: string,
  accountNumber: string
) {
  if (typeof id !== "string") throw new Error("id must be a string");
  const res = await axios.put(`${API_URL}/stylist-payment-method/${id}`, {
    methodName,
    accountNumber,
  });
  return res.data;
}

export async function deletePaymentMethod(id: string) {
  if (typeof id !== "string") throw new Error("id must be a string");
  const res = await axios.delete(`${API_URL}/stylist-payment-method/${id}`);
  return res.data;
}

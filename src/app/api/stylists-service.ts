import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080" as string;

// Create axios instance with automatic auth headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// TypeScript interfaces
export interface Service {
  id: number;
  name: string;
  price: number;
  description?: string;
  duration?: number;
}

export const addServiceToStylist = async (data: {
  stylistId: number;
  serviceId: number;
  price?: number;
  duration?: number;
}) => {
  const res = await apiClient.post(`/stylist-services`, {
    stylistId: data.stylistId,
    serviceId: data.serviceId,
    price: data.price,
    duration: data.duration
  });
  return res.data;
};

// Get all available services from database
export const getServices = async (): Promise<Service[]> => {
  const res = await apiClient.get(`/services`);
  return res.data;
};

// Get services for a specific stylist from database
export const getServicesForStylist = async (stylistId: number): Promise<Service[]> => {
  const res = await apiClient.get(`/stylist-services?stylist_id=${stylistId}`);
  
  // Filter on frontend to ensure we only get the correct stylist's services
  const filteredData = Array.isArray(res.data) 
    ? res.data.filter((item: any) => 
        item.stylistId === stylistId || 
        item.stylist_id === stylistId
      )
    : [];
  
  return filteredData;
};

// Get service by ID from database
export const getServiceById = async (id: number): Promise<Service> => {
  const res = await apiClient.get(`/services/${id}`);
  return res.data;
};

// Update service in database
export const updateService = async (id: number, data: { name?: string; description?: string; price?: number }): Promise<Service> => {
  const res = await apiClient.put(`/stylist-services/${id}`, data);
  return res.data;
};

// Update stylist service (price, duration, etc.)
export const updateStylistService = async (id: number, data: { serviceId?: number; price?: number; duration?: number }) => {
  const res = await apiClient.put(`/stylist-services/${id}`, data);
  return res.data;
};

// Delete service from stylist
export const removeServiceFromStylist = async (stylistId: number, serviceId: number) => {
  const res = await apiClient.delete(`/stylist-services`, {
    data: { 
      stylistId: stylistId,
      serviceId: serviceId
    }
  });
  return res.data;
};

// Delete stylist service by record ID
export const deleteStylistService = async (id: number) => {
  const res = await apiClient.delete(`/stylist-services/${id}`);
  return res.data;
};



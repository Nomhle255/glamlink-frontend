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
  id: string;
  name: string;
  price: number;
  description?: string;
  duration?: number;
}

export const addServiceToStylist = async (data: {
  stylistId: string;
  serviceId: string;
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
export const getServicesForStylist = async (stylistId: string): Promise<Service[]> => {
  const res = await apiClient.get(`/stylist-services?stylist_id=${stylistId}`);
  // Filter on frontend to ensure we only get the correct stylist's services
  const filteredData = Array.isArray(res.data) 
    ? res.data.filter((item: any) => 
        String(item.stylistId) === stylistId || 
        String(item.stylist_id) === stylistId
      )
    : [];
  return filteredData;
};

// Get service by ID from database
export const getServiceById = async (id: string): Promise<Service> => {
  const res = await apiClient.get(`/services/${id}`);
  return res.data;
};

// Update service in database
export const updateService = async (id: string, data: { name?: string; description?: string; price?: number }): Promise<Service> => {
  const res = await apiClient.put(`/stylist-services/${id}`, data);
  return res.data;
};

// Update stylist service (price, duration, etc.)
export const updateStylistService = async (id: string, data: { serviceId?: string; price?: number; duration?: number }) => {
  const res = await apiClient.put(`/stylist-services/${id}`, data);
  return res.data;
};

// Delete service from stylist
export const removeServiceFromStylist = async (stylistId: string, serviceId: string) => {
  const res = await apiClient.delete(`/stylist-services`, {
    data: { 
      stylistId: stylistId,
      serviceId: serviceId
    }
  });
  return res.data;
};

// Delete stylist service by record ID
export const deleteStylistService = async (id: string) => {
  const res = await apiClient.delete(`/stylist-services/${id}`);
  return res.data;
};

// Create a new service and add it to stylist
export const createServiceAndAddToStylist = async (data: {
  stylistId: string;
  serviceName: string;
  price: number;
  description?: string;
}) => {
  try {
    // Log the payload before creating the service
    console.log('Creating service with:', {
      name: data.serviceName,
      description: data.description || `${data.serviceName} service`
    });
    // First, create the new service
    const serviceRes = await apiClient.post(`/services`, {
      name: data.serviceName,
      description: data.description || `${data.serviceName} service`,
    });
    const newServiceId = serviceRes.data.id;
    // Log the payload before linking the service to the stylist
    console.log('Linking service to stylist with:', {
      stylistId: String(data.stylistId),
      serviceId: String(newServiceId),
      price: data.price,
    });
    // Then, link the service to the stylist
    const linkRes = await apiClient.post(`/stylist-services`, {
      stylistId: String(data.stylistId),
      serviceId: String(newServiceId),
      price: data.price,
    });
    return linkRes.data;
  } catch (error) {
    const err = error as any;
    console.error('Service creation error:', err.response?.data || err.message);
    throw error;
  }
};

// Update both service name and stylist service data
export const updateStylistServiceWithName = async (stylistServiceId: string, serviceId: string, data: {
  serviceName?: string;
  price?: number;
  duration?: number;
}) => {
  try {
    // If service name needs to be updated, update the service record
    if (data.serviceName && serviceId) {
      await apiClient.put(`/services/${serviceId}`, {
        name: data.serviceName
      });
    }
    
    // Update the stylist service record (price, duration)
    const updateData: any = {};
    if (data.price !== undefined) updateData.price = data.price;
    if (data.duration !== undefined) updateData.duration = data.duration;
    
    if (Object.keys(updateData).length > 0) {
      const res = await apiClient.put(`/stylist-services/${stylistServiceId}`, updateData);
      return res.data;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating stylist service with name:', error);
    throw error;
  }
};



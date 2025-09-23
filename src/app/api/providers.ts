import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Provider interface
export interface Provider {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  specialties?: string[];
  bio?: string;
  rating?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get provider by ID
export const getProviderById = async (id: number): Promise<Provider> => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get(`${API_URL}/providers/${id}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Provider not found');
    }
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch provider');
  }
};

// Get all providers
export const getAllProviders = async (): Promise<Provider[]> => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get(`${API_URL}/providers`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch providers');
  }
};

// Update provider
export const updateProvider = async (id: number, providerData: Partial<Provider>): Promise<Provider> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.put(`${API_URL}/providers/${id}`, providerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.response?.status === 404) {
      throw new Error('Provider not found');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid provider data: Please check your inputs');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to update provider');
  }
};
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Profile interface
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string; // Backend uses phoneNumber
  location?: string;
  profilePicture?: string;
  role?: string;
  bio?: string;
  isActive?: boolean;
  rating?: number;
  totalReviews?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  password?: string; // Backend includes this but we don't display it
  createdAt?: string;
  updatedAt?: string;
  paymentMethods?: string[];
}

// Get user profile by user ID
export const getUserProfileById = async (userId: number): Promise<UserProfile> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    // Try multiple possible endpoints for user data
    let response;
    
    // First try users endpoint
    try {
      response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    } catch (firstError: any) {
      if (firstError.response?.status === 404) {
        // Try stylists endpoint if users endpoint doesn't exist
        try {
          response = await axios.get(`${API_URL}/stylists/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        } catch (secondError: any) {
          if (secondError.response?.status === 404) {
            // Try providers endpoint as final fallback
            response = await axios.get(`${API_URL}/providers/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
          } else {
            throw secondError;
          }
        }
      } else {
        throw firstError;
      }
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

// Update user profile by user ID
export const updateUserProfileById = async (userId: number, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    // Try multiple possible endpoints for user update
    let response;
    
    // First try users endpoint
    try {
      response = await axios.put(`${API_URL}/users/${userId}`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    } catch (firstError: any) {
      if (firstError.response?.status === 404) {
        // Try stylists endpoint if users endpoint doesn't exist
        try {
          response = await axios.put(`${API_URL}/stylists/${userId}`, profileData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        } catch (secondError: any) {
          if (secondError.response?.status === 404) {
            // Try providers endpoint as final fallback
            response = await axios.put(`${API_URL}/providers/${userId}`, profileData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
          } else {
            throw secondError;
          }
        }
      } else {
        throw firstError;
      }
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.response?.status === 404) {
      throw new Error('User not found for update');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid profile data: Please check your inputs');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Upload profile picture for user by ID
export const uploadProfilePictureById = async (userId: number, file: File): Promise<string> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('profilePicture', file);

  try {
    // Try multiple possible endpoints for profile picture upload
    let response;
    
    // First try users endpoint
    try {
      response = await axios.post(`${API_URL}/users/${userId}/upload-picture`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (firstError: any) {
      if (firstError.response?.status === 404) {
        // Try stylists endpoint if users endpoint doesn't exist
        try {
          response = await axios.post(`${API_URL}/stylists/${userId}/upload-picture`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          });
        } catch (secondError: any) {
          if (secondError.response?.status === 404) {
            // Try providers endpoint as final fallback
            response = await axios.post(`${API_URL}/providers/${userId}/upload-picture`, formData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              }
            });
          } else {
            throw secondError;
          }
        }
      } else {
        throw firstError;
      }
    }
    
    return response.data.profilePictureUrl;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    if (error.response?.status === 404) {
      throw new Error('Upload endpoint not found');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid file: Please select a valid image');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection');
    }
    throw new Error(error.response?.data?.message || 'Failed to upload picture');
  }
};
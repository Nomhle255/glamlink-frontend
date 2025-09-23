// lib/api/auth.ts
import axios from "axios";

// Direct backend URL - no proxy needed
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080" as string;

// Create axios instance for authenticated requests
const authApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
authApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function for authenticated requests
export const makeAuthenticatedRequest = authApiClient;

export interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  location: string;
  priceRangeMin: number;
  priceRangeMax: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const login = async (data: LoginData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    console.log("Login response:", res.data);
    console.log("Login response keys:", Object.keys(res.data || {}));
    console.log("Has token:", !!res.data?.token);
    console.log("Response structure:", JSON.stringify(res.data, null, 2));
    console.log("Full response status:", res.status);
    console.log("Response headers:", res.headers);
    
    // Check if we have any user identification data in the response
    const possibleId = res.data?.id || res.data?.user?.id || res.data?.stylist?.id || res.data?.userId || res.data?.stylistId;
    const possibleName = res.data?.name || res.data?.user?.name || res.data?.stylist?.name || res.data?.username;
    const possibleEmail = res.data?.email || res.data?.user?.email || res.data?.stylist?.email;
    
    console.log("Extracted possible data:");
    console.log("- ID:", possibleId);
    console.log("- Name:", possibleName);
    console.log("- Email:", possibleEmail);
    
    if (res.data && res.data.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", res.data.token);
        console.log("✅ Stored token in localStorage");
        
        // Normalize user object - handle different possible structures
        let userObj = res.data.user || res.data.stylist || res.data || {};
        
        // Ensure we have the essential fields
        if (!userObj.id && res.data.id) userObj.id = res.data.id;
        if (!userObj.name && res.data.name) userObj.name = res.data.name;
        if (!userObj.email && res.data.email) userObj.email = res.data.email;
        
        console.log("Normalized user object:", userObj);
        
        if (userObj.id) {
          localStorage.setItem("userInfo", JSON.stringify(userObj));
          localStorage.setItem("userId", userObj.id.toString());
          console.log("✅ Stored user info in localStorage");
        }
        
        // Handle stylist_id from various possible locations
        const stylistId = res.data.stylist_id || userObj.stylist_id || res.data.id;
        if (stylistId) {
          localStorage.setItem("stylist_id", stylistId.toString());
          console.log("✅ Stored stylist_id in localStorage");
        }
      }
    } else if (possibleId) {
      // If we have some user data but no token, try to work with it
      console.log("🔍 No token but found user data, creating session with extracted data");
      if (typeof window !== 'undefined') {
        const tempToken = "temp_token_" + Date.now();
        const extractedUser = {
          id: possibleId,
          name: possibleName || "Stylist User",
          email: possibleEmail || data.email
        };
        
        console.log("🔧 Creating session with extracted data:", extractedUser);
        localStorage.setItem("token", tempToken);
        localStorage.setItem("userInfo", JSON.stringify(extractedUser));
        localStorage.setItem("userId", extractedUser.id.toString());
        localStorage.setItem("stylist_id", extractedUser.id.toString());
      }
    } else {
      console.log("❌ No token or user data found in login response");
      console.log("⚠️  Backend might need to be fixed to return proper login data");
      
      // As a last resort, we could make an additional API call to get user info
      // if we know the login was successful (status 200)
      if (res.status === 200) {
        console.log("🔍 Login status 200, attempting to fetch user profile...");
        try {
          // Try to get current user info from a profile endpoint
          const profileRes = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer temp_token_${Date.now()}`
            }
          });
          console.log("Profile response:", profileRes.data);
          
          if (profileRes.data?.id) {
            const profileUser = {
              id: profileRes.data.id,
              name: profileRes.data.name || "Stylist User",
              email: profileRes.data.email || data.email
            };
            
            console.log("✅ Got user data from profile endpoint:", profileUser);
            const tempToken = "temp_token_" + Date.now();
            localStorage.setItem("token", tempToken);
            localStorage.setItem("userInfo", JSON.stringify(profileUser));
            localStorage.setItem("userId", profileUser.id.toString());
            localStorage.setItem("stylist_id", profileUser.id.toString());
          }
        } catch (profileError) {
          console.log("❌ Profile endpoint failed:", profileError);
          // Final fallback - ask user for their ID or redirect to manual setup
          console.log("🔧 Consider implementing a user ID input or backend fix");
        }
      }
    }
    
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Helper function to get current stylist ID
export const getCurrentStylistId = (): number | null => {
  if (typeof window !== 'undefined') {
    const stylistId = localStorage.getItem("stylist_id");
    const userId = localStorage.getItem("userId");
    
    // Try stylist_id first, then fallback to userId
    const id = stylistId || userId;
    return id ? parseInt(id, 10) : null;
  }
  return null;
};

// Helper function to get current user info
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        console.log("Retrieved user from storage:", parsed);
        return parsed;
      }
    } catch (error) {
      console.error("Error parsing user info from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("userInfo");
    }
  }
  return null;
};

// Helper function to check if user is logged in
export const isLoggedIn = (): boolean => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    
    console.log("isLoggedIn check - Token exists:", !!token, "UserInfo exists:", !!userInfo);
    return !!token && !!userInfo;
  }
  return false;
};

// Helper function to logout and clear storage
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("stylist_id");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
    console.log("Cleared all auth data from localStorage");
  }
};
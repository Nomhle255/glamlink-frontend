
"use client";
import { useState, useEffect } from "react";

// Backend base URL for images
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// Centralized country list
const countryList = [
  "Botswana",
  "Lesotho",
  "South Africa",
  "United States"
];
import { getUserProfileById, updateUserProfileById, uploadProfilePictureById, UserProfile } from "@/app/api/profile";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
    
    // Only fetch profile if user is available and has an ID
    if (user && user.id) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("Please log in to view your profile.");
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user || !user.id) {
      setError("User ID not available. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Try to fetch complete user data from backend using user ID
      const profileData = await getUserProfileById(user.id);
      
      setProfile(profileData);
      
      // Set form fields with fetched data
      setName(profileData.name || "");
      setEmail(profileData.email || "");
      setPhoneNumber(profileData.phoneNumber || ""); 
      setLocation(profileData.location || "");
      setCountry(profileData.country || "");
      setPaymentMethods(profileData.paymentMethods || []);
  setSubscriptionPlan(profileData.subscription_plan || "");
      
    } catch (err: any) {
      setError(`Unable to load profile data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  

  // Save profile changes 
  const handleSave = async () => {
    if (!user || !user.id) {
      setError("User ID not available. Please log in again.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      const updatedProfile = {
        name,
        email,
        phoneNumber,
        location,
        country,
        paymentMethods
      };
      
      // Update via backend using user ID
      const result = await updateUserProfileById(user.id, updatedProfile);
      
      setMessage("Profile updated successfully!");
      setShowModal(true);
      setTimeout(() => {
        setMessage("");
        setShowModal(false);
      }, 2000);
      
    } catch (err: any) {
      setError(`Failed to save profile changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 p-4">
      {/* Greeting */}
      <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">{greeting} {name || 'User'}!</h2>
        <p className="text-white">
          Update your profile information below.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
          <button 
            onClick={() => setError("")}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col items-center gap-4">
        {/* Country display removed as requested */}
        
          {/* Profile Icon */}
          <div className="relative">
            <img
              src={"/assets/Profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
          {/* Subscription Plan Display */}
          <div className="w-full mb-2 text-center">
            <span className="text-sm text-gray-600">Subscription Plan: </span>
            <span className="font-semibold text-pink-600">{subscriptionPlan || "Not set"}</span>
          </div>

        {/* Editable Fields - ENABLED for updates */}
        <div className="w-full flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
              disabled={saving}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
              disabled={saving}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
              disabled={saving}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
              disabled={saving}
              placeholder="Enter your location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
              disabled={saving}
              required
            >
              <option value="">Select Country</option>
              {countryList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-4 w-full px-4 py-2 rounded transition ${
            saving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-pink-500 hover:bg-pink-600'
          } text-white`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Success Message */}
        {message && <p className="text-green-500 mt-2">{message}</p>}

        {/* Modal Dialog */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-green-500 rounded-lg shadow-lg p-6 flex flex-col items-center">
              <span className="text-green-600 text-xl font-bold mb-2">Success!</span>
              <span className="text-gray-700 mb-4">Profile has been updated successfully.</span>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            </div>
            <div className="fixed inset-0 bg-black opacity-30 z-40" />
          </div>
        )}
      </div>
    </div>
  );
}

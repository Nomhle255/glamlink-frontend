
"use client";
import { useState, useEffect } from "react";
import { getUserProfileById, updateUserProfileById, uploadProfilePictureById, UserProfile } from "@/app/api/profile";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

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
      
      console.log(`Fetching profile for user ID: ${user.id}`);
      
      // Try to fetch complete user data from backend using user ID
      const profileData = await getUserProfileById(user.id);
      console.log('Backend profile data received:', profileData);
      
      setProfile(profileData);
      
      // Set form fields with fetched data
      setName(profileData.name || "");
      setEmail(profileData.email || "");
      setPhone(profileData.phone || profileData.phoneNumber || ""); // Handle both field names
      setLocation(profileData.location || "");
      setProfilePic(profileData.profilePicture || null);
      setPaymentMethods(profileData.paymentMethods || []);
      
      console.log('Profile loaded successfully from backend');
      
    } catch (err: any) {
      console.error('Failed to fetch profile from backend:', err);
      
      // Fallback to auth context data if backend fails
      console.log('Using auth context data as fallback');
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || user.phoneNumber || ""); // Handle both field names
      setLocation(user.location || "");
      setProfilePic(user.profilePicture || null);
      setPaymentMethods([]);
      
      // Only show error if it's not a 404 (missing endpoint)
      if (!err.message.includes('not found')) {
        setError(`Unable to load complete profile data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture upload - DISABLED (read-only mode)
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Just show a message that this is read-only for now
    setMessage("Profile picture upload is disabled in view-only mode");
    setTimeout(() => setMessage(""), 3000);
    
    // Clear the file input
    if (e.target) {
      e.target.value = '';
    }
  };

  // Save profile changes - DISABLED (read-only mode)
  const handleSave = async () => {
    // Just show a message that this is read-only for now
    setMessage("Profile is in view-only mode");
    setShowModal(true);
    setTimeout(() => {
      setMessage("");
      setShowModal(false);
    }, 2000);
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
        <h2 className="text-lg font-bold">{greeting} {name || user?.name || 'User'}!</h2>
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
        {/* Profile Picture - READ-ONLY */}
        <div className="relative">
          <img
            src={profilePic || "/assets/Profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="absolute bottom-0 right-0 bg-gray-400 text-white p-1 rounded-full cursor-not-allowed">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleProfilePicChange}
              disabled={true}
            />
            ✎
          </div>
        </div>

        {/* Editable Fields - READ-ONLY MODE */}
        <div className="w-full flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
              disabled={true}
              placeholder="Loading..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
              disabled={true}
              placeholder="Loading..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
              disabled={true}
              placeholder="Not provided"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
              disabled={true}
              placeholder="Not provided"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={paymentMethods.includes("cash")}
                  onChange={e => {
                    setPaymentMethods(prev =>
                      e.target.checked
                        ? [...prev, "cash"]
                        : prev.filter(m => m !== "cash")
                    );
                  }}
                  className="form-checkbox h-4 w-4 text-pink-600"
                  disabled={true}
                />
                <span className="ml-2 text-gray-600">Cash</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={paymentMethods.includes("credit card")}
                  onChange={e => {
                    setPaymentMethods(prev =>
                      e.target.checked
                        ? [...prev, "credit card"]
                        : prev.filter(m => m !== "credit card")
                    );
                  }}
                  className="form-checkbox h-4 w-4 text-pink-600"
                  disabled={true}
                />
                <span className="ml-2 text-gray-600">Credit Card</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button - READ-ONLY MODE */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 w-full px-4 py-2 rounded transition bg-gray-400 text-white cursor-not-allowed"
        >
          View Only Mode
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

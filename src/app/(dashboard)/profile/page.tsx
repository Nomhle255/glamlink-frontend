
"use client";
import { useState, useEffect } from "react";

export default function Profile() {
  // Hardcoded initial values
  const [showModal, setShowModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("Nomhle Cathala");
  const [email, setEmail] = useState("nom@glamlink.com");
  const [phone, setPhone] = useState("+26659403845");
  // const [role, setRole] = useState("Stylist");
  const [location, setLocation] = useState("Maseru, Ha Abia");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
  }, []);

  // Handle profile picture upload (still works locally, not persisted)
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Save changes (just show a message, no backend)
  const handleSave = () => {
    setMessage("Profile updated successfully!");
    setShowModal(true);
    setTimeout(() => {
      setMessage("");
      setShowModal(false);
    }, 2000);
  };

  return (
    <div className="pb-16 p-4">
      {/* Greeting */}
  <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">{greeting} {name}!</h2>
        <p className="text-gray-700">
          Update your profile information below.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col items-center gap-4">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-1 rounded-full cursor-pointer hover:bg-pink-600">
            <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
            ✎
          </label>
        </div>

        {/* Editable Fields */}
        <div className="w-full flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
        >
          Save Changes
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

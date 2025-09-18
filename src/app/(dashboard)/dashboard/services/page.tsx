
"use client";
import { useState } from "react";

interface Service {
  id: number;
  name: string;
  price: number;
}


export default function Services() {
  // Hardcoded services 
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Haircut", price: 25 },
    { id: 2, name: "Nail Polish", price: 15 },
    { id: 3, name: "Facial", price: 30 },
  ]);
  const sortedServices = [...services].sort((a, b) => a.name.localeCompare(b.name));

  // Modal state for add service
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState("");

  // Edit state
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // Delete service handler
  const handleDelete = (id: number) => {
    setServices(prev => prev.filter(s => s.id !== id));
    if (editId === id) {
      setEditId(null);
      setEditName("");
      setEditPrice("");
    }
  };

  // Example dropdown options (could be more in real app)
  const serviceOptions = [
    "Haircut",
    "Nail Polish",
    "Facial",
    "Makeup",
    "Massage",
    "Waxing",
    "Other"
  ];

  // Add service handler
  const handleAddService = () => {
    if (!selectedService || !price) return;
    setServices(prev => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map(s => s.id)) + 1 : 1,
        name: selectedService,
        price: Number(price)
      }
    ]);
    setSelectedService("");
    setPrice("");
    setShowAddModal(false);
  };

  // Edit service handler
  const handleEditClick = (service: Service) => {
    setEditId(service.id);
    setEditName(service.name);
    setEditPrice(service.price.toString());
  };

  const handleEditSave = () => {
    if (!editName || !editPrice) return;
    setServices(prev => prev.map(s => s.id === editId ? { ...s, name: editName, price: Number(editPrice) } : s));
    setEditId(null);
    setEditName("");
    setEditPrice("");
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditName("");
    setEditPrice("");
  };
   // Simple greeting logic (e.g., based on time of day)
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  })();

  return (
    <div className="pb-16 p-4 relative">
      
      {/* Greeting */}
      <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">{greeting} Welcome to GlamLink!</h2>
        <p className="text-gray-700">
          View your services and their prices below.
        </p>
      </div>

      {/* Add Service Button */}
      {/* Add Service Button and Conditional Form */}
      <div className="flex flex-col items-start mb-8">
        <button
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded shadow mb-4"
          title="Add Service"
          onClick={() => setShowAddModal((v) => !v)}
        >
          <span className="text-xl">+</span> Add Service
        </button>
        {showAddModal && (
          <div className="max-w-md bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-pink-600">Add Service</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleAddService(); }}>
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <select
                  className="w-full border p-2 rounded"
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  placeholder="Enter price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded shadow mt-2"
              >
                Add Service
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Service List */}
      <div className="grid grid-cols-4 gap-4">
        {sortedServices.map((service) => (
          <div
            key={service.id}
            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2 relative"
          >
            {editId === service.id ? (
              <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Name</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={handleEditCancel}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-pink-600 dark:text-pink-400">
                    {service.name}
                  </h5>
                  <div className="flex gap-4 items-center">
                    <button className="text-pink-600 hover:underline font-medium" title="Edit" onClick={() => handleEditClick(service)}>Edit</button>
                    <button className="text-red-600 hover:underline font-medium" title="Delete" onClick={() => handleDelete(service.id)}>Delete</button>
                  </div>
                </div>
                <div 
                  className="inline-flex items-center px-3 py-2 text-sm font-bold text-pink-600 bg-pink-100 rounded-lg border border-pink-200"
                >
                  P{!isNaN(Number(service.price))
                    ? Number(service.price).toFixed(2)
                    : "0.00"}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


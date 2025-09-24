"use client";

import React, { useState, useEffect } from "react";
import {
  addServiceToStylist,
  getServices,
  getServicesForStylist,
  getServiceById,
  updateStylistService,
  removeServiceFromStylist,
  deleteStylistService,
  Service,
} from "@/app/api/stylists-service";
import { useAuth } from "@/context/AuthContext";

export default function ServicesPage() {
  const { user, isAuthenticated, loading } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modal state for add service
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Modal state for edit service
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [editSelectedService, setEditSelectedService] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Greeting logic
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  })();

  // Helper to clear current list
  const clearAllServices = () => {
    setServices([]);
  };

  // Fetch services for this user
  const fetchServices = async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      const data = await getServicesForStylist(user.id);

      // For each stylist service, fetch the service details
      const processedServices = await Promise.all(
        Array.isArray(data) 
          ? data.map(async (item: any) => {
              const serviceDetails = await getServiceById(item.serviceId);
              return {
                id: item.id,
                name: serviceDetails.name,
                price: item.price || 0,
                description: serviceDetails.description,
                duration: item.duration,
                serviceId: item.serviceId,
              };
            })
          : []
      );

      setServices(processedServices);
    } catch (error) {
      setIsError(true);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all services for dropdown
  const fetchAllServices = async () => {
    try {
      const data = await getServices();
      setAllServices(Array.isArray(data) ? data : []);
    } catch (error) {
      // Error fetching all services
    }
  };

  // Initial load
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Fetch services for this specific stylist from stylist-services table
      fetchServices();
      // Also fetch all available services for the dropdown
      fetchAllServices();
    }
  }, [user, loading, isAuthenticated]);

  // Handle add service
  const handleAddService = async () => {
    if (!selectedService || !price || !user) return;

    try {
      setIsCreating(true);

      const selectedServiceObj = allServices.find(
        (service) => service.name === selectedService
      );
      if (!selectedServiceObj) {
        alert("Selected service not found");
        return;
      }

      const serviceData = {
        stylistId: Number(user.id),
        serviceId: Number(selectedServiceObj.id),
        price: Number(price),
      };

      await addServiceToStylist(serviceData);

      setSelectedService("");
      setPrice("");
      setShowAddModal(false);
      await fetchServices();
    } catch (error: any) {
      alert("Failed to add service. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle edit service
  const handleEditService = (service: any) => {
    setEditingService(service);
    setEditSelectedService(service.serviceId?.toString() || "");
    setEditPrice(service.price?.toString() || "");
    setShowEditModal(true);
  };

  // Handle update service
  const handleUpdateService = async () => {
    if (!editSelectedService || !editPrice || !user || !editingService) return;

    setIsUpdating(true);
    try {
      const result = await updateStylistService(editingService.id, {
        serviceId: parseInt(editSelectedService),
        price: parseFloat(editPrice),
      });

      alert("Service updated successfully!");
      setShowEditModal(false);
      setEditingService(null);
      setEditSelectedService("");
      setEditPrice("");
      fetchServices(); // Refresh the list
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to update service: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete service
  const handleDeleteService = async (service: any) => {
    if (!user) {
      alert("Please log in to delete services.");
      return;
    }

    if (confirm('Are you sure you want to delete this service?')) {
      try {
        if (service.serviceId) {
          await removeServiceFromStylist(Number(user.id), service.serviceId);
        } else {
          await deleteStylistService(service.id);
        }
        
        alert("Service deleted successfully!");
        fetchServices(); // Refresh the list
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        alert(`Failed to delete service: ${errorMessage}`);
      }
    }
  };

  // Helpers for display
  const getServiceName = (service: any): string => {
    return service?.name || "Unknown Service";
  };

  const getServicePrice = (service: any): number => {
    return service?.price || 0;
  };

  // UI states
  if (loading) {
    return (
      <div className="p-6">
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6">
        <div className="text-red-600">
          Error: Please log in to view your services.
          <br />
          <small>
            Not authenticated: {!isAuthenticated ? 'true' : 'false'}, 
            No user: {!user ? 'true' : 'false'}
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 p-4 relative">
      {/* Greeting */}
      <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">
          {greeting} {user?.name || 'User'}, Welcome to GlamLink!
        </h2>
        <p>View your services and their prices below.</p>
      </div>

      {/* Add Service Button */}
      <div className="flex flex-col items-start mb-8">
        <button
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded shadow mb-4"
          onClick={() => setShowAddModal((v) => !v)}
        >
          <span className="text-xl">+</span> Add Service
        </button>

        {showAddModal && (
          <div className="max-w-md bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-pink-600">
              Add Service
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddService();
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Name
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {allServices.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
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
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isCreating || !selectedService || !price}
                className={`font-semibold px-5 py-2 rounded shadow mt-2 ${
                  isCreating || !selectedService || !price
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-pink-500 hover:bg-pink-600 text-white"
                }`}
              >
                {isCreating ? "Adding..." : "Add Service"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Loading state for services */}
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-100 rounded">
          Loading your services...
        </div>
      )}

      {/* Error state for services */}
      {isError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error loading services. Please try refreshing the page.
        </div>
      )}

      {/* Services list*/}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Your Services</h3>
        {services.length === 0 && !isLoading ? (
          <p>No services added yet.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 bg-white rounded shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      {getServiceName(service)}
                    </h4>
                    <p className="text-2xl font-bold text-pink-600">
                      P{getServicePrice(service)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
                      className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-pink-600">
              Edit Service
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateService();
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Name
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={editSelectedService}
                  onChange={(e) => setEditSelectedService(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {allServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  placeholder="Enter price (p)"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingService(null);
                    setEditSelectedService("");
                    setEditPrice("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editSelectedService || !editPrice}
                  className={`flex-1 font-semibold px-4 py-2 rounded ${
                    isUpdating || !editSelectedService || !editPrice
                      ? "bg-gray-400 cursor-not-allowed text-gray-600"
                      : "bg-pink-500 hover:bg-pink-600 text-white"
                  }`}
                >
                  {isUpdating ? "Updating..." : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
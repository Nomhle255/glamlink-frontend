"use client";
import React, { useState } from "react";
import { savePaymentMethod, fetchAllPaymentMethods, fetchStylistPaymentMethods } from "@/app/api/payment-method";
import { useAuth } from "@/context/AuthContext";


export default function PaymentMethodPage() {
  const { user } = useAuth();
  const [methodName, setMethodName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [allMethods, setAllMethods] = useState<any[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [stylistMethods, setStylistMethods] = useState<any[]>([]);

  // Header logic 
  const [providerName, setProviderName] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  React.useEffect(() => {
    setIsClient(true);
    if (user?.name) setProviderName(user.name);
    else setProviderName("Service Provider");
  }, [user]);

  // Fetch all available payment methods for selection
  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await fetchAllPaymentMethods();
        setAllMethods(Array.isArray(data) ? data : []);
      } catch {
        setAllMethods([]);
      }
    };
    fetchAll();
  }, []);

  // Fetch payment methods mapped to the stylist
  React.useEffect(() => {
    const fetchStylist = async () => {
      if (!user?.id) return;
      setMethodsLoading(true);
      try {
        const data = await fetchStylistPaymentMethods(user.id);
        setStylistMethods(Array.isArray(data) ? data : []);
      } catch (err) {
        setStylistMethods([]);
      } finally {
        setMethodsLoading(false);
      }
    };
    fetchStylist();
  }, [user]);

  // Handle checkbox change
  const handleCheckboxChange = (methodId: string) => {
    setSelectedMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      if (!user?.id) throw new Error("User not found");
      await savePaymentMethod(user.id, methodName);
      setSuccess("Payment method saved!");
      setMethodName("");
      // Refresh payment methods
      const data = await fetchAllPaymentMethods();
      setPaymentMethods(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to save payment method");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 pb-20 p-4">
      <div className="bg-pink-500 text-white p-10 rounded-2xl shadow mb-6 text-center w-full">
        <p className="mt-2 text-lg">
          {isClient ? (
            <>Welcome back, {providerName} 👋</>
          ) : (
            <span>&nbsp;</span>
          )}
        </p>
        <p className="mt-3 text-sm opacity-90">
          Manage your bookings and services with ease ✨
        </p>
      </div>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Payment Methods</h1>
        <div className="bg-white rounded shadow p-4 mt-6">
          <h2 className="text-lg font-bold mb-4">Payment Methods Linked to You</h2>
          {methodsLoading ? (
            <p>Loading...</p>
          ) : stylistMethods.length === 0 ? (
            <p className="text-gray-500">No payment methods found for you.</p>
          ) : (
            <ul className="list-disc pl-5">
              {stylistMethods.map((pm: any, idx: number) => (
                <li key={pm.id || idx} className="mb-2">
                  {pm.methodName || pm.name || pm.method || "Unnamed Method"}
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-6">
          <label className="block mb-2 font-medium">Payment Method Name</label>
          <input
            type="text"
            value={methodName}
            onChange={e => setMethodName(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Payment Method"}
          </button>
          {success && <p className="text-green-600 mt-2">{success}</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-4">Select Preferred Payment Methods</h2>
          {allMethods.length === 0 ? (
            <p className="text-gray-500">No payment methods available.</p>
          ) : (
            <form>
              <div className="flex flex-col gap-2">
                {allMethods.map((method: any) => (
                  <label key={method.id || method.methodName || method.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={method.id || method.methodName || method.name}
                      checked={selectedMethods.includes(String(method.id || method.methodName || method.name))}
                      onChange={() => handleCheckboxChange(String(method.id || method.methodName || method.name))}
                    />
                    {method.methodName || method.name || method.method || "Unnamed Method"}
                  </label>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

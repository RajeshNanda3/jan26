import React, { useEffect, useState } from "react";
import { AppData } from "../context/AppContext";
import api from "../apiInterceptor";
import { toast } from "react-toastify";

const IssuePoint = () => {
  const { user, setUser } = AppData();
  const [customers, setCustomers] = useState([]);
  const [customerIdentifier, setCustomerIdentifier] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [customerError, setCustomerError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setFetching(true);
      const { data } = await api.get("/api/v1/users/customers");
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    } finally {
      setFetching(false);
    }
  };

  const resolveCustomer = () => {
    setCustomerError("");
    if (!customerIdentifier) {
      setCustomerError("Enter customer mobile or id");
      setSelectedCustomer(null);
      return;
    }
    const found = customers.find(
      (c) => c.mobile === customerIdentifier || c.id === customerIdentifier,
    );
    if (!found) {
      setCustomerError("Customer not found");
      setSelectedCustomer(null);
    } else {
      setSelectedCustomer(found);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return toast.error("Please lookup a valid customer");
    const pts = parseInt(points, 10);
    if (!pts || pts <= 0) return toast.error("Enter a valid points amount");
    if (!user) return toast.error("User not loaded");
    if (pts > user.points) return toast.error("Insufficient points");

    try {
      setLoading(true);
      const payload = {
        vendorId: user.id,
        customerId: selectedCustomer.id,
        points: pts,
      };
      const res = await api.post("/api/v1/issue", payload);
      toast.success(res.data.message || "Points issued successfully");

      // refresh vendor points
      try {
        const { data } = await api.get("/api/v1/users/me");
        setUser(data.user);
      } catch (e) {
        console.warn("Failed to refresh user after issue", e);
      }

      setPoints("");
      setSelectedCustomer(null);
      setCustomerIdentifier("");
      setCustomerError("");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Issue failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Issue Points</h1>
        <p className="text-gray-600 mb-6">
          Assign points to a customer by ID or phone.
        </p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-sm text-gray-600">Your Available Points</p>
          <p className="text-3xl font-bold text-indigo-600">
            {user?.points ?? 0}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer ID or Mobile
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customerIdentifier}
                onChange={(e) => {
                  setCustomerIdentifier(e.target.value);
                  setSelectedCustomer(null);
                  setCustomerError("");
                }}
                placeholder="Enter customer id or mobile"
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={resolveCustomer}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Lookup
              </button>
            </div>
            {customerError && (
              <p className="text-red-500 text-sm mt-1">{customerError}</p>
            )}
            {selectedCustomer && (
              <p className="text-green-600 text-sm mt-1">
                Found: {selectedCustomer.name} ({selectedCustomer.mobile})
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points to Issue
            </label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter amount of points"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || !selectedCustomer}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Processing..." : "Issue Points"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPoints("");
                setSelectedCustomer(null);
                setCustomerIdentifier("");
                setCustomerError("");
              }}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssuePoint;

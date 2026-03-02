import React, { useEffect, useState } from "react";
import { AppData } from "../context/AppContext";
import CustomerNav from "../components/CustomerNav";
import api from "../apiInterceptor";

const CustomerHero = () => {
  const { user, isAuth } = AppData();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/v1/users/vendors");
      setVendors(data.vendors || []);
    } catch (err) {
      setError(err.message || "Failed to fetch vendors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-hero p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Vendors</h1>
        <p className="text-gray-600 mb-8">
          Explore all our trusted vendors and their offerings
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading vendors...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
            <button
              onClick={fetchVendors}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : vendors.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No vendors available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">
                    {vendor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  {vendor.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    <span className="truncate">{vendor.email}</span>
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {vendor.mobile}
                  </p>
                  <p>
                    <span className="font-medium">Points Available:</span>{" "}
                    <span className="text-indigo-600 font-bold">
                      {vendor.points}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(vendor.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button className="w-full mt-4 bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHero;

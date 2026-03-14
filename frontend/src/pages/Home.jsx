import React from "react";
import { Link } from "react-router-dom";
import { AppData } from "../context/AppContext";

const Home = () => {
  const { user, isAuth } = AppData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Sanchay Loyalty Point Transfer System
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Earn, Transfer, and Redeem Loyalty Points Effortlessly
          </p>
          <div className="space-x-4">
            {!isAuth ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                to={
                  user?.role === "ADMIN"
                    ? "/dashboard"
                    : user?.role === "USER"
                      ? "/customer-hero"
                      : "/vendor-hero"
                }
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Sanchay?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
              <p className="text-gray-600">
                Shop with our partnered vendors and earn loyalty points on every
                purchase.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Transfer Points</h3>
              <p className="text-gray-600">
                Easily transfer points to friends, family, or redeem them for
                rewards.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-gray-600">
                Use your points for discounts, gifts, or exclusive offers from
                vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Register</h3>
              <p className="text-gray-600">
                Create your account as a customer or vendor.
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Earn Points</h3>
              <p className="text-gray-600">
                Make purchases and accumulate points.
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Transfer</h3>
              <p className="text-gray-600">
                Share points with others securely.
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Redeem</h3>
              <p className="text-gray-600">Enjoy rewards and savings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the Sanchay Community Today!
          </h2>
          <p className="text-xl mb-8">
            Start earning and transferring loyalty points with ease.
          </p>
          {!isAuth && (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>

      {/* Conditional Logout for Authenticated Users */}
      {isAuth && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => {
              // Assuming logoutUser is available; implement if needed
              window.location.href = "/login"; // Simple redirect for now
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

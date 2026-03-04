import React, { useState } from "react";
import { AppData } from "../context/AppContext";
import { Link } from "react-router-dom";

const VendorNav = () => {
  const { user, isAuth, logout } = AppData();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* logo */}
          <div className="shrink-0">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              VendorApp
            </Link>
          </div>

          {/* desktop links */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            {isAuth && (
              <>
                <Link
                  to="/issue"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Issue Points
                </Link>
                <Link
                  to="/purchase"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Purchase
                </Link>
                <Link
                  to="/vendor-transactions"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Transactions
                </Link>
                <Link
                  to="/vendor-profile"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* right side user info */}
          <div className="flex items-center space-x-4">
            {isAuth && user ? (
              <>
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="font-medium text-gray-800">
                    Hi, {user.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    Points: <span className="font-semibold">{user.points}</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition"
              >
                Login
              </Link>
            )}

            {/* mobile toggle */}
            <button
              className="md:hidden inline-flex justify-center items-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {openMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {openMenu && (
        <div className="md:hidden bg-white shadow-inner px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          {isAuth && (
            <>
              <Link
                to="/issue"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Issue Points
              </Link>
              <Link
                to="/purchase"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Purchase
              </Link>
              <Link
                to="/vendor-transactions"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Transactions
              </Link>
              <Link
                to="/vendor-profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </>
          )}
          {!isAuth && (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-100"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default VendorNav;

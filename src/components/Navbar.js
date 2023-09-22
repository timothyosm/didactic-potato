import React from "react";
import { useAuth } from "./../util/auth";
import { Link } from "./../util/router";

function NavBar() {
  const auth = useAuth();

  return (
    <header className="bg-indigo-700 py-5 px-4">
      <div className="container mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="text-white font-bold">
          Planning Poker
        </Link>

        <nav className="flex space-x-4">
          <Link
            to="/about"
            className="text-gray-300 hover:bg-indigo-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            About
          </Link>

          {auth.user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:bg-indigo-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/settings/general"
                className="text-gray-300 hover:bg-indigo-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Settings
              </Link>
              <Link
                to="/auth/signout"
                className="text-gray-300 hover:bg-indigo-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  auth.signout();
                }}
              >
                Sign out
              </Link>
            </>
          ) : (
            <Link
              to="/auth/signin"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;

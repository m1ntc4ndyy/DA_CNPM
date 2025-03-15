import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Event Hub</span>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Events
              </Link>
              {isAdmin() && (
                <Link to="/manage" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Manage Events
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <User className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
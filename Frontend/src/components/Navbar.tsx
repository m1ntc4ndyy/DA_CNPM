import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useState} from 'react';
import { useAuth } from '../context/AuthProvider';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, isAdmin, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

    

  const logout = (): void => {
    handleLogout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div>
    {/* Header */}
      <header className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <h1 className="pl-5 text-3xl font-bold">
                <Link to="/">
                  EventHub
                </Link>
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex sm:hidden items-center space-x-6">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Events
              </Link>
              {isAdmin() && (
                  <>
                  <Link to="/manage" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Manage
                  </Link>
                  </>
              )}
              <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Profile
              </Link>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <User className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">
                    {currentUser.name} ({currentUser.role})
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden flex flex-col py-4 space-y-3">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Events
              </Link>
              {isAdmin() && (
                  <>
                  <Link to="/manage" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Manage
                  </Link>
                  </>
              )}
              <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Profile
              </Link>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <User className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">
                    {currentUser.name} ({currentUser.role})
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
    </header>
  </div>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Home, 
  Settings, 
  Users, 
  Calendar,
  HelpCircle, 
  FileText,
  PlusCircle,
  User,
  LogOut
} from 'lucide-react';

interface SubMenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubMenuItem[];
  requiredRole?: string;
}

interface SidebarProps {
  userRole?: string;
  onLogout?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userRole = '', 
  onLogout,
  isOpen = true,
  onToggle
}) => {
  // If isOpen is controlled externally, use that. Otherwise manage state internally
  const [localIsOpen, setLocalIsOpen] = useState<boolean>(true);
  const effectiveIsOpen = isOpen !== undefined ? isOpen : localIsOpen;
  
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleSidebar = (): void => {
    if (onToggle) {
      onToggle(); // Use the parent handler if provided
    } else {
      setLocalIsOpen(!localIsOpen); // Fall back to local state
    }
  };

  const toggleSubMenu = (menuName: string): void => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };
  
  const isActiveParent = (item: MenuItem): boolean => {
    if (item.path && isActiveRoute(item.path)) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => isActiveRoute(subItem.path));
    }
    return false;
  };

  const menuItems: MenuItem[] = [
    { 
      name: 'Home', 
      icon: <Home size={20} />,
      path: '/'
    },
    { 
      name: 'Events', 
      icon: <Calendar size={20} />,
      subItems: [
        { name: 'View All Events', icon: <Calendar size={16} />, path: '/' },
        ...(userRole === 'admin' ? [
          { name: 'Manage Events', icon: <Settings size={16} />, path: '/manage' },
          { name: 'Create Event', icon: <PlusCircle size={16} />, path: '/events/create' }
        ] : [])
      ] 
    },
    { 
      name: 'Profile', 
      icon: <User size={20} />,
      path: '/profile'
    },
    ...(userRole === 'admin' ? [
      { 
        name: 'Admin', 
        icon: <Settings size={20} />,
        subItems: [
          { name: 'Event Management', icon: <Calendar size={16} />, path: '/manage' }
        ] 
      }
    ] : [])
  ];

  return (
    <div 
      className={`bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out ${
        effectiveIsOpen ? 'w-64' : 'w-20'
      } fixed left-0 top-0 z-40`}
    >
      {/* Toggle Button */}
      <button 
        className="absolute -right-3 top-10 bg-gray-800 text-white p-1 rounded-full border border-gray-700"
        onClick={toggleSidebar}
      >
        {effectiveIsOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo and Brand */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <span className={`font-bold text-xl transition-opacity duration-200 ${effectiveIsOpen ? 'opacity-100' : 'opacity-0'}`}>
          {effectiveIsOpen && 'EventApp'}
        </span>
        {!effectiveIsOpen && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">E</div>}
      </div>

      {/* Menu Items */}
      <nav className="mt-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
        <ul>
          {menuItems.map((item, index) => {
            // Skip rendering menu items that require admin role if user doesn't have it
            if (item.requiredRole === 'admin' && userRole !== 'admin') return null;
            
            return (
              <li key={index}>
                <div className="relative">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between py-3 px-4 hover:bg-gray-700 transition-colors ${
                        isActiveParent(item) ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => item.subItems && toggleSubMenu(item.name)}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-300">{item.icon}</span>
                        <span 
                          className={`ml-4 transition-all duration-200 ${
                            effectiveIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                      {item.subItems && effectiveIsOpen && (
                        <span className="text-gray-400">
                          {expandedMenus[item.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      className={`w-full text-left flex items-center justify-between py-3 px-4 hover:bg-gray-700 transition-colors ${
                        isActiveParent(item) ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => item.subItems && toggleSubMenu(item.name)}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-300">{item.icon}</span>
                        <span 
                          className={`ml-4 transition-all duration-200 ${
                            effectiveIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                      {item.subItems && effectiveIsOpen && (
                        <span className="text-gray-400">
                          {expandedMenus[item.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </button>
                  )}
                  
                  {/* Sub-menu items */}
                  {item.subItems && effectiveIsOpen && expandedMenus[item.name] && (
                    <ul className="bg-gray-900 pl-4">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link 
                            to={subItem.path} 
                            className={`flex items-center py-2 px-4 text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors ${
                              isActiveRoute(subItem.path) ? 'bg-gray-700 text-white' : ''
                            }`}
                          >
                            <span className="text-gray-400 mr-2">{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-700 rounded transition-colors"
          >
            <LogOut size={20} className="text-gray-300" />
            <span className={`ml-4 transition-opacity duration-200 ${effectiveIsOpen ? 'opacity-100' : 'opacity-0'}`}>
              {effectiveIsOpen && 'Logout'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

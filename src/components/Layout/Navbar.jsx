
import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { X } from "lucide-react";
import menuIcon from "../../assets/menu.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "About Us", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Blog", path: "/blog" },
    // { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-gray-900 font-semibold text-lg">MSA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-orange-500 ${
                  isActive(item.path) 
                    ? 'text-orange-500' 
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/register"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded transition-all duration-200 hover:shadow-md"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <img 
                  src={menuIcon} 
                  alt="Menu" 
                  className="h-5 w-5" 
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-200 hover:text-orange-500 hover:bg-gray-50 ${
                    isActive(item.path) 
                      ? 'text-orange-500 bg-orange-50' 
                      : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-100 mt-2">
                <Link 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded transition-all duration-200 text-center"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    <Outlet />
    </>
  );
};

export default Navbar;

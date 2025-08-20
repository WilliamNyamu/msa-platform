
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import MenuIcon from "../../assets/menu.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Gallery", href: "/gallery" },
    { title: "Blog", href: "/blog" },
    { title: "Events", href: "/events" },
    { title: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "py-3 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-md" 
            : "py-4 bg-white/95 backdrop-blur-md border-b border-gray-100/50"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">MSA</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={link.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-orange-600 ${
                    isActive(link.href) 
                      ? 'text-orange-600' 
                      : 'text-gray-700/80'
                  }`}
                >
                  {link.title}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Link
                to="/register"
                className="px-4 py-2 bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 rounded-md border border-orange-600/30 transition-all duration-200 hover:shadow-md"
              >
                Join Now
              </Link>
            </motion.div>
          </nav>
                  <button 
                    className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X size={24} /> : <img src={MenuIcon} alt="Menu" className="w-6 h-6" />}
                  </button>
                </div>

                {/* Mobile Navigation Menu */}
        <motion.div 
          className={`fixed top-[73px] right-0 h-screen w-[70vw] bg-white border-l border-gray-200/50 flex flex-col md:hidden shadow-xl ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          initial={{ x: "100%" }}
          animate={{ x: mobileMenuOpen ? 0 : "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex flex-col p-6 space-y-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 border-b border-gray-200/50 transition-colors duration-200 hover:text-orange-600 ${
                  isActive(link.href) 
                    ? 'text-orange-600 font-medium' 
                    : 'text-gray-700/80'
                }`}
              >
                {link.title}
              </Link>
            ))}
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 px-4 py-2 bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 text-center rounded-md border border-orange-600/30 transition-all duration-200"
            >
              Join Now
            </Link>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{ zIndex: -1 }}
          />
        )}
      </header>
      <Outlet />
    </>
  );
};

export default Navbar;

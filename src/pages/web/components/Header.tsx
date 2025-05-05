import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Database } from "lucide-react";
import Button from "./ui/Button";

interface HeaderProps {
  onLoginClick: () => void;
  onDemoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onDemoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-semibold text-primary-950">
              StockWise AIIMS
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-primary-900 hover:text-primary-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-primary-900 hover:text-primary-600 transition-colors"
            >
              Benefits
            </a>
            <a
              href="#showcase"
              className="text-primary-900 hover:text-primary-600 transition-colors"
            >
              Showcase
            </a>
            <a
              href="#testimonials"
              className="text-primary-900 hover:text-primary-600 transition-colors"
            >
              Testimonials
            </a>
            <Button variant="outline" size="sm" onClick={onLoginClick}>
              Login
            </Button>
            <Button variant="primary" size="sm" onClick={onDemoClick}>
              Request Demo
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-900 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <div className="px-4 py-2 space-y-1">
            <a
              href="#features"
              className="block py-3 text-primary-900 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="block py-3 text-primary-900 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </a>
            <a
              href="#showcase"
              className="block py-3 text-primary-900 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Showcase
            </a>
            <a
              href="#testimonials"
              className="block py-3 text-primary-900 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <div className="py-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsMenuOpen(false);
                  onLoginClick();
                }}
                className="mb-2"
              >
                Login
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setIsMenuOpen(false);
                  onDemoClick();
                }}
              >
                Request Demo
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;

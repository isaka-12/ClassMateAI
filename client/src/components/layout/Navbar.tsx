import React, { useState } from 'react';
import Logo from '../common/Logo';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm bg-primary">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 transition-transform duration-300 transform hover:scale-105">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline gap-6 ml-16 space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative  text-sm font-medium text-gray-700 transition-all duration-300 border-2 rounded-full hover:text-blue-600 hover:bg-blue-50 group border-secondary w-[120px] h-[40px] flex items-center justify-center hover:translate-x-2 hover:shadow-lg"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="items-center hidden space-x-4 md:flex">
            <Link 
              to="/signin"
              className="text-sm font-medium text-white transition-all duration-300 transform border-2 rounded-full hover:scale-105 hover:shadow-md bg-primary hover:bg-primary-dark hover:text-white border-secondary w-[120px] h-[40px] flex items-center justify-center hover:translate-x-2"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-white transition-all duration-300 transform rounded-full hover:scale-105 hover:shadow-lg bg-secondary w-[120px] h-[40px] flex items-center justify-center hover:translate-x-2"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 transition-all duration-300 transform hover:text-blue-600 focus:outline-none focus:text-blue-600 hover:scale-110"
            >
              <svg className="w-6 h-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 transition-all duration-300 transform rounded-md hover:text-blue-600 hover:bg-blue-50 hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full transition-all duration-300 transform hover:scale-105">
                Sign In
              </Button>
              <Button variant="primary" size="sm" className="w-full transition-all duration-300 transform hover:scale-105">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
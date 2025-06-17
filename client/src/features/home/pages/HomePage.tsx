import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import BrandSection from '../components/BrandSection';
import { EmailOutlined, LocationOnOutlined, Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen text-white bg-primary">
      <Navbar />
      <main>
        <HeroSection />
        <BrandSection />
        <FeaturesSection />
       
      </main>
      <footer className="py-8 text-white ">
        <div className="px-4 py-4 mx-auto border-t border-secondary max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Quick Links */}
            <div className="text-left">
              <h3 className="mb-4 text-lg font-semibold text-secondary">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/terms" className="text-gray-300 transition-colors duration-300 hover:text-white hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-300 transition-colors duration-300 hover:text-white hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="text-left">
              <h3 className="mb-4 text-lg font-semibold text-secondary">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-start text-gray-300">
                  <EmailOutlined className="mr-2 text-secondary" sx={{ fontSize: 20 }} />
                  <span>contact@classmateai.com</span>
                </div>
                <div className="flex items-center justify-start text-gray-300">
                  <LocationOnOutlined className="mr-2 text-secondary" sx={{ fontSize: 20 }} />
                  <span>Dar es salaam, TZ</span>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="text-left">
              <h3 className="mb-4 text-lg font-semibold text-secondary">Follow Us</h3>
              <div className="flex justify-start space-x-4">
                <a href="#" className="text-gray-300 transition-all duration-300 transform hover:text-secondary hover:scale-110">
                  <Facebook sx={{ fontSize: 24 }} />
                </a>
                <a href="#" className="text-gray-300 transition-all duration-300 transform hover:text-secondary hover:scale-110">
                  <Twitter sx={{ fontSize: 24 }} />
                </a>
                <a href="#" className="text-gray-300 transition-all duration-300 transform hover:text-secondary hover:scale-110">
                  <Instagram sx={{ fontSize: 24 }} />
                </a>
                <a href="#" className="text-gray-300 transition-all duration-300 transform hover:text-secondary hover:scale-110">
                  <LinkedIn sx={{ fontSize: 24 }} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 mt-8 text-center ">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} ClassMateAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
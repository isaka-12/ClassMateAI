import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
       
      </main>
      <footer>
        <div className="py-6 text-center text-gray-600">
          &copy; {new Date().getFullYear()} ClassMateAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 ">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Study Smarter, Not Harder with <span className="text-secondary">ClassMate</span>AI
            
          </h1>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-gray">
            ClassmateAI  helps you  turn your class notes into flashcards, quizzes, and summaries—all powered by AI. Marking studying smart and enjoyable.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

            <Link to ="/flashcards" className=' text-white transition-colors duration-300 rounded-full shadow-md bg-secondary hover:bg-secondary-dark w-[240px] h-[50px] flex items-center justify-center'>
            Try it Now
            </Link>
            <Link to="/signup" className=" text-gray-800 transition-colors duration-300 border-2 rounded-full shadow-md border-secondary w-[240px] h-[50px] flex items-center justify-center hover:bg-secondary hover:text-white">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="py-16 md:py-28 bg-gradient-to-br from-blue-50 to-indigo-100 h-screen">
      <div className="flex flex-col items-center justify-center  px-4 mx-auto sm:px-6 lg:px-8 ">
        <div className="text-center">
          <h1 className="mb-16 text-[32px]  md:text-[48px] font-bold text-gray-900  animate-fade-in-up lg:text-[48px] max-w-4xl">
            Study Smarter, Not Harder with <span className="text-secondary animate-pulse">ClassMate</span>AI
          </h1>
          <p className="max-w-3xl mx-auto mb-24 text-[20px] md:text-[24px] text-gray animate-fade-in-up animation-delay-200">
            ClassmateAI helps you turn your class notes into flashcards, quizzes, and summaries—all powered by AI. Making studying smart and enjoyable.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
            <Link 
              to="/flashcards" 
              className="text-white transition-all duration-300 rounded-full shadow-lg bg-secondary hover:bg-secondary-dark hover:shadow-xl hover:scale-105 transform w-[240px] h-[50px] flex items-center justify-center group text-[24px] hover:font-semibold"
            >
              <span className="mr-2">Try it Now</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              to="/signup" 
              className="text-white transition-all duration-300 border-2 rounded-full shadow-lg border-secondary w-[240px] h-[50px] flex items-center justify-center hover:bg-secondary hover:text-white hover:shadow-xl hover:scale-105 transform group text-[24px] hover:font-semibold"
            >
              <span className="mr-2">Get Started</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
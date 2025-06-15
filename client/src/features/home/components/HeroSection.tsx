import React from 'react';
import Button from '../../../components/ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 h-[80vh]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Study Smarter, Not Harder with <span className="text-secondary">ClassMate</span>AI
            
          </h1>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-gray">
            ClassmateAI  helps you  turn your class notes into flashcards, quizzes, and summaries—all powered by AI. Marking studying smart and enjoyable.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="secondary" size="lg" onClick={() => {window.location.href = '/flashcards'}}>
              Start Learning
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
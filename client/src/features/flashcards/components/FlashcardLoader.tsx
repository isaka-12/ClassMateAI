import React from "react";

export const FlashcardLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0D1B2A]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Cards */}
        <div className="relative mb-8">
          <div className="flex space-x-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-16 h-20 bg-gradient-to-br from-[#FF6B00] to-[#FF8500] rounded-lg shadow-lg animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s"
                }}
              >
                <div className="w-full h-full bg-[#1B263B]/30 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#FF6B00]/60 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "2s"
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-[#FF6B00] animate-pulse">
            🧠 Cooking up your flashcards...
          </h3>
          <div className="flex justify-center space-x-1">
            {["C", "l", "a", "s", "s", "M", "a", "t", "e", "AI", " ", "i", "s", " ", "w", "o", "r", "k", "i", "n", "g"].map((char, i) => (
              <span
                key={i}
                className="text-[#E0E1DD] animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1s"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-[#1B263B] rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8500] rounded-full animate-pulse"></div>
          </div>
          
          <p className="text-[#778DA9] text-sm mt-4">
            Analyzing your content and generating smart questions...
          </p>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useImperativeHandle, forwardRef } from "react";

interface FlashcardItemProps {
  question: string;
  answer: string;
}

export interface FlashcardItemRef {
  resetFlip: () => void;
}

export const FlashcardItem = forwardRef<FlashcardItemRef, FlashcardItemProps>(
  ({ question, answer }, ref) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const toggleCard = () => setIsFlipped((prev) => !prev);

    const resetFlip = () => setIsFlipped(false);

    useImperativeHandle(ref, () => ({
      resetFlip,
    }));

    return (
      <div className="perspective-1000 w-full min-h-[900px] md:min-h-[400px] ">
        <div
          className={`relative w-full min-h-[900px] md:min-h-[500px]  transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={toggleCard}
        >
          {/* Front Side - Question */}
          <div className="absolute inset-0 w-full min-h-[800px] md:min-h-[300px]  backface-hidden bg-gradient-to-br from-[#1B263B]/90 to-[#0D1B2A]/90 border-2 border-[#FF6B00] rounded-xl shadow-2xl backdrop-blur-md flex flex-col justify-between p-6 hover:border-orange-400 transition-colors">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🤔</span>
              </div>
              <h3 className="text-xl font-semibold text-[#E0E1DD] mb-4">Question</h3>
              <p className="text-lg text-[#E0E1DD] leading-relaxed max-w-full break-words">{question}</p>
            </div>
            <div className="text-center text-sm text-[#778DA9] italic mt-4">
              Click to reveal answer
            </div>
          </div>

          {/* Back Side - Answer */}
          <div className="absolute inset-0 w-full min-h-[800px] md:min-h-[300px] backface-hidden rotate-y-180 bg-gradient-to-br from-[#FF6B00]/90 to-[#FF8500]/90 border-2 border-[#E0E1DD] rounded-xl shadow-2xl backdrop-blur-md flex flex-col justify-between p-6 hover:border-white transition-colors">
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Answer</h3>
              <p className="text-lg text-white leading-relaxed max-w-full break-words">{answer}</p>
            </div>
            <div className="text-center text-sm text-white/80 italic mt-4">
              Click to see question again
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FlashcardItem.displayName = "FlashcardItem";
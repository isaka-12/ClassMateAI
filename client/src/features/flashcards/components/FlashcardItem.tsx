import  { useState, useImperativeHandle, forwardRef } from "react";

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
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleCard = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setIsFlipped((prev) => !prev);
    };

    const resetFlip = () => {
      if (isFlipped) {
        setIsAnimating(true);
        setIsFlipped(false);
      }
    };

    useImperativeHandle(ref, () => ({
      resetFlip,
    }));

    const handleAnimationEnd = () => {
      setIsAnimating(false);
    };

    return (
      <div className="w-full h-full perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform-style-preserve-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={toggleCard}
          onTransitionEnd={handleAnimationEnd}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front Side - Question */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-[#1B263B]/90 to-[#0D1B2A]/90 border-2 border-[#FF6B00] rounded-xl shadow-2xl backdrop-blur-md flex flex-col justify-between p-6 hover:border-orange-400 transition-colors duration-300 group"
            style={{
              transform: 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="flex flex-col items-center justify-center flex-1 overflow-y-auto text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FF6B00]/20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-3xl">🤔</span>
              </div>
              <h3 className="text-xl font-semibold text-[#E0E1DD] mb-4">Question</h3>
              <p className="text-lg text-[#E0E1DD] leading-relaxed max-w-full break-words md:px-4 px-1">
                {question}
              </p>
            </div>
            <div className="text-center text-sm text-[#778DA9] italic mt-4 animate-pulse">
              Click to reveal answer ↓
            </div>
          </div>

          {/* Back Side - Answer */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-secondary-light/90 to-secondary-light border-2 border-[#E0E1DD] rounded-xl shadow-2xl backdrop-blur-md flex flex-col justify-between p-6 hover:border-white transition-colors duration-300 group"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="flex flex-col items-center justify-center flex-1 overflow-y-auto">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 transition-transform rounded-full bg-white/20 group-hover:scale-110">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-white">Answer</h3>
              <p className="max-w-full px-1 text-lg leading-relaxed text-white break-words md:px-4">
                {answer}
              </p>
            </div>
            <div className="mt-4 text-sm italic text-center text-white/80 animate-pulse">
              Click to return to question ↑
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FlashcardItem.displayName = "FlashcardItem";
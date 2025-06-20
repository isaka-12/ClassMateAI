
import { useState, useImperativeHandle, forwardRef } from "react";
import { explanationApi, type ExplanationResponse } from "../api/explanationApi";

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
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [explanationData, setExplanationData] = useState<ExplanationResponse | null>(null);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

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

    const handleExplanationRequest = async (type: 'detailed' | 'simplified' | 'examples') => {
      setIsLoadingExplanation(true);
      try {
        let response: ExplanationResponse;
        
        switch (type) {
          case 'detailed':
            response = await explanationApi.getAdditionalExplanation({
              question,
              current_answer: answer,
            });
            break;
          case 'simplified':
            response = await explanationApi.getSimplifiedExplanation({
              question,
              current_answer: answer,
            });
            break;
          case 'examples':
            response = await explanationApi.getExamples({
              question,
              current_answer: answer,
            });
            break;
        }
        
        setExplanationData(response);
        setShowExplanationModal(true);
      } catch (error) {
        console.error('Error getting explanation:', error);
        setExplanationData({
          success: false,
          explanation: 'Sorry, I could not generate an explanation at this time. Please try again.',
          original_question: question,
          original_answer: answer,
          error: 'Network error'
        });
        setShowExplanationModal(true);
      } finally {
        setIsLoadingExplanation(false);
      }
    };

    return (
      <>
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
              
              {/* Explanation Buttons */}
              <div className="mt-4 space-y-2">
                <div className="text-sm italic text-center text-white/80">
                  Need more help? Click below:
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplanationRequest('detailed');
                    }}
                    disabled={isLoadingExplanation}
                    className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 disabled:opacity-50"
                  >
                    📚 More Detail
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplanationRequest('simplified');
                    }}
                    disabled={isLoadingExplanation}
                    className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 disabled:opacity-50"
                  >
                    🔍 Simplify
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplanationRequest('examples');
                    }}
                    disabled={isLoadingExplanation}
                    className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 disabled:opacity-50"
                  >
                    🌟 Examples
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-sm italic text-center text-white/80 animate-pulse">
                Click to return to question ↑
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Modal */}
        {showExplanationModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="bg-[#FF6B00] text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {explanationData?.type === 'simplified' ? '🔍 Simplified Explanation' :
                   explanationData?.type === 'examples' ? '🌟 Examples & Applications' :
                   '📚 Detailed Explanation'}
                </h3>
                <button
                  onClick={() => setShowExplanationModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {isLoadingExplanation ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
                    <span className="ml-3 text-gray-600">Generating explanation...</span>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Original Question:</h4>
                      <p className="text-gray-700">{explanationData?.original_question}</p>
                    </div>
                    
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Original Answer:</h4>
                      <p className="text-gray-700">{explanationData?.original_answer}</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {explanationData?.type === 'simplified' ? 'Simplified Explanation:' :
                         explanationData?.type === 'examples' ? 'Examples & Applications:' :
                         'Detailed Explanation:'}
                      </h4>
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {explanationData?.explanation}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setShowExplanationModal(false)}
                  className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#e55a00] transition-colors duration-200"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

FlashcardItem.displayName = "FlashcardItem";
import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
    const [displayedExplanation, setDisplayedExplanation] = useState('');
    const [isTyping, setIsTyping] = useState(false);

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

    // Typing animation effect
    useEffect(() => {
      if (explanationData?.explanation && showExplanationModal && !isLoadingExplanation) {
        setIsTyping(true);
        setDisplayedExplanation('');
        
        let index = 0;
        const explanation = explanationData.explanation;
        const typingInterval = setInterval(() => {
          if (index < explanation.length) {
            setDisplayedExplanation(explanation.slice(0, index + 1));
            index++;
          } else {
            setIsTyping(false);
            clearInterval(typingInterval);
          }
        }, 15); // Adjust speed as needed

        return () => clearInterval(typingInterval);
      }
    }, [explanationData, showExplanationModal, isLoadingExplanation]);

    const handleExplanationRequest = async (type: 'detailed' | 'simplified' | 'examples') => {
      // Open modal immediately for better UX
      setShowExplanationModal(true);
      setIsLoadingExplanation(true);
      setExplanationData(null);
      setDisplayedExplanation('');
      
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
      } catch (error) {
        console.error('Error getting explanation:', error);
        setExplanationData({
          success: false,
          explanation: 'Sorry, I could not generate an explanation at this time. Please try again.',
          original_question: question,
          original_answer: answer,
          error: 'Network error'
        });
      } finally {
        setIsLoadingExplanation(false);
      }
    };

    const closeModal = () => {
      setShowExplanationModal(false);
      setExplanationData(null);
      setDisplayedExplanation('');
      setIsTyping(false);
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
                    className="px-3 py-1 text-xs transition-colors duration-200 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50"
                  >
                    📚 More Detail
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplanationRequest('simplified');
                    }}
                    disabled={isLoadingExplanation}
                    className="px-3 py-1 text-xs transition-colors duration-200 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50"
                  >
                    🔍 Simplify
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplanationRequest('examples');
                    }}
                    disabled={isLoadingExplanation}
                    className="px-3 py-1 text-xs transition-colors duration-200 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50"
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

        {/* Enhanced Explanation Modal with Markdown Support */}
        {showExplanationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="bg-[#FF6B00] text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {explanationData?.type === 'simplified' ? '🔍 Simplified Explanation' :
                   explanationData?.type === 'examples' ? '🌟 Examples & Applications' :
                   '📚 Detailed Explanation'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-2xl text-white transition-colors hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                {isLoadingExplanation ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
                    <span className="ml-3 text-gray-600">Generating explanation...</span>
                  </div>
                ) : explanationData ? (
                  <>
                    {/* Original Question */}
                    <div className="p-4 mb-4 border-l-4 border-gray-400 rounded-lg bg-gray-50">
                      <h4 className="flex items-center mb-2 font-semibold text-gray-800">
                        <span className="mr-2">❓</span>
                        Original Question:
                      </h4>
                      <div className="leading-relaxed text-gray-700">
                        <ReactMarkdown>{explanationData.original_question}</ReactMarkdown>
                      </div>
                    </div>
                    
                    {/* Original Answer */}
                    <div className="p-4 mb-4 border-l-4 border-blue-400 rounded-lg bg-blue-50">
                      <h4 className="flex items-center mb-2 font-semibold text-gray-800">
                        <span className="mr-2">💡</span>
                        Original Answer:
                      </h4>
                      <div className="leading-relaxed text-gray-700">
                        <ReactMarkdown>{explanationData.original_answer}</ReactMarkdown>
                      </div>
                    </div>
                    
                    {/* Enhanced Explanation with Markdown */}
                    <div className="p-4 border-l-4 border-green-400 rounded-lg bg-green-50">
                      <h4 className="flex items-center mb-3 font-semibold text-gray-800">
                        <span className="mr-2">
                          {explanationData?.type === 'simplified' ? '🔍' :
                           explanationData?.type === 'examples' ? '🌟' : '📚'}
                        </span>
                        {explanationData?.type === 'simplified' ? 'Simplified Explanation:' :
                         explanationData?.type === 'examples' ? 'Examples & Applications:' :
                         'Detailed Explanation:'}
                      </h4>
                      <div className="prose-sm prose text-gray-700 max-w-none">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={tomorrow}
                                  language={match[1]}
                                  PreTag="div"
                                  className="text-sm"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            h1: ({ children }) => (
                              <h1 className="mt-4 mb-3 text-xl font-bold text-gray-800 first:mt-0">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mt-3 mb-2 text-lg font-semibold text-gray-800">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mt-3 mb-2 text-base font-medium text-gray-800">{children}</h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-3 leading-relaxed text-gray-700">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-3 space-y-1 text-gray-700 list-disc list-inside">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-3 space-y-1 text-gray-700 list-decimal list-inside">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="leading-relaxed">{children}</li>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="py-2 pl-4 mb-3 italic text-gray-600 border-l-4 border-orange-400 bg-orange-50">
                                {children}
                              </blockquote>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-gray-800">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-gray-700">{children}</em>
                            ),
                          }}
                        >
                          {displayedExplanation}
                        </ReactMarkdown>
                        {isTyping && (
                          <span className="inline-block w-0.5 h-4 bg-[#FF6B00] animate-pulse ml-0.5"></span>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              
              {/* Footer */}
              <div className="flex justify-end p-4 border-t bg-gray-50">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#e55a00] transition-colors duration-200 font-medium"
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
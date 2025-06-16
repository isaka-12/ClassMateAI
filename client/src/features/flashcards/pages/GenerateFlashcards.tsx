import React, { useState, useRef } from "react";
import axios from "axios";
import { FlashcardItem, type FlashcardItemRef } from "../components/FlashcardItem";
import { FlashcardLoader } from "../components/FlashcardLoader";

interface Flashcard {
  question: string;
  answer: string;
}
const APP_URL = import.meta.env.VITE_API_URL ;
const GenerateFlashcards: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const flashcardRef = useRef<FlashcardItemRef>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${APP_URL}/flashcards/generate-flashcards`, formData);
      setFlashcards(response.data.flashcards);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      flashcardRef.current?.resetFlip();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      flashcardRef.current?.resetFlip();
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      {loading && <FlashcardLoader />}
      
      <div className="min-h-screen p-4 text-white bg-primary">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-4xl font-bold text-secondary">
              🧠 Try Mode - Flashcards
            </h2>
            <p className="text-lg text-gray">
              Upload your study material and let ClassMate AI create interactive flashcards
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-[#1B263B]/50 backdrop-blur-md rounded-xl p-6 border border-[#FF6B00]/30 mb-8">
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileChange}
                className="block w-full bg-[#0D1B2A] text-[#E0E1DD] border-2 border-dashed border-[#FF6B00]/50 rounded-lg p-4 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FF6B00] file:text-white hover:file:bg-orange-600 focus:border-[#FF6B00] transition-colors"
              />

              <button
                onClick={handleUpload}
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8500] text-white py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg shadow-lg"
                disabled={!file || loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "✨ Generate Flashcards"
                )}
              </button>
            </div>
          </div>

          {/* Flashcard Display */}
         {flashcards.length > 0 && (
            <div className="space-y-6">
              {/* Dynamic container with responsive height */}
              <div className="w-full h-[70vh] min-h-[400px] max-h-[800px] transition-all duration-300 ease-in-out">
                <FlashcardItem
                  key={`flashcard-${currentIndex}`}
                  ref={flashcardRef}
                  question={flashcards[currentIndex].question}
                  answer={flashcards[currentIndex].answer}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center bg-[#1B263B]/30 backdrop-blur-md rounded-lg p-4 border border-[#FF6B00]/20 w-full">
                <button
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#1B263B] border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white disabled:opacity-30 transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  
                  <span>Previous</span>
                </button>

                <div className="text-center">
                  <span className="text-lg font-semibold text-[#FF6B00]">
                    {currentIndex + 1}
                  </span>
                  <span className="text-[#778DA9]"> / </span>
                  <span className="text-lg font-semibold text-[#E0E1DD]">
                    {flashcards.length}
                  </span>
                  <div className="text-sm text-[#778DA9] mt-1">cards</div>
                </div>

                <button
                  onClick={nextCard}
                  disabled={currentIndex === flashcards.length - 1}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#1B263B] border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white disabled:opacity-30 transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GenerateFlashcards;
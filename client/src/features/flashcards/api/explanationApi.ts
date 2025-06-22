import axios from 'axios';

const APP_URL = import.meta.env.VITE_API_URL;

export interface ExplanationRequest {
  question: string;
  current_answer: string;
  context?:"",
}

export interface ExplanationResponse {
  success: boolean;
  explanation: string;
  original_question: string;
  original_answer: string;
  type?: 'detailed' | 'simplified' | 'examples';
  error?: string;
}

class ExplanationApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = APP_URL || 'http://localhost:8000';
  }

  /**
   * Get additional detailed explanation for a flashcard
   */
  async getAdditionalExplanation(data: ExplanationRequest): Promise<ExplanationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/explanations/additional-explanation`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        
      });

      return {
        ...response.data,
        type: 'detailed' as const,
        original_question: data.question,
        original_answer: data.current_answer,
      };
    } catch (error) {
      console.error('Error getting detailed explanation:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          explanation: `Sorry, I couldn't generate a detailed explanation right now. ${
            error.response?.data?.message || 'Please try again later.'
          }`,
          original_question: data.question,
          original_answer: data.current_answer,
          type: 'detailed',
          error: error.message,
        };
      }

      return {
        success: false,
        explanation: 'An unexpected error occurred. Please try again.',
        original_question: data.question,
        original_answer: data.current_answer,
        type: 'detailed',
        error: 'Unknown error',
      };
    }
  }

  /**
   * Get simplified explanation for a flashcard
   */
  async getSimplifiedExplanation(data: ExplanationRequest): Promise<ExplanationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/explanations/simplified-explanation`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
       
      });

      return {
        ...response.data,
        type: 'simplified' as const,
        original_question: data.question,
        original_answer: data.current_answer,
      };
    } catch (error) {
      console.error('Error getting simplified explanation:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          explanation: `Sorry, I couldn't generate a simplified explanation right now. ${
            error.response?.data?.message || 'Please try again later.'
          }`,
          original_question: data.question,
          original_answer: data.current_answer,
          type: 'simplified',
          error: error.message,
        };
      }

      return {
        success: false,
        explanation: 'An unexpected error occurred. Please try again.',
        original_question: data.question,
        original_answer: data.current_answer,
        type: 'simplified',
        error: 'Unknown error',
      };
    }
  }

  /**
   * Get examples and applications for a flashcard
   */
  async getExamples(data: ExplanationRequest): Promise<ExplanationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/explanations/examples`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
    
      });

      return {
        ...response.data,
        type: 'examples' as const,
        original_question: data.question,
        original_answer: data.current_answer,
      };
    } catch (error) {
      console.error('Error getting examples:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          explanation: `Sorry, I couldn't generate examples right now. ${
            error.response?.data?.message || 'Please try again later.'
          }`,
          original_question: data.question,
          original_answer: data.current_answer,
          type: 'examples',
          error: error.message,
        };
      }

      return {
        success: false,
        explanation: 'An unexpected error occurred. Please try again.',
        original_question: data.question,
        original_answer: data.current_answer,
        type: 'examples',
        error: 'Unknown error',
      };
    }
  }

  /**
   * Generic explanation method that can handle different types
   */
  async getExplanation(
    data: ExplanationRequest, 
    type: 'detailed' | 'simplified' | 'examples' = 'detailed'
  ): Promise<ExplanationResponse> {
    switch (type) {
      case 'detailed':
        return this.getAdditionalExplanation(data);
      case 'simplified':
        return this.getSimplifiedExplanation(data);
      case 'examples':
        return this.getExamples(data);
      default:
        return this.getAdditionalExplanation(data);
    }
  }
}

// Export singleton instance
export const explanationApi = new ExplanationApi();

// Export the class for potential custom instances
export default ExplanationApi;

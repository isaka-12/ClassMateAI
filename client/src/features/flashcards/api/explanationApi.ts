const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ExplanationRequest {
  question: string;
  current_answer: string;
  context?: string;
}

export interface ExplanationResponse {
  success: boolean;
  explanation: string;
  type?: string;
  original_question: string;
  original_answer: string;
  error?: string;
}

export const explanationApi = {
  async getAdditionalExplanation(request: ExplanationRequest): Promise<ExplanationResponse> {
    const response = await fetch(`${API_URL}/explanations/additional-explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getSimplifiedExplanation(request: Omit<ExplanationRequest, 'context'>): Promise<ExplanationResponse> {
    const response = await fetch(`${API_URL}/explanations/simplified-explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getExamples(request: Omit<ExplanationRequest, 'context'>): Promise<ExplanationResponse> {
    const response = await fetch(`${API_URL}/explanations/examples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
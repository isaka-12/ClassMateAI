# app/services/cohere_service.py

import os
import cohere
import json
import re
from dotenv import load_dotenv

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def generate_flashcards_from_text(text: str) -> list:
    prompt = f"""
Create flashcards from the following text. Return ONLY a valid JSON array of flashcard objects.

Text:
{text[:4000]}

Return exactly this format (valid JSON only):
[
  {{
    "question": "What is...?",
    "answer": "The answer is..."
  }},
  {{
    "question": "How does...?",
    "answer": "It works by..."
  }}
]

Important: Return ONLY the JSON array, no other text.
"""

    try:
        response = co.chat(
            message=prompt,
            model="command-r-plus",
            temperature=0.3,
            chat_history=[],
        )
        
        print(f"Cohere raw response: {response.text}")
        
        # Clean the response text
        response_text = response.text.strip()
        
        # Try to extract JSON from the response
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            json_text = json_match.group(0)
            flashcards = json.loads(json_text)
            print(f"Parsed flashcards: {flashcards}")
            return flashcards
        else:
            print("No JSON array found in response")
            # Fallback: create basic flashcards from the text
            return create_fallback_flashcards(text[:1000])
            
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return create_fallback_flashcards(text[:1000])
    except Exception as e:
        print(f"Cohere API error: {e}")
        return create_fallback_flashcards(text[:1000])

def create_fallback_flashcards(text: str) -> list:
    """Create basic flashcards as fallback"""
    sentences = text.split('. ')
    flashcards = []
    
    for i, sentence in enumerate(sentences[:5]):  # Limit to 5 flashcards
        if len(sentence.strip()) > 10:
            flashcards.append({
                "question": f"What is mentioned about: {sentence[:50]}...?",
                "answer": sentence.strip()
            })
    
    return flashcards if flashcards else [{"question": "What is the main topic?", "answer": "Please review the uploaded content."}]
# app/services/cohere_service.py

import os
import cohere
import json
import re
from dotenv import load_dotenv

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def generate_flashcards_from_text(text: str) -> list:
    # Split large text into chunks to generate more flashcards
    chunk_size = 3000  # Reduced chunk size for better processing
    text_chunks = split_text_into_chunks(text, chunk_size)
    
    all_flashcards = []
    
    for i, chunk in enumerate(text_chunks):
        print(f"Processing chunk {i+1}/{len(text_chunks)}")
        
        # Calculate number of flashcards based on chunk length
        target_flashcards = max(3, min(8, len(chunk) // 200))  # 3-8 flashcards per chunk
        
        prompt = f"""
Create {target_flashcards} comprehensive flashcards from the following text. Focus on key concepts, definitions, processes, and important details. Return ONLY a valid JSON array of flashcard objects.

Text:
{chunk}

Return exactly this format (valid JSON only):
[
  {{
    "question": "What is...?",
    "answer": "The answer is..."
  }},
  {{
    "question": "How does...?",
    "answer": "It works by..."
  }},
  {{
    "question": "Why is...?",
    "answer": "Because..."
  }}
]

Requirements:
- Create exactly {target_flashcards} flashcards
- Questions should test understanding, not just memorization
- Include definitions, explanations, and key concepts
- Return ONLY the JSON array, no other text
"""

        try:
            response = co.chat(
                message=prompt,
                model="command-r-plus",
                temperature=0.4,  # Slightly higher for variety
                chat_history=[],
            )
            
            print(f"Cohere response for chunk {i+1}: {response.text[:200]}...")
            
            # Clean and extract JSON
            response_text = response.text.strip()
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            
            if json_match:
                json_text = json_match.group(0)
                chunk_flashcards = json.loads(json_text)
                
                # Validate flashcards structure
                valid_flashcards = []
                for card in chunk_flashcards:
                    if isinstance(card, dict) and "question" in card and "answer" in card:
                        if card["question"].strip() and card["answer"].strip():
                            valid_flashcards.append(card)
                
                all_flashcards.extend(valid_flashcards)
                print(f"Added {len(valid_flashcards)} flashcards from chunk {i+1}")
            else:
                print(f"No valid JSON found in chunk {i+1}, creating fallback")
                all_flashcards.extend(create_fallback_flashcards(chunk, target_flashcards))
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error in chunk {i+1}: {e}")
            all_flashcards.extend(create_fallback_flashcards(chunk, target_flashcards))
        except Exception as e:
            print(f"Error processing chunk {i+1}: {e}")
            all_flashcards.extend(create_fallback_flashcards(chunk, target_flashcards))
    
    # Remove duplicates and limit total flashcards
    unique_flashcards = remove_duplicate_flashcards(all_flashcards)
    
    # Ensure we have at least some flashcards
    if not unique_flashcards:
        return create_fallback_flashcards(text[:2000], 5)
    
    print(f"Generated {len(unique_flashcards)} total flashcards")
    return unique_flashcards[:50]  # Limit to 50 flashcards max

def split_text_into_chunks(text: str, chunk_size: int) -> list:
    """Split text into chunks of approximately chunk_size characters"""
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    sentences = text.split('. ')
    current_chunk = ""
    
    for sentence in sentences:
        # If adding this sentence would exceed chunk_size, start a new chunk
        if len(current_chunk) + len(sentence) + 2 > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "
        else:
            current_chunk += sentence + ". "
    
    # Add the last chunk if it has content
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks

def remove_duplicate_flashcards(flashcards: list) -> list:
    """Remove duplicate flashcards based on similar questions"""
    seen_questions = set()
    unique_flashcards = []
    
    for card in flashcards:
        # Normalize question for comparison
        normalized_question = card["question"].lower().strip()
        
        # Check if we've seen a similar question
        is_duplicate = False
        for seen_q in seen_questions:
            # Simple similarity check - you could make this more sophisticated
            if normalized_question == seen_q or (
                len(normalized_question) > 20 and 
                normalized_question[:20] == seen_q[:20]
            ):
                is_duplicate = True
                break
        
        if not is_duplicate:
            seen_questions.add(normalized_question)
            unique_flashcards.append(card)
    
    return unique_flashcards

def create_fallback_flashcards(text: str, target_count: int = 3) -> list:
    """Create basic flashcards as fallback"""
    sentences = [s.strip() for s in text.split('. ') if len(s.strip()) > 20]
    flashcards = []
    
    question_templates = [
        "What is mentioned about: {}?",
        "How would you explain: {}?",
        "What is the significance of: {}?",
        "Can you describe: {}?",
        "What does the text say about: {}?"
    ]
    
    for i, sentence in enumerate(sentences[:target_count]):
        if len(sentence.strip()) > 20:
            
            words = sentence.split()[:4]
            key_phrase = " ".join(words)
            
            template = question_templates[i % len(question_templates)]
            question = template.format(key_phrase)
            
            flashcards.append({
                "question": question,
                "answer": sentence.strip()
            })
    
    return flashcards if flashcards else [
        {"question": "What is the main topic of this content?", "answer": "Please review the uploaded content for key concepts and details."}
    ]
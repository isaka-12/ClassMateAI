# app/services/gemini_service.py

import os
import google.generativeai as genai
import json
import re
import asyncio
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import time
from app.services.file_parser import extract_text_from_file

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API"))

# Initialize model with error handling
def get_gemini_model():
    """Get the best available Gemini model"""
    try:
        return genai.GenerativeModel('gemini-1.5-flash')
    except Exception:
        try:
            return genai.GenerativeModel('gemini-1.5-pro')
        except Exception:
            try:
                return genai.GenerativeModel('gemini-pro')
            except Exception as e:
                print(f"Error initializing Gemini model: {e}")
                raise

model = get_gemini_model()

async def generate_flashcards_from_file(file_content: bytes, filename: str) -> list:
    """Generate flashcards from file using your file parser to extract text"""
    
    try:
        # Use your file parser to extract text
        extracted_text = extract_text_from_file(filename, file_content)
        
        if not extracted_text or not extracted_text.strip():
            print(f"No text extracted from file: {filename}")
            return create_fallback_flashcards("No content extracted", 3)
        
        print(f"Extracted {len(extracted_text)} characters from {filename}")
        
        # For small files, process directly without chunking
        if len(extracted_text) < 4000:
            return await process_single_chunk_async(extracted_text, 0, 8)
        
        # For larger files, use async processing
        return await generate_flashcards_from_text(extracted_text)
        
    except Exception as e:
        print(f"Error processing file {filename}: {e}")
        return create_fallback_flashcards("Error processing file", 5)

async def generate_flashcards_from_text(text: str) -> list:
    """Generate flashcards from text using optimized Gemini processing"""
    
    start_time = time.time()
    
    # Optimize chunk size and limit chunks for speed
    chunk_size = 5000  # Optimal size for Gemini
    max_chunks = 6     # Limit total chunks for speed
    
    text_chunks = split_text_into_chunks(text, chunk_size)
    
    # Limit number of chunks to process
    if len(text_chunks) > max_chunks:
        print(f"Limiting processing to first {max_chunks} chunks for speed")
        text_chunks = text_chunks[:max_chunks]
    
    print(f"Processing {len(text_chunks)} chunks with Gemini...")
    
    # Process chunks concurrently
    all_flashcards = await process_chunks_concurrently(text_chunks)
    
    # Remove duplicates and limit total flashcards
    unique_flashcards = remove_duplicate_flashcards(all_flashcards)
    
    # Ensure we have at least some flashcards
    if not unique_flashcards:
        return create_fallback_flashcards(text[:3000], 8)
    
    end_time = time.time()
    print(f"Generated {len(unique_flashcards)} flashcards in {end_time - start_time:.2f} seconds")
    
    return unique_flashcards[:80]  # Limit to 35 for better UX

async def process_chunks_concurrently(text_chunks: list) -> list:
    """Process multiple chunks concurrently for speed"""
    
    # Use ThreadPoolExecutor for concurrent API calls
    loop = asyncio.get_event_loop()
    
    with ThreadPoolExecutor(max_workers=3) as executor:  # Reduced workers for API limits
        # Create tasks for each chunk
        tasks = []
        for i, chunk in enumerate(text_chunks):
            target_flashcards = max(4, min(8, len(chunk) // 500))  # 4-7 per chunk
            task = loop.run_in_executor(
                executor, 
                process_single_chunk, 
                chunk, 
                i, 
                target_flashcards
            )
            tasks.append(task)
        
        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Collect valid flashcards from all results
        all_flashcards = []
        for i, result in enumerate(results):
            if isinstance(result, list):
                all_flashcards.extend(result)
                print(f"Chunk {i+1}: Added {len(result)} flashcards")
            elif isinstance(result, Exception):
                print(f"Error in chunk {i+1}: {result}")
                # Add fallback for failed chunks
                all_flashcards.extend(create_fallback_flashcards(
                    text_chunks[i] if i < len(text_chunks) else "error", 3
                ))
        
        return all_flashcards

async def process_single_chunk_async(chunk: str, chunk_index: int, target_flashcards: int) -> list:
    """Async wrapper for single chunk processing"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, process_single_chunk, chunk, chunk_index, target_flashcards)

def process_single_chunk(chunk: str, chunk_index: int, target_flashcards: int) -> list:
    """Process a single chunk using Gemini API"""
    
    prompt = f"""
Analyze this text and create {target_flashcards} high-quality study flashcards. 

Focus on:
- Key concepts and definitions
- Important facts and figures
- Processes and procedures
- Critical thinking questions

Text to analyze:
{chunk}

Create diverse question types:
- "What is..." for definitions
- "How does..." for processes
- "Why is..." for reasoning
- "When/Where..." for context
- "Compare/Contrast..." for analysis

Return ONLY a valid JSON array in this exact format:
[
  {{"question": "What is the definition of [concept]?", "answer": "Complete definition with key details", "difficulty": "easy", "category": "definition"}},
  {{"question": "How does [process] work?", "answer": "Step-by-step explanation", "difficulty": "medium", "category": "process"}},
  {{"question": "Why is [concept] important?", "answer": "Explanation of significance", "difficulty": "medium", "category": "analysis"}}
]

Requirements:
- Create exactly {target_flashcards} flashcards
- Use clear, specific questions
- Provide complete, accurate answers
- Include difficulty and category
- Return ONLY JSON, no other text
"""

    try:
        # Optimized generation config for Gemini
        generation_config = genai.types.GenerationConfig(
            temperature=0.2,  # Lower for consistency
            top_p=0.8,
            top_k=40,
            max_output_tokens=2000,
        )
        
        # Safety settings to ensure content generation
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
        
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        if response.text:
            print(f"Gemini response for chunk {chunk_index + 1}: {len(response.text)} chars")
            
            # Clean and extract JSON
            response_text = response.text.strip()
            
            # Remove markdown code blocks
            response_text = re.sub(r'```json\s*', '', response_text)
            response_text = re.sub(r'```\s*', '', response_text)
            response_text = re.sub(r'^json\s*', '', response_text, flags=re.MULTILINE)
            
            # Extract JSON array
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            
            if json_match:
                json_text = json_match.group(0)
                try:
                    chunk_flashcards = json.loads(json_text)
                    valid_flashcards = validate_flashcards_fast(chunk_flashcards)
                    print(f"Chunk {chunk_index + 1}: Generated {len(valid_flashcards)} valid flashcards")
                    return valid_flashcards
                except json.JSONDecodeError as e:
                    print(f"JSON decode error in chunk {chunk_index + 1}: {e}")
                    print(f"Raw JSON: {json_text[:200]}...")
            else:
                print(f"No JSON array found in chunk {chunk_index + 1}")
                print(f"Response preview: {response_text[:200]}...")
        
        # Fast fallback
        print(f"Using fallback for chunk {chunk_index + 1}")
        return create_fallback_flashcards(chunk, target_flashcards)
        
    except Exception as e:
        print(f"Error in chunk {chunk_index + 1}: {e}")
        return create_fallback_flashcards(chunk, target_flashcards)

def validate_flashcards_fast(flashcards: list) -> list:
    """Fast validation of flashcards structure"""
    valid_flashcards = []
    
    if not isinstance(flashcards, list):
        print(f"Expected list, got {type(flashcards)}")
        return []
    
    for i, card in enumerate(flashcards):
        if isinstance(card, dict):
            question = card.get("question", "").strip()
            answer = card.get("answer", "").strip()
            
            if question and answer and len(question) > 5 and len(answer) > 5:
                valid_flashcards.append({
                    "question": question,
                    "answer": answer,
                    "difficulty": card.get("difficulty", "medium"),
                    "category": card.get("category", "concept")
                })
            else:
                print(f"Skipping invalid card {i}: missing or short question/answer")
        else:
            print(f"Skipping non-dict card {i}: {type(card)}")
    
    return valid_flashcards

def split_text_into_chunks(text: str, chunk_size: int) -> list:
    """Optimized text chunking for better context preservation"""
    if len(text) <= chunk_size:
        return [text]
    
    # First try splitting on double newlines (paragraphs)
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    
    if not paragraphs:
        # Fallback to sentence splitting
        return split_by_sentences(text, chunk_size)
    
    chunks = []
    current_chunk = ""
    
    for para in paragraphs:
        # If adding this paragraph would exceed chunk_size
        if len(current_chunk) + len(para) + 2 > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = para + "\n\n"
        else:
            current_chunk += para + "\n\n"
    
    # Add the last chunk
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    # If any chunk is still too long, split it further
    final_chunks = []
    for chunk in chunks:
        if len(chunk) > chunk_size * 1.3:  # 30% tolerance
            final_chunks.extend(split_by_sentences(chunk, chunk_size))
        else:
            final_chunks.append(chunk)
    
    return final_chunks

def split_by_sentences(text: str, chunk_size: int) -> list:
    """Fallback sentence-based splitting"""
    sentences = [s.strip() + '.' for s in text.split('.') if s.strip()]
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) + 1 > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
        else:
            current_chunk += sentence + " "
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks if chunks else [text[:chunk_size]]

def remove_duplicate_flashcards(flashcards: list) -> list:
    """Remove duplicate flashcards with improved similarity detection"""
    seen_questions = set()
    unique_flashcards = []
    
    for card in flashcards:
        question = card["question"].lower().strip()
        
        # Create a normalized version for comparison
        normalized = re.sub(r'[^\w\s]', '', question)
        words = normalized.split()
        
        # Create a signature using first few words
        signature = ' '.join(words[:5]) if len(words) >= 5 else normalized
        
        if signature not in seen_questions:
            seen_questions.add(signature)
            unique_flashcards.append(card)
    
    return unique_flashcards

def create_fallback_flashcards(text: str, target_count: int = 3) -> list:
    """Create basic flashcards as fallback when AI processing fails"""
    sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 20][:target_count * 2]
    
    flashcards = []
    question_templates = [
        "What is discussed about {}?",
        "How is {} described in the text?",
        "What are the key points regarding {}?",
        "What does the text explain about {}?",
        "What is the significance of {}?"
    ]
    
    difficulties = ["easy", "medium", "hard"]
    categories = ["definition", "concept", "application", "analysis"]
    
    for i, sentence in enumerate(sentences[:target_count]):
        if len(sentence.strip()) > 20:
            # Extract key terms from the sentence
            words = sentence.split()[:4]
            key_phrase = " ".join(words)
            
            template = question_templates[i % len(question_templates)]
            question = template.format(key_phrase)
            
            flashcards.append({
                "question": question,
                "answer": sentence.strip(),
                "difficulty": difficulties[i % len(difficulties)],
                "category": categories[i % len(categories)]
            })
    
    return flashcards if flashcards else [{
        "question": "What is the main topic of this content?",
        "answer": "This content covers important study material. Please review the original document for detailed information.",
        "difficulty": "easy",
        "category": "concept"
    }]

async def get_additional_explanation(question: str, current_answer: str, context: str = "") -> dict:
    """Get additional explanation for a flashcard using Gemini"""
    
    prompt = f"""
As an expert tutor, provide a comprehensive explanation for this study concept:

Question: {question}
Current Answer: {current_answer}
Additional Context: {context if context else "None provided"}

Provide a detailed explanation that includes:
1. Core concept breakdown
2. Real-world examples or analogies
3. Key points to remember
4. Common misconceptions to avoid
5. How this connects to broader topics

Make it educational and easy to understand.
"""

    try:
        loop = asyncio.get_event_loop()
        
        def _generate():
            return model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=1000
                )
            )
        
        response = await loop.run_in_executor(None, _generate)
        
        return {
            "success": True,
            "explanation": response.text.strip() if response.text else "No explanation generated",
            "original_question": question,
            "original_answer": current_answer
        }
        
    except Exception as e:
        print(f"Error getting additional explanation: {e}")
        return {
            "success": False,
            "error": str(e),
            "explanation": "Unable to generate additional explanation at this time.",
            "original_question": question,
            "original_answer": current_answer
        }

def get_simplified_explanation(question: str, current_answer: str) -> dict:
    """Get a simplified explanation using Gemini"""
    
    prompt = f"""
Simplify this explanation for better understanding:

Question: {question}
Current Answer: {current_answer}

Provide:
1. Simplified explanation using everyday language
2. Break down complex terms
3. Simple analogies or examples
4. Focus on the most important points

Keep it clear and concise.
"""

    try:
        response = model.generate_content(prompt)
        
        return {
            "success": True,
            "explanation": response.text.strip() if response.text else "No simplified explanation generated",
            "type": "simplified",
            "original_question": question,
            "original_answer": current_answer
        }
        
    except Exception as e:
        print(f"Error getting simplified explanation: {e}")
        return {
            "success": False,
            "error": str(e),
            "explanation": "Sorry, I couldn't generate a simplified explanation.",
            "original_question": question,
            "original_answer": current_answer
        }

def get_examples_and_applications(question: str, current_answer: str) -> dict:
    """Get practical examples and applications using Gemini"""
    
    prompt = f"""
Provide practical examples and real-world applications:

Question: {question}
Current Answer: {current_answer}

Include:
1. 3-4 concrete real-world examples
2. Practical applications in different fields
3. How this connects to everyday life
4. Current trends or developments

Make it relevant and engaging.
"""

    try:
        response = model.generate_content(prompt)
        
        return {
            "success": True,
            "explanation": response.text.strip() if response.text else "No examples generated",
            "type": "examples",
            "original_question": question,
            "original_answer": current_answer
        }
        
    except Exception as e:
        print(f"Error getting examples: {e}")
        return {
            "success": False,
            "error": str(e),
            "explanation": "Sorry, I couldn't generate examples at this time.",
            "original_question": question,
            "original_answer": current_answer
        }
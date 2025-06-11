# ClassMateAI Server

A FastAPI-based backend service for ClassMateAI that provides file parsing and AI-powered flashcard generation capabilities.

## Features

- **File Upload & Parsing**: Support for PDF, DOCX, and PPTX files
- **AI-Powered Flashcards**: Generate study flashcards using Cohere AI
- **User Authentication**: JWT-based authentication with MongoDB
- **Document Processing**: Extract text from various document formats

## Tech Stack

- **Framework**: FastAPI
- **Database**: MongoDB
- **AI Service**: Cohere API
- **File Processing**: pdfplumber, python-docx, python-pptx
- **Authentication**: JWT with bcrypt password hashing

## Project Structure

```
app/
├── main.py                 # FastAPI application entry point
├── db.py                   # MongoDB connection setup
├── auth/                   # Authentication module
│   ├── auth_router.py      # Auth endpoints
│   ├── auth_service.py     # Auth business logic
│   └── models.py           # Pydantic models
├── routers/                # API route handlers
│   ├── upload.py           # File upload endpoints
│   └── flashcards.py       # Flashcard generation endpoints
├── services/               # Business logic services
│   ├── file_parser.py      # File parsing service
│   └── cohere_service.py   # AI service integration
└── utils/                  # Utility functions
    ├── pdf_utils.py        # PDF text extraction
    ├── docx_utils.py       # DOCX text extraction
    └── pptx_utils.py       # PPTX text extraction
```

## Setup & Installation

### Prerequisites

- Python 3.8+
- MongoDB Atlas account (or local MongoDB)
- Cohere API key

### 1. Clone and Install Dependencies

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the server root:

```env
COHERE_API_KEY=your_cohere_api_key_here
SECRET_KEY=your_jwt_secret_key_here
```

### 3. Database Setup

Update the MongoDB connection string in `app/db.py`:

```python
client = MongoClient("your_mongodb_connection_string")
```

### 4. Run the Application

```bash
# Development server
uvicorn app.main:app --reload

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

### File Upload & Processing

#### Parse File
```http
POST /upload/upload/parse
Content-Type: multipart/form-data

file: [PDF/DOCX/PPTX file]
```

**Response:**
```json
{
  "text": "Extracted text preview (first 2000 characters)..."
}
```

### Flashcard Generation

#### Generate Flashcards
```http
POST /flashcards/generate-flashcards
Content-Type: multipart/form-data

file: [PDF/DOCX/PPTX file]
```

**Response:**
```json
{
  "count": 5,
  "flashcards": [
    {
      "question": "What is machine learning?",
      "answer": "Machine learning is a subset of artificial intelligence..."
    },
    {
      "question": "How does supervised learning work?",
      "answer": "Supervised learning uses labeled training data..."
    }
  ]
}
```

## Supported File Formats

- **PDF**: Text extraction using pdfplumber
- **DOCX**: Microsoft Word documents using python-docx
- **PPTX**: PowerPoint presentations using python-pptx
- **TXT**: Plain text files (UTF-8 encoding)

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid file, no text extracted)
- `401`: Unauthorized (invalid credentials)
- `500`: Internal Server Error (AI service issues, parsing errors)

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Formatting

```bash
# Install formatting tools
pip install black isort

# Format code
black .
isort .
```

### Adding New File Types

1. Create a new utility function in `app/utils/`
2. Add the file extension check in `app/services/file_parser.py`
3. Update the documentation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `COHERE_API_KEY` | API key for Cohere AI service | Yes |
| `SECRET_KEY` | JWT signing secret | No (defaults to 'devkey') |

## Deployment

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
COPY .env .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment-specific Configuration

- **Development**: Use `--reload` flag for auto-restart
- **Production**: Set proper `SECRET_KEY`, use HTTPS, configure CORS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the FastAPI documentation: https://fastapi.tiangolo.com/
- Cohere API documentation: https://docs.cohere.ai/
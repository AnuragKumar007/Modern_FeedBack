# Feedback Collector Backend API

A simple REST API for the Feedback Collector application that handles feedback submission and retrieval.

## Features

- Submit feedback via POST request
- Retrieve all feedbacks with pagination via GET request
- JSON file storage for simplicity
- Environment configuration with dotenv
- CORS protection for security

## API Endpoints

- `POST /api/submit-feedback`: Submit a new feedback entry
- `GET /api/feedbacks`: Get all feedback entries with pagination
- `GET /api/health`: Health check endpoint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory
```bash
cd backend
```
3. Install dependencies
```bash
npm install
```
4. Create a `.env` file (or use the existing one) with the following variables:
```
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Running the server

#### Development mode
```bash
npm run dev
```

#### Production mode
```bash
npm start
```

## API Usage

### Submit Feedback

**Endpoint:** `POST /api/submit-feedback`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is a feedback message."
}
```

**Response:**
```json
{
  "id": 1631234567890,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is a feedback message.",
  "date": "2023-09-10T12:34:56.789Z"
}
```

### Get All Feedback

**Endpoint:** `GET /api/feedbacks`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)

**Response:**
```json
{
  "total": 25,
  "data": [ 
    {
      "id": 1631234567890,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "This is a feedback message.",
      "date": "2023-09-10T12:34:56.789Z"
    },
    // More feedback entries...
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "hasMore": true
  }
}
```

## Data Storage

Feedback entries are stored in a JSON file at `src/data/feedback.json`. The file is created automatically when the server starts if it doesn't exist. 
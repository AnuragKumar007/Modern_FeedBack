# Feedback Collector Application

A modern feedback collection application with both frontend and backend components. This application allows users to submit feedback and view all submitted entries through an admin interface.

## Project Structure

- `/frontend`: React application with Tailwind CSS
- `/backend`: Node.js Express API server

## Features

### Frontend
- Modern, minimalistic design with intuitive UX
- Dark/light theme toggle
- Responsive design for all device sizes
- Form validation with error handling
- Animated components and micro-interactions
- Admin view for reviewing feedback submissions

### Backend
- RESTful API built with Express
- JSON file storage for simplicity
- Endpoints for submitting and retrieving feedback
- CORS protection for security
- Pagination support for feedback listing

## Getting Started

To run the complete application, you need to start both the backend and frontend servers.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Starting the Backend

1. Navigate to the backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm run dev
```

The backend server will start at http://localhost:5000 by default.

### Starting the Frontend

1. Navigate to the frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The frontend development server will start at http://localhost:5173 by default.

## API Endpoints

### Submit Feedback
- **URL**: `/api/submit-feedback`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is my feedback"
  }
  ```

### Get All Feedback
- **URL**: `/api/feedbacks`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)

Created by Anurag Kumar

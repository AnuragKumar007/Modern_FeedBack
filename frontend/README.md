# Feedback Collector Frontend

A modern, responsive web application that allows users to submit feedback and view submitted entries in an admin panel.

## Features

- Modern, minimalistic design with clean UI
- Dark/light theme toggle with user preference detection
- Responsive layout for all device sizes
- Form validation with error handling
- Animated components and micro-interactions
- Hash-based routing for feedback and admin views
- API integration with the backend service

## Technologies Used

- React 19
- Tailwind CSS for styling
- Custom animations and transitions
- Fetch API for backend communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (preferably on port 5000)

### Installation

1. Clone the repository
2. Navigate to the frontend directory
```bash
cd frontend
```
3. Install dependencies
```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

This will start the development server, usually at http://localhost:5173

## Application Structure

- `/src/components`: UI components for the application
  - `Navbar.jsx`: Navigation bar with theme toggle
  - `FeedbackForm.jsx`: Form for submitting feedback
  - `AdminView.jsx`: Admin interface to view all feedback
  - `Footer.jsx`: Footer with watermark
- `/src/context`: React context providers
  - `ThemeContext.jsx`: Dark/light theme management
- `/src/services`: API services
  - `api.js`: Communication with the backend API

## Usage

1. Open the application in your browser
2. Fill out the feedback form with your name, email, and message
3. Submit the form to store your feedback
4. Click "Admin View" in the navigation or navigate to `/#admin` to view all feedback entries
5. Toggle between light and dark theme using the button in the top right

## Backend Integration

The application is configured to connect to a backend API running at `http://localhost:5000/api`. Make sure the backend server is running before attempting to submit or retrieve feedback.

If the backend is not available, the application will show a warning banner and still function in a limited capacity.

## Customization

- Theme colors and UI elements can be adjusted in the Tailwind configuration
- API base URL can be changed in `/src/services/api.js`
- Additional form fields can be added to the FeedbackForm component

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

// Initialize express application
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOriginsRaw = process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173';
// Properly process origins by trimming whitespace
const allowedOrigins = allowedOriginsRaw
  .split(',')
  .map(origin => origin.trim());

console.log('Allowed origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // For debugging
    console.log('Request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // More lenient check for subdomains/development environments
      const originAllowed = allowedOrigins.some(allowed => 
        origin.includes(allowed) || allowed.includes(origin)
      );
      
      if (originAllowed) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Path to our JSON data file
const dataFilePath = path.join(__dirname, 'data', 'feedback.json');

// Ensure data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dataDir, { recursive: true });
    // Create empty feedback.json file with an empty array
    await fs.writeFile(dataFilePath, JSON.stringify([]));
  }
};

// Helper to read feedback data
const readFeedbackData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or has invalid JSON, return empty array
    return [];
  }
};

// Helper to write feedback data
const writeFeedbackData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};

// POST endpoint to submit feedback
app.post('/api/submit-feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Simple validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Read existing data
    const feedbackEntries = await readFeedbackData();
    
    // Create new feedback entry
    const newFeedback = {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString()
    };
    
    // Add to array and save
    feedbackEntries.unshift(newFeedback); // Add to the beginning for newest first
    await writeFeedbackData(feedbackEntries);
    
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// GET endpoint to retrieve all feedback
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbackEntries = await readFeedbackData();
    
    // Basic pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {
      total: feedbackEntries.length,
      data: feedbackEntries.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(feedbackEntries.length / limit),
        hasMore: endIndex < feedbackEntries.length
      }
    };
    
    res.json(results);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, async () => {
  await ensureDataDirectory();
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
}); 
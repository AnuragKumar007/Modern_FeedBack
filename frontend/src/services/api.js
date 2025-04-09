// Use environment variable with fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// If VITE_API_URL doesn't include '/api', add it
const apiUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

/**
 * Submit a new feedback entry
 * @param {Object} feedbackData - The feedback data (name, email, message)
 * @returns {Promise<Object>} - The created feedback entry
 */
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${apiUrl}/submit-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get all feedback entries with pagination
 * @param {number} page - The page number
 * @param {number} limit - The number of items per page
 * @returns {Promise<Object>} - The paginated feedback entries
 */
export const getFeedbacks = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${apiUrl}/feedbacks?page=${page}&limit=${limit}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to retrieve feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    throw error;
  }
};

/**
 * Check if the backend API is available
 * @returns {Promise<boolean>} - Whether the API is available
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${apiUrl}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}; 
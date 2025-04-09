import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import FeedbackForm from './components/FeedbackForm';
import AdminView from './components/AdminView';
import Footer from './components/Footer';
import { checkApiHealth } from './services/api';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('feedback');
  const [apiStatus, setApiStatus] = useState({
    isChecking: true,
    isOnline: false,
    message: 'Checking connection to backend...'
  });
  
  // Reference to the AdminView component for refreshing
  const adminViewRef = useRef();

  // Check API connection on startup
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isHealthy = await checkApiHealth();
        
        setApiStatus({
          isChecking: false,
          isOnline: isHealthy,
          message: isHealthy 
            ? 'Connected to backend successfully' 
            : 'Unable to connect to backend. Some features may not work.'
        });
      } catch (error) {
        setApiStatus({
          isChecking: false,
          isOnline: false,
          message: 'Error connecting to backend. Please check if the server is running.'
        });
      }
    };
    
    checkConnection();
  }, []);

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setActiveView('admin');
      } else {
        setActiveView('feedback');
      }
    };

    // Set initial state based on URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When feedback is submitted successfully
  const handleSubmitFeedback = (newEntry) => {
    // If we're in the feedback view, switch to admin view to see the newly submitted feedback
    if (activeView === 'feedback') {
      window.location.hash = 'admin';
    }
    
    // Refresh the admin view to show the new feedback
    setTimeout(() => {
      if (adminViewRef.current && adminViewRef.current.refresh) {
        adminViewRef.current.refresh();
      }
    }, 500);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        
        {/* API Status Banner */}
        {!apiStatus.isChecking && !apiStatus.isOnline && (
          <div className="bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 text-center text-sm">
            {apiStatus.message}
          </div>
        )}
        
        <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              {/* Hero section */}
              <section className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
                  <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Your Feedback Matters
                  </span>
                </h1>
                <p className="max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                  Help us improve by sharing your thoughts and experiences.
                </p>
              </section>
              
              {/* Main content */}
              <div className="space-y-12">
                <FeedbackForm onSubmit={handleSubmitFeedback} />
                <AdminView ref={adminViewRef} />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

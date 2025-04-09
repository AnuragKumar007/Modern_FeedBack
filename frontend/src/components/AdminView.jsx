import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { getFeedbacks } from '../services/api';

const AdminView = forwardRef((props, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    data: [],
    total: 0,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasMore: false
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch feedback entries from the API
  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFeedbacks(currentPage, limit);
      setFeedbackData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to load feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  // Expose the refresh method to parent components
  useImperativeHandle(ref, () => ({
    refresh: fetchFeedbacks
  }));

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);
  
  // Add a manual refresh function
  const handleRefresh = () => {
    fetchFeedbacks();
  };
  
  const filteredEntries = feedbackData.data.filter(entry => 
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextPage = () => {
    if (feedbackData.pagination.hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div id="admin" className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin View</h2>
        <button 
          onClick={handleRefresh}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : feedbackData.total === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No feedback yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by submitting your first feedback.</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="max-h-96 overflow-y-auto">
                {filteredEntries.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No matching entries found
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEntries.map((entry) => (
                      <li 
                        key={entry.id}
                        className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 ${selectedEntry?.id === entry.id ? 'bg-blue-50 dark:bg-slate-700' : ''}`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{entry.name}</p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{entry.email}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(entry.date)}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{entry.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Pagination Controls */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing page {feedbackData.pagination.currentPage} of {feedbackData.pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className={`px-3 py-1 rounded-md ${currentPage <= 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!feedbackData.pagination.hasMore}
                    className={`px-3 py-1 rounded-md ${!feedbackData.pagination.hasMore ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              {selectedEntry ? (
                <div className="animate-fade-in h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedEntry.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(selectedEntry.date)}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{selectedEntry.email}</p>
                  <div className="prose dark:prose-invert overflow-auto flex-grow max-h-[300px]">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{selectedEntry.message}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <p>Select a feedback to view details</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default AdminView; 
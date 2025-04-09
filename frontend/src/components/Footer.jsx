const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 px-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} Fallon Studios Feedback. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500 text-sm font-medium text-center">
              <p className="animate-pulse-slow">
                Created by <span className="text-blue-500 dark:text-blue-400 font-semibold">Anurag Kumar (Falllon Studios Assessment)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
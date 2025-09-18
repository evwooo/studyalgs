import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
          
          <div className="text-center">
            <Link
              to="/algorithms"
              className="text-primary-600 hover:text-primary-500 flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Browse Algorithms</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

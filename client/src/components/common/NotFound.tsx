import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="text-center">
        <h1 className="font-bold text-gray-300 text-9xl">404</h1>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="max-w-md mx-auto mb-8 text-gray-600">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
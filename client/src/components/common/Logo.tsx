import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center text-xl font-bold transition-transform duration-300 transform text-secondary hover:scale-105">
      {/* <div className="p-2 mr-2 text-white bg-blue-600 rounded-lg">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div> */}
     ClassMate<span className="text-xl font-bold text-white">AI</span>
    </div>
  );
};

export default Logo;
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`relative rounded-lg shadow-md p-[2px] ${className}`}
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--primary) 30%, var(--secondary) 70%)',
      }}
    >
      <div className="bg-primary rounded-[calc(0.5rem-2px)] w-full h-full p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:scale-105">
        {children}
      </div>
    </div>
  );
};

export default Card;
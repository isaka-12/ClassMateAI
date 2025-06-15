import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={` rounded-lg shadow-md border-2 border-gradient-t from-secondary to-primary  ${className}`}>
      {children}
    </div>
  );
};

export default Card;
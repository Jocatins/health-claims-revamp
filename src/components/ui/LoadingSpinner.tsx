import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', color = 'text-gray-500' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-20 h-20',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin ${sizeClasses[size]} ${color} border-4 border-solid border-t-transparent rounded-full`}
        style={{ borderWidth: '4px' }}
      ></div>
    </div>
  );
};
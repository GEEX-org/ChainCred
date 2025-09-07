import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No contributions yet",
  description = "Start earning rewards by submitting your contributions",
  buttonText = "Submit First Contribution",
  onButtonClick,
  showButton = true,
  icon
}) => {
  return (
    <div className="text-center py-24">
      <div className="w-16 h-16 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center">
        {icon || <CodeBracketIcon className="w-8 h-8 text-gray-500" />}
      </div>
      <h2 className="text-xl font-light text-white mb-2">{title}</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
        {description}
      </p>
      {showButton && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="px-6 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
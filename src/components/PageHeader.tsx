import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface PageHeaderProps {
  title: string;
  description: string;
  showSubmitButton?: boolean;
  onSubmitClick?: () => void;
  submitButtonText?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  showSubmitButton = false,
  onSubmitClick,
  submitButtonText = "Submit"
}) => {
  return (
    <div className="flex justify-between items-start mb-16">
      <div>
        <h1 className="text-3xl font-light text-white mb-2">{title}</h1>
        <p className="text-gray-400 text-sm max-w-md">
          {description}
        </p>
      </div>
      {showSubmitButton && onSubmitClick && (
        <button
          onClick={onSubmitClick}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{submitButtonText}</span>
        </button>
      )}
    </div>
  );
};

export default PageHeader;
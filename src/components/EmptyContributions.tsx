import React from 'react';
import { CodeBracketIcon, PlusIcon } from '@heroicons/react/24/outline';

interface EmptyContributionsProps {
  isConnected: boolean;
  onSubmitClick: () => void;
}

const EmptyContributions: React.FC<EmptyContributionsProps> = ({
  isConnected,
  onSubmitClick
}) => {
  return (
    <div className="text-center py-32">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-2xl mb-8 group">
        <CodeBracketIcon className="w-10 h-10 text-white/40 group-hover:text-white/60 transition-colors" />
      </div>
      <h2 className="text-2xl font-light text-white mb-4">No contributions yet</h2>
      <p className="text-white/50 font-light mb-12 max-w-sm mx-auto leading-relaxed">
        Start earning rewards by submitting your valuable open-source contributions
      </p>
      {isConnected && (
        <button
          onClick={onSubmitClick}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors group"
        >
          <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Submit First Contribution</span>
        </button>
      )}
    </div>
  );
};

export default EmptyContributions;
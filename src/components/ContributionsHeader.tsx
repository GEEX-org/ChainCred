import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ContributionsHeaderProps {
  isConnected: boolean;
  onSubmitClick: () => void;
}

const ContributionsHeader: React.FC<ContributionsHeaderProps> = ({
  isConnected,
  onSubmitClick
}) => {
  return (
    <div className="text-center mb-20">
      <h1 className="text-4xl lg:text-5xl font-light mb-4 text-white">
        Contributions
      </h1>
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
      <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed mb-12">
        Submit your open-source work and earn rewards through transparent community validation
      </p>
      
      {isConnected && (
        <button
          onClick={onSubmitClick}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors group"
        >
          <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Submit Contribution</span>
        </button>
      )}
    </div>
  );
};

export default ContributionsHeader;
import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { ContributionCategory } from '../utils/web3';

interface SubmitContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    title: string;
    description: string;
    projectUrl: string;
    githubPR: string;
    category: string;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SubmitContributionModal: React.FC<SubmitContributionModalProps> = ({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onSubmit
}) => {
  const categories = [
    { value: 'bug-fix', label: 'Bug Fix', contractValue: ContributionCategory.BugFix },
    { value: 'feature', label: 'New Feature', contractValue: ContributionCategory.Feature },
    { value: 'security', label: 'Security', contractValue: ContributionCategory.Security },
    { value: 'documentation', label: 'Documentation', contractValue: ContributionCategory.Documentation },
    { value: 'performance', label: 'Performance', contractValue: ContributionCategory.Performance },
    { value: 'research', label: 'Research', contractValue: ContributionCategory.Research },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-light text-white mb-2">Submit Contribution</h2>
              <div className="w-16 h-px bg-gradient-to-r from-white/40 to-transparent"></div>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70">
                Contribution Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors font-light"
                placeholder="Brief title of your contribution"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors h-32 resize-none font-light"
                placeholder="Detailed description of your contribution and its impact"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFormDataChange({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors font-light"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value} className="bg-black text-white">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Project URL
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => onFormDataChange({ ...formData, projectUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors font-light"
                  placeholder="https://github.com/project/repo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  GitHub PR/Issue URL
                </label>
                <input
                  type="url"
                  value={formData.githubPR}
                  onChange={(e) => onFormDataChange({ ...formData, githubPR: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors font-light"
                  placeholder="https://github.com/project/repo/pull/123"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white/70 font-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 text-white font-light"
              >
                Submit Contribution
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitContributionModal;
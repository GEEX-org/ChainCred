import React, { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface ContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  loading?: boolean;
}

interface FormData {
  title: string;
  description: string;
  projectUrl: string;
  githubPR: string;
  category: string;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    projectUrl: '',
    githubPR: '',
    category: 'bug-fix'
  });

  const categories = [
    { value: 'bug-fix', label: 'Bug Fix' },
    { value: 'feature', label: 'Feature' },
    { value: 'security', label: 'Security' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'performance', label: 'Performance' },
    { value: 'research', label: 'Research' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectUrl: '',
      githubPR: '',
      category: 'bug-fix'
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-950 border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light text-white">Submit Contribution</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                placeholder="Brief title of your contribution"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors h-24 resize-none"
                placeholder="Detailed description of your contribution"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:border-gray-500 focus:outline-none transition-colors"
                disabled={loading}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => handleInputChange('projectUrl', e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                  placeholder="https://github.com/project/repo"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub PR URL
                </label>
                <input
                  type="url"
                  value={formData.githubPR}
                  onChange={(e) => handleInputChange('githubPR', e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                  placeholder="https://github.com/project/repo/pull/123"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2 px-4 bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContributionForm;
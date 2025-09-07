import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { web3Service, ContributionCategory } from '../utils/web3';
import { 
  PlusIcon,
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  HandRaisedIcon,
  XCircleIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface Contribution {
  id: number;
  title: string;
  description: string;
  projectUrl: string;
  githubPR: string;
  contributor: string;
  category: number;
  submissionTime: Date;
  approvalVotes: number;
  rejectionVotes: number;
  totalValidators: number;
  status: number;
  rewardAmount: string;
  claimed: boolean;
  isMock?: boolean;
}

const Contributions: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    githubPR: '',
    category: 'bug-fix'
  });

  useEffect(() => {
    fetchContributions();
  }, [isConnected, account]);

  const fetchContributions = async () => {
    // Mock contributions data
    const mockContributions: Contribution[] = [
      {
        id: 1,
        title: "Enhanced Smart Contract Gas Optimization",
        description: "Optimized gas usage in core DeFi smart contracts, reducing transaction costs by 35% through efficient storage patterns and optimized loops.",
        projectUrl: "https://github.com/defi-protocol/core-contracts",
        githubPR: "https://github.com/defi-protocol/core-contracts/pull/247",
        contributor: "0x742d35Cc6634C0532925a3b8D404fddBD4f4d4d4",
        category: ContributionCategory.Performance,
        submissionTime: new Date('2024-01-15'),
        approvalVotes: 15,
        rejectionVotes: 2,
        totalValidators: 18,
        status: 1, // Approved
        rewardAmount: "350",
        claimed: true,
        isMock: true
      },
      {
        id: 2,
        title: "Cross-Chain Bridge Security Audit",
        description: "Comprehensive security review and penetration testing of the multi-chain bridge protocol. Identified and fixed critical vulnerabilities.",
        projectUrl: "https://github.com/bridge-protocol/core",
        githubPR: "https://github.com/bridge-protocol/core/pull/89",
        contributor: "0x8ba1f109551bD432803012645Hac136c2c2e2c2e",
        category: ContributionCategory.Security,
        submissionTime: new Date('2024-01-12'),
        approvalVotes: 22,
        rejectionVotes: 1,
        totalValidators: 25,
        status: 1, // Approved
        rewardAmount: "500",
        claimed: false,
        isMock: true
      },
      {
        id: 3,
        title: "GraphQL API Performance Enhancement",
        description: "Implemented advanced caching mechanisms and query optimization for the DAO's GraphQL API, improving response times by 60%.",
        projectUrl: "https://github.com/oss-dao/api-server",
        githubPR: "https://github.com/oss-dao/api-server/pull/156",
        contributor: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        category: ContributionCategory.Feature,
        submissionTime: new Date('2024-01-10'),
        approvalVotes: 8,
        rejectionVotes: 5,
        totalValidators: 15,
        status: 0, // Pending
        rewardAmount: "0",
        claimed: false,
        isMock: true
      },
      {
        id: 4,
        title: "Rust Macro Improvements",
        description: "Fixed critical macro issues in Rust crates, improving compilation performance and developer experience.",
        projectUrl: "https://github.com/oss-dao/mobile-app",
        githubPR: "https://github.com/oss-dao/mobile-app/pull/78",
        contributor: "0x9876543210fedcba0987654321fedcba09876543",
        category: ContributionCategory.Feature,
        submissionTime: new Date('2024-01-08'),
        approvalVotes: 12,
        rejectionVotes: 8,
        totalValidators: 20,
        status: 2, // Rejected
        rewardAmount: "0",
        claimed: false,
        isMock: true
      },
      {
        id: 5,
        title: "Documentation Overhaul",
        description: "Complete restructure of project documentation with interactive tutorials, API references, and multilingual support.",
        projectUrl: "https://github.com/oss-dao/documentation",
        githubPR: "https://github.com/oss-dao/documentation/pull/234",
        contributor: "0x456789abcdef0123456789abcdef012345678901",
        category: ContributionCategory.Documentation,
        submissionTime: new Date('2024-01-05'),
        approvalVotes: 18,
        rejectionVotes: 3,
        totalValidators: 21,
        status: 1, // Approved
        rewardAmount: "275",
        claimed: true,
        isMock: true
      }
    ];

    try {
      setLoading(true);
      
      if (web3Service.isContractsDeployed()) {
        const fetchedContributions = await web3Service.getAllContributions();
        
        if (fetchedContributions && fetchedContributions.length > 0) {
          const realContributions = fetchedContributions.map(c => ({ ...c, isMock: false }));
          setContributions([...realContributions, ...mockContributions].sort((a, b) => b.id - a.id));
        } else {
          setContributions(mockContributions);
        }
      } else {
        setContributions(mockContributions);
      }
      
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      setContributions(mockContributions);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'bug-fix', label: 'Bug Fix', contractValue: ContributionCategory.BugFix },
    { value: 'feature', label: 'Feature', contractValue: ContributionCategory.Feature },
    { value: 'security', label: 'Security', contractValue: ContributionCategory.Security },
    { value: 'documentation', label: 'Documentation', contractValue: ContributionCategory.Documentation },
    { value: 'performance', label: 'Performance', contractValue: ContributionCategory.Performance },
    { value: 'research', label: 'Research', contractValue: ContributionCategory.Research },
  ];

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      case 2:
        return <ExclamationCircleIcon className="w-4 h-4 text-red-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'text-green-400 bg-green-400/10';
      case 2:
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Pending';
    }
  };

  const getCategoryColor = (category: number) => {
    const colors: { [key: number]: string } = {
      [ContributionCategory.BugFix]: 'bg-red-500/10 text-red-400',
      [ContributionCategory.Feature]: 'bg-blue-500/10 text-blue-400',
      [ContributionCategory.Security]: 'bg-purple-500/10 text-purple-400',
      [ContributionCategory.Documentation]: 'bg-amber-500/10 text-amber-400',
      [ContributionCategory.Performance]: 'bg-emerald-500/10 text-emerald-400',
      [ContributionCategory.Research]: 'bg-pink-500/10 text-pink-400',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-400';
  };

  const getCategoryName = (category: number) => {
    const names: { [key: number]: string } = {
      [ContributionCategory.BugFix]: 'Bug Fix',
      [ContributionCategory.Feature]: 'Feature',
      [ContributionCategory.Security]: 'Security',
      [ContributionCategory.Documentation]: 'Documentation',
      [ContributionCategory.Performance]: 'Performance',
      [ContributionCategory.Research]: 'Research',
    };
    return names[category] || 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const category = categories.find(c => c.value === formData.category);
      if (!category) {
        alert('Invalid category selected');
        return;
      }

      const tx = await web3Service.submitContribution(
        formData.title,
        formData.description,
        formData.projectUrl,
        formData.githubPR,
        category.contractValue
      );
      
      alert('Contribution submitted successfully!');
      setFormData({ title: '', description: '', projectUrl: '', githubPR: '', category: 'bug-fix' });
      setShowSubmitForm(false);
      fetchContributions();
    } catch (error) {
      console.error('Failed to submit contribution:', error);
      alert('Failed to submit contribution: ' + (error as Error).message);
    }
  };

  const handleVote = async (contributionId: number, approve: boolean) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const tx = await web3Service.validateContribution(contributionId, approve);
      alert('Vote submitted successfully!');
      fetchContributions();
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote: ' + (error as Error).message);
    }
  };

  const handleClaimReward = async (contributionId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const tx = await web3Service.claimReward(contributionId);
      alert('Reward claimed successfully!');
      fetchContributions();
    } catch (error) {
      console.error('Failed to claim reward:', error);
      alert('Failed to claim reward: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading contributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Contributions</h1>
            <p className="text-gray-400 text-sm max-w-md">
              Submit your work and earn rewards through community validation
            </p>
          </div>
          {isConnected && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Submit</span>
            </button>
          )}
        </div>

        {/* Contributions List */}
        {contributions.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center">
              <CodeBracketIcon className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-light text-white mb-2">No contributions yet</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
              Start earning rewards by submitting your contributions
            </p>
            {isConnected && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="px-6 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100 transition-colors"
              >
                Submit First Contribution
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {contributions.map((contribution) => (
              <div 
                key={contribution.id} 
                className="bg-gray-950 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-white">{contribution.title}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(contribution.status)}`}>
                          {getStatusIcon(contribution.status)}
                          <span>{getStatusText(contribution.status)}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(contribution.category)}`}>
                          {getCategoryName(contribution.category)}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed max-w-3xl">
                        {contribution.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-6 text-xs text-gray-500 mb-6">
                    <span>
                      {contribution.contributor.slice(0, 6)}...{contribution.contributor.slice(-4)}
                    </span>
                    <span>{contribution.submissionTime.toLocaleDateString()}</span>
                    {contribution.projectUrl && (
                      <a
                        href={contribution.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Project</span>
                      </a>
                    )}
                    {contribution.githubPR && (
                      <a
                        href={contribution.githubPR}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <CodeBracketIcon className="w-3 h-3" />
                        <span>PR</span>
                      </a>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-medium text-green-400">{contribution.approvalVotes}</div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-red-400">{contribution.rejectionVotes}</div>
                      <div className="text-xs text-gray-500">Rejected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-gray-300">{contribution.totalValidators}</div>
                      <div className="text-xs text-gray-500">Total Validators</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isConnected && contribution.status === 0 && contribution.contributor !== account && (
                    <div className="flex space-x-3 mb-4">
                      <button
                        onClick={() => handleVote(contribution.id, true)}
                        className="flex-1 py-2 px-4 bg-green-900/30 text-green-400 text-sm font-medium hover:bg-green-900/50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <HandRaisedIcon className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleVote(contribution.id, false)}
                        className="flex-1 py-2 px-4 bg-red-900/30 text-red-400 text-sm font-medium hover:bg-red-900/50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {/* Reward */}
                  {contribution.status === 1 && (
                    <div className="bg-green-900/20 border border-green-800/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-green-400">
                            {contribution.rewardAmount} OSS Tokens
                          </div>
                          <div className="text-xs text-gray-500">Reward Amount</div>
                        </div>
                        {contribution.contributor === account && !contribution.claimed && (
                          <button
                            onClick={() => handleClaimReward(contribution.id)}
                            className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                          >
                            Claim
                          </button>
                        )}
                        {contribution.claimed && (
                          <div className="text-xs text-green-400 font-medium">
                            Claimed
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Form Modal */}
        {showSubmitForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-950 border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-light text-white">Submit Contribution</h2>
                  <button
                    onClick={() => setShowSubmitForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
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
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                      placeholder="Brief title of your contribution"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors h-24 resize-none"
                      placeholder="Detailed description of your contribution"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:border-gray-500 focus:outline-none transition-colors"
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
                        onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                        placeholder="https://github.com/project/repo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        GitHub PR URL
                      </label>
                      <input
                        type="url"
                        value={formData.githubPR}
                        onChange={(e) => setFormData({ ...formData, githubPR: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                        placeholder="https://github.com/project/repo/pull/123"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowSubmitForm(false)}
                      className="flex-1 py-2 px-4 bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contributions;
import React from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  HandRaisedIcon,
  XCircleIcon,
  LinkIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

interface ContributionCardProps {
  contribution: {
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
  };
  isConnected?: boolean;
  currentAccount?: string;
  onVote?: (contributionId: number, approve: boolean) => void;
  onClaimReward?: (contributionId: number) => void;
}

const ContributionCard: React.FC<ContributionCardProps> = ({
  contribution,
  isConnected = false,
  currentAccount = '',
  onVote,
  onClaimReward
}) => {
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
      0: 'bg-red-500/10 text-red-400', // BugFix
      1: 'bg-blue-500/10 text-blue-400', // Feature
      2: 'bg-purple-500/10 text-purple-400', // Security
      3: 'bg-amber-500/10 text-amber-400', // Documentation
      4: 'bg-emerald-500/10 text-emerald-400', // Performance
      5: 'bg-pink-500/10 text-pink-400', // Research
    };
    return colors[category] || 'bg-gray-500/10 text-gray-400';
  };

  const getCategoryName = (category: number) => {
    const names: { [key: number]: string } = {
      0: 'Bug Fix',
      1: 'Feature',
      2: 'Security',
      3: 'Documentation',
      4: 'Performance',
      5: 'Research',
    };
    return names[category] || 'Unknown';
  };

  return (
    <div className="bg-gray-950 border border-gray-800 hover:border-gray-700 transition-colors">
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
        {isConnected && contribution.status === 0 && contribution.contributor !== currentAccount && onVote && (
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => onVote(contribution.id, true)}
              className="flex-1 py-2 px-4 bg-green-900/30 text-green-400 text-sm font-medium hover:bg-green-900/50 transition-colors flex items-center justify-center space-x-2"
            >
              <HandRaisedIcon className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onVote(contribution.id, false)}
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
              {contribution.contributor === currentAccount && !contribution.claimed && onClaimReward && (
                <button
                  onClick={() => onClaimReward(contribution.id)}
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
  );
};

export default ContributionCard;
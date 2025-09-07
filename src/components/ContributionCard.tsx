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
import { ContributionCategory } from '../utils/web3';

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

interface ContributionCardProps {
  contribution: Contribution;
  isConnected: boolean;
  account: string | null;
  onVote: (contributionId: number, approve: boolean) => void;
  onClaimReward: (contributionId: number) => void;
}

const ContributionCard: React.FC<ContributionCardProps> = ({
  contribution,
  isConnected,
  account,
  onVote,
  onClaimReward
}) => {
  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircleIcon className="w-4 h-4 text-white/70" />;
      case 2:
        return <ExclamationCircleIcon className="w-4 h-4 text-white/70" />;
      default:
        return <ClockIcon className="w-4 h-4 text-white/70" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 2:
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
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
      [ContributionCategory.BugFix]: 'bg-red-500/10 text-red-400 border-red-400/20',
      [ContributionCategory.Feature]: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
      [ContributionCategory.Security]: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
      [ContributionCategory.Documentation]: 'bg-amber-500/10 text-amber-400 border-amber-400/20',
      [ContributionCategory.Performance]: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
      [ContributionCategory.Research]: 'bg-pink-500/10 text-pink-400 border-pink-400/20',
    };
    return colors[category] || 'bg-white/5 text-white/60 border-white/10';
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

  return (
    <div className="group bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-xl font-medium text-white group-hover:text-white transition-colors">
                {contribution.title}
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1.5 ${getStatusColor(contribution.status)}`}>
                {getStatusIcon(contribution.status)}
                <span>{getStatusText(contribution.status)}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(contribution.category)}`}>
                {getCategoryName(contribution.category)}
              </div>
            </div>
            <p className="text-white/60 font-light leading-relaxed max-w-3xl group-hover:text-white/70 transition-colors">
              {contribution.description}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center space-x-8 text-sm text-white/40 mb-8">
          <span className="font-mono">
            {contribution.contributor.slice(0, 6)}...{contribution.contributor.slice(-4)}
          </span>
          <span>{contribution.submissionTime.toLocaleDateString()}</span>
          {contribution.projectUrl && (
            <a
              href={contribution.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-white/40 hover:text-white transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Project</span>
            </a>
          )}
          {contribution.githubPR && (
            <a
              href={contribution.githubPR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-white/40 hover:text-white transition-colors"
            >
              <CodeBracketIcon className="w-4 h-4" />
              <span>Pull Request</span>
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-light text-green-400 mb-1">{contribution.approvalVotes}</div>
            <div className="text-xs text-white/40 font-medium">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-red-400 mb-1">{contribution.rejectionVotes}</div>
            <div className="text-xs text-white/40 font-medium">Rejected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-white mb-1">{contribution.totalValidators}</div>
            <div className="text-xs text-white/40 font-medium">Total Validators</div>
          </div>
        </div>

        {/* Voting Actions */}
        {isConnected && contribution.status === 0 && contribution.contributor !== account && (
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => onVote(contribution.id, true)}
              className="flex-1 py-3 px-4 bg-green-500/10 text-green-400 font-medium border border-green-400/20 rounded-xl hover:bg-green-500/20 hover:border-green-400/30 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <HandRaisedIcon className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onVote(contribution.id, false)}
              className="flex-1 py-3 px-4 bg-red-500/10 text-red-400 font-medium border border-red-400/20 rounded-xl hover:bg-red-500/20 hover:border-red-400/30 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <XCircleIcon className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </div>
        )}

        {/* Reward Section */}
        {contribution.status === 1 && (
          <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium text-green-400 mb-1">
                  {contribution.rewardAmount} OSS Tokens
                </div>
                <div className="text-sm text-white/40">Reward Amount</div>
              </div>
              {contribution.contributor === account && !contribution.claimed && (
                <button
                  onClick={() => onClaimReward(contribution.id)}
                  className="px-6 py-2 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
                >
                  Claim Reward
                </button>
              )}
              {contribution.claimed && (
                <div className="text-sm text-green-400 font-medium">
                  ✓ Claimed
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
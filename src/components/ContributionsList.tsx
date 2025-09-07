import React from 'react';
import {
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  HandRaisedIcon,
  XCircleIcon,
  LinkIcon
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

interface ContributionsListProps {
  contributions: Contribution[];
  isConnected: boolean;
  account: string | null;
  onVote: (contributionId: number, approve: boolean) => void;
  onClaimReward: (contributionId: number) => void;
  onShowSubmitForm: () => void;
}

const ContributionsList: React.FC<ContributionsListProps> = ({
  contributions,
  isConnected,
  account,
  onVote,
  onClaimReward,
  onShowSubmitForm
}) => {
  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: // Approved
        return <CheckCircleIcon className="w-5 h-5 text-white/70" />;
      case 2: // Rejected
        return <ExclamationCircleIcon className="w-5 h-5 text-white/70" />;
      default: // Pending
        return <ClockIcon className="w-5 h-5 text-white/70" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: // Approved
        return 'text-white/70 bg-white/10 border-white/20';
      case 2: // Rejected
        return 'text-white/60 bg-white/5 border-white/10';
      default: // Pending
        return 'text-white/60 bg-white/5 border-white/10';
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
    return 'bg-white/10 text-white/60 border-white/20';
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

  if (contributions.length === 0) {
    return (
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-xl mb-8">
              <CodeBracketIcon className="w-10 h-10 text-white/70" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-light text-white mb-6">
              No Contributions Yet
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-white/60 mb-8 max-w-md mx-auto font-light leading-relaxed">
              Start earning rewards by submitting your open-source contributions for community validation.
            </p>
            {isConnected ? (
              <button
                onClick={onShowSubmitForm}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <span className="text-white/70 font-light">Submit First Contribution</span>
              </button>
            ) : (
              <div className="text-sm text-white/50 font-light">
                Connect your wallet to submit contributions
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="space-y-8">
          {contributions.map((contribution) => (
            <div key={contribution.id} className="group">
              <div className="p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-xl font-medium text-white">{contribution.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 whitespace-nowrap ${getStatusColor(contribution.status)}`}>
                        {getStatusIcon(contribution.status)}
                        <span>{getStatusText(contribution.status)}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-light border whitespace-nowrap ${getCategoryColor(contribution.category)}`}>
                        {getCategoryName(contribution.category)}
                      </span>
                    </div>
                    <p className="text-white/60 mb-6 leading-relaxed font-light">{contribution.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-white/50 mb-6 font-light">
                      <span>
                        Contributor: <span className="text-white/70 font-mono">{contribution.contributor.slice(0, 8)}...{contribution.contributor.slice(-6)}</span>
                      </span>
                      <span>•</span>
                      <span>Submitted: {contribution.submissionTime.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      {contribution.projectUrl && (
                        <a
                          href={contribution.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-light"
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
                          className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-light"
                        >
                          <CodeBracketIcon className="w-4 h-4" />
                          <span>Pull Request</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Voting Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                    <div className="text-2xl font-light text-white mb-1">{contribution.approvalVotes}</div>
                    <div className="text-sm text-white/50 font-light">Approved</div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                    <div className="text-2xl font-light text-white mb-1">{contribution.rejectionVotes}</div>
                    <div className="text-sm text-white/50 font-light">Rejected</div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                    <div className="text-2xl font-light text-white mb-1">{contribution.totalValidators}</div>
                    <div className="text-sm text-white/50 font-light">Total Validators</div>
                  </div>
                </div>

                {/* Voting Buttons */}
                {isConnected && contribution.status === 0 && contribution.contributor !== account && (
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={() => onVote(contribution.id, true)}
                      className="flex-1 py-3 px-6 rounded-xl font-light transition-all duration-300 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                      <HandRaisedIcon className="w-5 h-5 flex-shrink-0" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onVote(contribution.id, false)}
                      className="flex-1 py-3 px-6 rounded-xl font-light transition-all duration-300 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                      <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {/* Reward Information */}
                {contribution.status === 1 && (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-light text-white">
                          {contribution.rewardAmount} OSS Tokens
                        </div>
                        <div className="text-sm text-white/50 font-light">Approved Reward</div>
                      </div>
                      {contribution.contributor === account && !contribution.claimed && (
                        <button
                          onClick={() => onClaimReward(contribution.id)}
                          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white/70 font-light"
                        >
                          Claim Reward
                        </button>
                      )}
                      {contribution.claimed && (
                        <div className="text-white/70 font-light">
                          ✓ Reward Claimed
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContributionsList;
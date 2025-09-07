import React, { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { web3Service, ContributionCategory } from "../utils/web3";
import {
  PlusIcon,
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  HandRaisedIcon,
  XCircleIcon,
  LinkIcon,
  SparklesIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";

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
    title: "",
    description: "",
    projectUrl: "",
    githubPR: "",
    category: "bug-fix",
  });

  useEffect(() => {
    fetchContributions();
  }, [isConnected, account]);

  const fetchContributions = async () => {
    // Mock contributions data
    const mockContributions: Contribution[] = [
      {
        id: 1,
        title: "Advanced Memory Pool Optimization",
        description:
          "Implemented sophisticated memory management techniques in the transaction pool, achieving 42% reduction in memory footprint and faster transaction processing.",
        projectUrl: "https://github.com/defi-protocol/core-contracts",
        githubPR: "https://github.com/defi-protocol/core-contracts/pull/247",
        contributor: "0x742d35Cc6634C0532925a3b8D404fddBD4f4d4d4",
        category: ContributionCategory.Performance,
        submissionTime: new Date("2024-01-15"),
        approvalVotes: 15,
        rejectionVotes: 2,
        totalValidators: 18,
        status: 1, // Approved
        rewardAmount: "350",
        claimed: true,
        isMock: true,
      },
      {
        id: 2,
        title: "Zero-Knowledge Proof Integration",
        description:
          "Developed and integrated zk-SNARK verification modules for enhanced privacy in cross-chain transactions. Includes comprehensive test coverage and formal verification.",
        projectUrl: "https://github.com/bridge-protocol/core",
        githubPR: "https://github.com/bridge-protocol/core/pull/89",
        contributor: "0x8ba1f109551bD432803012645Hac136c2c2e2c2e",
        category: ContributionCategory.Security,
        submissionTime: new Date("2024-01-12"),
        approvalVotes: 22,
        rejectionVotes: 1,
        totalValidators: 25,
        status: 1, // Approved
        rewardAmount: "500",
        claimed: false,
        isMock: true,
      },
      {
        id: 3,
        title: "Real-time WebSocket Event System",
        description:
          "Built a scalable real-time notification system using WebSockets and Redis pub/sub, enabling instant updates for governance proposals and voting events.",
        projectUrl: "https://github.com/oss-dao/api-server",
        githubPR: "https://github.com/oss-dao/api-server/pull/156",
        contributor: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        category: ContributionCategory.Feature,
        submissionTime: new Date("2024-01-10"),
        approvalVotes: 8,
        rejectionVotes: 5,
        totalValidators: 15,
        status: 0, // Pending
        rewardAmount: "0",
        claimed: false,
        isMock: true,
      },
      {
        id: 4,
        title: "Multi-signature Wallet Enhancement",
        description:
          "Enhanced the mobile wallet with multi-signature capabilities, hardware wallet integration, and biometric authentication for improved security.",
        projectUrl: "https://github.com/oss-dao/mobile-app",
        githubPR: "https://github.com/oss-dao/mobile-app/pull/78",
        contributor: "0x9876543210fedcba0987654321fedcba09876543",
        category: ContributionCategory.Feature,
        submissionTime: new Date("2024-01-08"),
        approvalVotes: 12,
        rejectionVotes: 8,
        totalValidators: 20,
        status: 2, // Rejected
        rewardAmount: "0",
        claimed: false,
        isMock: true,
      },
      {
        id: 5,
        title: "Interactive Developer Playground",
        description:
          "Created an interactive coding environment with live smart contract testing, step-by-step tutorials, and integrated IDE features for new developers.",
        projectUrl: "https://github.com/oss-dao/documentation",
        githubPR: "https://github.com/oss-dao/documentation/pull/234",
        contributor: "0x456789abcdef0123456789abcdef012345678901",
        category: ContributionCategory.Documentation,
        submissionTime: new Date("2024-01-05"),
        approvalVotes: 18,
        rejectionVotes: 3,
        totalValidators: 21,
        status: 1, // Approved
        rewardAmount: "275",
        claimed: true,
        isMock: true,
      },
    ];

    try {
      setLoading(true);

      if (web3Service.isContractsDeployed()) {
        const fetchedContributions = await web3Service.getAllContributions();

        if (fetchedContributions && fetchedContributions.length > 0) {
          const realContributions = fetchedContributions.map((c) => ({
            ...c,
            isMock: false,
          }));
          setContributions(
            [...realContributions, ...mockContributions].sort(
              (a, b) => b.id - a.id
            )
          );
        } else {
          setContributions(mockContributions);
        }
      } else {
        setContributions(mockContributions);
      }
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
      setContributions(mockContributions);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      value: "bug-fix",
      label: "Bug Fix",
      contractValue: ContributionCategory.BugFix,
    },
    {
      value: "feature",
      label: "Feature",
      contractValue: ContributionCategory.Feature,
    },
    {
      value: "security",
      label: "Security",
      contractValue: ContributionCategory.Security,
    },
    {
      value: "documentation",
      label: "Documentation",
      contractValue: ContributionCategory.Documentation,
    },
    {
      value: "performance",
      label: "Performance",
      contractValue: ContributionCategory.Performance,
    },
    {
      value: "research",
      label: "Research",
      contractValue: ContributionCategory.Research,
    },
  ];

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircleIcon className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <ExclamationCircleIcon className="w-4 h-4 text-rose-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case 2:
        return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default:
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const getCategoryColor = (category: number) => {
    const colors: { [key: number]: string } = {
      [ContributionCategory.BugFix]:
        "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30",
      [ContributionCategory.Feature]:
        "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30",
      [ContributionCategory.Security]:
        "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30",
      [ContributionCategory.Documentation]:
        "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
      [ContributionCategory.Performance]:
        "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30",
      [ContributionCategory.Research]:
        "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-500/30",
    };
    return (
      colors[category] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
    );
  };

  const getCategoryName = (category: number) => {
    const names: { [key: number]: string } = {
      [ContributionCategory.BugFix]: "Bug Fix",
      [ContributionCategory.Feature]: "Feature",
      [ContributionCategory.Security]: "Security",
      [ContributionCategory.Documentation]: "Documentation",
      [ContributionCategory.Performance]: "Performance",
      [ContributionCategory.Research]: "Research",
    };
    return names[category] || "Unknown";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const category = categories.find((c) => c.value === formData.category);
      if (!category) {
        alert("Invalid category selected");
        return;
      }

      // Create a new mock contribution with current form data
      const newContribution: Contribution = {
        id: contributions.length + 1,
        title: formData.title,
        description: formData.description,
        projectUrl: formData.projectUrl,
        githubPR: formData.githubPR,
        contributor: account || "0x" + Math.random().toString(16).substr(2, 40),
        category: category.contractValue,
        submissionTime: new Date(),
        approvalVotes: 0,
        rejectionVotes: 0,
        totalValidators: 0,
        status: 0, // Pending
        rewardAmount: "0",
        claimed: false,
        isMock: true,
      };

      // Add the new contribution to the list
      setContributions((prev) => [newContribution, ...prev]);

      // Try to submit to blockchain if available
      if (web3Service.isContractsDeployed()) {
        try {
          await web3Service.submitContribution(
            formData.title,
            formData.description,
            formData.projectUrl,
            formData.githubPR,
            category.contractValue
          );
        } catch (error) {
          console.error("Blockchain submission failed:", error);
        }
      }

      alert("Contribution submitted successfully!");
      setFormData({
        title: "",
        description: "",
        projectUrl: "",
        githubPR: "",
        category: "bug-fix",
      });
      setShowSubmitForm(false);
    } catch (error) {
      console.error("Failed to submit contribution:", error);
      alert("Failed to submit contribution: " + (error as Error).message);
    }
  };

  const handleVote = async (contributionId: number, approve: boolean) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const tx = await web3Service.validateContribution(
        contributionId,
        approve
      );
      alert("Vote submitted successfully!");
      fetchContributions();
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Failed to vote: " + (error as Error).message);
    }
  };

  const handleClaimReward = async (contributionId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const tx = await web3Service.claimReward(contributionId);
      alert("Reward claimed successfully!");
      fetchContributions();
    } catch (error) {
      console.error("Failed to claim reward:", error);
      alert("Failed to claim reward: " + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg font-light">
            Loading contributions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-sm font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                <SparklesIcon className="w-4 h-4" />
                <span>Community Contributions</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-light text-white leading-tight">
                Shape the Future
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                Submit your work, earn rewards, and help build the next
                generation of open-source technology through community
                validation.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-400">
                    {contributions.filter((c) => c.status === 1).length}{" "}
                    Approved
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-400">
                    {contributions.filter((c) => c.status === 0).length} Pending
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-400">
                    {contributions.length} Total
                  </span>
                </div>
              </div>
            </div>
            {isConnected && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <PlusIcon className="w-5 h-5" />
                    <span>Submit Contribution</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Contributions List */}
        {contributions.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
              <CodeBracketIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-light text-white mb-4">
              No contributions yet
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
              Be the first to contribute and start earning rewards from the
              community
            </p>
            {isConnected && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl"
              >
                Submit First Contribution
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="group bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-light text-white group-hover:text-blue-100 transition-colors">
                          {contribution.title}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-2 ${getStatusColor(
                            contribution.status
                          )}`}
                        >
                          {getStatusIcon(contribution.status)}
                          <span>{getStatusText(contribution.status)}</span>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                            contribution.category
                          )}`}
                        >
                          {getCategoryName(contribution.category)}
                        </div>
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
                        {contribution.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                        {contribution.contributor.slice(2, 4).toUpperCase()}
                      </div>
                      <span className="font-mono">
                        {contribution.contributor.slice(0, 6)}...
                        {contribution.contributor.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>
                        {contribution.submissionTime.toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    {contribution.projectUrl && (
                      <a
                        href={contribution.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group/link"
                      >
                        <LinkIcon className="w-4 h-4 group-hover/link:rotate-45 transition-transform" />
                        <span>Project</span>
                      </a>
                    )}
                    {contribution.githubPR && (
                      <a
                        href={contribution.githubPR}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group/link"
                      >
                        <CodeBracketIcon className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                        <span>Pull Request</span>
                      </a>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div className="text-3xl font-light text-emerald-400 mb-1">
                        {contribution.approvalVotes}
                      </div>
                      <div className="text-sm text-gray-400">Approved</div>
                    </div>
                    <div className="text-center p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                      <div className="text-3xl font-light text-rose-400 mb-1">
                        {contribution.rejectionVotes}
                      </div>
                      <div className="text-sm text-gray-400">Rejected</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <div className="text-3xl font-light text-blue-400 mb-1">
                        {contribution.totalValidators}
                      </div>
                      <div className="text-sm text-gray-400">Validators</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isConnected &&
                    contribution.status === 0 &&
                    contribution.contributor !== account && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <button
                          onClick={() => handleVote(contribution.id, true)}
                          className="group/btn py-4 px-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 rounded-xl flex items-center justify-center space-x-3"
                        >
                          <HandRaisedIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleVote(contribution.id, false)}
                          className="group/btn py-4 px-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium hover:bg-rose-500/20 hover:border-rose-500/40 transition-all duration-200 rounded-xl flex items-center justify-center space-x-3"
                        >
                          <XCircleIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                  {/* Reward */}
                  {contribution.status === 1 && (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                            <GiftIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-xl font-light text-emerald-400 mb-1">
                              {contribution.rewardAmount} OSS Tokens
                            </div>
                            <div className="text-sm text-gray-400">
                              Reward Amount
                            </div>
                          </div>
                        </div>
                        {contribution.contributor === account &&
                          !contribution.claimed && (
                            <button
                              onClick={() => handleClaimReward(contribution.id)}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              Claim Reward
                            </button>
                          )}
                        {contribution.claimed && (
                          <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Claimed</span>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-slate-800 to-gray-800 border border-gray-600/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-light text-white mb-2">
                      Submit New Contribution
                    </h2>
                    <p className="text-gray-400">
                      Share your work with the community and earn rewards
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSubmitForm(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="lg:col-span-2">
                      <label className="block text-lg font-medium text-gray-200 mb-3">
                        Contribution Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-4 bg-slate-900/50 border border-gray-600/50 text-white text-lg placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors rounded-xl"
                        placeholder="Brief, descriptive title of your contribution"
                        required
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-lg font-medium text-gray-200 mb-3">
                        Detailed Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-4 bg-slate-900/50 border border-gray-600/50 text-white text-lg placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors h-32 resize-none rounded-xl"
                        placeholder="Provide a comprehensive description of your contribution, including the problem solved and impact"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-200 mb-3">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-4 bg-slate-900/50 border border-gray-600/50 text-white text-lg focus:border-blue-500 focus:outline-none transition-colors rounded-xl"
                      >
                        {categories.map((category) => (
                          <option
                            key={category.value}
                            value={category.value}
                            className="bg-slate-800"
                          >
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-200 mb-3">
                        Project Repository
                      </label>
                      <input
                        type="url"
                        value={formData.projectUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectUrl: e.target.value,
                          })
                        }
                        className="w-full px-4 py-4 bg-slate-900/50 border border-gray-600/50 text-white text-lg placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors rounded-xl"
                        placeholder="https://github.com/organization/repository"
                        required
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-lg font-medium text-gray-200 mb-3">
                        Pull Request URL
                      </label>
                      <input
                        type="url"
                        value={formData.githubPR}
                        onChange={(e) =>
                          setFormData({ ...formData, githubPR: e.target.value })
                        }
                        className="w-full px-4 py-4 bg-slate-900/50 border border-gray-600/50 text-white text-lg placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors rounded-xl"
                        placeholder="https://github.com/organization/repository/pull/123"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <SparklesIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-blue-300 font-medium mb-2">
                          Contribution Guidelines
                        </h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>
                            • Ensure your contribution adds significant value to
                            the project
                          </li>
                          <li>
                            • Include detailed documentation and testing where
                            applicable
                          </li>
                          <li>
                            • Follow the project's coding standards and best
                            practices
                          </li>
                          <li>
                            • Your submission will be reviewed by community
                            validators
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700/50">
                    <button
                      type="button"
                      onClick={() => setShowSubmitForm(false)}
                      className="flex-1 py-4 px-6 bg-gray-700/50 text-gray-300 font-medium hover:bg-gray-700/70 transition-colors rounded-xl border border-gray-600/50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      Submit Contribution
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

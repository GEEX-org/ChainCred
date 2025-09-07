import React from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

// Import the new components
import DashboardStats from "../components/DashboardStats";
import WalletInfo from "../components/WalletInfo";
import RecentActivity from "../components/RecentActivity";
import ReputationDashboard from "../components/ReputationDashboard";

const Dashboard: React.FC = () => {
  const { isConnected, account, balance, tokenBalance } = useWeb3();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-xl mb-8">
              <ChartBarIcon className="w-10 h-10 text-white/70" />
            </div>

            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-light text-white mb-6">
              Connect Your Wallet
            </h2>

            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>

            {/* Description */}
            <div className="space-y-6">
              <p className="text-lg text-white/60 leading-relaxed font-light">
                Welcome to your Dashboard. Monitor your contributions, track rewards, and stay updated with the latest DAO activities in this comprehensive dashboard.
              </p>
              
              <p className="text-sm text-white/50 font-light">
                Connect your wallet to access personalized dashboard features
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-8 sm:space-y-0">
          {/* Header Content */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-light text-white">
              User Dashboard
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-white/40 to-transparent"></div>
            <p className="text-lg text-white/60 font-light leading-relaxed max-w-xl">
              Welcome back,{" "}
              <span className="text-white font-medium">contributor</span>!
              Here's your decentralized impact overview.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              to="/contributions"
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 whitespace-nowrap"
            >
              <PlusIcon className="w-5 h-5 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-300 flex-shrink-0" />
              <span className="text-white/70 group-hover:text-white transition-colors font-light">
                New Contribution
              </span>
            </Link>

            {/* <Link
              to="/proposals"
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 whitespace-nowrap"
            >
              <span className="text-white/70 group-hover:text-white transition-colors font-light">
                Governance
              </span>
              <ArrowTrendingUpIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors flex-shrink-0" />
            </Link> */}
          </div>
        </div>
      </div>

      {/* Wallet Info Component */}
      <WalletInfo
        account={account!}
        balance={balance}
        tokenBalance={tokenBalance}
      />

      {/* Stats Component */}
      <DashboardStats />

      {/* Performance Chart Placeholder */}
      {/* <div className="card-cyber">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold neon-text flex items-center space-x-2">
            <ChartBarIcon className="w-6 h-6 text-neon-blue" />
            <span>Performance Analytics</span>
          </h3>
          <div className="text-sm text-dark-400">Last 30 days</div>
        </div>
        <div className="h-64 bg-gradient-to-r from-dark-200/30 to-dark-300/30 rounded-lg border border-dark-400/30 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-blue to-accent-purple rounded-full flex items-center justify-center animate-pulse">
              <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-dark-400 mb-2">Analytics Dashboard</p>
            <p className="text-sm text-dark-500">
              Chart integration coming soon
            </p>
          </div>
        </div>
      </div> */}

      {/* Recent Activity Component */}
      <RecentActivity />

      <ReputationDashboard/>

    </div>
  );
};

export default Dashboard;

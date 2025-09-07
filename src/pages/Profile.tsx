import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { StarIcon } from '@heroicons/react/24/outline';
import StatsGrid from '../components/StatsGrid';
import AchievementGallery from '../components/AchievementGallery';
import ActivityTimeline from '../components/ActivityTimeline';
import ContributionAnalytics from '../components/ContributionAnalytics';

const Profile: React.FC = () => {
  const { isConnected, account } = useWeb3();

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-xl mb-6">
            <StarIcon className="w-7 h-7 text-white/70" />
          </div>
          <h2 className="text-2xl font-medium text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/60 font-light leading-relaxed mb-6">
            Connect your wallet to view your profile and track your open-source contributions.
          </p>
          <div className="text-sm text-white/40 font-light">
            Access your decentralized identity and achievements
          </div>
        </div>
      </div>
    );
  }

  // Calculate achievement points for header
  const achievements = [
    { earned: true, points: 50 },
    { earned: true, points: 200 },
    { earned: true, points: 500 },
    { earned: true, points: 1000 },
    { earned: false, points: 300 },
    { earned: false, points: 750 },
    { earned: false, points: 400 },
    { earned: false, points: 2000 }
  ];

  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);
  const earnedAchievements = achievements.filter(a => a.earned).length;

  return (
    <div className="space-y-12">
      {/* Profile Header */}
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-medium text-white shadow-lg">
            {account?.slice(2, 4).toUpperCase()}
          </div>
          {earnedAchievements > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-gray-900">
              <span className="text-xs font-medium text-gray-900">{earnedAchievements}</span>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-light text-white mb-4">Developer Profile</h1>
        
        <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg mb-4">
          <span className="text-white/70 font-mono text-sm">
            {account?.slice(0, 8)}...{account?.slice(-6)}
          </span>
        </div>
        
        <div className="text-sm text-white/50 font-light">
          <span className="text-emerald-300 font-medium">{totalPoints.toLocaleString()}</span> points earned from {earnedAchievements} achievements
        </div>
      </div>

      {/* Stats Grid Component */}
      <StatsGrid />

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {/* Achievement Gallery Component */}
          <AchievementGallery />
        </div>
        
        <div className="space-y-8">
          {/* Activity Timeline Component */}
          <ActivityTimeline />
        </div>
      </div>

      {/* Contribution Analytics Component */}
      <ContributionAnalytics />
    </div>
  );
};

export default Profile;
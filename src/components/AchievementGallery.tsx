import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface Achievement {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  rarity: string;
  points: number;
}

interface AchievementGalleryProps {
  className?: string;
}

const AchievementGallery: React.FC<AchievementGalleryProps> = ({ className = '' }) => {
  const achievements: Achievement[] = [
    {
      title: 'First Commit',
      description: 'Submit your first pull request',
      icon: '🚀',
      earned: true,
      rarity: 'Common',
      points: 50
    },
    {
      title: 'Code Reviewer',
      description: 'Review 25 pull requests',
      icon: '👁️',
      earned: true,
      rarity: 'Rare',
      points: 200
    },
    {
      title: 'Open Source Hero',
      description: 'Maintain an active project for 6 months',
      icon: '🌟',
      earned: true,
      rarity: 'Epic',
      points: 500
    },
    {
      title: 'Security Expert',
      description: 'Report and fix critical vulnerabilities',
      icon: '🛡️',
      earned: true,
      rarity: 'Legendary',
      points: 1000
    },
    {
      title: 'Community Builder',
      description: 'Help 100+ developers in discussions',
      icon: '🤝',
      earned: false,
      rarity: 'Rare',
      points: 300
    },
    {
      title: 'Performance Ninja',
      description: 'Optimize code reducing load time by 50%',
      icon: '⚡',
      earned: false,
      rarity: 'Epic',
      points: 750
    },
    {
      title: 'Documentation Guru',
      description: 'Write comprehensive guides for complex projects',
      icon: '📖',
      earned: false,
      rarity: 'Epic',
      points: 400
    },
    {
      title: 'Innovation Leader',
      description: 'Pioneer breakthrough technologies',
      icon: '💎',
      earned: false,
      rarity: 'Mythic',
      points: 2000
    }
  ];

  const getRarityIndicator = (rarity: string) => {
    const colors = {
      'Common': 'bg-gray-500',
      'Rare': 'bg-blue-400',
      'Epic': 'bg-purple-400',
      'Legendary': 'bg-orange-400',
      'Mythic': 'bg-pink-400'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <TrophyIcon className="w-6 h-6 text-white/70" />
          <h2 className="text-2xl font-light text-white">Achievements</h2>
        </div>
        <div className="flex items-center space-x-8 text-sm">
          <span className="text-white/50">
            <span className="text-white font-medium">{earnedCount}</span> of {achievements.length} unlocked
          </span>
          <span className="text-white/50">
            <span className="text-emerald-300 font-medium">{totalPoints.toLocaleString()}</span> points earned
          </span>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`group flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
              achievement.earned 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
            }`}
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl border border-white/10 ${
              achievement.earned 
                ? 'bg-white/10' 
                : 'bg-white/5 grayscale opacity-40'
            }`}>
              {achievement.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-medium ${
                  achievement.earned ? 'text-white' : 'text-white/40'
                }`}>
                  {achievement.title}
                </h3>
                <div className={`w-2 h-2 rounded-full ${getRarityIndicator(achievement.rarity)} ${
                  achievement.earned ? 'opacity-100' : 'opacity-30'
                }`} />
              </div>
              <p className={`text-sm font-light ${
                achievement.earned ? 'text-white/60' : 'text-white/30'
              }`}>
                {achievement.description}
              </p>
            </div>

            {/* Points */}
            <div className={`flex-shrink-0 text-right ${
              achievement.earned ? 'text-white/70' : 'text-white/20'
            }`}>
              <div className="text-sm font-medium">
                +{achievement.points}
              </div>
              <div className="text-xs text-white/40">
                {achievement.rarity}
              </div>
            </div>

            {/* Earned indicator */}
            {achievement.earned && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementGallery;
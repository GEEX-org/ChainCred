import React from 'react';
import { LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ExpertiseArea {
  name: string;
  percentage: number;
  gradient: string;
  color: string;
  delay: string;
}

interface CommunityStanding {
  rank: number;
  percentile: string;
  reputationScore: number;
  trustLevel: string;
}

interface ProfileInsightsProps {
  className?: string;
}

const ProfileInsights: React.FC<ProfileInsightsProps> = ({ className = '' }) => {
  const expertiseAreas: ExpertiseArea[] = [
    {
      name: 'Smart Contracts',
      percentage: 85,
      gradient: 'from-accent-green to-accent-emerald',
      color: 'text-accent-green',
      delay: '0s'
    },
    {
      name: 'Security Auditing',
      percentage: 78,
      gradient: 'from-accent-purple to-accent-violet',
      color: 'text-accent-purple',
      delay: '0.5s'
    },
    {
      name: 'Performance Optimization',
      percentage: 72,
      gradient: 'from-neon-blue to-primary-400',
      color: 'text-neon-blue',
      delay: '1s'
    }
  ];

  const communityStanding: CommunityStanding = {
    rank: 47,
    percentile: 'Top 5%',
    reputationScore: 2847,
    trustLevel: 'Verified'
  };

  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {/* Expertise Areas */}
      <div className="card-cyber">
        <h3 className="text-xl font-bold neon-text mb-6 flex items-center space-x-2">
          <LightBulbIcon className="w-6 h-6 text-neon-blue" />
          <span>Expertise Areas</span>
        </h3>
        <div className="space-y-4">
          {expertiseAreas.map((area, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-dark-700 font-medium">{area.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-400 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${area.gradient} h-3 rounded-full animate-pulse`} 
                    style={{ 
                      width: `${area.percentage}%`,
                      animationDelay: area.delay
                    }}
                  />
                </div>
                <span className={`text-sm ${area.color} font-semibold`}>
                  {area.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Standing */}
      <div className="card-cyber">
        <h3 className="text-xl font-bold neon-text mb-6 flex items-center space-x-2">
          <ShieldCheckIcon className="w-6 h-6 text-neon-blue" />
          <span>Community Standing</span>
        </h3>
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="text-4xl font-bold neon-text">#{communityStanding.rank}</div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-green to-accent-emerald rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">↗</span>
            </div>
          </div>
          <p className="text-dark-600 mb-6">Global Ranking</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-dark-300/30 to-dark-400/30 rounded-lg">
              <span className="text-dark-600">Percentile:</span>
              <span className="text-accent-green font-semibold">{communityStanding.percentile}</span>
            </div>
            <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-dark-300/30 to-dark-400/30 rounded-lg">
              <span className="text-dark-600">Reputation Score:</span>
              <span className="text-neon-blue font-semibold">{communityStanding.reputationScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-dark-300/30 to-dark-400/30 rounded-lg">
              <span className="text-dark-600">Trust Level:</span>
              <span className="text-accent-purple font-semibold">{communityStanding.trustLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInsights;
import React from 'react';
import { ChartBarIcon, FireIcon } from '@heroicons/react/24/outline';

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity levels
}

interface ImpactMetric {
  label: string;
  value: string;
  change: string;
  icon: string;
}

interface ContributionAnalyticsProps {
  className?: string;
}

const ContributionAnalytics: React.FC<ContributionAnalyticsProps> = ({ className = '' }) => {
  // Generate sample contribution data for the last 12 weeks
  const generateContributionData = (): ContributionDay[] => {
    const data: ContributionDay[] = [];
    const today = new Date();
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate realistic contribution patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseActivity = isWeekend ? 0.3 : 0.8;
      
      const count = Math.floor(Math.random() * 8 * baseActivity);
      const level = count === 0 ? 0 : Math.min(Math.floor(count / 2) + 1, 4);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count,
        level
      });
    }
    
    return data;
  };

  const contributionData = generateContributionData();
  
  // Calculate streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (let i = contributionData.length - 1; i >= 0; i--) {
    if (contributionData[i].count > 0) {
      tempStreak++;
      if (i === contributionData.length - 1 || currentStreak === 0) {
        currentStreak = tempStreak;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  const impactMetrics: ImpactMetric[] = [
    {
      label: 'Lines of Code',
      value: '42.3k',
      change: '+18%',
      icon: '📝'
    },
    {
      label: 'Files Changed',
      value: '1,247',
      change: '+23%',
      icon: '📁'
    },
    {
      label: 'Repositories',
      value: '28',
      change: '+3',
      icon: '📦'
    },
    {
      label: 'Pull Requests',
      value: '156',
      change: '+12',
      icon: '🔄'
    }
  ];

  const getActivityColor = (level: number): string => {
    const colors = [
      'bg-white/5',      // No activity
      'bg-emerald-500/30', // Low activity
      'bg-emerald-500/50', // Medium-low activity
      'bg-emerald-500/70', // Medium-high activity
      'bg-emerald-500'     // High activity
    ];
    return colors[level] || colors[0];
  };

  const totalContributions = contributionData.reduce((sum, day) => sum + day.count, 0);

  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {/* Activity Heatmap */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white flex items-center space-x-3">
            <ChartBarIcon className="w-5 h-5 text-white/70" />
            <span>Activity Overview</span>
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <FireIcon className="w-4 h-4 text-orange-400" />
              <span className="text-white/60">{currentStreak} day streak</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mb-4">
          <div className="grid grid-cols-12 gap-1 mb-3">
            {contributionData.map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm ${getActivityColor(day.level)} border border-white/5 hover:border-white/20 transition-colors`}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Less</span>
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-2 rounded-sm ${getActivityColor(level)}`}
                />
              ))}
            </div>
            <span className="text-white/40">More</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Total contributions:</span>
            <span className="text-white font-medium">{totalContributions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Longest streak:</span>
            <span className="text-white font-medium">{longestStreak} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Active days:</span>
            <span className="text-white font-medium">{contributionData.filter(d => d.count > 0).length}</span>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-6">Impact Metrics</h3>
        
        <div className="space-y-4">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-sm">
                  {metric.icon}
                </div>
                <div>
                  <div className="text-white font-medium">{metric.value}</div>
                  <div className="text-white/50 text-sm">{metric.label}</div>
                </div>
              </div>
              <div className="text-emerald-300 text-sm font-medium">
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-medium text-white">89%</div>
              <div className="text-xs text-white/50">Code Quality</div>
            </div>
            <div>
              <div className="text-xl font-medium text-white">4.8</div>
              <div className="text-xs text-white/50">Avg PR Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionAnalytics;
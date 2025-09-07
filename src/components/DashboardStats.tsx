import React from 'react';
import {
  CurrencyDollarIcon,
  TrophyIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const DashboardStats: React.FC = () => {
  const userStats = [
    {
      label: 'Total Earned',
      value: '955',
      suffix: 'OSS coins',
      icon: CurrencyDollarIcon,
      trend: '+18%'
    },
    {
      label: 'Contributions',
      value: '5',
      suffix: 'projects',
      icon: TrophyIcon,
      trend: '+2'
    },
    {
      label: 'Reputation Score',
      value: '345',
      suffix: 'points',
      icon: StarIcon,
      trend: '+156'
    },
    {
      label: 'Active Streak',
      value: '1',
      suffix: 'days',
      icon: FireIcon,
      trend: 'New!'
    }
  ];

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
            Your Impact
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Track your progress and see how your contributions are making a difference
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {userStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group text-center">
                <div className="space-y-6 p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Value */}
                  <div className="space-y-1">
                    <div className="text-2xl font-light text-white">
                      {stat.value}
                      {stat.suffix && (
                        <span className="text-base text-white/50 ml-1">{stat.suffix}</span>
                      )}
                    </div>
                    
                    {/* Trend */}
                    <div className="text-xs font-medium text-white/50 bg-white/10 border border-white/20 px-2 py-1 rounded-full inline-block">
                      {stat.trend}
                    </div>
                  </div>

                  {/* Label */}
                  <p className="text-sm text-white/50 font-light group-hover:text-white/60 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DashboardStats;
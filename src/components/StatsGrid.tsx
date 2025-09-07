import React from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  change: string;
}

interface StatsGridProps {
  className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ className = '' }) => {
  const stats: Stat[] = [
    {
      label: 'Total Contributions',
      value: '28',
      icon: ChartBarIcon,
      color: 'text-blue-300/70',
      change: '+12%'
    },
    {
      label: 'Total Earned',
      value: '4,300 OSS',
      icon: CurrencyDollarIcon,
      color: 'text-emerald-300/70',
      change: '+18%'
    },
    {
      label: 'Reputation Score',
      value: '2,847',
      icon: StarIcon,
      color: 'text-purple-300/70',
      change: '+5%'
    },
    {
      label: 'Active Streak',
      value: '23 days',
      icon: FireIcon,
      color: 'text-orange-300/70',
      change: 'New!'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Featured large card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold text-white mb-2 group-hover:text-white transition-colors">
              {stats[0].value}
            </div>
            <div className="text-lg text-white/60 mb-3 font-medium leading-relaxed group-hover:text-white/70 transition-colors">
              {stats[0].label}
            </div>
            <div className="text-sm text-emerald-300/70 font-medium group-hover:text-emerald-300 transition-colors">
              {stats[0].change}
            </div>
          </div>
          <div className="ml-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              {React.createElement(stats[0].icon, { className: `w-10 h-10 ${stats[0].color} group-hover:text-white/80 transition-colors duration-300` })}
            </div>
          </div>
        </div>
      </div>

      {/* Vertical stack for remaining cards */}
      <div className="space-y-4">
        {stats.slice(1).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index + 1}
              className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-lg mr-6 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                <Icon className={`w-5 h-5 ${stat.color} group-hover:text-white/80 transition-colors duration-300`} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="text-xl font-medium text-white mb-1 group-hover:text-white transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 font-light leading-relaxed group-hover:text-white/60 transition-colors">
                  {stat.label}
                </div>
              </div>

              {/* Change indicator */}
              <div className="text-xs text-emerald-300/70 font-medium group-hover:text-emerald-300 transition-colors ml-4">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsGrid;
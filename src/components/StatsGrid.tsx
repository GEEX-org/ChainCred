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
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="group bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-lg mb-4 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <Icon className={`w-5 h-5 ${stat.color} group-hover:text-white/80 transition-colors duration-300`} />
            </div>
            
            {/* Value */}
            <div className="text-xl font-medium text-white mb-1 group-hover:text-white transition-colors">
              {stat.value}
            </div>
            
            {/* Label */}
            <div className="text-sm text-white/50 mb-3 font-light leading-relaxed group-hover:text-white/60 transition-colors">
              {stat.label}
            </div>
            
            {/* Change indicator */}
            <div className="text-xs text-emerald-300/70 font-medium group-hover:text-emerald-300 transition-colors">
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
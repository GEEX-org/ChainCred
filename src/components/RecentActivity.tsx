import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const RecentActivity: React.FC = () => {
  const recentActivity = [
    {
      type: 'contribution',
      title: 'Smart Contract Gas Saver',
      description: 'Submitted a high-efficiency gas optimization patch during Hexafalls 2025.',
      amount: '+150 OSS',
      time: '2 hours ago',
      status: 'pending',
      category: 'Performance'
    },
    {
      type: 'reward',
      title: 'Bounty Winner',
      description: 'Won a bounty for completing a full-stack security audit for security project.',
      amount: '+500 OSS',
      time: '4 hours ago',
      status: 'completed',
      category: 'Security'
    },
    {
      type: 'vote',
      title: 'Final governance Voting',
      description: 'Voted on final governance round for project submissions at Nevo.',
      amount: '+5 OSS',
      time: '6 hours ago',
      status: 'completed',
      category: 'Governance'
    },
    {
      type: 'contribution',
      title: 'Grpc server api',
      description: 'Enhanced API layer for real-time queries for chatting systems.',
      amount: '+300 OSS',
      time: '10 hours ago',
      status: 'approved',
      category: 'Feature'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-white/70 bg-white/10 border-white/20';
      case 'approved':
        return 'text-white/70 bg-white/10 border-white/20';
      case 'pending':
        return 'text-white/60 bg-white/5 border-white/10';
      default:
        return 'text-white/50 bg-white/5 border-white/10';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <RocketLaunchIcon className="w-5 h-5" />;
      case 'reward':
        return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'vote':
        return <ChartBarIcon className="w-5 h-5" />;
      default:
        return <StarIcon className="w-5 h-5" />;
    }
  };

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
            Recent Activity
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Your latest contributions, rewards, and community interactions
          </p>
        </div>

        <div className="group">
          <div className="p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl">
                  <ClockIcon className="w-6 h-6 text-white/70" />
                </div>
                <h3 className="text-2xl font-light text-white">Activity Feed</h3>
              </div>
              <Link
                to="/profile"
                className="text-white/60 hover:text-white transition-colors font-light text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-white/70">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-white">{activity.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        <span className="text-xs font-light text-white/50">
                          {activity.category}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 font-light leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50 font-light">{activity.time}</span>
                        <span className="text-white/70 font-medium">{activity.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivity;
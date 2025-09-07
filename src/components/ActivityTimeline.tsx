import React from 'react';
import {
  ClockIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  BugAntIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Activity {
  type: 'commit' | 'review' | 'issue' | 'docs' | 'merge' | 'discussion';
  title: string;
  repository: string;
  date: string;
  impact: string;
  language?: string;
}

interface ActivityTimelineProps {
  className?: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ className = '' }) => {
  const recentActivity: Activity[] = [
    {
      type: 'commit',
      title: 'Fix memory leak in auth service',
      repository: 'ethereum/go-ethereum',
      date: '2 hours ago',
      impact: '+250 pts',
      language: 'Go'
    },
    {
      type: 'review',
      title: 'Reviewed PR: Add multi-signature support',
      repository: 'openzeppelin/contracts',
      date: '5 hours ago',
      impact: '+75 pts',
      language: 'Solidity'
    },
    {
      type: 'issue',
      title: 'Reported critical vulnerability in token transfer',
      repository: 'compound-finance/compound-protocol',
      date: '8 hours ago',
      impact: '+500 pts',
      language: 'Solidity'
    },
    {
      type: 'merge',
      title: 'Merged: Performance optimization for large datasets',
      repository: 'facebook/react',
      date: '12 hours ago',
      impact: '+150 pts',
      language: 'TypeScript'
    },
    {
      type: 'docs',
      title: 'Updated API documentation for v2.0',
      repository: 'nodejs/node',
      date: '1 day ago',
      impact: '+100 pts',
      language: 'JavaScript'
    },
    {
      type: 'discussion',
      title: 'Participated in architecture discussion',
      repository: 'vercel/next.js',
      date: '2 days ago',
      impact: '+50 pts',
      language: 'TypeScript'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <CodeBracketIcon className="w-4 h-4" />;
      case 'review':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'issue':
        return <BugAntIcon className="w-4 h-4" />;
      case 'merge':
        return <ArrowPathIcon className="w-4 h-4" />;
      case 'docs':
        return <DocumentTextIcon className="w-4 h-4" />;
      case 'discussion':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      default:
        return <CodeBracketIcon className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'commit':
        return 'text-emerald-300/70';
      case 'review':
        return 'text-blue-300/70';
      case 'issue':
        return 'text-orange-300/70';
      case 'merge':
        return 'text-purple-300/70';
      case 'docs':
        return 'text-cyan-300/70';
      case 'discussion':
        return 'text-pink-300/70';
      default:
        return 'text-white/70';
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'commit':
        return 'bg-emerald-400/10';
      case 'review':
        return 'bg-blue-400/10';
      case 'issue':
        return 'bg-orange-400/10';
      case 'merge':
        return 'bg-purple-400/10';
      case 'docs':
        return 'bg-cyan-400/10';
      case 'discussion':
        return 'bg-pink-400/10';
      default:
        return 'bg-white/10';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commit':
        return 'Commit';
      case 'review':
        return 'Review';
      case 'issue':
        return 'Issue';
      case 'merge':
        return 'Merge';
      case 'docs':
        return 'Docs';
      case 'discussion':
        return 'Discussion';
      default:
        return 'Activity';
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <ClockIcon className="w-5 h-5 text-white/70" />
        <h3 className="text-lg font-medium text-white">Recent Activity</h3>
      </div>
      
      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <div 
            key={index}
            className="group flex items-start space-x-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Activity Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getActivityBg(activity.type)} border border-white/10`}>
              <span className={getActivityColor(activity.type)}>
                {getActivityIcon(activity.type)}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded-full ${getActivityBg(activity.type)} ${getActivityColor(activity.type)} font-medium`}>
                  {getTypeLabel(activity.type)}
                </span>
                {activity.language && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/50">
                    {activity.language}
                  </span>
                )}
              </div>
              
              <h4 className="font-medium text-white mb-1 group-hover:text-white transition-colors">
                {activity.title}
              </h4>
              
              <div className="flex items-center space-x-2 text-sm text-white/50">
                <span className="truncate">{activity.repository}</span>
                <span>•</span>
                <span>{activity.date}</span>
              </div>
            </div>

            {/* Impact */}
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-medium text-emerald-300">
                {activity.impact}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-medium text-white">12</div>
            <div className="text-xs text-white/50">This Week</div>
          </div>
          <div>
            <div className="text-lg font-medium text-white">47</div>
            <div className="text-xs text-white/50">This Month</div>
          </div>
          <div>
            <div className="text-lg font-medium text-white">284</div>
            <div className="text-xs text-white/50">All Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
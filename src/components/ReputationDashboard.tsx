import React from 'react';
import {
  StarIcon,
  ShieldCheckIcon,
  TrophyIcon,
  CodeBracketIcon,
  UserGroupIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const ReputationDashboard: React.FC = () => {
  const reputationScore = 345;
  const maxScore = 500;
  const progressPercentage = (reputationScore / maxScore) * 100;

  const skills = [
    { name: 'Frontend Development', endorsements: 12, level: 'Expert' },
    { name: 'React/Next.js', endorsements: 8, level: 'Advanced' },
    { name: 'TypeScript', endorsements: 15, level: 'Expert' },
    { name: 'Smart Contracts', endorsements: 5, level: 'Intermediate' },
    { name: 'UI/UX Design', endorsements: 7, level: 'Advanced' },
    { name: 'Open Source', endorsements: 18, level: 'Expert' }
  ];

  const achievements = [
    {
      icon: TrophyIcon,
      title: 'First Contribution',
      description: 'Successfully merged your first pull request',
      earned: true
    },
    {
      icon: CodeBracketIcon,
      title: 'Code Quality Master',
      description: 'Maintained 95%+ code review approval rate',
      earned: true
    },
    {
      icon: UserGroupIcon,
      title: 'Community Builder',
      description: 'Helped 10+ developers with their contributions',
      earned: false
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation Pioneer',
      description: 'Introduced game-changing feature or improvement',
      earned: false
    }
  ];

  const feedback = [
    {
      project: 'DeFi Protocol',
      rating: 5,
      comment: 'Exceptional code quality and attention to detail. Great collaboration skills.',
      reviewer: 'core-dev-alice'
    },
    {
      project: 'NFT Marketplace',
      rating: 4,
      comment: 'Solid implementation with clean, well-documented code.',
      reviewer: 'lead-bob'
    },
    {
      project: 'DAO Governance',
      rating: 5,
      comment: 'Outstanding problem-solving abilities and innovative approach.',
      reviewer: 'architect-carol'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'text-white';
      case 'Advanced': return 'text-white/80';
      case 'Intermediate': return 'text-white/60';
      default: return 'text-white/40';
    }
  };

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
            Reputation Dashboard
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Your community standing, skills, and achievements in the open-source ecosystem
          </p>
        </div>

        <div className="space-y-12">
          {/* Reputation Score Overview */}
          <div className="group">
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-xl">
                    <StarIcon className="w-8 h-8 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white">Reputation Score</h3>
                    <p className="text-white/50 font-light">Community validation of your contributions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-light text-white">{reputationScore}</div>
                  <div className="text-white/50 font-light">of {maxScore}</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/40 to-white/60 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Skills & Endorsements */}
          <div className="group">
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl">
                  <ShieldCheckIcon className="w-6 h-6 text-white/70" />
                </div>
                <h3 className="text-2xl font-light text-white">Skills & Endorsements</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{skill.name}</h4>
                      <span className={`text-sm font-light ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.min(skill.endorsements / 3, 5) ? 'text-white/60 fill-current' : 'text-white/20'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-white/50 font-light">
                        {skill.endorsements} endorsements
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="group">
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl">
                  <TrophyIcon className="w-6 h-6 text-white/70" />
                </div>
                <h3 className="text-2xl font-light text-white">Achievement Badges</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className={`flex items-start space-x-4 p-6 rounded-xl border transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-white/5 border-white/20' 
                        : 'bg-white/2 border-white/5 opacity-50'
                    }`}>
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                        achievement.earned 
                          ? 'bg-white/10 border border-white/20' 
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <Icon className={`w-5 h-5 ${achievement.earned ? 'text-white/70' : 'text-white/40'}`} />
                      </div>
                      <div className="space-y-1">
                        <h4 className={`font-medium ${achievement.earned ? 'text-white' : 'text-white/50'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm font-light leading-relaxed ${achievement.earned ? 'text-white/60' : 'text-white/40'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Community Feedback */}
          <div className="group">
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl">
                  <UserGroupIcon className="w-6 h-6 text-white/70" />
                </div>
                <h3 className="text-2xl font-light text-white">Recent Feedback</h3>
              </div>
              
              <div className="space-y-6">
                {feedback.map((item, index) => (
                  <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-white mb-1">{item.project}</h4>
                        <p className="text-sm text-white/50 font-light">by {item.reviewer}</p>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-4 h-4 ${i < item.rating ? 'text-white/60 fill-current' : 'text-white/20'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/60 font-light leading-relaxed">"{item.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReputationDashboard;
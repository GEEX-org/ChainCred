import React from 'react';
import { 
  GiftIcon, 
  UsersIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: GiftIcon,
      title: 'Token Rewards',
      description: 'Get paid in tokens for open-source work you already love doing — no paperwork, just smart contracts.',
    },
    {
      icon: UsersIcon,
      title: 'Community Validation',
      description: 'Contributions are reviewed and valued by fellow developers — fair, open, and based on real impact.',
    },
    {
      icon: ChartBarIcon,
      title: 'Impact Analytics',
      description: 'See the difference you\'re making with clear insights into how your code helps the community.',
    }
  ];

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
            How It Works
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            A transparent, blockchain-powered process for recognizing valuable open-source work
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group text-center">
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    <Icon className="w-7 h-7 text-white/70 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-medium text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/50 leading-relaxed font-light group-hover:text-white/60 transition-colors">
                    {feature.description}
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

export default FeaturesSection;
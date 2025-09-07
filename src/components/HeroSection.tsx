import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  RocketLaunchIcon,
  WalletIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface HeroSectionProps {
  isConnected: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isConnected }) => {
  const stats = [
    { label: 'Contributors', value: '1.2K', icon: '👥' },
    { label: 'Rewards Paid', value: '2.5M', icon: '💎' },
    { label: 'Projects', value: '156', icon: '🚀' },
  ];

  return (
    <section className="relative min-h-screen flex items-start pt-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-12">
            {/* Status Indicator */}
            {/* <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-sm font-medium text-white/80">Live on Mainnet</span>
            </div> */}

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-light leading-tight tracking-tight">
                <span className="block text-white font-extralight">ChainCred</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-normal">
                  Rewards
                </span>
              </h1>
              
              <p className="text-xl text-white/60 leading-relaxed max-w-lg font-light">
                Transform open-source contributions into crypto rewards through 
                <span className="text-white/80"> decentralized validation</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-200 font-medium"
                >
                  <RocketLaunchIcon className="w-5 h-5" />
                  <span>Launch Dashboard</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-lg">
                  <WalletIcon className="w-5 h-5 text-white/60" />
                  <span className="text-white/80 font-medium">Connect Wallet</span>
                </div>
              )}
              
              <Link
                to="/contributions"
                className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-lg hover:border-white/30 hover:bg-white/5 transition-all duration-200 text-white/80 hover:text-white"
              >
                <PlayIcon className="w-5 h-5" />
                <span className="font-medium">Explore</span>
              </Link>
            </div>
          </div>

          {/* Right Side - Clean Stats */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-white mb-2">Live Metrics</h3>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-2xl mb-2 opacity-60 group-hover:opacity-80 transition-opacity">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-light text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/50 font-medium tracking-wide">
                      {stat.label}
                    </div>
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

export default HeroSection;
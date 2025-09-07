import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  CodeBracketIcon,
  WalletIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

interface SignupCTAProps {
  isConnected: boolean;
}

const SignupCTA: React.FC<SignupCTAProps> = ({ isConnected }) => {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 lg:p-16 text-center">
          
          {/* Heading */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-light mb-6 text-white">
              Ready to Start Earning?
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
              Join thousands of developers already earning crypto rewards for their open-source contributions
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12 py-8 border-y border-white/10">
            <div>
              <div className="text-3xl font-light text-white mb-2">5 min</div>
              <div className="text-white/50 text-sm font-light uppercase tracking-wide">
                Setup Time
              </div>
            </div>
            <div>
              <div className="text-3xl font-light text-white mb-2">$150</div>
              <div className="text-white/50 text-sm font-light uppercase tracking-wide">
                Avg Monthly
              </div>
            </div>
            <div>
              <div className="text-3xl font-light text-white mb-2">0%</div>
              <div className="text-white/50 text-sm font-light uppercase tracking-wide">
                Platform Fee
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-6">
            {isConnected ? (
              <div className="space-y-4">
                <Link
                  to="/contributions"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-200 font-medium text-lg"
                >
                  <CodeBracketIcon className="w-6 h-6" />
                  <span>Submit Your First Contribution</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                
                <p className="text-white/50 text-sm font-light">
                  Your wallet is connected • Start earning immediately
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-200 font-medium text-lg cursor-pointer">
                  <WalletIcon className="w-6 h-6" />
                  <span>Connect Wallet & Join</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </div>
                
                <p className="text-white/50 text-sm font-light">
                  Free to join • No monthly fees • Instant payouts
                </p>
              </div>
            )}

            {/* Secondary CTA */}
            <div className="pt-4">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors font-light"
              >
                <span>Learn how it works</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/40">
              <div className="flex items-center gap-2">
                <RocketLaunchIcon className="w-5 h-5" />
                <span className="text-sm font-light">Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="text-sm font-light">Secure & Audited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌍</span>
                <span className="text-sm font-light">Global Community</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-light">Real-time Payouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupCTA;
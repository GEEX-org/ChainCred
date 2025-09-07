import React from 'react';
import { BoltIcon } from '@heroicons/react/24/outline';

interface WalletInfoProps {
  account: string;
  balance: string;
  tokenBalance?: string;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ account, balance, tokenBalance }) => {
  return (
    <section className="relative py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl">
              <BoltIcon className="w-6 h-6 text-white/70" />
            </div>
            <h3 className="text-3xl font-light text-white">Wallet Status</h3>
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group text-center">
            <div className="space-y-6 p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider">Address</h4>
              <p className="text-white/70 font-mono text-sm break-all font-light group-hover:text-white transition-colors">
                {account?.slice(0, 12)}...{account?.slice(-10)}
              </p>
            </div>
          </div>

          <div className="group text-center">
            <div className="space-y-6 p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider">ETH Balance</h4>
              <p className="text-white font-light text-2xl group-hover:text-white transition-colors">
                {parseFloat(balance).toFixed(4)} ETH
              </p>
            </div>
          </div>

          <div className="group text-center">
            <div className="space-y-6 p-8 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider">OSS Tokens</h4>
              <p className="text-white font-light text-2xl group-hover:text-white transition-colors">
                {tokenBalance || '1,250'} OSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletInfo;
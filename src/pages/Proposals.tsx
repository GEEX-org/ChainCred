import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const Proposals: React.FC = () => {
  const { isConnected, account, balance, tokenBalance } = useWeb3();

  return (
    <div>
      Proposals Page - Coming Soon!
    </div>
  );
};

export default Proposals;
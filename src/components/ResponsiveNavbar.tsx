import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  CodeBracketIcon,
  UserIcon,
  WalletIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ResponsiveNavbar: React.FC = () => {
  const location = useLocation();
  const { isConnected, account, connectWallet, disconnect, isLoading } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    // { name: 'Proposals', href: '/proposals', icon: DocumentTextIcon },
    { name: 'Contributions', href: '/contributions', icon: CodeBracketIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const isActive = (href: string) => location.pathname === href;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed top-6 left-6 right-6 z-50 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-light text-white">
                <span>Chain</span>
                <span className="font-normal">Cred</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    } flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Wallet Section */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  {/* Account Display */}
                  <div className="px-3 py-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-white/80 font-mono">
                      {formatAddress(account!)}
                    </span>
                  </div>
                  
                  {/* Disconnect Button */}
                  <button
                    onClick={disconnect}
                    className="flex items-center px-3 py-2 hover:bg-white/5 text-white/60 hover:text-white/80 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <WalletIcon className="w-4 h-4 mr-2" />
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-2'
          } overflow-hidden`}>
            <div className="px-2 pt-2 pb-4 space-y-1">
              {/* Mobile Navigation Links */}
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${
                      isActive(item.href)
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    } flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Wallet Section */}
              <div className="pt-4 mt-4">
                {isConnected ? (
                  <div className="space-y-3">
                    {/* Account Display */}
                    <div className="px-4 py-2 bg-white/5 rounded-lg">
                      <span className="text-sm text-white/80 font-mono">
                        {formatAddress(account!)}
                      </span>
                    </div>
                    
                    {/* Disconnect Button */}
                    <button
                      onClick={() => {
                        disconnect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 hover:bg-white/5 text-white/60 hover:text-white/80 rounded-lg text-base font-medium transition-all duration-200"
                    >
                      <XMarkIcon className="w-5 h-5 mr-2" />
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-white text-black hover:bg-white/90 rounded-lg text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <WalletIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer div to push content below the navbar */}
      <div className="h-28"></div>
    </>
  );
};

export default ResponsiveNavbar;
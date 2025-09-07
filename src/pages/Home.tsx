import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SupportedTechnoliges from '../components/SupportedTechnologies';
import DeveloperTestimonials from '../components/DeveloperTestimonials';
import SignupCTA from '../components/SignupCTA';

const Home: React.FC = () => {
  const { isConnected } = useWeb3();

  return (
    <div className="relative overflow-hidden">
      {/* Floating Grid Background
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Orbs */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-neon-blue/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-accent-purple/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-neon-pink/5 via-transparent to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      </div> */} 

      {/* Hero Section */}
      <HeroSection isConnected={isConnected} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Process Steps Section */}
      <SupportedTechnoliges />

      <DeveloperTestimonials/>

      {/* Signup CTA Section */}
      <SignupCTA isConnected={isConnected} />

    </div>
  );
};

export default Home;
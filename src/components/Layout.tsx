import React from "react";
import ResponsiveNavbar from "./ResponsiveNavbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-50 flex flex-col">
      {/* Cyber Background Effects */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-glow opacity-30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-glow opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div> */}

      {/* Responsive Navbar */}
      <ResponsiveNavbar />

      {/* Main Content - starts right below navbar and grows to fill space */}
      <main className="pt-16 flex-grow">
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-white/70 font-light">
                © 2025 <span className="text-white font-medium">ChainCred</span>
                . Transforming open-source collaboration through blockchain
                rewards.
              </p>
            </div>
            <p className="text-xs text-white/50 font-light">
              Secured by{" "}
              <span className="text-blue-400 font-medium">Blockchain</span>
              <span className="mx-2 text-purple-400">✦</span>
              Crafted with{" "}
              <span className="text-purple-400 font-medium">Innovation</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
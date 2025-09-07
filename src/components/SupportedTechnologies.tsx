import React from 'react';

const SupportedTechnologies: React.FC = () => {
  const technologies = [
    { name: 'React', logo: '⚛️', projects: 234, category: 'Frontend' },
    { name: 'Ethereum', logo: '⟠', projects: 156, category: 'Blockchain' },
    { name: 'Python', logo: '🐍', projects: 189, category: 'Backend' },
    { name: 'TypeScript', logo: '🔷', projects: 178, category: 'Language' },
    { name: 'Node.js', logo: '🟢', projects: 145, category: 'Runtime' },
    { name: 'Solidity', logo: '💎', projects: 92, category: 'Smart Contracts' },
  ];

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
            Supported Technologies
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Earn rewards across the most popular development frameworks and languages
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {technologies.map((tech, index) => (
            <div key={index} className="group text-center">
              <div className="space-y-4">
                {/* Logo */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {tech.logo}
                  </span>
                </div>
                
                {/* Name */}
                <h3 className="text-lg font-medium text-white group-hover:text-white transition-colors">
                  {tech.name}
                </h3>
                
                {/* Projects count */}
                <div className="space-y-1">
                  <p className="text-2xl font-light text-white/80 group-hover:text-white transition-colors">
                    {tech.projects}
                  </p>
                  <p className="text-xs text-white/40 font-light uppercase tracking-wide">
                    Projects
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 font-light mb-6">
            Don't see your technology? We're always adding new frameworks.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-white/80 hover:text-white font-medium">
            <span>Request Technology</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupportedTechnologies;
import React from 'react';

const DeveloperTestimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "ChainCred changed how I think about open source. Getting rewarded for my React contributions feels amazing.",
      author: "Sarah Chen",
      role: "Senior Frontend Developer",
      avatar: "👩‍💻",
      earnings: "2.4K tokens"
    },
    {
      quote: "Finally, a platform that recognizes the real impact of code quality. My Ethereum smart contract optimizations are paying off.",
      author: "Marcus Rodriguez", 
      role: "Blockchain Engineer",
      avatar: "👨‍💼",
      earnings: "3.1K tokens"
    },
    {
      quote: "The peer review system is fair and transparent. I've learned so much from the community feedback on my Python projects.",
      author: "Alex Kim",
      role: "Full Stack Developer", 
      avatar: "👨‍💻",
      earnings: "1.8K tokens"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
            Developer Stories
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Real developers sharing their experience earning crypto through open-source contributions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                
                {/* Quote */}
                <blockquote className="text-white/80 leading-relaxed font-light mb-8 text-lg">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">
                      {testimonial.author}
                    </h4>
                    <p className="text-white/50 text-sm font-light">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                {/* Earnings Badge */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                    <span className="text-sm">💎</span>
                    <span className="text-white/70 text-sm font-medium">
                      Earned {testimonial.earnings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-white/10">
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">98%</div>
            <div className="text-white/50 text-sm font-light uppercase tracking-wide">
              Satisfaction Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">24h</div>
            <div className="text-white/50 text-sm font-light uppercase tracking-wide">
              Avg Review Time
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">500+</div>
            <div className="text-white/50 text-sm font-light uppercase tracking-wide">
              Active Reviewers
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">$2.1M</div>
            <div className="text-white/50 text-sm font-light uppercase tracking-wide">
              Total Paid Out
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperTestimonials;
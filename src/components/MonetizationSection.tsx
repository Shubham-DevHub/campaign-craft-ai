import React from 'react';
import { DollarSign, Briefcase, Zap, Globe, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const MonetizationSection: React.FC = () => {
  const points = [
    {
      title: "Subscription Model (SaaS)",
      description: "Charge marketing agencies or small business owners $20-$50/month for unlimited, high-strategic campaign generation.",
      icon: Globe,
      color: "text-blue-400"
    },
    {
      title: "Pay-per-Campaign",
      description: "Sell 'Generation Credits'. Allow users to buy bundles of 10 or 50 campaigns for a one-time fee, perfect for small startups.",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Freelancing Accelerator",
      description: "Use this internally to deliver professional marketing assets to clients 10x faster than traditional copywriters.",
      icon: Briefcase,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-24 border-t border-white/5 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Commercial Framework</h2>
        <p className="text-white/40 text-sm max-w-lg mx-auto">This project is a launch-ready MVP. Here is your roadmap to generating revenue with it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {points.map((point, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass-panel p-8 space-y-4 relative overflow-hidden group"
          >
            <div className={`p-3 rounded-2xl bg-white/5 w-fit ${point.color}`}>
              <point.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">{point.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {point.description}
            </p>
            <div className="pt-4 flex items-center gap-2 text-xs font-mono text-white/30 uppercase tracking-widest">
              Explore Strategy <ArrowUpRight className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-1 border-orange-500/20 bg-orange-500/5">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 text-black rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">Scaling Potential</h4>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mt-1">Ready for API Integration & Auth</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-black font-display font-bold rounded-full text-sm hover:bg-orange-500 transition-colors">
            Connect Payment Engine
          </button>
        </div>
      </div>
    </div>
  );
};

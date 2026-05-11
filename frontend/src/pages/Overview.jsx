import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const mockHistory = [
  { month: 'Jan', roi: 4.2 }, { month: 'Feb', roi: 4.5 }, { month: 'Mar', roi: 5.1 },
  { month: 'Apr', roi: 4.8 }, { month: 'May', roi: 5.4 }, { month: 'Jun', roi: 6.2 }
];

export default function Overview({ data }) {
  const formatCr = (value) => value ? `₹${(value / 10000000).toFixed(2)} Cr` : '₹0 Cr';

  return (
    <motion.div className="space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
      <div className="grid gap-6 md:grid-cols-4">
        <motion.div variants={itemVariants} className="p-6 rounded-[24px] bg-white/5 border border-white/10 shadow-glow backdrop-blur-xl hover:bg-white/10 transition-colors">
          <p className="text-sm uppercase tracking-widest text-mint/70 mb-2">Total Investment</p>
          <p className="text-3xl font-bold text-cream">₹1.24 Cr</p>
          <p className="text-xs text-neonEmerald mt-2">+12% vs last year</p>
        </motion.div>
        <motion.div variants={itemVariants} className="p-6 rounded-[24px] bg-white/5 border border-white/10 shadow-glow backdrop-blur-xl hover:bg-white/10 transition-colors">
          <p className="text-sm uppercase tracking-widest text-mint/70 mb-2">Portfolio ROI</p>
          <p className="text-3xl font-bold text-cream">6.2%</p>
          <p className="text-xs text-neonEmerald mt-2">Stable yield</p>
        </motion.div>
        <motion.div variants={itemVariants} className="p-6 rounded-[24px] bg-white/5 border border-white/10 shadow-glow backdrop-blur-xl hover:bg-white/10 transition-colors">
          <p className="text-sm uppercase tracking-widest text-mint/70 mb-2">ESG Score</p>
          <p className="text-3xl font-bold text-cream">A+</p>
          <p className="text-xs text-neonEmerald mt-2">Top 15% globally</p>
        </motion.div>
        <motion.div variants={itemVariants} className="p-6 rounded-[24px] bg-white/5 border border-white/10 shadow-glow backdrop-blur-xl hover:bg-white/10 transition-colors">
          <p className="text-sm uppercase tracking-widest text-mint/70 mb-2">Active Bonds</p>
          <p className="text-3xl font-bold text-cream">14</p>
          <p className="text-xs text-mint/50 mt-2">Across 4 sectors</p>
        </motion.div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2 p-8 rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] shadow-[inset_0_12px_24px_rgba(0,0,0,0.18)]">
          <h3 className="text-xl font-semibold text-cream mb-6">Investment Performance (ROI)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{fill: '#A3B68D'}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: '#A3B68D'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0B2414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#E8F3ED' }} />
                <Line type="monotone" dataKey="roi" stroke="#00FF88" strokeWidth={3} dot={{ fill: '#00FF88', r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 flex flex-col justify-between">
          <div className="p-6 rounded-[24px] bg-gradient-to-br from-moss/20 to-transparent border border-white/10 shadow-glow backdrop-blur-xl relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute -right-2 -top-2 text-6xl opacity-20">🌳</div>
            <p className="text-sm uppercase tracking-widest text-mint/70 mb-1">Impact Widget</p>
            <p className="text-2xl font-bold text-cream">1,240</p>
            <p className="text-sm text-mint/60">Equivalent Trees Planted</p>
          </div>
          <div className="p-6 rounded-[24px] bg-gradient-to-br from-moss/20 to-transparent border border-white/10 shadow-glow backdrop-blur-xl relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute -right-2 -top-2 text-6xl opacity-20">💨</div>
            <p className="text-sm uppercase tracking-widest text-mint/70 mb-1">Impact Widget</p>
            <p className="text-2xl font-bold text-cream">450 Tons</p>
            <p className="text-sm text-mint/60">CO₂ Emissions Avoided</p>
          </div>
          <div className="p-6 rounded-[24px] bg-gradient-to-br from-moss/20 to-transparent border border-white/10 shadow-glow backdrop-blur-xl relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute -right-2 -top-2 text-6xl opacity-20">⚡</div>
            <p className="text-sm uppercase tracking-widest text-mint/70 mb-1">Impact Widget</p>
            <p className="text-2xl font-bold text-cream">8.5 MWh</p>
            <p className="text-sm text-mint/60">Clean Energy Generated</p>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="p-8 rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] shadow-glow">
        <h3 className="text-xl font-semibold text-cream mb-6">Bond Watchlist</h3>
        <div className="space-y-4">
          {[
            { name: "Ocean Cleanup Bond 2026", type: "Biodiversity", change: "+1.2%" },
            { name: "Solar Grid Expansion Alpha", type: "Renewable Energy", change: "+0.8%" },
            { name: "Urban Water Management", type: "Clean Water", change: "-0.3%" }
          ].map((bond, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 cursor-pointer">
              <div>
                <p className="font-semibold text-cream">{bond.name}</p>
                <p className="text-xs text-mint/60 uppercase mt-1">{bond.type}</p>
              </div>
              <div className={`font-medium px-3 py-1 rounded-full text-sm ${bond.change.startsWith('+') ? 'text-neonEmerald bg-neonEmerald/10' : 'text-red-400 bg-red-400/10'}`}>
                {bond.change}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

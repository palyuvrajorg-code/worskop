import React, { useState } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Calculator() {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [bondType, setBondType] = useState('mixed');

  const multipliers = {
    renewable: { co2: 0.025, energy: 0.08, trees: 0.05 },
    water: { co2: 0.01, energy: 0.02, trees: 0.02, water: 0.15 },
    biodiversity: { co2: 0.03, energy: 0.01, trees: 0.12 },
    mixed: { co2: 0.015, energy: 0.05, trees: 0.04 }
  };

  const currentMultiplier = multipliers[bondType];

  return (
    <motion.div className="space-y-10 animate-fade-in max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] p-10 shadow-glow text-center">
        <h2 className="text-4xl font-serif text-cream mb-4">Portfolio Impact Calculator</h2>
        <p className="text-mint/70 mb-10 text-lg">See the real-world environmental impact of your green bond investments.</p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-2xl mx-auto">
          <div className="relative text-left">
            <label className="text-xs uppercase tracking-widest text-mint/70 ml-2 mb-2 block">Investment Amount</label>
            <span className="absolute left-6 top-[40px] text-3xl text-mint/50">₹</span>
            <input 
              type="number" 
              value={investmentAmount || ''}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="w-full bg-black/30 border-2 border-neonEmerald/30 rounded-[24px] py-4 pl-16 pr-8 text-3xl text-cream font-bold focus:outline-none focus:border-neonEmerald transition-colors"
            />
          </div>
          <div className="text-left">
            <label className="text-xs uppercase tracking-widest text-mint/70 ml-2 mb-2 block">Bond Focus Area</label>
            <select 
              value={bondType}
              onChange={(e) => setBondType(e.target.value)}
              className="w-full bg-black/30 border-2 border-white/10 rounded-[24px] py-4 px-6 text-xl text-cream font-medium focus:outline-none focus:border-neonEmerald transition-colors appearance-none h-[72px]"
            >
              <option value="mixed">Diversified ESG</option>
              <option value="renewable">Renewable Energy</option>
              <option value="water">Clean Water</option>
              <option value="biodiversity">Biodiversity</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(163,182,141,0.1)] transition-transform hover:scale-105">
            <div className="text-4xl mb-4">💨</div>
            <p className="text-sm uppercase tracking-widest text-mint/60 mb-2">CO₂ Reduced</p>
            <p className="text-3xl font-bold text-cream">{(investmentAmount * currentMultiplier.co2).toLocaleString(undefined, {maximumFractionDigits: 0})}<span className="text-lg text-mint/50 ml-1">kg</span></p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,215,0,0.1)] relative overflow-hidden transition-transform hover:scale-105">
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-neonGold/10 blur-[50px] rounded-full" />
            <div className="text-4xl mb-4 relative z-10">⚡</div>
            <p className="text-sm uppercase tracking-widest text-mint/60 mb-2 relative z-10">Clean Energy</p>
            <p className="text-3xl font-bold text-cream relative z-10">{(investmentAmount * currentMultiplier.energy).toLocaleString(undefined, {maximumFractionDigits: 0})}<span className="text-lg text-mint/50 ml-1">kWh</span></p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(0,191,255,0.1)] transition-transform hover:scale-105">
            <div className="text-4xl mb-4">{bondType === 'water' ? '💧' : '🌳'}</div>
            <p className="text-sm uppercase tracking-widest text-mint/60 mb-2">{bondType === 'water' ? 'Water Saved' : 'Trees Equivalent'}</p>
            <p className="text-3xl font-bold text-cream">
              {(investmentAmount * (currentMultiplier.water || currentMultiplier.trees)).toLocaleString(undefined, {maximumFractionDigits: 0})}
              <span className="text-lg text-mint/50 ml-1">{bondType === 'water' ? 'Liters' : 'Trees'}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

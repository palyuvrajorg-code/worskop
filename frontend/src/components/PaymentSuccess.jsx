import React from 'react';
import { motion } from 'framer-motion';

const PaymentSuccess = ({ transaction, onContinue }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-forest/95 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg bg-[#0c1810] border border-neonEmerald/30 rounded-[40px] p-10 shadow-[0_0_50px_rgba(0,255,136,0.15)] overflow-hidden text-center"
      >
        {/* Success Particles/Glow */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.15)_0%,transparent_50%)] pointer-events-none animate-[spin_10s_linear_infinite]" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto bg-neonEmerald/20 rounded-full flex items-center justify-center mb-6 border-2 border-neonEmerald shadow-[0_0_30px_rgba(0,255,136,0.4)]"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#00FF88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.div>

          <h2 className="text-4xl font-serif text-cream mb-2">Investment Successful</h2>
          <p className="text-mint/70 mb-8">Transaction ID: {transaction.id}</p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-widest text-mint/50 font-bold mb-4 border-b border-white/10 pb-2">Your ESG Impact Generated</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#4ade80]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4ade80] text-xl">🌲</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-cream">{transaction.esgMetrics.treesPlanted}</div>
                  <div className="text-xs text-mint/60">Equivalent Trees Planted</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#60a5fa] text-xl">☁️</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-cream">{transaction.esgMetrics.co2Avoided.toFixed(2)} Tons</div>
                  <div className="text-xs text-mint/60">CO₂ Emissions Avoided</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#fcd34d]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#fcd34d] text-xl">⚡</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-cream">{transaction.esgMetrics.renewableEnergy.toFixed(2)} MWh</div>
                  <div className="text-xs text-mint/60">Clean Energy Funded</div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onContinue}
            className="w-full py-4 rounded-xl bg-white text-forest font-bold text-lg hover:bg-neonEmerald hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;

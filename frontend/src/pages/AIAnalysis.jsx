import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AIAnalysis() {
  const [aiData, setAiData] = useState(null);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      fetch('/api/ai-insights')
        .then(res => res.json())
        .then(data => {
          setAiData(data);
          setAnalyzing(false);
        })
        .catch(err => {
          console.error(err);
          setAnalyzing(false);
        });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div className="space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-cream">AI ESG Intelligence</h2>
          <p className="text-mint/60 mt-2">Automated sustainability risk analysis and insights.</p>
        </div>
      </div>

      {analyzing ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-neonEmerald border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-mint text-xl animate-pulse">Neural engine analyzing portfolio ESG data...</p>
        </div>
      ) : aiData ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={itemVariants} className="p-8 rounded-[36px] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-glow backdrop-blur-xl flex flex-col items-center text-center">
              <p className="text-sm uppercase tracking-widest text-mint/70 mb-4">Overall ESG Score</p>
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <motion.circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#00FF88" strokeWidth="10" 
                    strokeDasharray={`${2 * Math.PI * 45}`} 
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - aiData.overallScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-cream">{aiData.overallScore}</span>
                  <span className="text-mint/50 text-sm mt-1">/ 100</span>
                </div>
              </div>
              <p className="text-neonEmerald font-medium mt-6 bg-neonEmerald/10 px-4 py-2 rounded-full">Top Quartile</p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-6 rounded-[24px] bg-white/5 border border-white/10 shadow-glow backdrop-blur-xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm uppercase tracking-widest text-mint/70">Greenwashing Risk</p>
                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-bold border border-green-500/30">{aiData.greenwashingRisk}</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <motion.div className="h-full bg-green-400" initial={{ width: 0 }} animate={{ width: '2%' }} transition={{ duration: 1 }} />
              </div>
              <p className="text-xs text-mint/50 mt-3 leading-relaxed">Analysis confirms strong alignment between reported metrics and taxonomy standards. Low probability of unsubstantiated claims.</p>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants} className="p-8 rounded-[36px] bg-forest/40 border border-white/10 shadow-glow backdrop-blur-[12px] h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">🧠</span>
                <h3 className="text-2xl font-semibold text-cream">AI Generated Insights</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                {aiData.insights.map((insight, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.5 + i * 0.2 }}
                    className="p-5 rounded-2xl bg-black/20 border border-white/5 flex gap-4 items-start hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-neonEmerald/20 flex items-center justify-center flex-shrink-0 mt-1 text-neonEmerald">✨</div>
                    <p className="text-mint/90 leading-relaxed text-lg">{insight}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-mint/50 mb-3 uppercase tracking-widest">Ask ESG Assistant</p>
                <div className="flex gap-3">
                  <input type="text" placeholder="e.g. How does EU Taxonomy classify nuclear energy?" className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-mint placeholder-mint/30 focus:outline-none focus:border-neonEmerald" />
                  <button className="px-6 py-3 rounded-xl bg-neonEmerald text-forest font-bold hover:bg-neonEmerald/90 transition-colors">
                    Ask
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

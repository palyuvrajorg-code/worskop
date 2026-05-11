import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function LiveImpact() {
  const [liveData, setLiveData] = useState({
    co2Avoided: 0,
    energyGenerated: 0,
    waterSaved: 0
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      try {
        const res = await fetch('/api/live-impact');
        const data = await res.json();
        setLiveData(data);
        setHistory(prev => {
          const newHistory = [...prev, { time: new Date().toLocaleTimeString(), ...data }];
          return newHistory.slice(-10); // keep last 10 points
        });
      } catch (err) {
        console.error("Failed to fetch live data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-cream">Live Impact Tracking</h2>
          <p className="text-mint/60 mt-2">Real-time simulation of environmental impact metrics.</p>
        </div>
        <div className="flex items-center gap-3 bg-obsidian/60 border border-neonEmerald/30 px-5 py-2.5 rounded-full backdrop-blur-md">
          <div className="w-3 h-3 bg-neonEmerald rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
          <span className="text-neonEmerald text-sm font-semibold tracking-widest uppercase">Live Stream</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants} className="p-8 rounded-[30px] bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-glow backdrop-blur-xl">
          <p className="text-sm uppercase tracking-widest text-mint/70 mb-2">CO₂ Avoided</p>
          <p className="text-4xl font-bold text-neonEmerald">{liveData.co2Avoided.toLocaleString()} <span className="text-lg text-mint/50">Tons</span></p>
        </motion.div>
        <motion.div variants={itemVariants} className="p-8 rounded-[30px] bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-glow backdrop-blur-xl">
          <p className="text-sm uppercase tracking-widest text-mint/70 mb-2">Energy Generated</p>
          <p className="text-4xl font-bold text-neonGold">{liveData.energyGenerated.toLocaleString()} <span className="text-lg text-mint/50">MWh</span></p>
        </motion.div>
        <motion.div variants={itemVariants} className="p-8 rounded-[30px] bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-glow backdrop-blur-xl">
          <p className="text-sm uppercase tracking-widest text-mint/70 mb-2">Water Conserved</p>
          <p className="text-4xl font-bold text-sky-400">{liveData.waterSaved.toLocaleString()} <span className="text-lg text-mint/50">kL</span></p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="p-8 rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] shadow-glow">
        <h3 className="text-xl font-semibold text-cream mb-6">Real-time CO₂ Reduction Trend</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{fill: '#A3B68D', fontSize: 12}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: '#A3B68D'}} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#0B2414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#E8F3ED' }} />
              <Area type="monotone" dataKey="co2Avoided" stroke="#00FF88" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}

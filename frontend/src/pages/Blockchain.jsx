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

export default function Blockchain() {
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    fetch('/api/blockchain-ledger')
      .then(res => res.json())
      .then(data => setLedger(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <motion.div className="space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-cream">Blockchain & Tokenization</h2>
          <p className="text-mint/60 mt-2">Immutable ledger for transparent, fractionalized green bond ownership.</p>
        </div>
        <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-glow flex items-center gap-2">
          <span>🔗</span> Connect Wallet
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={itemVariants} className="p-8 rounded-[36px] bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 shadow-glow backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
            <p className="text-sm uppercase tracking-widest text-indigo-300 mb-2">My Digital Assets</p>
            <p className="text-4xl font-bold text-white mb-6">3.52 GBND</p>
            
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-xl flex justify-between items-center border border-indigo-500/20">
                <span className="text-indigo-200 text-sm">Global Solar Token</span>
                <span className="text-white font-medium">1.20</span>
              </div>
              <div className="bg-black/30 p-4 rounded-xl flex justify-between items-center border border-indigo-500/20">
                <span className="text-indigo-200 text-sm">Wind Farm Alpha</span>
                <span className="text-white font-medium">2.32</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10">
              Trade Tokens
            </button>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.div variants={itemVariants} className="p-8 rounded-[36px] bg-forest/40 border border-white/10 shadow-glow backdrop-blur-[12px] h-full flex flex-col">
            <h3 className="text-xl font-semibold text-cream mb-6">Immutable Transaction Ledger</h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-sm uppercase tracking-widest text-mint/50">
                    <th className="pb-4 font-normal">Tx Hash</th>
                    <th className="pb-4 font-normal">Type</th>
                    <th className="pb-4 font-normal">Amount</th>
                    <th className="pb-4 font-normal">Asset</th>
                    <th className="pb-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {ledger.map((tx, i) => (
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 font-mono text-indigo-300">{tx.hash}</td>
                      <td className="py-4 text-mint">{tx.type}</td>
                      <td className="py-4 text-cream font-medium">{tx.amount}</td>
                      <td className="py-4 text-mint/80">{tx.bond}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-neonEmerald/10 text-neonEmerald text-xs rounded-full border border-neonEmerald/30">
                          {tx.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {ledger.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-mint/50">Fetching ledger data...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

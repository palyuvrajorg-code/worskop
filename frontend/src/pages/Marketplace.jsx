import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InvestmentModal from '../components/InvestmentModal';
import PaymentSuccess from '../components/PaymentSuccess';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Marketplace() {
  const [bonds, setBonds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterTaxonomy, setFilterTaxonomy] = useState('All');
  const [selectedBond, setSelectedBond] = useState(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState(null);

  useEffect(() => {
    fetch('/api/marketplace')
      .then(res => res.json())
      .then(data => setBonds(data))
      .catch(err => console.error(err));
  }, []);

  const filteredBonds = bonds.filter(bond => {
    const matchesSearch = bond.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'All' || bond.risk === filterRisk;
    const matchesTaxonomy = filterTaxonomy === 'All' || bond.taxonomy === filterTaxonomy;
    return matchesSearch && matchesRisk && matchesTaxonomy;
  });

  return (
    <motion.div className="space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-serif text-cream">Advanced Green Bond Marketplace</h2>
          <p className="text-mint/60 mt-2">Discover, compare, and invest in institutional-grade sustainability projects.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search bonds..." 
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-mint placeholder-mint/30 focus:outline-none focus:border-neonEmerald min-w-[200px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-mint focus:outline-none focus:border-neonEmerald appearance-none"
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
          <select 
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-mint focus:outline-none focus:border-neonEmerald appearance-none"
            value={filterTaxonomy}
            onChange={e => setFilterTaxonomy(e.target.value)}
          >
            <option value="All">All Taxonomies</option>
            <option value="EU Taxonomy">EU Taxonomy</option>
            <option value="ICMA">ICMA</option>
            <option value="Climate Bonds">Climate Bonds</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBonds.length === 0 ? (
          <p className="text-mint/50 col-span-3 text-center py-10">No bonds match your criteria.</p>
        ) : (
          filteredBonds.map(bond => (
            <motion.div key={bond.id} variants={itemVariants} className="p-6 rounded-[24px] bg-white/5 border border-white/10 shadow-glow backdrop-blur-xl hover:bg-white/10 transition-colors flex flex-col justify-between h-full group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${bond.risk === 'Low' ? 'text-neonEmerald border-neonEmerald/30 bg-neonEmerald/10' : bond.risk === 'Medium' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' : 'text-red-400 border-red-400/30 bg-red-400/10'}`}>
                    {bond.risk} Risk
                  </span>
                  <span className="text-xs font-bold text-cream bg-white/10 px-2 py-1 rounded">Rating: {bond.rating}</span>
                </div>
                <h3 className="text-xl font-bold text-cream mb-1">{bond.name}</h3>
                <p className="text-sm text-mint/60 mb-4">{bond.sector}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-mint/50">Taxonomy</span>
                    <span className="text-mint">{bond.taxonomy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mint/50">Target ROI</span>
                    <span className="text-neonEmerald font-semibold">{bond.roi}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mint/50">Available</span>
                    <span className="text-cream font-medium">₹{(bond.available / 100000).toLocaleString()} L</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedBond(bond)}
                className="w-full py-3 rounded-xl border border-neonEmerald text-neonEmerald hover:bg-neonEmerald hover:text-forest transition-colors font-semibold uppercase tracking-wider text-sm opacity-80 group-hover:opacity-100"
              >
                View Details
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedBond && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBond(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-forest border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-glow z-10 overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neonEmerald/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${selectedBond.risk === 'Low' ? 'text-neonEmerald border-neonEmerald/30 bg-neonEmerald/10' : selectedBond.risk === 'Medium' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' : 'text-red-400 border-red-400/30 bg-red-400/10'}`}>
                      {selectedBond.risk} Risk
                    </span>
                    <span className="text-xs font-bold text-cream bg-white/10 px-2 py-1 rounded">Rating: {selectedBond.rating}</span>
                  </div>
                  <h3 className="text-3xl font-serif text-cream">{selectedBond.name}</h3>
                  <p className="text-mint/60">{selectedBond.sector}</p>
                </div>
                <button onClick={() => setSelectedBond(null)} className="text-mint/50 hover:text-white p-2">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-mint/50 uppercase tracking-widest mb-1">Target ROI</p>
                  <p className="text-2xl font-bold text-neonEmerald">{selectedBond.roi}%</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-mint/50 uppercase tracking-widest mb-1">Available Allocation</p>
                  <p className="text-2xl font-bold text-cream">₹{(selectedBond.available / 100000).toLocaleString()} L</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-mint/50 uppercase tracking-widest mb-1">Taxonomy Alignment</p>
                  <p className="text-lg font-medium text-cream">{selectedBond.taxonomy}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-mint/50 uppercase tracking-widest mb-1">Verification</p>
                  <p className="text-lg font-medium text-blue-400 flex items-center gap-2"><span>🛡️</span> SPO Verified</p>
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <h4 className="text-lg font-bold text-cream">Impact Forecast</h4>
                <p className="text-sm text-mint/70 leading-relaxed">
                  Investing in the {selectedBond.name} contributes directly to global sustainability goals. 
                  The project undergoes strict auditing under the {selectedBond.taxonomy} framework. Proceeds are exclusively allocated to {selectedBond.sector.toLowerCase()} initiatives, with rigorous risk mitigation strategies ensuring zero negative ecological side-effects.
                </p>
              </div>

              <div className="flex gap-4 relative z-10">
                <button 
                  onClick={() => setShowInvestmentModal(true)}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-neonEmerald to-sage text-forest font-bold text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
                >
                  Invest Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showInvestmentModal && selectedBond && (
        <InvestmentModal 
          bond={selectedBond} 
          onClose={() => setShowInvestmentModal(false)} 
          onSuccess={(tx) => {
            setShowInvestmentModal(false);
            setSelectedBond(null);
            setCompletedTransaction(tx);
          }}
        />
      )}

      {completedTransaction && (
        <PaymentSuccess 
          transaction={completedTransaction} 
          onContinue={() => setCompletedTransaction(null)} 
        />
      )}
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const COLORS = ['#00FF88', '#FFD700', '#38bdf8']; // Green, Gold, Blue

export default function IssuerDashboard({ myBonds, setMyBonds }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/issuer/stats').then(res => res.json()).then(data => setStats(data));
    fetch('/api/issuer/projects').then(res => res.json()).then(data => setProjects(data));
    fetch('/api/issuer/transactions').then(res => res.json()).then(data => setTransactions(data));
  }, []);

  const calculateImpact = (amountCr) => ({
    co2_avoided_tco2: Math.round(amountCr * 600),
    capacity_added_mw: Number((amountCr * 0.15).toFixed(1)),
    jobs_created: Math.round(amountCr * 4)
  });

  const handleIssue = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amountCrore = Number(formData.get('target'));
    const newBond = {
      id: Date.now(),
      project: formData.get('title'),
      amount_crore: amountCrore,
      sector: formData.get('category'),
      ...calculateImpact(amountCrore)
    };
    setMyBonds(prev => [newBond, ...prev]);
    alert('Bond published successfully to the marketplace!');
    e.target.reset();
    setActiveTab('My Bonds');
  };

  const pieData = stats ? [
    { name: 'Green Projects', value: stats.allocation.green },
    { name: 'Climate Adaptation', value: stats.allocation.climate },
    { name: 'Social Impact', value: stats.allocation.social },
  ] : [];

  const areaData = [
    { name: 'Jan', funding: 400 },
    { name: 'Feb', funding: 800 },
    { name: 'Mar', funding: 1500 },
    { name: 'Apr', funding: 2400 },
    { name: 'May', funding: 4250 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
        {['Overview', 'My Bonds', 'Issue New Bond'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`px-8 py-4 text-sm uppercase tracking-widest font-semibold transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-cream' : 'text-mint/50 hover:text-mint'}`}
          >
            {tab}
            {activeTab === tab && <motion.div layoutId="issuerTab" className="absolute bottom-0 left-0 right-0 h-1 bg-neonEmerald" />}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && stats && (
        <motion.div className="space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
          {/* Welcome Banner */}
          <motion.div variants={itemVariants} className="p-10 rounded-[36px] bg-gradient-to-r from-forest/80 to-moss/40 border border-white/10 shadow-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-neonEmerald/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-serif text-cream mb-2">Welcome back, Eco-Capital</h1>
                <p className="text-mint/80 text-lg">Your institutional ESG compliance is currently rated <span className="text-neonEmerald font-bold">Excellent ({stats.esgScore}/100)</span>.</p>
              </div>
              <div className="hidden md:flex gap-4">
                {stats.achievements.map((ach, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <span>🏆</span>
                    <span className="text-xs font-semibold text-mint">{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Capital Raised', value: `₹${(stats.totalCapital / 10000000).toFixed(1)} Cr`, icon: '💰', color: 'text-neonEmerald' },
              { label: 'Active Green Bonds', value: stats.activeBonds, icon: '📄', color: 'text-cream' },
              { label: 'Institutional Investors', value: stats.investorCount.toLocaleString(), icon: '🏦', color: 'text-blue-400' },
              { label: 'Overall ESG Score', value: `${stats.esgScore}/100`, icon: '🌱', color: 'text-neonGold' }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="p-6 rounded-[24px] bg-black/20 border border-white/5 backdrop-blur-md">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                <p className="text-xs uppercase tracking-widest text-mint/50 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Allocation Chart */}
            <motion.div variants={itemVariants} className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-cream mb-6">Fund Allocation Breakdown</h3>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0B2414', border: '1px solid #1f2937', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-4 w-1/2">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <div>
                        <p className="text-sm text-cream font-medium">{entry.name}</p>
                        <p className="text-xs text-mint/50">{entry.value}% Allocated</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Funding Trend */}
            <motion.div variants={itemVariants} className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-cream mb-6">Funding Growth Trajectory</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#A3B68D" tick={{fontSize: 12}} />
                    <YAxis stroke="#A3B68D" tick={{fontSize: 12}} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0B2414', border: '1px solid #1f2937' }} />
                    <Area type="monotone" dataKey="funding" stroke="#00FF88" fillOpacity={1} fill="url(#colorFunding)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Active Projects Monitoring */}
          <div>
            <h3 className="text-2xl font-serif text-cream mb-6">Live Project Monitoring</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map(project => (
                <motion.div key={project.id} variants={itemVariants} className="p-6 rounded-[24px] border border-white/10 bg-forest/30 backdrop-blur-md">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold text-neonEmerald bg-neonEmerald/10 px-2 py-1 rounded-md">{project.sector}</span>
                    <span className="text-lg">📍</span>
                  </div>
                  <h4 className="text-lg font-bold text-cream mb-1">{project.name}</h4>
                  <p className="text-xs text-mint/60 mb-6">{project.location}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-mint/80">
                      <span>Funding Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-neonEmerald" style={{ width: `${project.progress}%` }} />
                    </div>
                    <p className="text-right text-[10px] text-mint/50 mt-1">Target: ₹{(project.target / 10000000).toFixed(0)} Cr</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'My Bonds' && (
        <motion.div className="space-y-6 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
          {myBonds.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-[36px] border border-white/10">
              <span className="text-4xl mb-4 block">📄</span>
              <p className="text-mint/70 text-lg">No bonds issued manually yet.</p>
              <button onClick={() => setActiveTab('Issue New Bond')} className="mt-4 text-neonEmerald underline">Create your first bond</button>
            </div>
          ) : myBonds.map((bond, index) => (
            <motion.div key={bond.id || index} variants={itemVariants} className="p-8 rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neonEmerald/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs uppercase tracking-widest text-neonEmerald border border-neonEmerald/20 px-3 py-1 rounded-full bg-neonEmerald/5">Active Market</span>
                    <span className="text-xs uppercase tracking-widest text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full bg-blue-400/5 flex items-center gap-1"><span>🛡️</span> Verified ESG</span>
                  </div>
                  <h3 className="text-3xl font-bold text-cream mb-2">{bond.project}</h3>
                  <p className="text-mint/70 text-sm">Sector: {bond.sector} • Jobs Created: {bond.jobs_created || 0}</p>
                </div>
                
                <div className="flex gap-8 text-right bg-black/20 p-6 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-mint/50 mb-1">Target</p>
                    <p className="text-2xl font-bold text-cream">₹{bond.amount_crore} Cr</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-mint/50 mb-1">CO₂ Avoided</p>
                    <p className="text-2xl font-bold text-neonEmerald">{bond.co2_avoided_tco2 ? (bond.co2_avoided_tco2 / 1000).toFixed(1) + 'k T' : '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-mint/50 mb-1">Capacity</p>
                    <p className="text-2xl font-bold text-sage">{bond.capacity_added_mw || 0} MW</p>
                  </div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-mint/70">Funding Progress (Simulated)</span>
                  <span className="text-neonEmerald">75%</span>
                </div>
                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-moss to-neonEmerald" 
                    initial={{ width: 0 }} 
                    animate={{ width: '75%' }} 
                    transition={{ duration: 1.5, delay: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'Issue New Bond' && (
        <motion.div className="animate-fade-in max-w-3xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] p-10 shadow-glow">
            <h2 className="text-3xl font-serif text-cream mb-2">Publish New Bond</h2>
            <p className="text-mint/70 mb-8">Launch a new green bond to the marketplace to secure funding.</p>
            <form className="space-y-6" onSubmit={handleIssue}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-mint/70 ml-1">Bond Title</label>
                <input name="title" required type="text" className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint placeholder-mint/30 focus:border-neonEmerald/50 focus:ring-1 focus:ring-neonEmerald/50 transition-all outline-none" placeholder="e.g. Ocean Cleanup Initiative 2026" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-mint/70 ml-1">Target Funding (₹ Cr)</label>
                  <input name="target" required type="number" className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint placeholder-mint/30 focus:border-neonEmerald/50 transition-all outline-none" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-mint/70 ml-1">Category</label>
                  <select name="category" className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint focus:border-neonEmerald/50 transition-all outline-none appearance-none">
                    <option>Renewable Energy</option>
                    <option>Clean Water</option>
                    <option>Biodiversity</option>
                    <option>Clean Transport</option>
                    <option>Sustainable Agriculture</option>
                    <option>Green Buildings</option>
                    <option>Sustainable Forestry</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-mint/70 ml-1">Sustainability Framework</label>
                <select name="framework" className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint focus:border-neonEmerald/50 transition-all outline-none appearance-none">
                  <option>EU Taxonomy Aligned</option>
                  <option>ICMA Green Bond Principles</option>
                  <option>Climate Bonds Initiative Certified</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-mint/70 ml-1">Project Description</label>
                <textarea name="description" required rows="4" className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint placeholder-mint/30 focus:border-neonEmerald/50 transition-all outline-none" placeholder="Describe the environmental impact goals..." />
              </div>
              
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200 flex gap-3 items-start">
                <span className="text-lg">ℹ️</span>
                <p>Upon publishing, this bond will undergo AI ESG verification before being tokenized on the ledger.</p>
              </div>

              <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-neonEmerald to-sage text-forest font-bold text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all">
                Publish to Market
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

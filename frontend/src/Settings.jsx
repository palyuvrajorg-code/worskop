import React, { useState } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-cream mb-2">Settings</h1>
        <p className="text-mint/60">Manage your profile, preferences, and security settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-2">
            {[
              { id: 'account', label: 'Account Settings', icon: '👤' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' },
              { id: 'security', label: 'Security', icon: '🔒' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-cream border border-white/10 shadow-glow'
                    : 'text-mint/60 hover:text-mint hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <motion.div 
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 rounded-[32px] border border-white/10 bg-forest/40 backdrop-blur-2xl p-8 shadow-[inset_0_12px_24px_rgba(0,0,0,0.18)] min-h-[500px]"
        >
          {activeTab === 'account' && (
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-cream mb-6">Profile Picture</h2>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-moss to-sage p-1">
                    <div className="w-full h-full rounded-full bg-forest flex items-center justify-center overflow-hidden border-2 border-forest">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0B2414" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-mint text-sm font-medium transition-colors backdrop-blur-md">
                      Change Avatar
                    </button>
                    <p className="mt-2 text-xs text-mint/40">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
              </motion.div>

              <div className="w-full h-px bg-white/5" />

              <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-mint/70 ml-1">Full Name</label>
                  <input type="text" defaultValue="Alex Investor" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-mint placeholder-mint/30 focus:outline-none focus:border-neonEmerald/50 focus:ring-1 focus:ring-neonEmerald/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-mint/70 ml-1">Email Address</label>
                  <input type="email" defaultValue="alex@greenimpact.com" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-mint placeholder-mint/30 focus:outline-none focus:border-neonEmerald/50 focus:ring-1 focus:ring-neonEmerald/50 transition-all" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end pt-4">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-neonEmerald to-sage text-forest font-semibold hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all">
                  Save Changes
                </button>
              </motion.div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-cream mb-6">Display Preferences</h2>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <p className="font-medium text-mint">Theme</p>
                    <p className="text-sm text-mint/50">Dark mode is currently locked for optimal biophilic experience.</p>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-black/40 text-sage text-sm border border-sage/20">
                    Dark Theme Active
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-cream mb-6">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Investment Updates', desc: 'Alerts when your green bonds update.' },
                    { title: 'Impact Reports', desc: 'Monthly summary of your carbon offset.' },
                    { title: 'Platform Announcements', desc: 'New features and green projects.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div>
                        <p className="font-medium text-mint">{item.title}</p>
                        <p className="text-sm text-mint/50">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-black/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neonEmerald"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-cream mb-6">Security Settings</h2>
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <div>
                    <p className="font-medium text-mint text-lg">Two-Factor Authentication</p>
                    <p className="text-sm text-mint/50 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-mint text-sm font-medium transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-cream mb-4">Login History</h2>
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-mint/60 uppercase">
                      <tr>
                        <th className="px-6 py-4 font-medium">Device</th>
                        <th className="px-6 py-4 font-medium">Location</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-mint/80">
                      <tr>
                        <td className="px-6 py-4">MacBook Pro (Chrome)</td>
                        <td className="px-6 py-4">San Francisco, CA</td>
                        <td className="px-6 py-4 text-neonEmerald">Active Now</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">iPhone 14 Pro</td>
                        <td className="px-6 py-4">San Francisco, CA</td>
                        <td className="px-6 py-4 text-mint/50">2 days ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignInButton, useUser } from '@clerk/clerk-react';

const Login = ({ onLogin, onBack }) => {
  const [role, setRole] = useState('investor');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { isSignedIn, user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-forest text-mint">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-moss/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neonEmerald/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="rounded-[40px] border border-white/10 bg-forest/40 backdrop-blur-2xl p-10 shadow-glow relative overflow-hidden"
        >
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
          
          {onBack && (
            <button 
              type="button"
              onClick={onBack}
              className="absolute top-6 left-6 text-mint/50 hover:text-mint transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-medium z-20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          )}
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(163,182,141,0.2)] mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#E8F3ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="#E8F3ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="#E8F3ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-cream mb-2">Welcome Back</h1>
            <p className="text-sm text-mint/60">Access the Green Bond Impact Reactor</p>
          </div>

          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex gap-4">
              <button 
                type="button"
                onClick={() => setRole('investor')}
                className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${role === 'investor' ? 'bg-neonEmerald/10 border-neonEmerald/50 text-neonEmerald shadow-[0_0_15px_rgba(0,255,136,0.15)]' : 'border-white/10 text-mint/50 hover:bg-white/5'}`}
              >
                Investor
              </button>
              <button 
                type="button"
                onClick={() => setRole('issuer')}
                className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${role === 'issuer' ? 'bg-sage/20 border-sage/50 text-sage shadow-[0_0_15px_rgba(163,182,141,0.2)]' : 'border-white/10 text-mint/50 hover:bg-white/5'}`}
              >
                Issuer
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              {isSignedIn ? (
                <button 
                  type="button"
                  onClick={() => onLogin(role)}
                  className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-moss to-sage p-px font-medium"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <div className="relative bg-forest/80 backdrop-blur-md px-6 py-4 rounded-[15px] flex items-center justify-center gap-2 group-hover:bg-transparent transition-colors duration-300">
                    <span className="text-cream tracking-wide">Enter Dashboard as {role === 'investor' ? 'Investor' : 'Issuer'}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-1 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl="/login" forceRedirectUrl="/login">
                  <button 
                    type="button"
                    className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-moss to-sage p-px font-medium"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <div className="relative bg-forest/80 backdrop-blur-md px-6 py-4 rounded-[15px] flex items-center justify-center gap-2 group-hover:bg-transparent transition-colors duration-300">
                      <span className="text-cream tracking-wide">Secure Login with Clerk</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-1 transition-transform">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </SignInButton>
              )}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-mint/50">Authentication powered by Clerk</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForgotModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-forest border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-glow text-center z-10"
          >
            <div className="w-16 h-16 rounded-full bg-neonEmerald/10 flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-cream mb-2">Reset Password</h3>
            <p className="text-mint/70 mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Reset link sent!'); setShowForgotModal(false); }}>
              <input 
                type="email" 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-mint placeholder-mint/30 focus:outline-none focus:border-neonEmerald/50 mb-6"
                placeholder="name@domain.com"
                required
              />
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-mint hover:bg-white/5 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-moss to-sage text-forest hover:opacity-90 transition-opacity font-medium text-sm"
                >
                  Send Link
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;

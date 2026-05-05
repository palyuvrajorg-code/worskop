import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const LandingPage = ({ onGetStarted }) => {
  const aboutRef = useRef(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-forest text-mint overflow-x-hidden font-sans">
      {/* Hero Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-[100vh]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-moss/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neonEmerald/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[40%] bg-sage/10 blur-[100px] rounded-full" />
      </div>

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center z-10">
        <motion.div 
          className="max-w-4xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-neonEmerald animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-mint/80">Empowering Sustainable Finance</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-bold text-cream mb-6 leading-tight drop-shadow-md">
            Green Bond Impact Reactor
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-mint/80 mb-12 max-w-2xl leading-relaxed">
            Discover how green bonds are accelerating the global transition to sustainability. Explore real-time metrics, track environmental impact, and join the movement towards a greener future.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neonEmerald to-sage text-forest font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
            </button>
            <button 
              onClick={scrollToAbout}
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
          onClick={scrollToAbout}
        >
          <span className="text-xs tracking-widest uppercase text-mint/60">Scroll to Explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-bounce">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Project Details Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="hidden xl:block absolute right-12 top-1/2 transform -translate-y-1/2 w-[320px] p-8 rounded-[30px] bg-[#0c1810]/90 backdrop-blur-xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-20 text-left"
        >
          <div className="space-y-6">
            {/* Project Details */}
            <div>
              <h3 className="text-[#00FF88] text-sm font-bold tracking-[0.2em] uppercase mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-mint/50">Project Title</span>
                  <span className="text-white font-bold text-right">GREEN BOND IMPACT REPORTER</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mint/50">Division</span>
                  <span className="text-white font-bold">COMPS-C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mint/50">Batch</span>
                  <span className="text-white font-bold">B</span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Team */}
            <div>
              <h3 className="text-[#00FF88] text-sm font-bold tracking-[0.2em] uppercase mb-4">Team</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-mint/80">Aaryan Mohite</span>
                  <span className="text-mint/50 font-medium">C-34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mint/80">Ananya Narhe</span>
                  <span className="text-mint/50 font-medium">C-35</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mint/80">Yuvraj Pal</span>
                  <span className="text-mint/50 font-medium">C-36</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mint/80">Harish Parihar</span>
                  <span className="text-mint/50 font-medium">C-37</span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* SDGs */}
            <div>
              <h3 className="text-[#00FF88] text-sm font-bold tracking-[0.2em] uppercase mb-4">SDGs</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-[#FFD700] font-bold">7 —</span>
                  <span className="text-mint/80">Clean and Affordable Energy</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4ade80] font-bold">13 —</span>
                  <span className="text-mint/80">Climate Action</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. About Green Impact Section */}
      <section ref={aboutRef} className="relative z-10 py-24 px-6 md:px-10 bg-gradient-to-b from-forest via-obsidian to-forest">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-cream mb-4">What is Green Impact?</h2>
            <p className="text-mint/70 max-w-2xl mx-auto text-lg">Understanding the fundamental instruments driving sustainable change across the globe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: What */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={itemVariants}
              className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00FF88" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 12L11 15L16 9" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-cream mb-3">What are Green Bonds?</h3>
              <p className="text-mint/70 leading-relaxed">
                Green bonds are fixed-income instruments specifically earmarked to raise money for climate and environmental projects. They act as a crucial financial bridge toward a sustainable economy.
              </p>
            </motion.div>

            {/* Card 2: Why */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={itemVariants}
              className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-cream mb-3">Why They Matter</h3>
              <p className="text-mint/70 leading-relaxed">
                They provide investors a way to earn returns while actively funding solutions to global challenges. This alignment of capital with purpose accelerates innovation in green technologies.
              </p>
            </motion.div>

            {/* Card 3: How */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={itemVariants}
              className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63553 3.63553C7.32285 1.94821 9.61305 1 12 1C14.3869 1 16.6772 1.94821 18.3645 3.63553C20.0518 5.32387 21 7.61305 21 10Z" stroke="#A3B68D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#A3B68D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-cream mb-3">How They Help</h3>
              <p className="text-mint/70 leading-relaxed">
                Funds are directly deployed to fight climate change, build renewable energy infrastructure, protect biodiversity, and create resilient communities worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Video Section */}
      <section className="relative z-10 py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-cream mb-4">Learn About Green Bonds</h2>
            <p className="text-mint/70 max-w-2xl mx-auto text-lg">Watch and understand the real-world impact of sustainable investments.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Video 1 */}
            <div className="w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden shadow-glow border border-white/10 bg-black/40">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/ruXLhpXvhOE?si=MxCf5r4qZVhXJ1qW" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen>
              </iframe>
            </div>

            {/* Video 2 */}
            <div className="w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden shadow-glow border border-white/10 bg-black/40">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/ILpEynUY6hI?si=Pl7pp9jMusir8z_h" 
                title="YouTube video player" 
                frameBorder="0" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-20 px-6 text-center border-t border-white/10 bg-obsidian/40">
        <h2 className="text-3xl font-serif text-cream mb-6">Ready to see the impact?</h2>
        <button 
          onClick={onGetStarted}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-moss to-sage text-cream font-semibold text-lg hover:shadow-[0_0_20px_rgba(163,182,141,0.4)] transition-all duration-300"
        >
          Enter the Reactor
        </button>
      </section>
    </div>
  );
};

export default LandingPage;

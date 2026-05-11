import { useEffect, useMemo, useState, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useClerk, useUser } from '@clerk/clerk-react';
import Login from './Login';
import LandingPage from './LandingPage';
import Settings from './Settings';

// New Pages
import Overview from './pages/Overview';
import Marketplace from './pages/Marketplace';
import LiveImpact from './pages/LiveImpact';
import AIAnalysis from './pages/AIAnalysis';
import Calculator from './pages/Calculator';
import Blockchain from './pages/Blockchain';
import Taxonomy from './pages/Taxonomy';
import Reports from './pages/Reports';
import IssuerDashboard from './pages/IssuerDashboard';


const formatCr = (value) => value ? `₹${(value / 10000000).toFixed(2)} Cr` : '₹0 Cr';

const seedling = (`
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="rgba(232,243,237,0.16)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <path d="M32 40C32 28 30 22 28 18C26 22 24 28 24 40" stroke="#E8F3ED" stroke-width="3" stroke-linecap="round"/>
  <path d="M24 28C20 24 18 20 18 16" stroke="#A3B68D" stroke-width="3" stroke-linecap="round"/>
  <path d="M28 28C32 24 34 20 36 16" stroke="#A3B68D" stroke-width="3" stroke-linecap="round"/>
  <path d="M32 14C36 12 40 12 44 16" stroke="#E8F3ED" stroke-width="3" stroke-linecap="round"/>
</svg>
`);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

function SuspenseSeedling() {
  return (
    <div className="seedling-loader">
      <div className="seedling-animation" dangerouslySetInnerHTML={{ __html: seedling }} />
      <p className="text-mint/80 mt-4 text-sm">Sprouting ecosystem insights...</p>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-forest text-cream relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="background-layer layer-1" />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-8xl font-serif text-neonEmerald mb-4 drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">404</h1>
        <p className="text-2xl text-mint/80 mb-8 font-light">Ecosystem sector not found</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-cream transition-all backdrop-blur-md">
          Return to Overview
        </button>
      </div>
    </div>
  );
}

const calculateImpact = (amountCr) => ({
  co2_avoided_tco2: Math.round(amountCr * 600),
  capacity_added_mw: Number((amountCr * 0.15).toFixed(1)),
  jobs_created: Math.round(amountCr * 4)
});

function App() {
  const [data, setData] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [userRole, setUserRole] = useState(null); // 'investor' | 'issuer'
  const [activeNav, setActiveNav] = useState('Overview');
  const [hoveredNav, setHoveredNav] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [myBonds, setMyBonds] = useState([]);


  const navigate = useNavigate();
  const location = useLocation();

  const profileButtonRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (isDropdownOpen && profileButtonRef.current) {
        const rect = profileButtonRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + 12,
          right: window.innerWidth - rect.right
        });
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isDropdownOpen]);

  const navItems = userRole === 'issuer' 
    ? ['Dashboard', 'Blockchain', 'Reports'] 
    : ['Overview', 'Marketplace', 'Live Impact', 'AI Analysis', 'Calculator', 'Blockchain', 'Taxonomy', 'Reports'];

  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogout = () => {
    setShowLogoutModal(false);
    setIsDropdownOpen(false);
    setUserRole(null);
    signOut().then(() => navigate('/'));
  };

  useEffect(() => {
    fetch('/api/impact')
      .then((res) => res.json())
      .then((payload) => setData(payload));
  }, []);

  useEffect(() => {
    if (userRole === 'issuer') {
      fetch('/api/bonds')
        .then((res) => res.json())
        .then((bonds) => {
          const processedBonds = bonds.map(bond => ({
            ...bond,
            ...calculateImpact(bond.amount_crore)
          }));
          setMyBonds(processedBonds);
        })
        .catch((err) => console.error("Failed to load bonds:", err));
    }
  }, [userRole]);

  const cardOrder = useMemo(() => {
    if (!data) return [];
    return data.categories.map((category) => ({
      ...category,
      rank: data.ranking.findIndex((r) => r.id === category.id) + 1
    }));
  }, [data]);

  const allProjects = useMemo(() => {
    if (!data) return [];
    const projects = [];
    data.categories.forEach(cat => {
      if (cat.projects) {
        cat.projects.forEach(p => projects.push(p));
      }
    });
    return projects;
  }, [data]);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMouse({ x: clientX / window.innerWidth, y: clientY / window.innerHeight });
  };

  const activeCategory = data?.categories?.[0];
  const topRanking = data?.ranking?.slice(0, 3) || [];

  const renderDashboardLayout = (content) => {
    if (!userRole) return <Navigate to="/login" replace />;

    return (
      <div className="min-h-screen overflow-hidden text-mint" onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="background-layer layer-1" style={{ transform: `translate(${mouse.x * 18}px, ${mouse.y * 18}px)` }} />
        <div className="background-layer layer-2" style={{ transform: `translate(${mouse.x * 12}px, ${mouse.y * 12}px)` }} />
        <div className="background-layer layer-3" style={{ transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)` }} />
      </div>

      <header className="relative z-[9999] px-6 py-8 md:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-6 w-full">
            <div className="flex flex-wrap xl:flex-nowrap items-center gap-8">
              <div>
                <div className="rounded-[32px] backdrop-blur-xl border border-white/10 bg-forest/30 shadow-glow px-5 py-4 inline-flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-mint shadow-[0_0_16px_rgba(232,243,237,0.35)]" />
                  <span className="text-sm tracking-[0.2em] uppercase text-mint/70">Green Bond Impact Reporter</span>
                </div>
              </div>
              <nav className="flex flex-wrap items-center gap-6">
                {navItems.map((item) => (
                  <div 
                    key={item} 
                    className="relative"
                    onMouseEnter={() => setHoveredNav(item)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <button
                      className={`text-sm font-medium transition duration-300 ${activeNav === item ? 'text-cream' : 'text-mint/70'}`}
                      onClick={() => setActiveNav(item)}
                    >
                      {item}
                    </button>
                    <motion.div
                      className="absolute bottom-[-6px] left-0 h-0.5 bg-gradient-to-r from-moss to-mint rounded-full"
                      animate={{ width: (activeNav === item || hoveredNav === item) ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                ))}
              </nav>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-4 relative z-50 ml-auto xl:-mt-2">
              {userRole === 'investor' && content === 'dashboard' && (
                <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-mint text-sm font-medium transition-colors backdrop-blur-md print:hidden">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-3 3m0 0l-3-3m3 3V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Export Report
                </button>
              )}
              
              <div className="relative" ref={profileButtonRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-12 h-12 rounded-full border-2 border-neonEmerald/30 p-0.5 overflow-hidden focus:outline-none hover:border-neonEmerald transition-colors bg-forest flex-shrink-0"
                >
                  <img src={user?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0B2414"} alt="Profile" className="w-full h-full object-cover rounded-full" />
                </button>

                {isDropdownOpen && createPortal(
                  <div className="fixed inset-0 z-[9999] pointer-events-auto">
                    <div className="absolute inset-0" onClick={() => setIsDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      style={{ top: dropdownPos.top, right: dropdownPos.right }}
                      className="absolute w-64 rounded-2xl bg-forest/95 backdrop-blur-xl border border-white/10 shadow-glow overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/10">
                        <p className="text-cream font-medium">{user ? user.fullName : (userRole === 'issuer' ? 'Eco-Capital Issuer' : 'Alex Investor')}</p>
                        <p className="text-mint/50 text-xs">{user ? user.primaryEmailAddress?.emailAddress : (userRole === 'issuer' ? 'corp@eco-capital.com' : 'alex@greenimpact.com')}</p>
                      </div>
                      <div className="py-2">
                        <button onClick={() => { 
                          setActiveNav(userRole === 'issuer' ? 'Dashboard' : 'Overview');
                          navigate('/dashboard'); 
                          setIsDropdownOpen(false); 
                        }} className="w-full text-left px-5 py-3 text-sm text-mint hover:bg-white/10 transition-colors flex items-center gap-3">
                          <span className="text-lg">📊</span> Dashboard
                        </button>
                        <button onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-mint hover:bg-white/10 transition-colors flex items-center gap-3">
                          <span className="text-lg">⚙️</span> Settings
                        </button>
                        <button onClick={() => { alert('Notifications panel opening...'); setIsDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-mint hover:bg-white/10 transition-colors flex items-center gap-3">
                          <span className="text-lg">🔔</span> Notifications
                        </button>
                      </div>
                      <div className="border-t border-white/10 py-2">
                        <button onClick={() => setShowLogoutModal(true)} className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                          <span className="text-lg">🚪</span> Logout
                        </button>
                      </div>
                    </motion.div>
                  </div>,
                  document.body
                )}
              </div>
            </div>
          </div>

          {activeNav === 'Overview' && (
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start animate-fade-in">
              <div className="rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] p-8 shadow-[inset_0_12px_24px_rgba(0,0,0,0.18)]">
                <p className="uppercase text-xs tracking-[0.32em] text-mint/70">Biophilic Impact Dashboard</p>
                <h1 className="mt-4 text-5xl font-semibold leading-tight font-serif text-cream">Green Bond Impact Reporter</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-mint/85">Explore grouped impact analytics, efficiency ratios, stacked allocation charts, and ranking by computed sustainability metrics in a forest-inspired dashboard design.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[30px] bg-white/8 border border-white/10 backdrop-blur-xl p-6 shadow-glow">
                    <p className="text-sm uppercase text-mint/70">Total Funding</p>
                    <p className="mt-3 text-3xl font-semibold">{data ? formatCr(data.overview.totalFunding) : '...'}</p>
                  </div>
                  <div className="rounded-[30px] bg-white/8 border border-white/10 backdrop-blur-xl p-6 shadow-glow">
                    <p className="text-sm uppercase text-mint/70">Impact Score</p>
                    <p className="mt-3 text-3xl font-semibold">{data ? data.overview.totalImpact.toLocaleString() + ' pts' : '...'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[36px] border border-white/10 bg-moss/20 backdrop-blur-[12px] p-6 shadow-glow">
                <p className="text-sm uppercase text-mint/70">Current Efficiency Ratio</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="rounded-full bg-white/10 p-4 shadow-[0_0_28px_rgba(211,235,205,0.22)]">
                    <span className="text-4xl font-semibold text-cream">{data ? data.overview.avgEfficiency : '...'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-mint/80">Total impact delivered per dollar funded across categories.</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </header>

      {content === 'settings' ? (
        <Settings />
      ) : (
        <main className="relative z-10 px-6 pb-16 md:px-10 lg:px-14">
          <section className="mx-auto max-w-7xl">
          {!data ? (
            <div className="mt-20 flex justify-center">
              <SuspenseSeedling />
            </div>
          ) : (
            <div className="animate-fade-in">
              {activeNav === 'Overview' && <Overview data={data} />}
              {activeNav === 'Marketplace' && <Marketplace />}
              {activeNav === 'Live Impact' && <LiveImpact />}
              {activeNav === 'AI Analysis' && <AIAnalysis />}
              {activeNav === 'Calculator' && <Calculator />}
              {activeNav === 'Blockchain' && <Blockchain />}
              {activeNav === 'Taxonomy' && <Taxonomy />}
              {activeNav === 'Reports' && <Reports />}
              {activeNav === 'Dashboard' && userRole === 'issuer' && <IssuerDashboard myBonds={myBonds} setMyBonds={setMyBonds} />}
            </div>
          )}
        </section>
      </main>
      )}

      <div className="corner-sticker sticker-leaf" />
      <div className="corner-sticker sticker-stone" />
      <div className="corner-sticker sticker-butterfly" />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-forest border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-glow text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚪</span>
            </div>
            <h3 className="text-2xl font-serif text-cream mb-2">Logout</h3>
            <p className="text-mint/70 mb-8">Are you sure you want to log out of the Green Bond Impact Reporter?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-mint hover:bg-white/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-colors font-medium shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onGetStarted={() => navigate('/login')} />} />
      <Route path="/login" element={<Login 
        onLogin={(role) => { 
          setUserRole(role); 
          setActiveNav(role === 'issuer' ? 'Dashboard' : 'Overview'); 
          navigate('/dashboard'); 
        }} 
        onBack={() => navigate('/')} 
      />} />
      <Route path="/dashboard" element={renderDashboardLayout('dashboard')} />
      <Route path="/settings" element={renderDashboardLayout('settings')} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

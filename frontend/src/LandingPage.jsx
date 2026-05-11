import React, { useEffect, useRef } from 'react';

const LandingPage = ({ onGetStarted }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    // Desktop guards
    const isDesktop = window.innerWidth >= 1024;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (!isDesktop || reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Custom Cursor
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.to(cursorDotRef.current, { x: mouse.x, y: mouse.y, duration: 0 });
    };
    
    let rafId;
    const renderCursor = () => {
      ringMouse.x += (mouse.x - ringMouse.x) * 0.12;
      ringMouse.y += (mouse.y - ringMouse.y) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(-50%, -50%) translate(${ringMouse.x}px, ${ringMouse.y}px)`;
      }
      rafId = requestAnimationFrame(renderCursor);
    };
    
    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(renderCursor);

    // Hover effect
    const hoverElements = document.querySelectorAll('button, .feature-card, a');
    const addHover = () => cursorRingRef.current?.classList.add('hovered');
    const rmHover = () => cursorRingRef.current?.classList.remove('hovered');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });

    // 2. Hero Canvas Particles
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      for(let i=0; i<120; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '#00FF88' : '#00E5CC'
        });
      }

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const sy = window.scrollY;
        
        for(let i=0; i<particles.length; i++) {
          let p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y - sy * 0.3, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          for(let j=i+1; j<particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = (p.y - sy * 0.3) - (p2.y - sy * 0.3);
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 140) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y - sy * 0.3);
              ctx.lineTo(p2.x, p2.y - sy * 0.3);
              ctx.strokeStyle = `rgba(0, 255, 136, ${1 - dist/140})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(animateParticles);
      };
      animateParticles();
    }

    // 3. Hero Split Text
    const titleObj = document.querySelector('.hero-title');
    if (titleObj) {
      const text = titleObj.innerText.trim().replace(/\s+/g, ' ');
      titleObj.innerHTML = '';
      text.split(' ').forEach((word, wordIndex, array) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        
        word.split('').forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.innerText = char;
          charSpan.style.display = 'inline-block';
          charSpan.style.opacity = '0';
          charSpan.style.transform = 'translateY(40px)';
          charSpan.classList.add('hero-char');
          wordSpan.appendChild(charSpan);
        });

        titleObj.appendChild(wordSpan);
        
        if (wordIndex < array.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.innerHTML = ' ';
          titleObj.appendChild(spaceSpan);
        }
      });
      
      gsap.to('.hero-char', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.03,
        ease: "power3.out",
        delay: 0.2
      });
    }

    // Parallax
    gsap.to('.hero-parallax-bg', {
      y: () => window.scrollY * 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // 4. Feature Cards 3D Tilt
    const cards = document.querySelectorAll('.feature-card');
    const onCardMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    const onCardLeave = (e) => {
      e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };
    cards.forEach(card => {
      card.addEventListener('mousemove', onCardMove);
      card.addEventListener('mouseleave', onCardLeave);
    });

    // 5. Stats Odometer
    const stats = document.querySelectorAll('.stat-number');
    const arcs = document.querySelectorAll('.stat-arc');
    
    ScrollTrigger.create({
      trigger: ".stats-section",
      start: "top 80%",
      onEnter: () => {
        stats.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          gsap.to(stat, {
            innerHTML: target,
            duration: 2,
            ease: "expo.out",
            snap: { innerHTML: 1 },
            onUpdate: function() {
              stat.innerHTML = Math.round(this.targets()[0].innerHTML).toLocaleString();
            }
          });
        });
        
        arcs.forEach(arc => {
          const pct = parseFloat(arc.getAttribute('data-pct'));
          const length = arc.getTotalLength();
          arc.style.strokeDasharray = length;
          arc.style.strokeDashoffset = length;
          gsap.to(arc, {
            strokeDashoffset: length * (1 - pct/100),
            duration: 2,
            ease: "expo.out"
          });
        });
      },
      once: true
    });

    // 6. SVG Timeline Draw
    const path = document.querySelector('.timeline-path');
    if (path) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1.5
        }
      });
      
      gsap.utils.toArray('.timeline-node').forEach((node, i) => {
        gsap.fromTo(node, 
          { scale: 0, opacity: 0 },
          { 
            scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ".timeline-section",
              start: `top ${70 - i*10}%`,
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }

    // 7. Sticky Panels
    ScrollTrigger.create({
      trigger: ".sticky-container",
      pin: true,
      start: "top top",
      end: "+=3000",
      scrub: true,
      animation: gsap.timeline()
        .to(".panel-1", { opacity: 0, y: -50, duration: 1 })
        .fromTo(".panel-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .to(".panel-2", { opacity: 0, y: -50, duration: 1 }, "+=1")
        .fromTo(".panel-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
    });

    // 8. Navbar
    const nav = document.querySelector('.nav-bar');
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 80) {
        nav.style.backdropFilter = "blur(16px)";
        nav.style.backgroundColor = "rgba(11, 36, 20, 0.75)";
        nav.style.boxShadow = "0 4px 30px rgba(0,0,0,0.1)";
      } else {
        nav.style.backdropFilter = "none";
        nav.style.backgroundColor = "transparent";
        nav.style.boxShadow = "none";
      }
    };
    window.addEventListener('scroll', onScroll);

    // 9. Magnetic CTA Button
    const magnetBtn = document.querySelector('.magnetic-btn');
    const onMagnetMove = (e) => {
      const rect = magnetBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull only within 100px range
      const dist = Math.sqrt(x*x + y*y);
      if (dist < 150) {
        gsap.to(magnetBtn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(magnetBtn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      }
    };
    const onMagnetLeave = () => {
      gsap.to(magnetBtn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    };
    const onMagnetClick = (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('magnetic-ripple');
      const rect = magnetBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      magnetBtn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
      
      if(onGetStarted) setTimeout(onGetStarted, 300);
    };
    
    if (magnetBtn) {
      document.addEventListener('mousemove', onMagnetMove); // Bind to document to detect distance
      magnetBtn.addEventListener('mouseleave', onMagnetLeave);
      magnetBtn.addEventListener('click', onMagnetClick);
    }

    // 10. Footer Stagger
    gsap.fromTo('.footer-col', 
      { y: 60, opacity: 0 },
      { 
        y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer",
          start: "top 90%"
        }
      }
    );

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', rmHover);
      });
      cards.forEach(card => {
        card.removeEventListener('mousemove', onCardMove);
        card.removeEventListener('mouseleave', onCardLeave);
      });
      if (magnetBtn) {
        document.removeEventListener('mousemove', onMagnetMove);
        magnetBtn.removeEventListener('mouseleave', onMagnetLeave);
        magnetBtn.removeEventListener('click', onMagnetClick);
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [onGetStarted]);

  return (
    <div className="bg-forest text-mint overflow-x-hidden font-sans" ref={containerRef}>
      
      {/* Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      {/* Custom Cursor */}
      <div className="custom-cursor-dot hidden lg:block" ref={cursorDotRef}></div>
      <div className="custom-cursor-ring hidden lg:block" ref={cursorRingRef}></div>

      {/* Fixed Navbar */}
      <nav className="nav-bar fixed top-0 left-0 right-0 z-[5000] transition-all duration-300 py-6 px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-neonEmerald"></span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-cream">Green Impact Reporter</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-mint/80 font-semibold">
            <a href="#about" className="hover:text-neonEmerald transition-colors hover:tracking-[0.25em] duration-300">About</a>
            <a href="#stats" className="hover:text-neonEmerald transition-colors hover:tracking-[0.25em] duration-300">Impact</a>
            <a href="#timeline" className="hover:text-neonEmerald transition-colors hover:tracking-[0.25em] duration-300">Timeline</a>
          </div>
          <button onClick={onGetStarted} className="px-6 py-2 border border-neonEmerald text-neonEmerald rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neonEmerald hover:text-forest transition-colors">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section relative h-screen w-full flex flex-col items-center justify-center overflow-hidden z-10">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 hidden lg:block" />
        
        {/* SVG Globe Parallax Background */}
        <div className="hero-parallax-bg absolute right-[-100px] top-[20%] opacity-20 pointer-events-none z-0 hidden lg:block">
          <svg width="420" height="420" viewBox="0 0 100 100" className="animate-[spin_20s_linear_infinite]">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#00FF88" strokeWidth="0.5"/>
            <path d="M50 2 C 70 20 70 80 50 98" fill="none" stroke="#00FF88" strokeWidth="0.5"/>
            <path d="M50 2 C 30 20 30 80 50 98" fill="none" stroke="#00FF88" strokeWidth="0.5"/>
            <path d="M2 50 C 20 70 80 70 98 50" fill="none" stroke="#00FF88" strokeWidth="0.5"/>
            <path d="M2 50 C 20 30 80 30 98 50" fill="none" stroke="#00FF88" strokeWidth="0.5"/>
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6">
          <h1 className="hero-title text-6xl md:text-8xl font-serif font-bold text-cream mb-6 leading-[1.1]">
            Green Bond Impact Reporter
          </h1>
          <p className="text-xl md:text-2xl text-mint/80 mb-12 max-w-3xl mx-auto font-light">
            Empowering sustainable finance. Discover real-time metrics, track environmental impact, and join the movement towards a greener future.
          </p>
          <button onClick={onGetStarted} className="px-10 py-5 rounded-full bg-gradient-to-r from-neonEmerald to-sage text-forest font-bold text-lg hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all">
            Enter Dashboard
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="stats" className="stats-section relative z-10 py-16 bg-black/40 border-y border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { label: 'Total Capital Raised', target: '420', unit: 'M', pct: 85 },
            { label: 'CO2 Avoided', target: '150', unit: 'k', pct: 60 },
            { label: 'Clean Energy', target: '95', unit: 'MW', pct: 75 },
            { label: 'Active Projects', target: '24', unit: '', pct: 40 }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                  <circle className="stat-arc" cx="48" cy="48" r="44" fill="none" stroke="#00FF88" strokeWidth="4" data-pct={stat.pct} />
                </svg>
                <div className="text-3xl font-bold text-cream flex items-baseline">
                  <span className="stat-number" data-target={stat.target}>0</span>
                  <span className="text-lg text-neonEmerald ml-1">{stat.unit}</span>
                </div>
              </div>
              <p className="text-sm uppercase tracking-widest text-mint/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards 3D Grid */}
      <section id="about" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-cream mb-4">What is Green Impact?</h2>
          <p className="text-mint/70 max-w-2xl mx-auto text-lg">Understanding the fundamental instruments driving sustainable change across the globe.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="feature-card p-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-cream mb-4">What are Green Bonds?</h3>
            <p className="text-mint/70">Fixed-income instruments specifically earmarked to raise money for climate and environmental projects.</p>
          </div>
          <div className="feature-card p-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-cream mb-4">Why They Matter</h3>
            <p className="text-mint/70">They provide investors a way to earn returns while actively funding solutions to global challenges.</p>
          </div>
          <div className="feature-card p-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-cream mb-4">How They Help</h3>
            <p className="text-mint/70">Funds are directly deployed to fight climate change, build renewable energy, and protect biodiversity.</p>
          </div>
        </div>
      </section>

      {/* How it Works SVG Timeline */}
      <section id="timeline" className="timeline-section relative z-10 py-32 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-cream mb-24 text-center">How It Works</h2>
          
          <div className="relative w-full h-32 hidden md:block">
            <svg className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <line className="timeline-path" x1="0" y1="0" x2="100%" y2="0" stroke="#00FF88" strokeWidth="4" />
            </svg>
            
            <div className="absolute top-1/2 w-full flex justify-between -translate-y-1/2 px-10">
              {['Project Sourcing', 'AI ESG Verification', 'Blockchain Tokenization', 'Impact Yield'].map((step, i) => (
                <div key={i} className="timeline-node relative flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-forest border-4 border-neonEmerald shadow-[0_0_15px_rgba(0,255,136,0.5)] z-10"></div>
                  <div className="absolute top-10 whitespace-nowrap text-cream font-bold">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Panel Section */}
      <section className="sticky-container h-[300vh] relative z-10 bg-obsidian">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6">
          <div className="relative w-full max-w-5xl h-[60vh] flex items-center justify-center text-center">
            
            <div className="panel-1 absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-6xl font-serif text-cream mb-6">Unprecedented Transparency</h2>
              <p className="text-2xl text-mint/70 max-w-2xl">Every dollar is tracked. Every carbon ton avoided is verified.</p>
            </div>
            
            <div className="panel-2 absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <h2 className="text-6xl font-serif text-neonEmerald mb-6">Institutional Grade</h2>
              <p className="text-2xl text-mint/70 max-w-2xl">Built for high-volume ESG compliance and ICMA standards.</p>
            </div>
            
            <div className="panel-3 absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <h2 className="text-6xl font-serif text-cream mb-6">Invest in the Future</h2>
              <button onClick={onGetStarted} className="px-10 py-5 rounded-full bg-white text-forest font-bold text-xl hover:bg-neonEmerald transition-colors mt-8">
                Join the Network
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="footer relative z-10 pt-32 pb-12 px-6 border-t border-white/10 bg-forest text-center flex flex-col items-center">
        <div className="max-w-md mx-auto mb-20 relative">
          <button className="magnetic-btn w-64 h-24 rounded-full bg-gradient-to-r from-neonEmerald to-sage flex items-center justify-center relative overflow-hidden">
            <span className="magnetic-btn-text text-forest font-black text-xl uppercase tracking-widest relative z-10">
              <span className="text-main">Get Started</span>
              <span className="text-alt">Start Investing →</span>
            </span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto w-full text-left mb-16">
          <div className="footer-col">
            <h4 className="text-cream font-bold mb-4 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-2 text-mint/60 text-sm">
              <li>Dashboard</li>
              <li>Marketplace</li>
              <li>Reports</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="text-cream font-bold mb-4 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-2 text-mint/60 text-sm">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="text-cream font-bold mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-2 text-mint/60 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Disclosures</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="text-cream font-bold mb-4 uppercase tracking-wider text-xs">Social</h4>
            <ul className="space-y-2 text-mint/60 text-sm">
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>GitHub</li>
            </ul>
          </div>
        </div>
        
        <div className="text-mint/40 text-xs tracking-widest uppercase">
          © 2026 Green Bond Impact. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

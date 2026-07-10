'use client';

import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Users,
  Star,
  UsersRound,
  CreditCard,
  QrCode,
  LineChart,
  LayoutDashboard,
  Bell
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

// Animated counter hook
export function useCountUp(target: number, inView: boolean, duration = 1.5) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target, duration]);
  return value;
}

export function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const members = useCountUp(1248, inView, 1.8);
  const funds = useCountUp(3420, inView, 2.0);
  const rsvp1 = useCountUp(340, inView, 1.6);
  const rsvp2 = useCountUp(120, inView, 1.4);
  const rsvp3 = useCountUp(85, inView, 1.3);

  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setToast(true), 2200);
    const t2 = setTimeout(() => setToast(false), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  const [cursorPhase, setCursorPhase] = useState<'idle' | 'moving' | 'clicked' | 'retreating'>('idle');
  useEffect(() => {
    if (!inView) return;
    const phases: Array<[typeof cursorPhase, number]> = [
      ['moving', 800],
      ['clicked', 1200],
      ['retreating', 2000],
      ['idle', 2400],
    ];
    const timers = phases.map(([phase, delay]) =>
      setTimeout(() => setCursorPhase(phase), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div 
      ref={ref} 
      className="relative w-full"
    >
      {/* Glows */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent-teal/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 -translate-x-1/2 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      {/* Fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-canvas to-transparent z-10 pointer-events-none rounded-b-[20px]" />

      {/* Glossy sweep */}
      <div className="absolute inset-0 z-20 pointer-events-none rounded-[20px] overflow-hidden">
        <motion.div
          className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
        />
      </div>

      {/* Toast notification */}
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={toast ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -12, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-14 right-4 z-30 flex items-center gap-3 bg-white border border-border/60 rounded-2xl shadow-soft-lg px-4 py-3 min-w-[220px]"
      >
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-ink">New RSVP!</span>
          <span className="text-[11px] text-ink-muted">Jordan Lee joined Fall Rush 2026</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 ml-auto animate-pulse shrink-0" />
      </motion.div>

      {/* Fake cursor */}
      <motion.div
        className="absolute z-30 pointer-events-none"
        initial={{ right: '18%', top: '18%', opacity: 0 }}
        animate={{
          right: cursorPhase === 'moving' || cursorPhase === 'clicked' ? '13%' : '18%',
          top: cursorPhase === 'moving' || cursorPhase === 'clicked' ? '13%' : '18%',
          opacity: cursorPhase === 'idle' ? 0 : 1,
          scale: cursorPhase === 'clicked' ? 0.85 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 2l12 7-6 1-3 6L4 2z" fill="#0d3b38" stroke="white" strokeWidth="1.2" />
        </svg>
      </motion.div>

      <div className="glass-panel rounded-[20px] p-2 md:p-3 shadow-glass border border-white/60">
        <div className="bg-white rounded-xl overflow-hidden border border-border/60 shadow-inner relative aspect-[4/3] md:aspect-[16/9]">
          {/* Browser Header */}
          <div className="absolute top-0 w-full h-12 bg-surface-2/50 flex items-center px-4 gap-4 border-b border-border/40">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="h-6 flex-1 max-w-sm bg-white rounded-md border border-border/50 hidden sm:block" />
          </div>

          {/* App Body */}
          <div className="absolute top-12 bottom-0 w-full flex bg-[#fafafa]">
            {/* Sidebar */}
            <div className="w-48 lg:w-56 bg-surface-1 border-r border-border/50 p-4 hidden md:flex flex-col gap-6">
              <div className="flex items-center gap-2 px-2">
                <div className="w-7 h-7 rounded-md bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">C</div>
                <span className="font-semibold text-[15px] text-ink">ClubSync</span>
              </div>
              <div className="space-y-1">
                <div className="flex gap-3 items-center px-3 py-2.5 bg-surface-3/50 rounded-lg text-primary shadow-sm border border-border/50">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
                {[{ icon: Star, label: 'Events' }, { icon: Users, label: 'Members' }, { icon: CreditCard, label: 'Finances' }, { icon: QrCode, label: 'Check-in' }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex gap-3 items-center px-3 py-2.5 text-ink-muted rounded-lg">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 overflow-hidden">
              {/* Top bar */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-ink tracking-tight">Overview</h2>
                  <p className="text-sm text-ink-muted mt-1">Welcome back, Alex. Here's what's happening today.</p>
                </div>
                <motion.button
                  animate={cursorPhase === 'clicked' ? { scale: 0.95, backgroundColor: '#114e4a' } : { scale: 1, backgroundColor: '#0d3b38' }}
                  transition={{ duration: 0.15 }}
                  className="text-white px-4 py-2.5 flex items-center gap-2 rounded-full text-[13px] font-medium shadow-soft"
                >
                  <span className="text-lg leading-none mt-[-2px]">+</span> New Event
                </motion.button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-border/50 rounded-xl shadow-sm p-5 flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Total Members</span>
                    <UsersRound className="w-4 h-4 text-ink-muted" />
                  </div>
                  <span className="text-3xl font-bold text-ink tracking-tight">{members.toLocaleString()}</span>
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">↑ 12% this month</span>
                </div>
                <div className="bg-white border border-border/50 rounded-xl shadow-sm p-5 flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Active Events</span>
                    <Star className="w-4 h-4 text-ink-muted" />
                  </div>
                  <span className="text-3xl font-bold text-ink tracking-tight">4</span>
                  <span className="text-xs font-medium text-ink-subtle mt-1 flex items-center gap-1 bg-surface-2 w-fit px-2 py-0.5 rounded-full">2 upcoming this week</span>
                </div>
                <div className="bg-white border border-border/50 rounded-xl shadow-sm p-5 flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Funds Collected</span>
                    <LineChart className="w-4 h-4 text-ink-muted" />
                  </div>
                  <span className="text-3xl font-bold text-ink tracking-tight">${funds.toLocaleString()}</span>
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">↑ $850 this week</span>
                </div>
              </div>

              {/* Events list */}
              <div className="flex-1 bg-white border border-border/50 rounded-xl shadow-sm p-5 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h3 className="font-semibold text-ink text-[15px]">Upcoming Events</h3>
                  <span className="text-[13px] font-medium text-primary">View all</span>
                </div>
                <div className="flex flex-col gap-3 overflow-hidden">
                  {[
                    { month: 'Oct', day: 15, name: 'Fall Rush 2026', loc: 'Main Quad • 10:00 AM', rsvp: rsvp1, cap: 500, color: 'accent-teal' },
                    { month: 'Oct', day: 18, name: 'Hackathon Prep', loc: 'Student Center • 6:00 PM', rsvp: rsvp2, cap: 150, color: 'primary' },
                    { month: 'Oct', day: 22, name: 'General Body Meeting', loc: 'Room 402 • 7:00 PM', rsvp: rsvp3, cap: 100, color: 'amber' },
                  ].map(({ month, day, name, loc, rsvp, cap, color }) => {
                    const pct = Math.round((rsvp / cap) * 100);
                    const barColor = color === 'accent-teal' ? 'bg-accent-teal' : color === 'primary' ? 'bg-primary' : 'bg-amber-500';
                    const bgColor = color === 'accent-teal' ? 'bg-accent-teal/10 border-accent-teal/20 text-accent-teal' : color === 'primary' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-amber-500/10 border-amber-500/20 text-amber-600';
                    return (
                      <div key={name} className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border/40 shadow-sm gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className={`w-11 h-11 border rounded-lg flex flex-col items-center justify-center shrink-0 ${bgColor}`}>
                            <span className="text-[9px] font-bold uppercase tracking-wider leading-none mb-0.5">{month}</span>
                            <span className="text-base font-bold leading-none">{day}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-ink truncate">{name}</p>
                            <p className="text-[12px] text-ink-muted mt-0.5 truncate">{loc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          <p className="text-[14px] font-semibold text-ink">{rsvp.toLocaleString()} <span className="text-ink-subtle font-normal">/ {cap}</span></p>
                          <div className="w-24 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${barColor}`}
                              initial={{ width: 0 }}
                              animate={{ width: inView ? `${pct}%` : 0 }}
                              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCardsMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const attendees = useCountUp(124, inView, 2);

  return (
    <motion.div 
      ref={ref}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      className="relative min-h-[260px] sm:min-h-[300px] bg-white/80 backdrop-blur-md rounded-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col"
    >
      {/* Glossy sweep */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
        <motion.div
          className="w-[150%] h-[150%] absolute top-[-25%] left-[-25%] bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
        />
      </div>

      <div className="h-10 border-b border-border/30 bg-white/60 flex items-center px-4 gap-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3 bg-white/40 backdrop-blur-sm overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/10 blur-[40px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease }}
          className="w-full bg-white/90 rounded-lg border border-white/60 shadow-sm p-2.5 sm:p-3 flex gap-3 relative overflow-hidden"
        >
          {/* Shimmer */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-teal/5 to-transparent -translate-x-full"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
          />

          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-accent-teal/10 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-accent-teal uppercase text-center leading-tight">Oct<br />24</span>
          </div>
          <div className="flex flex-col justify-center flex-1 z-10">
            <span className="text-[12px] sm:text-[13px] font-bold text-ink leading-tight">Fall Rush Bonfire</span>
            <span className="text-[10px] sm:text-[11px] text-ink-muted mt-0.5">Greek Council · Main Quad</span>
            <div className="flex items-center gap-1 mt-1 sm:mt-2">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-primary/20 border border-white"></div>
                <div className="w-4 h-4 rounded-full bg-accent-teal/20 border border-white"></div>
                <div className="w-4 h-4 rounded-full bg-accent-gold/20 border border-white"></div>
              </div>
              <span className="text-[9px] text-ink-muted ml-1">+{attendees} going</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 0.6, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="w-full bg-white/90 rounded-lg border border-white/60 shadow-sm p-2.5 sm:p-3 flex gap-3"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-accent-gold/10 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-accent-gold uppercase text-center leading-tight">Oct<br />26</span>
          </div>
          <div className="flex flex-col justify-center flex-1">
            <span className="text-[12px] sm:text-[13px] font-bold text-ink leading-tight">Tech Resume Review</span>
            <span className="text-[10px] sm:text-[11px] text-ink-muted mt-0.5">Computer Science Club</span>
            <div className="flex items-center gap-1 mt-1 sm:mt-2">
              <span className="text-[9px] text-accent-teal font-medium bg-accent-teal/10 px-1.5 py-0.5 rounded">Free</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function RevenueChartMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const totalRev = useCountUp(4250, inView, 2);

  // SVG path coordinates (simplified graph)
  const pathD = "M 0 100 C 20 80, 40 110, 60 70 C 80 30, 100 50, 120 20 C 140 -10, 160 40, 200 0";

  return (
    <motion.div 
      ref={ref}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity, delay: 0.2 }}
      className="relative h-[260px] sm:h-[300px] bg-primary rounded-xl border border-primary-hover shadow-inner overflow-hidden flex flex-col p-6"
    >
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-teal/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="flex items-start justify-between mb-2 z-10">
        <div className="flex flex-col">
          <span className="text-white/80 text-sm font-medium">Net Revenue</span>
          <span className="text-white text-3xl font-playfair tracking-tight mt-1">
            ${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="bg-green-500/20 text-green-400 text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1"
        >
          +12.5%
        </motion.span>
      </div>

      <div className="flex-1 border-b border-l border-white/20 relative mt-4 z-10 w-full overflow-visible">
        {/* Animated Graph Line */}
        <svg className="absolute bottom-0 w-full h-[60%] overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* Gradient fill */}
          <motion.path
            d={`${pathD} L 200 100 L 0 100 Z`}
            fill="url(#grad)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.2 } : { opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#27E0C0" stopOpacity="1" />
              <stop offset="100%" stopColor="#27E0C0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Stroke line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#27E0C0"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {/* Moving Tooltip */}
        <motion.div 
          className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
          initial={{ left: '0%', bottom: '0%', opacity: 0 }}
          animate={inView ? { left: '100%', bottom: '100%', opacity: 1 } : { left: '0%', bottom: '0%', opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div 
            className="absolute -top-6 -left-6 bg-white text-primary text-[10px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 2.2 }}
          >
            $4,250.00
          </motion.div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-2 mt-4 z-10">
        {[
          { initials: 'JD', name: 'John Doe', amount: '+ $15.00', delay: 1.2 },
          { initials: 'AS', name: 'Alice Smith', amount: '+ $15.00', delay: 1.4 }
        ].map((tx, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.4, delay: tx.delay }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><span className="text-white text-[10px]">{tx.initials}</span></div>
              <span className="text-white/90 text-[12px]">{tx.name}</span>
            </div>
            <span className="text-white font-medium text-[12px]">{tx.amount}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function ScannerMockup() {
  const [scanCount, setScanCount] = useState(142);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => {
        setScanCount(prev => prev < 200 ? prev + 1 : prev);
        setIsScanning(false);
      }, 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
      className="relative h-[260px] sm:h-[300px] bg-[#0A1A17] rounded-xl border border-white/20 shadow-inner overflow-hidden flex flex-col items-center justify-center p-6"
    >
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <span className="text-white/70 text-xs font-medium">Scanner Active</span>
        <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          {scanCount} / 200
        </span>
      </div>

      {/* Viewfinder */}
      <div className="relative w-40 h-40 mt-4">
        {/* Pulsing Corners */}
        <motion.div 
          animate={isScanning ? { scale: 1.1, borderColor: '#4ade80' } : { scale: 1, borderColor: '#27E0C0' }}
          className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-colors duration-300" 
        />
        <motion.div 
          animate={isScanning ? { scale: 1.1, borderColor: '#4ade80' } : { scale: 1, borderColor: '#27E0C0' }}
          className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 transition-colors duration-300" 
        />
        <motion.div 
          animate={isScanning ? { scale: 1.1, borderColor: '#4ade80' } : { scale: 1, borderColor: '#27E0C0' }}
          className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 transition-colors duration-300" 
        />
        <motion.div 
          animate={isScanning ? { scale: 1.1, borderColor: '#4ade80' } : { scale: 1, borderColor: '#27E0C0' }}
          className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-colors duration-300" 
        />

        {/* Success Flash */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isScanning ? 0.3 : 0 }}
          className="absolute inset-0 bg-green-400 blur-xl rounded-full"
        />

        {/* Scanning Line */}
        <motion.div 
          className="absolute left-0 w-full h-[2px] bg-accent-teal shadow-[0_0_10px_#27E0C0] opacity-80"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
        />
      </div>

      {/* Success Toast */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isScanning ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-3 z-10 whitespace-nowrap"
      >
        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={isScanning ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.4 }}
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-[12px] font-semibold leading-tight">Sarah Jenkins</span>
          <span className="text-white/60 text-[10px]">VIP Ticket</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DebateSocietyMockup() {
  const [activeTab, setActiveTab] = useState<'events' | 'announcements'>('events');
  const [followers, setFollowers] = useState(450);

  useEffect(() => {
    const tabInterval = setInterval(() => {
      setActiveTab(prev => prev === 'events' ? 'announcements' : 'events');
    }, 4000);
    
    const followerInterval = setInterval(() => {
      setFollowers(prev => prev + 1);
    }, 3500);

    return () => {
      clearInterval(tabInterval);
      clearInterval(followerInterval);
    };
  }, []);

  return (
    <motion.div 
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1 }}
      className="relative h-[260px] sm:h-[300px] bg-white rounded-xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col"
    >
      {/* Club Profile Header */}
      <div className="h-28 w-full bg-gradient-to-r from-accent-teal/20 to-primary/20 relative">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center"
        >
          <span className="text-primary font-playfair font-bold text-2xl">D</span>
        </motion.div>
      </div>
      
      <div className="pt-10 px-6 pb-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-bold text-ink leading-tight">Debate Society</h4>
            <span className="text-[11px] text-ink-muted">@debatesociety · <motion.span key={followers} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>{followers}</motion.span> Followers</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white text-[10px] font-medium px-3 py-1.5 rounded-full"
          >
            Follow
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-6 border-b border-border relative">
          <button 
            className={`text-[12px] font-semibold pb-2 transition-colors ${activeTab === 'events' ? 'text-primary' : 'text-ink-muted'}`}
            onClick={() => setActiveTab('events')}
          >
            Upcoming Events
          </button>
          <button 
            className={`text-[12px] font-semibold pb-2 transition-colors ${activeTab === 'announcements' ? 'text-primary' : 'text-ink-muted'}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
          {/* Animated Tab Indicator */}
          <motion.div 
            className="absolute bottom-0 h-0.5 bg-primary"
            initial={false}
            animate={{ 
              left: activeTab === 'events' ? '0%' : '110px',
              width: activeTab === 'events' ? '100px' : '95px'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Tab Content */}
        <div className="mt-4 flex-1 relative">
          {/* Events Content */}
          <motion.div 
            initial={false}
            animate={{ opacity: activeTab === 'events' ? 1 : 0, pointerEvents: activeTab === 'events' ? 'auto' : 'none' }}
            className="absolute inset-0 flex gap-3 items-center"
          >
            <div className="w-12 h-12 rounded-lg bg-surface-2 flex flex-col items-center justify-center border border-border">
              <span className="text-[9px] uppercase font-bold text-accent-teal">Nov</span>
              <span className="text-[14px] font-bold text-ink leading-tight">12</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-ink">Fall Intercollegiate Debate</span>
              <span className="text-[11px] text-ink-muted">Student Union · 6:00 PM</span>
            </div>
          </motion.div>

          {/* Announcements Content */}
          <motion.div 
            initial={false}
            animate={{ opacity: activeTab === 'announcements' ? 1 : 0, pointerEvents: activeTab === 'announcements' ? 'auto' : 'none' }}
            className="absolute inset-0 flex gap-3 items-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-ink">Room Change!</span>
              <span className="text-[11px] text-ink-muted">Tonight's meeting moved to Hall B.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

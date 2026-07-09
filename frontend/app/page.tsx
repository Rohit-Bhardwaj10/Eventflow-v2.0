'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Users,
  Star,
  UsersRound,
  ShieldCheck,
  CreditCard,
  QrCode,
  LineChart,
  LayoutDashboard
} from 'lucide-react';
import { PublicLayout } from '@/components/layouts/public-layout';

const floatingBubbles = [
  { icon: CheckCircle2, label: "RSVP Confirmed", top: "25%", left: "8%", delay: 0, rotate: -4 },
  { icon: Users, label: "+42 this week", top: "15%", right: "12%", delay: 0.2, rotate: 3 },
  { icon: Star, label: "New Event", bottom: "35%", right: "8%", delay: 0.4, rotate: -2 },
  { icon: UsersRound, label: "+2 members", bottom: "45%", left: "12%", delay: 0.6, rotate: 4 },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  return (
    <PublicLayout>
      <div className="relative isolate overflow-hidden bg-canvas selection:bg-accent-teal selection:text-white pb-24">
        
        {/* HERO SECTION */}
        <section className="relative w-full">
          <div className="relative bg-surface-2 overflow-hidden min-h-screen flex flex-col items-center pt-40 pb-48">
            
            {/* Background Image/Gradient */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/Image.png" 
                alt="Background" 
                fill 
                className="object-cover"
                priority
              />
            </div>

            {/* Top Left Label */}
            <div className="absolute top-28 left-4 md:left-8 z-10 flex items-center gap-2 text-ink-muted bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
              <span className="text-xs font-semibold tracking-wide">✦ ClubSync.</span>
            </div>

            {/* Content Stack */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6 w-full mt-8 md:mt-16">
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 shadow-soft-sm mb-6"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Campus Events, Simplified.</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
                className="text-display-xl text-primary font-playfair"
              >
                Every Club. <span className="italic font-normal">One Sync.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
                className="mt-6 text-lg md:text-xl text-ink-muted max-w-2xl font-medium"
              >
                Discover events, manage clubs, and never miss what&apos;s happening on campus.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4"
              >
                <Link href="/signup">
                  <button className="bg-primary text-white px-8 py-3.5 rounded-full font-medium shadow-soft hover:bg-primary-hover transition-all hover:-translate-y-0.5">
                    Start Your Club
                  </button>
                </Link>
                <Link href="/explore">
                  <button className="bg-white/80 backdrop-blur-md text-primary border border-white/60 px-8 py-3.5 rounded-full font-medium hover:bg-white transition-all shadow-sm">
                    Explore Events
                  </button>
                </Link>
              </motion.div>

            </div>

            {/* Floating Bubbles */}
            {floatingBubbles.map((bubble, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 + bubble.delay, ease }}
                className="absolute hidden md:flex items-center gap-2 glass-pill px-4 py-2 rounded-full shadow-soft-sm z-10"
                style={{ 
                  top: bubble.top, 
                  left: bubble.left, 
                  right: bubble.right, 
                  bottom: bubble.bottom, 
                  transform: `rotate(${bubble.rotate}deg)` 
                }}
              >
                <div className="bg-white p-1 rounded-full shadow-sm text-primary">
                  <bubble.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">{bubble.label}</span>
              </motion.div>
            ))}

            {/* Overlapping Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease }}
              className="absolute -bottom-32 md:-bottom-48 left-0 right-0 mx-auto w-11/12 max-w-5xl z-20 perspective-[2000px]"
            >
              <div className="glass-panel rounded-[20px] p-2 md:p-3 shadow-glass border border-white/60 transform rotateX-2 transition-transform hover:rotateX-0 duration-700">
                <div className="bg-white rounded-xl overflow-hidden border border-border/60 shadow-inner relative aspect-[16/9] md:aspect-[21/9]">
                  
                  {/* Browser/App Header */}
                  <div className="absolute top-0 w-full h-12 bg-surface-2/50 flex items-center px-4 gap-4 border-b border-border/40">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="h-6 flex-1 max-w-sm bg-white rounded-md border border-border/50 hidden sm:block"></div>
                  </div>
                  
                  {/* Mock content representation */}
                  <div className="absolute top-12 bottom-0 w-full flex bg-canvas/30">
                    {/* Sidebar */}
                    <div className="w-48 lg:w-56 bg-surface-1/80 border-r border-border/50 p-4 hidden md:flex flex-col gap-6">
                      <div className="h-5 w-24 bg-surface-3 rounded mb-2"></div>
                      <div className="space-y-4">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="flex gap-3 items-center">
                            <div className="h-5 w-5 bg-surface-3 rounded-md"></div>
                            <div className="h-3 w-full bg-surface-2 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-hidden">
                      {/* Top bar */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-8 w-48 bg-surface-3 rounded-md"></div>
                        <div className="h-8 w-24 bg-primary/10 rounded-full"></div>
                      </div>
                      
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-4">
                         {[1,2,3].map(i => (
                           <div key={i} className="h-24 bg-white border border-border/50 rounded-xl shadow-sm p-4 flex flex-col justify-between">
                             <div className="h-3 w-16 bg-surface-3 rounded"></div>
                             <div className="h-8 w-20 bg-surface-3 rounded"></div>
                           </div>
                         ))}
                      </div>
                      
                      {/* List area */}
                      <div className="flex-1 bg-white border border-border/50 rounded-xl shadow-sm p-4 flex flex-col gap-4">
                        {[1,2,3].map(i => (
                           <div key={i} className="h-12 w-full bg-surface-2/50 rounded-lg border border-border/30"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Spacing for overlapping mockup */}
        <div className="h-48 md:h-64"></div>

        {/* WHY CLUBSYNC */}
        <section id="why" className="relative scroll-mt-24 px-6 pt-[120px] pb-10 lg:px-0 overflow-hidden">
          {/* Decorative Background Grid & Glows */}
          <div className="absolute inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
            <div className="absolute top-[-10%] w-[150%] h-[120%] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)]"></div>
            {/* Soft Teal Glow */}
            <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-accent-teal/5 rounded-full blur-[100px]"></div>
            {/* Soft Gold/Blue Glow */}
            <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-accent-gold/5 rounded-full blur-[80px]"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease }}
            className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center gap-5 text-center"
          >
            <span className="glass-pill px-3 py-1 font-sans text-[11.5px] font-bold uppercase tracking-[0.15em] text-accent-teal shadow-sm">Why ClubSync</span>
            <h2 className="text-[36px] font-playfair font-normal leading-[1.14] tracking-[-0.02em] text-ink sm:text-[46px]">
              One platform in.<br className="hidden sm:block"/> A thriving club out.
            </h2>
          </motion.div>
          
          <div className="relative z-10 mx-auto mt-20 flex max-w-[940px] flex-col items-center justify-center gap-8 md:flex-row md:gap-0">
            {/* Box 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="relative w-[320px] max-w-full border border-border/80 bg-white/80 backdrop-blur-xl shadow-soft-lg rounded-2xl overflow-hidden z-20 group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
              <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2/50 px-5 py-3">
                <LayoutDashboard className="w-4 h-4 text-ink-muted" />
                <span className="font-sans text-[12px] font-medium text-ink">Dashboard</span>
                <span className="ml-auto font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-ink-subtle">One Platform In</span>
              </div>
              <div className="flex flex-col gap-2 px-5 py-5 text-left font-sans text-[13px] leading-[24px]">
                <div className="flex justify-between items-center"><span className="text-ink-muted">Event</span> <span className="text-ink font-medium bg-surface-2 px-2 py-0.5 rounded-md">Fall Rush 2026</span></div>
                <div className="flex justify-between items-center"><span className="text-ink-muted">Capacity</span> <span className="text-ink font-medium">500 students</span></div>
                <div className="flex justify-between items-center"><span className="text-ink-muted">Ticket</span> <span className="text-accent-teal font-semibold bg-accent-teal/10 px-2 py-0.5 rounded-md">$5 / entry</span></div>
              </div>
            </motion.div>

            {/* Connector */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="flex shrink-0 flex-col items-center justify-center w-full md:w-20 lg:w-28 relative z-10 h-16 md:h-auto my-[-10px] md:my-0"
            >
              {/* Vertical line on mobile, Horizontal on desktop */}
              <div className="absolute h-full w-[2px] md:w-full md:h-[2px] border-l-2 md:border-l-0 md:border-t-2 border-dashed border-border md:-mr-4"></div>
              <div className="relative bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-border rounded-full shadow-sm flex items-center justify-center z-10">
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted whitespace-nowrap">Via ClubSync</span>
              </div>
            </motion.div>

            {/* Box 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="relative w-[320px] max-w-full border border-border/80 bg-white/80 backdrop-blur-xl shadow-soft-lg rounded-2xl overflow-hidden z-20 group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
              <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3 bg-surface-2/50">
                <span className="flex size-7 shrink-0 items-center justify-center bg-accent-teal/15 rounded-md font-sans text-[12px] font-bold text-accent-teal">C</span>
                <span className="font-sans text-[13px] font-semibold text-ink">Event Live</span>
                <span className="ml-auto flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"></span>
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.1em] text-green-700">Active</span>
                </span>
              </div>
              <div className="flex flex-col gap-4 px-5 py-5 text-left">
                <div className="flex items-center justify-between">
                  <span className="border border-border/60 px-2 py-1 rounded-md font-sans text-[10.5px] font-medium text-ink bg-white shadow-sm">Discovery</span>
                  <span className="border border-border/60 px-2 py-1 rounded-md font-sans text-[10.5px] font-medium text-ink bg-white shadow-sm">QR Scans</span>
                  <span className="font-sans text-[13px] font-bold text-ink flex items-center gap-1">240<span className="text-ink-muted font-medium"> RSVPs</span></span>
                </div>
              </div>
              <div className="border-t border-border/60 bg-gradient-to-r from-accent-teal/5 to-transparent px-5 py-2.5 text-left font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-accent-teal">
                Sold out · $1200 collected
              </div>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="relative z-10 mx-auto mt-16 max-w-[600px] text-center text-[17px] leading-[28px] text-ink-muted sm:text-[18px]"
          >
            Create your event once and ClubSync handles discovery, ticket sales, QR check-ins, and member roster sync. Zero spreadsheets required.
          </motion.p>
        </section>

        <div className="mx-auto max-w-[1100px] px-6 pt-[100px] lg:px-0">
          <div className="h-px w-full bg-border"></div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="scroll-mt-24 px-6 pt-[104px] lg:px-0">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-12">
            <div className="flex flex-col items-center gap-5 text-center">
              <span className="font-sans text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent-teal">How it works</span>
              <h2 className="text-[34px] font-playfair font-normal leading-[1.14] tracking-[-0.025em] text-ink sm:text-[42px]">
                Three steps to a packed event
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="flex flex-col items-start gap-[13px]">
                <span className="font-sans text-[12px] font-semibold tracking-[0.07em] text-accent-teal">01</span>
                <h3 className="text-[20px] font-medium tracking-[-0.01em] text-ink">Publish the details</h3>
                <p className="text-[15px] leading-[23px] text-ink-muted">Set a time, location, and capacity. Upload a flyer. Your event instantly appears in the centralized campus feed.</p>
              </div>
              <div className="flex flex-col items-start gap-[13px]">
                <span className="font-sans text-[12px] font-semibold tracking-[0.07em] text-accent-teal">02</span>
                <h3 className="text-[20px] font-medium tracking-[-0.01em] text-ink">Gather RSVPs & Dues</h3>
                <p className="text-[15px] leading-[23px] text-ink-muted">Students tap to RSVP or purchase tickets securely. You track real-time capacity and collected funds on your dashboard.</p>
              </div>
              <div className="flex flex-col items-start gap-[13px]">
                <span className="font-sans text-[12px] font-semibold tracking-[0.07em] text-accent-teal">03</span>
                <h3 className="text-[20px] font-medium tracking-[-0.01em] text-ink">Breeze through check-in</h3>
                <p className="text-[15px] leading-[23px] text-ink-muted">Scan QR codes at the door with any smartphone. Turnout metrics automatically sync to your club's analytics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES (ALTERNATING) */}
        <section id="features" className="flex scroll-mt-24 flex-col gap-24 overflow-x-clip px-6 pb-[104px] pt-20 lg:px-0">
          
          {/* Feature 1 */}
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:gap-20 lg:flex-row">
            <div className="w-full lg:w-[560px] lg:shrink-0 rounded-2xl overflow-hidden border border-border shadow-soft">
              <div className="bg-surface-2 p-6">
                <div className="relative h-[260px] sm:h-[300px] bg-white rounded-xl border border-border shadow-inner overflow-hidden flex flex-col">
                  {/* Mock UI */}
                  <div className="h-10 border-b border-border bg-surface-2 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3 bg-canvas">
                    <div className="w-full h-24 bg-surface-2 rounded-lg border border-border"></div>
                    <div className="w-full h-24 bg-surface-2 rounded-lg border border-border"></div>
                    <div className="w-full h-24 bg-surface-2 rounded-lg border border-border"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start gap-[18px]">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">01 · Discovery</span>
              <h3 className="text-[26px] font-playfair font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                A single feed for<br className="hidden sm:block"/> your entire campus
              </h3>
              <p className="text-[17px] leading-[26px] text-ink-muted">
                Stop relying on scattered flyers and chaotic group chats. ClubSync brings every event into one beautiful, personalized feed that students actually want to browse.
              </p>
            </div>
          </div>

          {/* Feature 2 (Reversed) */}
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:gap-20 lg:flex-row-reverse">
            <div className="w-full lg:w-[560px] lg:shrink-0 rounded-2xl overflow-hidden border border-border shadow-soft">
              <div className="bg-surface-2 p-6">
                <div className="relative h-[260px] sm:h-[300px] bg-primary rounded-xl border border-primary-hover shadow-inner overflow-hidden flex flex-col p-6">
                  {/* Mock UI */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-white font-medium">Ticket Sales</span>
                    <span className="text-white/60 text-sm">Last 7 days</span>
                  </div>
                  <div className="flex-1 border-b border-l border-white/20 relative">
                     {/* Fake Graph */}
                     <div className="absolute bottom-0 w-full h-[60%] bg-accent-teal/20" style={{ clipPath: 'polygon(0 100%, 0 60%, 20% 50%, 40% 70%, 60% 40%, 80% 60%, 100% 20%, 100% 100%)' }}></div>
                     <div className="absolute bottom-0 w-full h-[60%] border-t-2 border-accent-teal" style={{ clipPath: 'polygon(0 61%, 20% 51%, 40% 71%, 60% 41%, 80% 61%, 100% 21%, 100% 100%)' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start gap-[18px]">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">02 · Payments</span>
              <h3 className="text-[26px] font-playfair font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                Collect dues and<br className="hidden sm:block"/> sell tickets securely
              </h3>
              <p className="text-[17px] leading-[26px] text-ink-muted">
                Ditch the personal cash apps. Sell event tickets or collect semester dues through a unified platform, giving your treasurer real-time visibility into the budget.
              </p>
            </div>
          </div>

        </section>

        {/* GUARDRAILS / SECURITY (DARK) */}
        <section id="security" className="flex scroll-mt-24 flex-col items-center gap-11 bg-primary px-6 py-[100px] lg:px-0 relative w-full left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="flex flex-col items-center gap-[18px] text-center max-w-4xl mx-auto">
            <span className="font-sans text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent-teal">Security</span>
            <h2 className="text-[34px] font-playfair font-normal leading-[1.14] tracking-[-0.025em] text-white sm:text-[42px]">
              Trust and privacy,<br className="hidden sm:block"/> by default
            </h2>
            <p className="max-w-[600px] text-[17px] leading-[27px] text-white/70 sm:text-[18px]">
              Control who sees what. Keep internal club meetings private for verified members, and broadcast your major events to the entire campus safely.
            </p>
          </div>

          <div className="grid w-full max-w-[860px] grid-cols-2 gap-x-8 gap-y-7 border-t border-white/10 pt-[30px] lg:grid-cols-4 mx-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent-teal">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[15px] font-medium text-white">Verified Emails</span>
              </div>
              <span className="font-sans text-[11.5px] leading-[17px] text-white/60">Strict `.edu` domain verification required.</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent-teal">
                <Users className="w-4 h-4" />
                <span className="text-[15px] font-medium text-white">Private Events</span>
              </div>
              <span className="font-sans text-[11.5px] leading-[17px] text-white/60">Restrict visibility to approved members.</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent-teal">
                <CreditCard className="w-4 h-4" />
                <span className="text-[15px] font-medium text-white">Secure Payments</span>
              </div>
              <span className="font-sans text-[11.5px] leading-[17px] text-white/60">Bank-level encryption for all transactions.</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent-teal">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-[15px] font-medium text-white">Admin Controls</span>
              </div>
              <span className="font-sans text-[11.5px] leading-[17px] text-white/60">Manage permissions across officers.</span>
            </div>
          </div>
        </section>

        {/* REGISTRY / SOCIAL PROOF */}
        <section id="registry" className="flex scroll-mt-24 flex-col gap-11 px-6 py-[100px] lg:px-0 max-w-[1200px] mx-auto w-full">
          <div className="w-full">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <h2 className="max-w-[520px] text-[26px] font-playfair font-normal leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                Student leaders are already building their communities here
              </h2>
            </div>
          </div>
          
          {/* Logos Row */}
          <div className="flex w-full flex-wrap items-center justify-between gap-6">
            <span className="text-[20px] text-ink-subtle hover:text-ink-muted transition-colors duration-200 font-sans font-semibold">Stanford</span>
            <span className="text-[20px] text-ink-subtle hover:text-ink-muted transition-colors duration-200 font-playfair font-semibold">Harvard</span>
            <span className="text-[20px] text-ink-subtle hover:text-ink-muted transition-colors duration-200 font-sans font-bold uppercase tracking-widest">MIT</span>
            <span className="text-[20px] text-ink-subtle hover:text-ink-muted transition-colors duration-200 font-sans font-medium">UCLA</span>
            <span className="text-[20px] text-ink-subtle hover:text-ink-muted transition-colors duration-200 font-sans font-semibold">NYU</span>
          </div>
          
          {/* Testimonial & Stat Grid */}
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            <figure className="flex h-full flex-col justify-between gap-7 border border-border bg-white p-[34px] rounded-2xl shadow-sm">
              <blockquote className="text-[22px] font-normal leading-[1.45] tracking-[-0.015em] text-ink sm:text-[23px]">
                “ClubSync completely changed how we handle rush week. We went from messy spreadsheets to a seamless QR system in an afternoon.”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center bg-primary text-[14px] font-semibold text-white rounded-full">AR</span>
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold text-ink">Alex Rivera</span>
                  <span className="text-[14px] text-ink-muted">President, Debate Society</span>
                </span>
              </figcaption>
            </figure>
            <div className="flex h-full flex-col justify-between gap-7 overflow-hidden bg-accent-teal p-[34px] rounded-2xl shadow-soft">
              <span className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/80">Platform Scale</span>
              <div className="flex flex-col gap-2.5">
                <span className="text-[64px] font-playfair font-medium leading-none tracking-[-0.03em] text-white sm:text-[72px]">1.2M</span>
                <span className="max-w-[230px] text-[17px] leading-[24px] text-white/90">students reached across nationwide campuses.</span>
              </div>
              <div className="flex flex-col gap-7">
                <div className="h-px w-full bg-white/30"></div>
                <div className="flex items-start gap-7">
                  <div className="flex flex-col gap-[3px]">
                    <span className="font-sans text-[19px] font-semibold text-white">45k+</span>
                    <span className="font-sans text-[11px] uppercase tracking-[0.04em] text-white/80">events</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="font-sans text-[19px] font-semibold text-white">120+</span>
                    <span className="font-sans text-[11px] uppercase tracking-[0.04em] text-white/80">colleges</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA / PRICING SECTION */}
        <section className="flex flex-col items-center gap-[26px] px-6 pb-[130px] pt-[80px] text-center lg:px-0">
          <h2 className="text-[40px] font-playfair font-normal leading-[1.08] tracking-[-0.03em] text-ink sm:text-[54px]">
            Upgrade your club in<br/>under <span className="font-medium text-accent-teal">ten minutes</span>
          </h2>
          <p className="max-w-[520px] text-[18px] leading-[28px] text-ink-muted sm:text-[19px]">
            Join thousands of students and clubs already using ClubSync to make campus life better, simpler, and more connected.
          </p>
          <div className="flex flex-col items-center gap-3.5 pt-1.5 sm:flex-row">
            <Link href="/signup">
              <button className="bg-primary px-6 py-[15px] text-[16px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 rounded-lg shadow-soft-sm hover:bg-primary-hover">
                Get Started for Free
              </button>
            </Link>
            <Link href="/demo">
              <button className="group flex items-center gap-2 border border-border bg-white px-6 py-[15px] text-[16px] font-medium text-ink transition-colors hover:border-ink/30 rounded-lg shadow-sm">
                Book a Demo
              </button>
            </Link>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

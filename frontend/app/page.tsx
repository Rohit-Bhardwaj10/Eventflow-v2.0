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
import type { ReactNode } from 'react';
import { PublicLayout } from '@/components/layouts/public-layout';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Event Discovery',
    description: 'A beautiful, centralized calendar for students to find and RSVP to everything happening on campus.',
  },
  {
    icon: UsersRound,
    title: 'Club Management',
    description: 'Manage members, track dues, and organize your roster all in one secure place.',
  },
  {
    icon: QrCode,
    title: 'QR Check-in',
    description: 'Breeze through long lines with instant mobile QR scanning for registered attendees.',
  },
  {
    icon: CreditCard,
    title: 'Payments & Dues',
    description: 'Sell tickets securely and collect club dues without third-party cash apps.',
  },
  {
    icon: LineChart,
    title: 'Analytics & Insights',
    description: 'Understand what works with real-time turnout metrics and engagement tracking.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Access',
    description: 'Control who sees what. Keep internal club meetings private and open events public.',
  }
];

const stats = [
  { value: '120+', label: 'Colleges Using It' },
  { value: '45k+', label: 'Events Hosted' },
  { value: '1.2M', label: 'Students Reached' },
];

const testimonials = [
  {
    quote: "ClubSync completely changed how we handle rush week. We went from messy spreadsheets to a seamless QR system.",
    name: "Alex Rivera",
    role: "President, Debate Society"
  },
  {
    quote: "The analytics are a game-changer. We finally know exactly who's showing up to our workshops and when.",
    name: "Sarah Chen",
    role: "Events VP, Tech Club"
  },
  {
    quote: "Collecting dues and selling tickets in one place means we actually have a budget this semester.",
    name: "Jordan Smith",
    role: "Treasurer, Arts Coalition"
  }
];

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

        {/* SOCIAL PROOF */}
        <section className="py-12 bg-transparent relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-10">Trusted by campuses nationwide</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/60">
              {stats.map((stat, i) => (
                <div key={i} className="pt-6 md:pt-0">
                  <p className="text-4xl md:text-5xl font-playfair font-bold text-primary">{stat.value}</p>
                  <p className="mt-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <SectionShell eyebrow="Everything you need" title="Run your club like a pro.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 shadow-soft-sm border border-border/40 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center text-primary mb-6 shadow-inner">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-3">{feature.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* SPOTLIGHT SECTION */}
        <section className="py-24 max-w-6xl mx-auto px-6 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] rounded-[32px] bg-primary/5 p-8 border border-primary/10 overflow-hidden flex items-center justify-center shadow-inner">
               <div className="absolute inset-0 bg-diagonal-stripes-subtle opacity-30"></div>
               <div className="relative w-full max-w-sm aspect-[9/16] bg-white rounded-[32px] shadow-soft-lg border-[6px] border-surface-2 overflow-hidden flex flex-col">
                 <div className="h-12 bg-primary/5 flex items-center justify-center border-b border-border/40">
                   <div className="w-12 h-1.5 bg-border rounded-full"></div>
                 </div>
                 <div className="p-6 flex-1 flex flex-col gap-4">
                   <div className="w-full aspect-video bg-surface-2 rounded-xl"></div>
                   <div className="h-6 w-3/4 bg-surface-3 rounded-md mt-2"></div>
                   <div className="h-4 w-1/2 bg-surface-2 rounded"></div>
                   <div className="mt-auto">
                     <div className="h-12 w-full bg-primary text-white rounded-xl flex items-center justify-center text-sm font-semibold">RSVP Now</div>
                   </div>
                 </div>
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="glass-pill inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary mb-6">Discovery</div>
              <h2 className="text-display-lg text-ink font-playfair mb-6">A single feed for your entire campus.</h2>
              <p className="text-lg text-ink-muted mb-8 leading-relaxed">
                Stop relying on scattered flyers and chaotic group chats. ClubSync brings every event into one beautiful, personalized feed that students actually want to browse.
              </p>
              <ul className="space-y-5">
                {[
                  'Personalized recommendations based on major and interests.',
                  'One-tap RSVPs and instant calendar sync.',
                  'Push notifications for venue changes or reminders.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-accent-teal shrink-0 mt-0.5" />
                    <span className="text-ink-muted font-medium text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-surface-2/50 mt-12 border-y border-border/40">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-center text-display-md font-playfair text-ink mb-16">Loved by student leaders.</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((test, i) => (
                <div key={i} className="bg-white p-8 rounded-[24px] shadow-soft-sm border border-border/30 flex flex-col justify-between hover:shadow-soft transition-shadow">
                  <div>
                    <div className="flex gap-1 mb-6 text-accent-gold">
                      {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-ink text-base leading-relaxed font-medium mb-8">&quot;{test.quote}&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{test.name}</p>
                    <p className="text-xs font-medium text-ink-muted mt-1">{test.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="rounded-[32px] overflow-hidden relative shadow-soft-lg p-12 md:p-24 text-center flex flex-col items-center border border-white/60">
             <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-teal-100/40 to-yellow-50/40 z-0"></div>
             
             <div className="relative z-10 w-full max-w-2xl">
               <h2 className="text-display-lg text-primary font-playfair mb-6">Ready to upgrade your campus experience?</h2>
               <p className="text-lg text-ink-muted mb-10">
                 Join thousands of students and clubs already using ClubSync to make campus life better, simpler, and more connected.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/signup">
                    <button className="bg-primary text-white px-8 py-4 rounded-full font-medium shadow-soft hover:bg-primary-hover transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                      Get Started for Free
                    </button>
                  </Link>
                  <Link href="/demo">
                    <button className="bg-white/80 backdrop-blur text-primary border border-white/80 px-8 py-4 rounded-full font-medium shadow-sm hover:bg-white transition-all w-full sm:w-auto">
                      Book a Demo
                    </button>
                  </Link>
               </div>
             </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            {eyebrow}
          </p>
          <h2 className="text-display-md font-playfair text-ink">
            {title}
          </h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

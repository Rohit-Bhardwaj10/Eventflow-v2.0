'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Users,
  Star,
  UsersRound,
  ShieldCheck,
  CreditCard,
  QrCode,
  LineChart,
  LayoutDashboard,
  Bell
} from 'lucide-react';
import { PublicLayout } from '@/components/layouts/public-layout';


const ease = [0.16, 1, 0.3, 1] as const;

// Animation Helpers
function FadeIn({ children, delay = 0, className = '', y = 10, scale = 1 }: { children: React.ReactNode, delay?: number, className?: string, y?: number, scale?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } }
};

function StaggerContainer({ children, className = '', delayChildren = 0.1, staggerChildren = 0.1 }: { children: React.ReactNode, className?: string, delayChildren?: number, staggerChildren?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div variants={fadeVariants} className={className}>
      {children}
    </motion.div>
  );
}

import { DashboardMockup, EventCardsMockup, RevenueChartMockup, ScannerMockup, DebateSocietyMockup } from '@/components/landing/mockups';

export default function LandingPage() {
  return (
    <PublicLayout>
      <div className="relative isolate overflow-hidden bg-canvas selection:bg-accent-teal selection:text-white pb-24">

        {/* Full-page subtle grid texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_40%,transparent_100%)]" />

        {/* HERO SECTION */}
        <section className="relative w-full">
          <div className="relative bg-surface-2 min-h-screen flex flex-col items-center pt-32 md:pt-40 pb-20 md:pb-28">

            {/* Background Image/Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/Image.png"
                alt="Background"
                fill
                className="object-cover"
                priority
              />
              {/* Vertical Scanline Texture */}
              <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_right,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:4px_100%]" />
            </div>

            {/* Content Stack */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6 w-full">

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
                Your Campus Events. <br /><span className="italic font-normal">Finally Centralized.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
                className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-ink-muted max-w-2xl font-medium"
              >
                The all-in-one platform for college clubs to create, manage, and scale events. Stop wrestling with spreadsheets and group chats.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
                className="mt-7 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
              >
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 rounded-full font-medium shadow-soft hover:bg-primary-hover transition-all hover:-translate-y-0.5">
                    Start Your Club
                  </button>
                </Link>
                <Link href="/explore" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-primary border border-white/60 px-8 py-3.5 rounded-full font-medium hover:bg-white transition-all shadow-sm">
                    Explore Events
                  </button>
                </Link>
              </motion.div>

            </div>

            {/* Floating Bubbles */}
            {/* {floatingBubbles.map((bubble, i) => (
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
            ))} */}

          </div>
        </section>

        {/* Dashboard Mockup - sits below hero, pulled up with negative margin */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="relative hidden md:block -mt-24 md:-mt-48 mx-auto w-full px-2 md:px-6 max-w-7xl z-20"
        >
          <DashboardMockup />
        </motion.div>

        {/* MODULAR BENTO SECTION */}
        <section id="why" className="relative scroll-mt-24 px-4 md:px-6 pt-24 pb-16 overflow-hidden">
          {/* Decorative Background Grid & Glows */}
          <div className="absolute inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
            <div className="absolute top-[-10%] w-[150%] h-[120%] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)]"></div>
            <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-accent-teal/5 rounded-full blur-[100px]"></div>
            <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-accent-gold/5 rounded-full blur-[80px]"></div>
          </div>

          <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-12">
            <FadeIn y={10} className="flex flex-col items-center gap-4 text-center">
              <span className="glass-pill px-4 py-1.5 font-sans text-[11.5px] font-bold uppercase tracking-[0.15em] text-accent-teal shadow-sm bg-white/60 backdrop-blur-md border border-accent-teal/20 rounded-lg">Why EventFlow</span>
              <h2 className="text-[36px] font-playfair font-normal leading-[1.14] tracking-[-0.02em] text-ink sm:text-[46px]">
                One platform in.<br className="hidden sm:block" /> A thriving club out.
              </h2>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6" delayChildren={0.2} staggerChildren={0.1}>

              {/* Box 1: The Workflow */}
              <StaggerItem className="md:col-span-2 relative p-6 md:p-8 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-playfair font-bold text-ink tracking-tight">Focus on the experience, not the admin</h3>
                    <p className="text-[15px] text-ink-muted mt-2 max-w-md">EventFlow handles the tedious logistics—from ticketing to turnout tracking—so you can focus on throwing unforgettable events.</p>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-end justify-center pt-8 pb-4 gap-6 sm:gap-0">
                    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto max-w-[240px] sm:max-w-none">
                      {/* Dashboard Card */}
                      <div className="w-full sm:w-[160px] md:w-[220px] bg-white border border-border/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                        <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2/50 px-3 py-2.5">
                          <LayoutDashboard className="w-3.5 h-3.5 text-ink-muted" />
                          <span className="text-[11px] font-medium text-ink">Dashboard</span>
                        </div>
                        <div className="flex flex-col gap-2 px-3 py-3 text-[11px] md:text-xs">
                          <div className="flex justify-between items-center"><span className="text-ink-muted">Event</span> <span className="text-ink font-medium bg-surface-2 px-2 py-0.5 rounded-md">Fall Rush 2026</span></div>
                          <div className="flex justify-between items-center"><span className="text-ink-muted">Capacity</span> <span className="text-ink font-medium">500</span></div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden sm:block w-8 md:w-16 border-t-2 border-dashed border-border/70 relative">
                        <div className="absolute -right-1 -top-[5px] w-2 h-2 border-t-2 border-r-2 border-border/70 rotate-45"></div>
                      </div>
                      <div className="block sm:hidden h-6 border-l-2 border-dashed border-border/70 relative">
                        <div className="absolute -bottom-1 -left-[5px] w-2 h-2 border-b-2 border-r-2 border-border/70 rotate-45"></div>
                      </div>

                      {/* Live Card */}
                      <div className="w-full sm:w-[160px] md:w-[220px] bg-white border border-border/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-500 delay-100 ease-out">
                        <div className="flex items-center justify-between border-b border-border/60 bg-surface-2/50 px-3 py-2.5">
                          <span className="text-[11px] font-medium text-ink flex items-center gap-2">
                            <div className="size-4 bg-accent-teal/15 rounded flex items-center justify-center text-accent-teal text-[9px] font-bold">C</div>
                            Event Live
                          </span>
                          <span className="flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded-full">
                            <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"></span>
                            <span className="font-sans text-[8px] font-bold uppercase tracking-[0.1em] text-green-700">Active</span>
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 px-3 py-3 text-[11px] md:text-xs">
                          <div className="flex justify-between items-center"><span className="text-ink-muted">RSVPs</span> <span className="text-ink font-bold">240</span></div>
                          <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden mt-1"><motion.div className="h-full bg-accent-teal" initial={{ width: "0%" }} whileInView={{ width: "48%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }}></motion.div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* Box 2: Analytics */}
              <StaggerItem className="md:col-span-1 relative p-6 md:p-8 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-playfair font-bold text-ink tracking-tight">Grow your community</h3>
                    <p className="text-[15px] text-ink-muted mt-2">Gain deep insights into what your members love, helping you scale your club's presence.</p>
                  </div>
                  <div className="flex-1 flex flex-col justify-end gap-3 pt-8">
                    {[
                      { label: "Community Growth", value: "+42%", color: "text-ink" },
                      { label: "Avg Turnout", value: "85%", color: "text-ink" },
                      { label: "New Members", value: "+142", color: "text-accent-teal" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/80 border border-white/80 shadow-sm rounded-xl p-3 sm:p-4 flex justify-between items-center group-hover:scale-[1.02] transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                        <span className="text-[11px] sm:text-xs text-ink-muted font-bold uppercase tracking-wider">{stat.label}</span>
                        <span className={`text-base sm:text-lg font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>

              {/* Box 3: QR Entry */}
              <StaggerItem className="md:col-span-1 relative p-6 md:p-8 rounded-[2rem] border border-primary-hover bg-primary shadow-soft-lg overflow-hidden group text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-playfair font-bold tracking-tight">Verified & safe</h3>
                    <p className="text-[15px] text-white/70 mt-2">Exclusive to university-verified students with secure digital ticketing.</p>
                     <div className="flex-1 flex items-center justify-center pt-8">
                    <div className="relative size-28 sm:size-32 bg-white/5 rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <ShieldCheck className="size-12 sm:size-14 text-accent-teal" strokeWidth={1.5} />
                      <div className="absolute inset-0 bg-accent-teal/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100"></div>
                    </div>
                  </div>                </div>
                </div>
              </StaggerItem>

              {/* Box 4: Discovery */}
              <StaggerItem className="md:col-span-2 relative p-6 md:p-8 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-playfair font-bold text-ink tracking-tight">Never miss out again</h3>
                    <p className="text-[15px] text-ink-muted mt-2 max-w-md">For students, it’s the living pulse of the university. Always know what's happening and where your friends are going.</p>
                   <div className="flex-1 flex flex-col gap-3 mt-8 w-full max-w-sm mx-auto">
                     {/* Event pill 1 */}
                     <div className="bg-white border border-border/80 shadow-sm p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 sm:gap-4">
                        <div className="size-10 sm:size-12 rounded-xl bg-accent-teal/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-accent-teal uppercase">Oct</span>
                          <span className="text-sm sm:text-base font-bold text-accent-teal leading-none">24</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] sm:text-[15px] font-bold text-ink">Fall Rush Bonfire</span>
                          <span className="text-[11px] sm:text-xs text-ink-muted">Main Quad • 8:00 PM</span>
                        </div>
                     </div>
                     {/* Event pill 2 */}
                     <div className="bg-white border border-border/80 shadow-sm p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 sm:gap-4">
                        <div className="size-10 sm:size-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-primary uppercase">Oct</span>
                          <span className="text-sm sm:text-base font-bold text-primary leading-none">26</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] sm:text-[15px] font-bold text-ink">Tech Resume Review</span>
                          <span className="text-[11px] sm:text-xs text-ink-muted">Student Center • 6:00 PM</span>
                        </div>
                     </div>
                  </div>
                  </div>
                </div>
              </StaggerItem>

            </StaggerContainer>
          </div>
        </section>

        <div className="mx-auto max-w-[1100px] px-6 pt-[100px] lg:px-0">
          <div className="h-px w-full bg-border"></div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="scroll-mt-24 px-6 pt-[104px] lg:px-0">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-12">
            <FadeIn y={10}>
              <div className="flex flex-col items-center gap-5 text-center">
                <span className="font-sans text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent-teal">How it works</span>
                <h2 className="text-[34px] font-playfair font-normal leading-[1.14] tracking-[-0.025em] text-ink sm:text-[42px]">
                  Three steps to a packed event
                </h2>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3" delayChildren={0.2} staggerChildren={0.15}>
              {[
                { n: '01', title: 'Publish the details', body: 'Set a time, location, and capacity. Upload a flyer. Your event instantly appears in the centralized campus feed.' },
                { n: '02', title: 'Gather RSVPs & Dues', body: 'Students tap to RSVP or purchase tickets securely. You track real-time capacity and collected funds on your dashboard.' },
                { n: '03', title: 'Breeze through check-in', body: 'Scan QR codes at the door with any smartphone. Turnout metrics automatically sync to your club\'s analytics.' },
              ].map(({ n, title, body }) => (
                <StaggerItem key={n}>
                  <div className="relative flex flex-col items-start gap-4 p-6 rounded-2xl border border-white/50 bg-white/65 backdrop-blur-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="relative font-sans text-[13px] font-bold tracking-[0.08em] text-accent-teal">{n}</span>
                    <h3 className="relative text-[20px] font-medium tracking-[-0.01em] text-ink">{title}</h3>
                    <p className="relative text-[15px] leading-[23px] text-ink-muted">{body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* FEATURES (ALTERNATING) */}
        <section id="features" className="flex scroll-mt-24 flex-col gap-24 overflow-x-clip px-6 pb-[104px] pt-20 lg:px-0">

          {/* Feature 1 */}
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:gap-20 lg:flex-row">
            <FadeIn scale={0.97} delay={0.1} className="w-full lg:w-[560px] lg:shrink-0 rounded-2xl overflow-hidden border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] bg-white/60 backdrop-blur-[24px]">
              <div className="bg-white/40 backdrop-blur-sm p-4 sm:p-6">
<EventCardsMockup />
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="flex flex-1 flex-col items-start gap-[18px]">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">01 · Discovery</span>
              <h3 className="text-[26px] font-playfair font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                A single feed for<br className="hidden sm:block" /> your entire campus
              </h3>
              <p className="text-[17px] leading-[26px] text-ink-muted">
                Stop relying on scattered flyers and chaotic group chats. EventFlow brings every event into one beautiful, personalized feed that students actually want to browse.
              </p>
            </FadeIn>
          </div>

          {/* Feature 2 (Reversed) */}
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:gap-20 lg:flex-row-reverse">
            <FadeIn scale={0.97} delay={0.1} className="w-full lg:w-[560px] lg:shrink-0 rounded-2xl overflow-hidden border border-border shadow-soft">
              <div className="bg-surface-2 p-6">
<RevenueChartMockup />
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="flex flex-1 flex-col items-start gap-[18px]">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">02 · Management</span>
              <h3 className="text-[26px] font-playfair font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                Manage RSVPs and<br className="hidden sm:block" /> collect dues securely
              </h3>
              <p className="text-[17px] leading-[26px] text-ink-muted">
                Ditch the personal cash apps and chaotic spreadsheets. EventFlow gives your club a unified dashboard for real-time capacity tracking, secure ticketing, and post-event analytics.
              </p>
            </FadeIn>
          </div>

          {/* Feature 3 */}
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:gap-20 lg:flex-row">
            <FadeIn scale={0.97} delay={0.1} className="w-full lg:w-[560px] lg:shrink-0 rounded-2xl overflow-hidden border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] bg-white/60 backdrop-blur-[24px]">
              <div className="bg-white/40 backdrop-blur-sm p-6">
<ScannerMockup />
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="flex flex-1 flex-col items-start gap-[18px]">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">03 · Check-In</span>
              <h3 className="text-[26px] font-playfair font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                Breeze through the door<br className="hidden sm:block" /> with live QR scanning
              </h3>
              <p className="text-[17px] leading-[26px] text-ink-muted">
                Turn any smartphone into a check-in scanner. EventFlow’s live console prevents duplicate entries and keeps your door line moving fast, all while syncing turnout metrics instantly.
              </p>
            </FadeIn>
          </div>

          {/* Feature 4 (Reversed) */}
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:gap-20 lg:flex-row-reverse">
            <FadeIn scale={0.97} delay={0.1} className="w-full lg:w-[560px] lg:shrink-0 rounded-2xl overflow-hidden border border-border shadow-soft">
              <div className="bg-surface-2 p-6">
<DebateSocietyMockup />
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="flex flex-1 flex-col items-start gap-[18px]">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">04 · Community</span>
              <h3 className="text-[26px] font-playfair font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                Your club's digital<br className="hidden sm:block" /> home on campus
              </h3>
              <p className="text-[17px] leading-[26px] text-ink-muted">
                Build your brand with a beautiful club profile. Manage roles, broadcast announcements directly to followers, and give members a central hub to connect.
              </p>
            </FadeIn>
          </div>

        </section>

        {/* GUARDRAILS / SECURITY (DARK) */}
        <section id="security" className="flex scroll-mt-24 flex-col items-center gap-11 bg-primary px-6 py-[100px] lg:px-0 relative w-full left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <FadeIn y={10} className="flex flex-col items-center gap-[18px] text-center max-w-4xl mx-auto">
            <span className="font-sans text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent-teal">Security</span>
            <h2 className="text-[34px] font-playfair font-normal leading-[1.14] tracking-[-0.025em] text-white sm:text-[42px]">
              Trust and privacy,<br className="hidden sm:block" /> by default
            </h2>
            <p className="max-w-[600px] text-[17px] leading-[27px] text-white/70 sm:text-[18px]">
              Control who sees what. Keep internal club meetings private for verified members, and broadcast your major events to the entire campus safely.
            </p>
          </FadeIn>

          <StaggerContainer className="grid w-full max-w-[860px] grid-cols-2 gap-x-8 gap-y-7 border-t border-white/10 pt-[30px] lg:grid-cols-4 mx-auto" delayChildren={0.2} staggerChildren={0.1}>
            <StaggerItem>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent-teal">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[15px] font-medium text-white">Verified Emails</span>
                </div>
                <span className="font-sans text-[11.5px] leading-[17px] text-white/60">Strict `.edu` domain verification required.</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent-teal">
                  <Users className="w-4 h-4" />
                  <span className="text-[15px] font-medium text-white">Role Access</span>
                </div>
                <span className="font-sans text-[11.5px] leading-[17px] text-white/60">Admin, treasurer, and member permission levels.</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent-teal">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-[15px] font-medium text-white">Private Events</span>
                </div>
                <span className="font-sans text-[11.5px] leading-[17px] text-white/60">Hide meetings from the public campus feed.</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent-teal">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[15px] font-medium text-white">Secure Payouts</span>
                </div>
                <span className="font-sans text-[11.5px] leading-[17px] text-white/60">PCI-compliant transactions and direct deposit.</span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* REGISTRY / SOCIAL PROOF */}
        <section id="registry" className="flex scroll-mt-24 flex-col gap-11 px-6 pt-[100px] pb-16 lg:px-0 max-w-[1200px] mx-auto w-full">
          <div className="w-full">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <h2 className="max-w-[520px] text-[26px] font-playfair font-normal leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]">
                Empowering student leaders to build better communities
              </h2>
            </div>
          </div>

          {/* Mission & Roles Grid */}
          <StaggerContainer className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 mt-4" delayChildren={0.2} staggerChildren={0.2}>
            <StaggerItem className="h-full">
              <figure className="relative flex h-full flex-col justify-between gap-7 rounded-2xl border border-white/50 bg-white/65 backdrop-blur-[28px] p-[34px] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1.5px_0_rgba(255,255,255,1)] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                <div className="relative">
                  <span className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em] text-accent-teal">Our Mission</span>
                  <p className="mt-4 text-[22px] font-normal leading-[1.45] tracking-[-0.015em] text-ink sm:text-[23px]">
                    To eliminate the friction of campus event organization. EventFlow gives every club the professional tools they need to focus on what matters: building community.
                  </p>
                </div>
              </figure>
            </StaggerItem>
            <StaggerItem className="h-full">
              <div className="flex h-full flex-col justify-center gap-7 overflow-hidden bg-accent-teal p-[34px] rounded-2xl shadow-soft">
                <span className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/80">Built for Everyone</span>
                <div className="flex flex-col gap-6 mt-1">
                  <div>
                    <h4 className="text-lg font-semibold text-white">For Students</h4>
                    <p className="text-[15px] leading-relaxed text-white/80 mt-1">Discover what's happening on campus, RSVP with a tap, and keep your QR tickets in one place.</p>
                  </div>
                  <div className="h-px w-full bg-white/30"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">For Organizers</h4>
                    <p className="text-[15px] leading-relaxed text-white/80 mt-1">Create events, track capacity, sell tickets, scan check-ins, and analyze turnout all from one dashboard.</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* CTA / PRICING SECTION */}
        <section className="flex flex-col items-center gap-6 px-6 pb-16 pt-12 text-center lg:px-0">
          <h2 className="text-[40px] font-playfair font-normal leading-[1.08] tracking-[-0.03em] text-ink sm:text-[54px]">
            Upgrade your club in<br />under <span className="font-medium text-accent-teal">ten minutes</span>
          </h2>
          <p className="max-w-[520px] text-[18px] leading-[28px] text-ink-muted sm:text-[19px]">
            Join the student leaders already using EventFlow to make campus life better, simpler, and more connected.
          </p>
          <div className="flex flex-col items-center gap-3.5 pt-1.5 sm:flex-row">
            <Link href="/signup">
              <button className="relative overflow-hidden rounded-xl bg-primary/95 backdrop-blur-md border border-white/15 px-8 py-[15px] text-[16px] font-medium text-white shadow-[0_4px_20px_rgba(13,59,56,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-primary hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(13,59,56,0.4)]">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                Get Started for Free
              </button>
            </Link>
            <Link href="/demo">
              <button className="relative overflow-hidden rounded-xl border border-white/60 bg-white/70 backdrop-blur-[28px] px-8 py-[15px] text-[16px] font-medium text-ink shadow-[0_4px_16px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-200 hover:bg-white/80 hover:scale-[1.02]">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                Book a Demo
              </button>
            </Link>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

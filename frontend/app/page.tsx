"use client";

import Link from "next/link";
import { PublicLayout } from "@/components/layouts/public-layout";
import { motion } from "framer-motion";
import {
  Ticket,
  ScanLine,
  BarChart3,
  Wand2,
  Users,
  ShieldCheck,
  ArrowRight,
  Zap,
  QrCode,
  Sparkles,
  Terminal
} from "lucide-react";

const features = [
  {
    icon: Ticket,
    title: "Tiered Ticketing",
    desc: "Cap capacity, waitlists, payments. Absolute control.",
    color: "bg-accent-yellow",
    text: "text-canvas"
  },
  {
    icon: ScanLine,
    title: "Check-in",
    desc: "Sub-second QR scanning. Chaos eliminated.",
    color: "bg-accent-cyan",
    text: "text-canvas"
  },
  {
    icon: Wand2,
    title: "AI Co-pilot",
    desc: "Draft marketing copy in ms with Llama 3.",
    color: "bg-accent-pink",
    text: "text-canvas"
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Track everything. Trust only data.",
    color: "bg-primary",
    text: "text-canvas"
  }
];

export default function LandingPage() {
  return (
    <PublicLayout>
      <div className="brutal-noise-bg min-h-screen selection:bg-primary selection:text-canvas">
        
        {/* Aggressive Marquee Header */}
        <div className="w-full overflow-hidden border-b-[3px] border-border bg-primary py-2 shadow-brutal">
          <div className="flex whitespace-nowrap marquee-track font-mono font-black text-sm uppercase tracking-widest text-canvas">
            {Array(15)
              .fill("CAMPUS SCALE ONLY /// ")
              .map((text, i) => (
                <span key={i} className="mx-4">
                  {text}
                </span>
              ))}
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative border-b-[4px] border-border bg-canvas pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 brutal-grid-bg pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left — High Impact Copy */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              <div className="mb-6 inline-flex items-center bg-accent-pink text-canvas font-mono font-bold text-xs uppercase px-3 py-1 border-[3px] border-border shadow-[4px_4px_0_0_#f4f4f0] -rotate-2">
                <Zap className="w-4 h-4 mr-2" />
                V2.0 LIVE
              </div>

              <h1 className="text-display-xl text-ink leading-[0.85] mb-8">
                <span className="block">OWN</span>
                <span className="block text-outline-brutal">THE</span>
                <span className="inline-block bg-primary text-canvas px-4 pb-2 pt-1 rotate-2 shadow-[8px_8px_0_0_#f4f4f0] border-[4px] border-border mt-3">
                  DOOR.
                </span>
              </h1>

              <p className="text-subhead text-ink max-w-lg mb-10 p-5 border-[3px] border-border border-l-[8px] border-l-accent-cyan bg-surface-1 shadow-brutal-lg">
                Eventflow is the ruthless, all-in-one platform for college clubs.
                Stop using spreadsheets. Start running real events.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                <Link href="/signup" className="w-full">
                  <button className="w-full bg-primary text-canvas text-lg font-black uppercase py-5 border-[3px] border-border brutal-hover-lift flex items-center justify-center group shadow-[6px_6px_0_0_#f4f4f0]">
                    START FOR FREE
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
                <Link href="/explore" className="w-full">
                  <button className="w-full bg-surface-1 text-ink text-lg font-black uppercase py-5 border-[3px] border-border brutal-hover-lift shadow-[6px_6px_0_0_#f4f4f0]">
                    BROWSE
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — The Differentiation Anchor (Massive Ticket) */}
            <div className="lg:col-span-5 hidden lg:block perspective-[1200px]">
              <motion.div
                className="w-full max-w-[380px] mx-auto animate-float-brutal relative"
                initial={{ opacity: 0, rotateY: 30, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: -5, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="bg-canvas border-[4px] border-border shadow-[16px_16px_0_0_#f4f4f0] relative">
                  
                  {/* Top Half */}
                  <div className="p-8 bg-accent-pink border-b-[4px] border-border border-dashed relative h-[240px] flex flex-col justify-end">
                    <div className="bg-diagonal-stripes absolute inset-0 opacity-20 pointer-events-none"></div>
                    <div className="absolute -right-8 -top-8 opacity-10 rotate-12 text-canvas pointer-events-none">
                      <QrCode className="w-56 h-56" />
                    </div>
                    <div className="self-start bg-canvas text-ink font-mono font-bold text-xs uppercase px-3 py-1 border-[2px] border-border mb-4 -rotate-2 shadow-brutal-sm relative z-10">
                      VIP ACCESS
                    </div>
                    <h2 className="text-[56px] font-black text-canvas leading-[0.85] uppercase tracking-tighter relative z-10">
                      TECH<br/>NEXUS<br/>2026
                    </h2>
                  </div>
                  
                  {/* Bottom Half */}
                  <div className="p-8 bg-surface-1 flex justify-between items-end h-[160px]">
                    <div>
                      <p className="text-caption text-ink-muted mb-1">ATTENDEE</p>
                      <p className="font-black text-2xl uppercase tracking-tight text-ink">ADMIT ONE</p>
                    </div>
                    <div className="bg-canvas p-2 border-[3px] border-border shadow-brutal-sm">
                      <QrCode className="w-16 h-16 text-ink" />
                    </div>
                  </div>
                </div>
                
                {/* Floating stat card */}
                <div className="absolute -bottom-10 -left-12 bg-primary text-canvas border-[4px] border-border shadow-[8px_8px_0_0_#f4f4f0] p-5 -rotate-6 z-30 group-hover:rotate-0 transition-transform">
                  <p className="text-caption font-bold mb-1 uppercase tracking-wider text-canvas/80">Scan Time</p>
                  <p className="text-4xl font-black">&lt; 0.8s</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Asymmetrical Features */}
        <section className="py-24 lg:py-32 border-b-[4px] border-border bg-surface-1 relative overflow-hidden">
          <div className="bg-diagonal-stripes-subtle absolute inset-0 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-20">
              <h2 className="text-display-lg text-ink max-w-3xl leading-[0.9]">
                EVERYTHING<br/>YOU NEED.
                <span className="block text-accent-cyan mt-2 rotate-1 bg-ink text-canvas w-fit px-4 border-[4px] border-border shadow-brutal inline-block">NOTHING YOU DON'T.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div 
                  key={feature.title} 
                  className={`border-[3px] border-border p-8 shadow-brutal brutal-hover-lift flex flex-col justify-between ${feature.color} ${feature.text} relative overflow-hidden group`}
                >
                  <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-48 h-48" />
                  </div>
                  
                  <div className="h-16 w-16 bg-canvas border-[3px] border-border flex items-center justify-center mb-12 shadow-[4px_4px_0_0_#0f0f0f] relative z-10">
                    <feature.icon className="w-8 h-8 text-ink" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-headline uppercase mb-3 text-canvas">{feature.title}</h3>
                    <p className="font-bold text-canvas/80 text-lg leading-snug">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Massive Trust Bar underneath features */}
            <div className="mt-20 border-[4px] border-border bg-canvas p-8 shadow-brutal flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="text-headline uppercase font-black text-ink">TRUSTED BY <span className="text-primary">ELITE</span> CLUBS</p>
              <div className="flex flex-wrap justify-center md:justify-end gap-4">
                {["IIT Delhi", "BITS Pilani", "NIT Trichy", "VIT"].map((name) => (
                  <div key={name} className="px-4 py-2 border-[2px] border-border bg-surface-2 text-ink font-mono text-sm font-bold uppercase">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brutal AI Section */}
        <section className="py-24 lg:py-32 border-b-[4px] border-border bg-ink text-canvas relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="order-2 lg:order-1">
                <div className="border-[4px] border-primary bg-canvas text-ink shadow-[12px_12px_0_0_#bfff00] p-6 font-mono relative">
                  {/* Console Header */}
                  <div className="flex items-center justify-between mb-6 border-b-[3px] border-border pb-4">
                    <div className="flex gap-2">
                      <div className="w-5 h-5 bg-accent-pink border-[2px] border-border" />
                      <div className="w-5 h-5 bg-primary border-[2px] border-border" />
                      <div className="w-5 h-5 bg-accent-cyan border-[2px] border-border" />
                    </div>
                    <Terminal className="w-6 h-6 text-ink" />
                  </div>
                  
                  {/* Console Body */}
                  <div className="text-sm lg:text-base font-bold">
                    <p className="text-ink-muted mb-4">
                      <span className="text-primary mr-2">&gt;</span> 
                      groq generate --context "Web3 Hackathon"
                    </p>
                    <div className="bg-surface-2 border-[2px] border-border p-5 mt-4 relative">
                      <div className="absolute -top-3 -right-3 bg-accent-cyan text-canvas text-xs px-2 py-1 border-[2px] border-border rotate-[5deg]">
                        Output
                      </div>
                      <p className="text-ink leading-relaxed">
                        Join 200+ builders for a 48-hour sprint into decentralized apps. 
                        Workshops, mentors, ₹2L in prizes. No experience required — just curiosity and caffeine.
                      </p>
                    </div>
                    <p className="text-accent-pink mt-6 text-xs tracking-widest uppercase flex items-center">
                      <span className="inline-block w-2 h-2 bg-accent-pink animate-pulse mr-2 rounded-full"></span>
                      GENERATED IN 340ms
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="inline-block bg-primary text-canvas font-mono font-bold text-sm uppercase px-3 py-1 border-[2px] border-border shadow-brutal-sm mb-6">
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  GROQ CO-PILOT
                </div>
                <h2 className="text-display-md text-canvas mb-8 leading-[0.9]">
                  STOP STARING<br/>AT BLANK PAGES.
                </h2>
                <div className="border-l-[6px] border-accent-pink pl-6">
                  <p className="text-subhead text-canvas/80">
                    Generate descriptions, social copy, and emails instantly. 
                    Zero latency. Pure momentum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aggressive CTA */}
        <section className="py-32 bg-accent-pink border-b-[8px] border-border relative overflow-hidden">
          <div className="bg-diagonal-stripes absolute inset-0 opacity-20 mix-blend-overlay"></div>
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
            <h2 className="text-[clamp(60px,10vw,140px)] font-black uppercase leading-[0.8] tracking-tighter text-canvas mb-12 drop-shadow-[4px_4px_0_#0f0f0f]">
              DEPLOY<br/>NOW.
            </h2>
            <Link href="/signup">
              <button className="text-2xl py-8 px-16 uppercase font-black bg-primary text-canvas border-[4px] border-border shadow-[12px_12px_0_0_#0f0f0f] hover:shadow-[4px_4px_0_0_#0f0f0f] hover:translate-x-[8px] hover:translate-y-[8px] transition-all rounded-none">
                CREATE CLUB ACCOUNT
              </button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

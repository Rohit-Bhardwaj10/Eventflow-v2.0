import { PublicLayout } from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Ticket, ScanLine, BarChart3, Wand2, Users, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 mx-auto max-w-7xl flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <Badge variant="default" className="mb-8 relative z-10 hover:bg-surface-3 transition-colors cursor-default border border-hairline px-3 py-1">
          <span className="text-primary mr-2">✦</span> ClubSync 2.0 is now live
        </Badge>
        
        <h1 className="text-display-xl max-w-5xl text-ink relative z-10 tracking-tight leading-[1.05] drop-shadow-xl">
          The modern platform for college clubs.
        </h1>
        
        <p className="text-body-lg text-ink-muted max-w-2xl mt-8 relative z-10">
          ClubSync brings your events, members, and operations into one beautifully designed space. Built for speed, designed for scale.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-12 relative z-10">
          <Button variant="primary" size="default" className="shadow-[0_0_24px_rgba(94,106,210,0.4)] px-6 py-3 text-base">Start for free</Button>
          <Button variant="secondary" size="default" className="px-6 py-3 text-base">Book a demo</Button>
        </div>
      </section>

      {/* Hero Product Screenshot */}
      <section className="px-6 pb-section mx-auto max-w-[1200px] relative z-20">
        <div className="relative rounded-xl overflow-hidden border border-hairline bg-surface-1 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] transition-transform duration-700 hover:scale-[1.01] hover:shadow-[0_40px_120px_-20px_rgba(94,106,210,0.15)] group">
           <Image 
             src="/dashboard-mockup.png" 
             alt="ClubSync Dashboard" 
             width={1200} 
             height={675}
             className="w-full h-auto object-cover"
             priority
           />
           <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-xl" />
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section className="border-y border-hairline bg-surface-1/30 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-caption text-ink-subtle uppercase tracking-[0.2em] mb-10">Trusted by top student organizations</p>
          <div className="flex justify-center flex-wrap gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2"><LayoutDashboard className="w-6 h-6" /><h2 className="text-subhead font-bold tracking-tight">TechClub</h2></div>
            <div className="flex items-center gap-2"><Wand2 className="w-6 h-6" /><h2 className="text-subhead font-bold tracking-tight italic">DesignSociety</h2></div>
            <div className="flex items-center gap-2"><BarChart3 className="w-6 h-6" /><h2 className="text-subhead font-bold tracking-tight">FinanceOrg</h2></div>
            <div className="flex items-center gap-2"><Users className="w-6 h-6" /><h2 className="text-subhead font-bold tracking-tight">DebateUnion</h2></div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="px-6 py-section mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-display-lg text-ink">Built for organizers.</h2>
          <p className="text-body-lg text-ink-muted mt-6 max-w-2xl">
            Everything you need to run successful events, from intelligent ticketing to deep analytics, without the bloat.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1 (Large Image) */}
          <Card variant="feature" className="p-0 overflow-hidden flex flex-col group border-hairline transition-colors hover:border-hairline-strong">
            <div className="p-10 flex-1">
              <div className="h-12 w-12 bg-surface-3 rounded-lg flex items-center justify-center border border-hairline mb-8 shadow-sm">
                <Ticket className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-headline mb-4">Smart Ticketing & Waitlists</h3>
              <p className="text-body text-ink-muted leading-relaxed">
                Create multiple ticket tiers, manage waitlists seamlessly, and issue dynamic QR codes instantly to registered students. Automatically promote waitlisted students when spots open up.
              </p>
            </div>
            <div className="bg-surface-2 border-t border-hairline overflow-hidden p-8 pt-12">
              <div className="relative rounded-lg overflow-hidden border border-hairline shadow-2xl transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                <Image src="/event-ticket-mockup.png" alt="Ticketing" width={800} height={450} className="w-full h-auto" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none rounded-lg" />
              </div>
            </div>
          </Card>

          {/* Feature 2 (Large Image) */}
          <Card variant="feature" className="p-0 overflow-hidden flex flex-col group border-hairline transition-colors hover:border-hairline-strong">
            <div className="p-10 flex-1">
              <div className="h-12 w-12 bg-surface-3 rounded-lg flex items-center justify-center border border-hairline mb-8 shadow-sm">
                <BarChart3 className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-headline mb-4">Deep Analytics</h3>
              <p className="text-body text-ink-muted leading-relaxed">
                Understand your audience with real-time insights on registrations, drop-offs, and attendee demographics. Export data instantly for your college administration reports.
              </p>
            </div>
            <div className="bg-surface-2 border-t border-hairline overflow-hidden p-8 pt-12">
              <div className="relative rounded-lg overflow-hidden border border-hairline shadow-2xl transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                <Image src="/analytics-mockup.png" alt="Analytics" width={800} height={450} className="w-full h-auto" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none rounded-lg" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Feature List Grid */}
      <section className="px-6 py-section mx-auto max-w-7xl border-t border-hairline">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col group">
            <div className="h-12 w-12 bg-surface-2 rounded-lg flex items-center justify-center border border-hairline mb-8 group-hover:border-primary/50 transition-colors">
              <ScanLine className="text-ink w-5 h-5 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-card-title mb-4 text-ink group-hover:text-primary transition-colors">Real-time Check-in</h3>
            <p className="text-body text-ink-muted leading-relaxed">
              Scan QR codes from any device&apos;s camera. Watch your attendance counter update in real-time across all organizers&apos; devices simultaneously.
            </p>
          </div>
          <div className="flex flex-col group">
            <div className="h-12 w-12 bg-surface-2 rounded-lg flex items-center justify-center border border-hairline mb-8 group-hover:border-primary/50 transition-colors">
              <Wand2 className="text-ink w-5 h-5 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-card-title mb-4 text-ink group-hover:text-primary transition-colors">AI-Powered Creation</h3>
            <p className="text-body text-ink-muted leading-relaxed">
              Generate compelling event descriptions, promotional emails, and poster design briefs with our deeply integrated Claude AI models.
            </p>
          </div>
          <div className="flex flex-col group">
            <div className="h-12 w-12 bg-surface-2 rounded-lg flex items-center justify-center border border-hairline mb-8 group-hover:border-primary/50 transition-colors">
              <Users className="text-ink w-5 h-5 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-card-title mb-4 text-ink group-hover:text-primary transition-colors">Member Management</h3>
            <p className="text-body text-ink-muted leading-relaxed">
              Maintain a central directory of your club members, assign granular roles, and broadcast announcements instantly to your followers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-section mx-auto max-w-5xl">
        <div className="bg-surface-1 rounded-xxl p-16 md:p-24 border border-hairline flex flex-col items-center text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h2 className="text-display-md text-ink max-w-2xl relative z-10 tracking-tight leading-[1.1]">
            Ready to upgrade your club&apos;s operations?
          </h2>
          <p className="text-body-lg text-ink-muted mt-8 max-w-xl relative z-10">
            Join hundreds of organizers who are already saving hours every week. Setup takes less than 5 minutes.
          </p>
          <div className="flex gap-4 mt-12 relative z-10">
            <Button variant="primary" size="default" className="px-8 py-4 text-base shadow-[0_0_30px_rgba(94,106,210,0.3)]">Create your club</Button>
            <Button variant="secondary" size="default" className="px-8 py-4 text-base">Contact Sales</Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

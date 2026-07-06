'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Megaphone,
  MessageSquareQuote,
  Radar,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Ticket,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { PublicLayout } from '@/components/layouts/public-layout';
import { HeroScene } from '@/components/landing/hero-scene';

const stats = [
  { value: '3x', label: 'faster setup' },
  { value: '99.9%', label: 'scan reliability' },
  { value: '1', label: 'workspace' },
];

const features = [
  {
    icon: Ticket,
    title: 'Ticketing that stays tidy',
    description:
      'Create public or private ticket tiers, manage capacity, and keep the experience simple for attendees.',
  },
  {
    icon: ScanLine,
    title: 'Fast QR check-in',
    description:
      'Move entry from a bottleneck to a quick scan with a clear live view for the team at the door.',
  },
  {
    icon: BarChart3,
    title: 'Operational analytics',
    description:
      'See registrations, attendance, and conversion in one dashboard instead of stitching reports together.',
  },
  {
    icon: Megaphone,
    title: 'Announcements and outreach',
    description:
      'Send updates, reminders, and follow-ups without leaving the event workflow.',
  },
  {
    icon: FileCheck2,
    title: 'Certificates and records',
    description:
      'Keep attendance records and post-event certificates attached to the same source of truth.',
  },
  {
    icon: ShieldCheck,
    title: 'Controlled access',
    description:
      'Separate organizers, volunteers, and admins so the right people see the right controls.',
  },
];

const workflow = [
  {
    step: '01',
    title: 'Plan the event',
    description:
      'Set the event details, pricing, attendee limits, and communications from a single workspace.',
    icon: CalendarDays,
  },
  {
    step: '02',
    title: 'Publish and collect',
    description:
      'Share the event, sell tickets, and track signups while the dashboard keeps the numbers current.',
    icon: CreditCard,
  },
  {
    step: '03',
    title: 'Operate on the day',
    description:
      'Scan QR codes, monitor arrivals, and update the team without juggling separate tools.',
    icon: Radar,
  },
];

const showcase = [
  {
    image: '/dashboard-mockup.png',
    title: 'Command center',
    description:
      'Keep registrations, check-ins, and attendance trends in one dense but readable view.',
  },
  {
    image: '/event-ticket-mockup.png',
    title: 'Ticket surfaces',
    description:
      'Present tickets with a clear identity and the exact details organizers need at entry.',
  },
  {
    image: '/analytics-mockup.png',
    title: 'Live performance',
    description:
      'Review event health, traffic, and conversions before and after the event closes.',
  },
];

const testimonials = [
  {
    quote:
      'We moved from spreadsheets and ad-hoc messages to a single flow the team could actually follow during live events.',
    name: 'Aarav Mehta',
    role: 'Cultural secretary, campus club',
  },
  {
    quote:
      'The interface is direct. It gives enough control for organizers without making the dashboard feel crowded.',
    name: 'Sara Iyer',
    role: 'Events lead, student council',
  },
  {
    quote:
      'Check-in became a two-person job instead of a fire drill. That alone changed how our launch day felt.',
    name: 'Rohit Nair',
    role: 'Operations volunteer',
  },
];

const faq = [
  {
    q: 'Is Eventflow built for small teams?',
    a: 'Yes. It is designed for student teams and club organizers who need a clean workflow without a large operations staff.',
  },
  {
    q: 'Can we run public and private events?',
    a: 'Yes. The same flow supports open registration, invite-based access, and controlled entry depending on the event.',
  },
  {
    q: 'Do we get attendee analytics?',
    a: 'Yes. The dashboard is focused on the metrics that matter most: registrations, attendance, and conversion.',
  },
  {
    q: 'Does it support on-site check-in?',
    a: 'Yes. QR-based check-in is part of the core flow and is surfaced as a fast, operational tool.',
  },
];

const chipLogos = ['IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'VIT', 'SRM'];
const ease = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  return (
    <PublicLayout>
      <div className="relative isolate overflow-hidden bg-canvas selection:bg-primary selection:text-ink">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(183,188,248,0.12),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(73,128,115,0.1),_transparent_24%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(244,244,240,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(244,244,240,0.2)_1px,transparent_1px)] [background-size:42px_42px]" />

        <section className="relative pt-32 md:pt-36">
          <div className="mx-auto max-w-6xl px-6 pb-16 lg:pb-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.03fr_0.97fr]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 border-[2px] border-border bg-surface-1 px-3 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-ink-muted shadow-brutal-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Campus event operations
                </div>

                <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,6.6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-ink">
                  Plan, sell, scan, and report in one place.
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted md:text-lg">
                  Eventflow gives student teams a single workspace for tickets,
                  check-ins, announcements, certificates, and event reporting.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/signup">
                    <button className="inline-flex w-full items-center justify-center gap-2 border-[2px] border-border bg-primary px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-ink shadow-[6px_6px_0_0_var(--color-border)] transition-transform hover:-translate-x-1 hover:-translate-y-1 sm:w-auto">
                      Start free
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/explore">
                    <button className="inline-flex w-full items-center justify-center border-[2px] border-border bg-surface-1 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-ink transition-colors hover:bg-surface-2 sm:w-auto">
                      Explore events
                    </button>
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {stats.map((item) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.08, ease }}
                      className="border-[2px] border-border bg-surface-1 p-4 shadow-brutal-sm"
                    >
                      <div className="text-3xl font-black uppercase tracking-[-0.04em] text-ink">
                        {item.value}
                      </div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24, rotate: 1.2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, ease }}
                className="relative"
              >
                <div className="border-[2px] border-border bg-surface-1 p-4 shadow-[10px_10px_0_0_var(--color-border)]">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-ink-muted">
                        Live dashboard
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        Eventflow / Campus launch
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      Ready
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden border-[2px] border-border bg-canvas">
                    <div className="h-[310px] w-full">
                      <HeroScene />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="border-[2px] border-border bg-canvas p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">
                        Check-in status
                      </p>
                      <p className="mt-2 text-2xl font-black text-ink">Fast lane</p>
                      <p className="mt-1 text-sm text-ink-muted">
                        Live scan queue with clear access roles.
                      </p>
                    </div>
                    <div className="border-[2px] border-border bg-canvas p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">
                        Event readiness
                      </p>
                      <p className="mt-2 text-2xl font-black text-ink">94%</p>
                      <p className="mt-1 text-sm text-ink-muted">
                        Tickets, staff, and comms in place.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 left-5 border-[2px] border-border bg-primary px-4 py-3 shadow-[6px_6px_0_0_var(--color-border)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-ink-muted">
                    Queue time
                  </p>
                  <p className="text-2xl font-black text-ink">&lt; 1 min</p>
                </div>
              </motion.div>
            </div>

            <div className="mt-14 border-y border-border py-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-ink-muted">
                <span>Trusted by student teams and clubs</span>
                <div className="flex flex-wrap gap-2">
                  {chipLogos.map((logo) => (
                    <span key={logo} className="border border-border bg-surface-1 px-3 py-2">
                      {logo}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionShell
          id="features"
          eyebrow="Core modules"
          title="Built for the full event lifecycle."
          description="Everything is structured around the way campus teams actually work: prepare, publish, operate, and review."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05, ease }}
                className="border-[2px] border-border bg-surface-1 p-6 shadow-brutal-sm transition-transform hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center border-[2px] border-border bg-primary text-ink shadow-brutal-sm">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-black uppercase tracking-[-0.03em] text-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="workflow"
          eyebrow="Workflow"
          title="A short path from setup to entry."
          description="The layout stays linear so every step is visible without crowding the screen."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {workflow.map((item, index) => (
              <motion.article
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease }}
                className="border-[2px] border-border bg-surface-1 p-6 shadow-brutal-sm"
              >
                <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex h-11 w-11 items-center justify-center border-[2px] border-border bg-canvas text-ink shadow-brutal-sm">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-ink-muted">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black uppercase tracking-[-0.03em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </SectionShell>

        <section id="showcase" className="border-t border-border bg-surface-1">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                Showcase
              </p>
              <h2 className="mt-4 text-[clamp(2.2rem,4.8vw,4.4rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-ink">
                Clean surfaces for tickets, dashboards, and reporting.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted md:text-base">
                The product stays easy to scan: clear panels, direct labels, and enough structure to keep important data visible.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {showcase.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease }}
                  className="border-[2px] border-border bg-canvas p-4 shadow-brutal-sm"
                >
                  <div className="relative h-56 overflow-hidden border-[2px] border-border bg-surface-1">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <h3 className="mt-4 text-lg font-black uppercase tracking-[-0.03em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <SectionShell
          id="proof"
          eyebrow="Proof"
          title="Built for teams that need composure on event day."
          description="The product should feel direct to use and still look deliberate enough to trust."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.06, ease }}
                className="border-[2px] border-border bg-surface-1 p-6 shadow-brutal-sm"
              >
                <MessageSquareQuote className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm leading-7 text-ink">{item.quote}</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">{item.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-muted">{item.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </SectionShell>

        <section id="faq" className="border-t border-border bg-canvas">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                  FAQ
                </p>
                <h2 className="mt-4 text-[clamp(2rem,4.4vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-ink">
                  The questions teams ask before switching.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-ink-muted md:text-base">
                  The answers are intentionally short. The interface should reduce uncertainty, not add another layer of it.
                </p>
              </div>

              <div className="grid gap-4">
                {faq.map((item) => (
                  <article key={item.q} className="border-[2px] border-border bg-surface-1 p-5 shadow-brutal-sm">
                    <h3 className="text-base font-black uppercase tracking-[-0.02em] text-ink">{item.q}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">{item.a}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface-1">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
            <div className="grid gap-8 border-[2px] border-border bg-canvas p-6 shadow-[10px_10px_0_0_var(--color-border)] lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                  Ready to build
                </p>
                <h2 className="mt-4 text-[clamp(2.2rem,5vw,4.4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-ink">
                  Ship a cleaner event flow this week.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted md:text-base">
                  Start with the landing page, move into the event workspace, and let the system do the repetitive work.
                </p>
              </div>

              <div className="flex flex-col justify-between gap-4 border-[2px] border-border bg-surface-1 p-5">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-ink">
                    Everything organizers need in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className="flex-1">
                    <button className="w-full border-[2px] border-border bg-primary px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-ink shadow-[6px_6px_0_0_var(--color-border)] transition-transform hover:-translate-x-1 hover:-translate-y-1">
                      Create account
                    </button>
                  </Link>
                  <Link href="/login" className="flex-1">
                    <button className="w-full border-[2px] border-border bg-canvas px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-ink transition-colors hover:bg-surface-2">
                      Log in
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-[clamp(2.2rem,4.8vw,4.4rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-ink">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted md:text-base">
            {description}
          </p>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

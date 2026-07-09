'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { useAuth } from '@/lib/auth-context';
import { events, type Event, type TicketTier, ApiError } from '@/lib/api';
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Globe,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Ticket,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    events.get(slug)
      .then((ev) => {
        setEvent(ev);
        // Pre-select the first tier if any
        if (ev.ticketTiers && ev.ticketTiers.length > 0) {
          setSelectedTier(ev.ticketTiers[0].id);
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleRegister() {
    if (!user) {
      router.push('/login');
      return;
    }
    setRegistering(true);
    setRegError(null);
    try {
      await events.register(event!.id, selectedTier ?? undefined);
      setRegistered(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setRegError(err.message);
      } else {
        setRegError('Registration failed. Please try again.');
      }
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <PublicLayout hideNav={true}>
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-canvas">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-border"></div>
            <div className="absolute inset-0 rounded-full border-2 border-accent-teal border-t-transparent animate-spin"></div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (notFound || !event) {
    return (
      <PublicLayout hideNav={true}>
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-canvas gap-6">
          <p className="text-2xl font-playfair font-medium text-ink">Event not found.</p>
          <Link href="/explore">
            <button className="bg-surface-2 border border-border/80 text-ink px-6 py-2.5 rounded-full font-medium text-[14px] hover:border-accent-teal/50 hover:bg-surface-1 transition-all shadow-sm">
              Back to Explore
            </button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const isPast = new Date(event.endAt) < new Date();
  const isFull =
    event.capacity != null &&
    (event._count?.registrations ?? 0) >= event.capacity;

  return (
    <PublicLayout hideNav={true}>
      <div className="relative isolate overflow-hidden min-h-screen">
        {/* Subtle grid texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_40%,transparent_100%)]" />
        
        {/* Soft Gold/Blue Glow */}
        <div className="fixed top-[10%] left-[20%] w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          {/* Back */}
          <Link href="/explore" className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-muted hover:text-ink mb-10 transition-colors bg-surface-2/50 border border-border/60 px-4 py-2 rounded-full backdrop-blur-md hover:border-accent-teal/30 shadow-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left: Main content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-10"
            >
              {/* Cover Image */}
              <div className="rounded-[24px] overflow-hidden aspect-[21/9] bg-surface-2 relative border border-border/60 shadow-soft">
                {event.coverImage ? (
                  <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-[#0A1A17] opacity-80" />
                )}
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className="glass-pill px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-ink shadow-sm">
                    {event.status}
                  </span>
                  <span className="bg-accent-teal/20 backdrop-blur-md border border-accent-teal/30 text-accent-teal text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full shadow-sm">
                    {event.type === 'IN_PERSON' ? 'In Person' : event.type === 'ONLINE' ? 'Online' : 'Hybrid'}
                  </span>
                </div>
              </div>

              {/* Title + Meta */}
              <div>
                <Link href={`/clubs/${event.club.id}`} className="inline-block mb-3">
                  <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-accent-teal hover:text-accent-gold transition-colors">
                    {event.club.name}
                  </p>
                </Link>
                <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-playfair font-medium leading-[1.1] tracking-tight text-ink mb-6">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2.5 text-[15px] font-medium text-ink-muted">
                    <div className="w-8 h-8 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-ink">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    {formatDate(event.startAt)}
                  </div>
                  <div className="flex items-center gap-2.5 text-[15px] font-medium text-ink-muted">
                    <div className="w-8 h-8 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-ink">
                      <Clock className="h-4 w-4" />
                    </div>
                    {formatTime(event.startAt)} – {formatTime(event.endAt)}
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-2.5 text-[15px] font-medium text-ink-muted">
                      <div className="w-8 h-8 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-ink">
                        <MapPin className="h-4 w-4" />
                      </div>
                      {event.venue}
                    </div>
                  )}
                  {event.meetingLink && (
                    <a href={event.meetingLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-[15px] font-medium text-accent-teal hover:text-accent-gold transition-colors">
                      <div className="w-8 h-8 rounded-full bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center">
                        <Globe className="h-4 w-4" />
                      </div>
                      Join online
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <div className="flex items-center gap-2.5 text-[15px] font-medium text-ink-muted">
                    <div className="w-8 h-8 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-ink">
                      <Users className="h-4 w-4" />
                    </div>
                    {event._count?.registrations ?? 0} registered
                    {event.capacity && <span className="text-ink-muted/50">/ {event.capacity} max</span>}
                  </div>
                </div>

                {/* Tags */}
                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {event.tags.map((tag) => (
                      <span key={tag} className="text-[12px] font-semibold text-ink-muted bg-surface-2 border border-border/60 px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <section className="bg-surface-2/40 backdrop-blur-sm border border-border/60 rounded-3xl p-8 shadow-soft">
                <h2 className="text-[20px] font-playfair font-medium text-ink mb-4">
                  About This Event
                </h2>
                <p className="text-[15px] leading-relaxed text-ink-muted whitespace-pre-line">
                  {event.description}
                </p>
              </section>

              {/* Speakers */}
              {Array.isArray(event.speakers) && event.speakers.length > 0 && (
                <section>
                  <h2 className="text-[20px] font-playfair font-medium text-ink mb-6">
                    Speakers
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {event.speakers.map((sp, i) => (
                      <div key={i} className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-2xl p-5 flex items-center gap-4 hover:border-accent-teal/30 transition-colors shadow-soft">
                        {sp.photo ? (
                          <img src={sp.photo} alt={sp.name} className="h-14 w-14 rounded-full object-cover border-2 border-border/80" />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-canvas border border-border flex items-center justify-center">
                            <span className="text-[16px] font-playfair font-bold text-ink">{sp.name[0]}</span>
                          </div>
                        )}
                        <div>
                          <p className="text-[15px] font-bold text-ink">{sp.name}</p>
                          <p className="text-[13px] text-ink-muted mt-0.5">{sp.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQs */}
              {Array.isArray(event.faqs) && event.faqs.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-[20px] font-playfair font-medium text-ink mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="flex flex-col gap-4">
                    {event.faqs.map((faq, i) => (
                      <div key={i} className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-soft">
                        <p className="text-[15px] font-bold text-ink mb-2">{faq.q}</p>
                        <p className="text-[14px] text-ink-muted leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>

            {/* Right: Registration card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-28"
            >
              <div className="bg-surface-2/80 backdrop-blur-xl border border-border/80 rounded-3xl p-8 shadow-soft-lg">
                <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-ink mb-6 pb-4 border-b border-border/60">
                  Registration
                </p>

                {/* Ticket Tiers */}
                {event.ticketTiers && event.ticketTiers.length > 0 && (
                  <div className="flex flex-col gap-3 mb-8">
                    {event.ticketTiers.map((tier: TicketTier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`w-full text-left transition-all duration-300 rounded-2xl p-4 border ${
                          selectedTier === tier.id
                            ? 'border-accent-teal bg-accent-teal/5 shadow-[0_0_20px_rgba(45,212,191,0.1)]'
                            : 'border-border/60 bg-canvas/50 hover:border-accent-teal/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[15px] font-bold text-ink">{tier.name}</p>
                            {tier.description && (
                              <p className="text-[13px] text-ink-muted mt-1">{tier.description}</p>
                            )}
                            {tier.available != null && (
                              <p className="text-[12px] font-medium text-accent-teal mt-2">
                                {tier.available} spots remaining
                              </p>
                            )}
                          </div>
                          <span className="text-[18px] font-playfair font-semibold text-ink ml-4">
                            {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Error */}
                {regError && (
                  <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400 font-medium">
                    {regError}
                  </div>
                )}

                {/* Success */}
                {registered ? (
                  <div className="flex flex-col items-center gap-4 py-6 bg-accent-teal/5 rounded-2xl border border-accent-teal/20">
                    <div className="w-12 h-12 rounded-full bg-accent-teal/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-accent-teal" />
                    </div>
                    <p className="text-[15px] font-bold text-ink">You're registered!</p>
                    <Link href="/my-events" className="w-full px-6 mt-2">
                      <button className="w-full bg-surface-1 border border-border/80 text-ink px-4 py-3 rounded-xl font-semibold text-[14px] hover:border-accent-teal/50 hover:bg-surface-2 transition-all shadow-sm">
                        View My Ticket
                      </button>
                    </Link>
                  </div>
                ) : isPast ? (
                  <button className="w-full bg-surface-2 border border-border/60 text-ink-muted/50 px-4 py-3.5 rounded-xl font-bold text-[14px] cursor-not-allowed" disabled>
                    Event Ended
                  </button>
                ) : isFull ? (
                  <button className="w-full bg-surface-2 border border-border/60 text-ink-muted/50 px-4 py-3.5 rounded-xl font-bold text-[14px] cursor-not-allowed" disabled>
                    Fully Booked
                  </button>
                ) : (
                  <button
                    className="w-full bg-ink text-canvas hover:bg-ink/90 px-4 py-3.5 rounded-xl font-bold text-[14px] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleRegister}
                    disabled={registering}
                  >
                    {registering ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Ticket className="h-4 w-4" />
                        {user ? 'Register Now' : 'Sign in to Register'}
                      </>
                    )}
                  </button>
                )}

                {/* Club info */}
                <div className="mt-8 pt-6 border-t border-border/60">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted mb-4">
                    Organized by
                  </p>
                  <Link href={`/clubs/${event.club.id}`}>
                    <div className="flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-surface-1 transition-colors">
                      {event.club.logo ? (
                        <img src={event.club.logo} alt={event.club.name} className="h-10 w-10 rounded-full border border-border/80 object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/80 flex items-center justify-center">
                          <span className="text-[14px] font-bold text-ink">{event.club.name[0]}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[14px] font-bold text-ink block">
                          {event.club.name}
                        </span>
                        <span className="text-[12px] text-ink-muted">View Profile</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

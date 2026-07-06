'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
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
      <PublicLayout>
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (notFound || !event) {
    return (
      <PublicLayout>
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-2xl font-black uppercase text-ink">Event not found.</p>
          <Link href="/explore">
            <Button variant="secondary">Back to Explore</Button>
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
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-6 pb-12 w-full">
        {/* Back */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left: Main content */}
          <div className="flex flex-col gap-8">
            {/* Cover */}
            <div className="border-[2px] border-border overflow-hidden aspect-video bg-surface-1 relative">
              {event.coverImage ? (
                <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-2">
                  <span className="text-[80px] font-black text-ink/10 select-none">
                    {event.title[0]}
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] bg-canvas border border-border px-3 py-1.5">
                  {event.status}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] bg-primary border border-border px-3 py-1.5 text-ink">
                  {event.type === 'IN_PERSON' ? 'In Person' : event.type === 'ONLINE' ? 'Online' : 'Hybrid'}
                </span>
              </div>
            </div>

            {/* Title + Meta */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary mb-2">
                {event.club.name}
              </p>
              <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[1] tracking-[-0.04em] text-ink mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-2 text-sm text-ink-muted">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {formatDate(event.startAt)}
                </span>
                <span className="flex items-center gap-2 text-sm text-ink-muted">
                  <Clock className="h-4 w-4 text-primary" />
                  {formatTime(event.startAt)} – {formatTime(event.endAt)}
                </span>
                {event.venue && (
                  <span className="flex items-center gap-2 text-sm text-ink-muted">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.venue}
                  </span>
                )}
                {event.meetingLink && (
                  <a href={event.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Globe className="h-4 w-4" />
                    Join online
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <span className="flex items-center gap-2 text-sm text-ink-muted">
                  <Users className="h-4 w-4 text-primary" />
                  {event._count?.registrations ?? 0} registered
                  {event.capacity && ` / ${event.capacity} capacity`}
                </span>
              </div>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-black uppercase tracking-[0.15em] border border-border px-2 py-1 text-ink-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <section>
              <h2 className="text-base font-black uppercase tracking-[-0.02em] text-ink mb-3 border-b border-border pb-2">
                About This Event
              </h2>
              <p className="text-sm leading-7 text-ink-muted whitespace-pre-line">
                {event.description}
              </p>
            </section>

            {/* Speakers */}
            {Array.isArray(event.speakers) && event.speakers.length > 0 && (
              <section>
                <h2 className="text-base font-black uppercase tracking-[-0.02em] text-ink mb-4 border-b border-border pb-2">
                  Speakers
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.speakers.map((sp, i) => (
                    <div key={i} className="border-[2px] border-border bg-surface-1 p-4 flex items-center gap-4">
                      {sp.photo ? (
                        <img src={sp.photo} alt={sp.name} className="h-12 w-12 rounded-full object-cover border border-border" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-surface-2 border border-border flex items-center justify-center">
                          <span className="text-sm font-black text-ink">{sp.name[0]}</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-black uppercase text-ink">{sp.name}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{sp.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {Array.isArray(event.faqs) && event.faqs.length > 0 && (
              <section>
                <h2 className="text-base font-black uppercase tracking-[-0.02em] text-ink mb-4 border-b border-border pb-2">
                  FAQs
                </h2>
                <div className="flex flex-col gap-3">
                  {event.faqs.map((faq, i) => (
                    <div key={i} className="border-[2px] border-border bg-surface-1 p-4">
                      <p className="text-sm font-black uppercase text-ink mb-1">{faq.q}</p>
                      <p className="text-sm text-ink-muted leading-6">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Registration card */}
          <div className="lg:sticky lg:top-24">
            <div className="border-[2px] border-border bg-surface-1 p-6 shadow-[6px_6px_0_0_var(--color-border)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary mb-4">
                Register
              </p>

              {/* Ticket Tiers */}
              {event.ticketTiers && event.ticketTiers.length > 0 && (
                <div className="flex flex-col gap-2 mb-5">
                  {event.ticketTiers.map((tier: TicketTier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`w-full border-[2px] p-3 text-left transition-colors ${
                        selectedTier === tier.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-canvas hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black uppercase text-ink">{tier.name}</p>
                          {tier.description && (
                            <p className="text-xs text-ink-muted mt-0.5">{tier.description}</p>
                          )}
                          {tier.available != null && (
                            <p className="text-xs text-ink-muted mt-1">
                              {tier.available} spots left
                            </p>
                          )}
                        </div>
                        <span className="text-base font-black text-ink ml-4">
                          {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Error */}
              {regError && (
                <div className="mb-4 border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400 font-semibold">
                  {regError}
                </div>
              )}

              {/* Success */}
              {registered ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <p className="text-sm font-black uppercase text-ink">You&apos;re registered!</p>
                  <Link href="/my-events">
                    <Button variant="secondary" size="default">
                      View My Ticket
                    </Button>
                  </Link>
                </div>
              ) : isPast ? (
                <Button variant="secondary" className="w-full" disabled>
                  Event Ended
                </Button>
              ) : isFull ? (
                <Button variant="secondary" className="w-full" disabled>
                  Fully Booked
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  size="lg"
                  onClick={handleRegister}
                  disabled={registering}
                >
                  {registering ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      {user ? 'Register Now' : 'Sign in to Register'}
                    </span>
                  )}
                </Button>
              )}

              {/* Club info */}
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-muted mb-2">
                  Organised by
                </p>
                <Link href={`/clubs/${event.club.id}`}>
                  <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    {event.club.logo ? (
                      <img src={event.club.logo} alt={event.club.name} className="h-9 w-9 border border-border object-cover" />
                    ) : (
                      <div className="h-9 w-9 bg-surface-2 border border-border flex items-center justify-center">
                        <span className="text-xs font-black text-ink">{event.club.name[0]}</span>
                      </div>
                    )}
                    <span className="text-sm font-black uppercase tracking-[-0.01em] text-ink">
                      {event.club.name}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

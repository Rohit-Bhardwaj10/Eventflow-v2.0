'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { clubs, events, type Club, type Event, ApiError } from '@/lib/api';
import {
  ArrowLeft,
  Users,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Loader2,
  CalendarDays,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ClubDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [club, setClub] = useState<Club & { members?: { role: string; userId: string }[] } | null>(null);
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    clubs.get(slug)
      .then((c) => {
        setClub(c);
        // Fetch events for this club via the events list (filter client-side by club)
        return events.list(1, 100);
      })
      .then((res) => {
        setClubEvents(res.events.filter((e) => e.club.id === club?.id || e.club.name === club?.name));
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Re-filter events once club is loaded
  useEffect(() => {
    if (club) {
      events.list(1, 100).then((res) => {
        setClubEvents(res.events.filter((e) => e.club.id === club.id));
      }).catch(() => {});
    }
  }, [club]);

  async function handleJoin() {
    if (!user) { window.location.href = '/login'; return; }
    setJoining(true);
    setJoinError(null);
    try {
      await clubs.join(slug);
      setJoined(true);
    } catch (err) {
      if (err instanceof ApiError) setJoinError(err.message);
      else setJoinError('Could not join club. Try again.');
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    if (!user) return;
    setJoining(true);
    try {
      await clubs.leave(slug);
      setJoined(false);
    } catch {}
    finally { setJoining(false); }
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

  if (notFound || !club) {
    return (
      <PublicLayout>
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl font-black uppercase text-ink">Club not found.</p>
          <Link href="/clubs"><Button variant="secondary">Browse Clubs</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-6 py-12 w-full">
        <Link href="/clubs" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Clubs
        </Link>

        {/* Club banner */}
        <div className="border-[2px] border-border overflow-hidden h-52 bg-surface-2 relative mb-8">
          {club.banner ? (
            <img src={club.banner} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-1 to-surface-2 flex items-center justify-center">
              <span className="text-[120px] font-black text-ink/5 select-none">{club.name[0]}</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Left */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start gap-5">
              {club.logo && (
                <div className="h-16 w-16 border-[2px] border-border bg-canvas overflow-hidden shrink-0">
                  <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-ink">
                    {club.name}
                  </h1>
                  {club.isVerified && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                {club.tagline && (
                  <p className="text-sm text-ink-muted">{club.tagline}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] border border-border px-2 py-1 text-primary">
                    {club.category}
                  </span>
                  <span className="text-[10px] text-ink-muted flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {club._count?.members ?? 0} members
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {club.bio && (
              <section>
                <h2 className="text-sm font-black uppercase tracking-[-0.02em] text-ink mb-3 border-b border-border pb-2">
                  About
                </h2>
                <p className="text-sm leading-7 text-ink-muted whitespace-pre-line">{club.bio}</p>
              </section>
            )}

            {/* Events */}
            <section>
              <h2 className="text-sm font-black uppercase tracking-[-0.02em] text-ink mb-4 border-b border-border pb-2">
                Events by {club.name}
              </h2>
              {clubEvents.length === 0 ? (
                <p className="text-sm text-ink-muted py-4">No published events from this club yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {clubEvents.map((ev) => (
                    <Link key={ev.id} href={`/events/${ev.slug}`}>
                      <div className="border-[2px] border-border bg-surface-1 p-4 hover:bg-surface-2 transition-colors flex items-center gap-4 shadow-brutal-sm">
                        <div className="flex flex-col items-center w-12 shrink-0 border-r border-border pr-3">
                          <span className="text-[8px] font-black uppercase text-primary">
                            {new Date(ev.startAt).toLocaleString('en', { month: 'short' })}
                          </span>
                          <span className="text-xl font-black text-ink">
                            {new Date(ev.startAt).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black uppercase text-ink truncate">{ev.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            {ev.venue && (
                              <span className="text-[10px] text-ink-muted flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {ev.venue}
                              </span>
                            )}
                            <span className="text-[10px] text-ink-muted">
                              {ev._count?.registrations ?? 0} registered
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-ink border border-border px-2 py-1 shrink-0">
                          {ev.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            {/* Join/leave */}
            <div className="border-[2px] border-border bg-surface-1 p-5 shadow-[6px_6px_0_0_var(--color-border)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary mb-4">Membership</p>

              {joinError && (
                <div className="mb-3 border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400 font-semibold">
                  {joinError}
                </div>
              )}

              {joined ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-green-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    You joined this club!
                  </div>
                  <Button variant="secondary" className="w-full" onClick={handleLeave} disabled={joining}>
                    Leave Club
                  </Button>
                </div>
              ) : (
                <Button variant="primary" className="w-full" size="lg" onClick={handleJoin} disabled={joining}>
                  {joining ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Joining…
                    </span>
                  ) : user ? 'Join Club' : 'Sign in to Join'}
                </Button>
              )}
            </div>

            {/* Social links */}
            {(club.website || club.instagram || club.twitter || club.linkedin) && (
              <div className="border-[2px] border-border bg-surface-1 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-muted mb-3">Links</p>
                <div className="flex flex-col gap-2">
                  {club.website && (
                    <a href={club.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                  {club.instagram && (
                    <a href={`https://instagram.com/${club.instagram}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
                      <Instagram className="h-4 w-4" /> @{club.instagram}
                    </a>
                  )}
                  {club.twitter && (
                    <a href={`https://twitter.com/${club.twitter}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
                      <Twitter className="h-4 w-4" /> @{club.twitter}
                    </a>
                  )}
                  {club.linkedin && (
                    <a href={club.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

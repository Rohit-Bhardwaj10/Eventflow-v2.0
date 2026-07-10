'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { useAuth } from '@/lib/auth-context';
import { clubs, events, type Club, type Event, ApiError } from '@/lib/api';
import {
  ArrowLeft,
  Users,
  Globe,
  Loader2,
  CalendarDays,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
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

  if (notFound || !club) {
    return (
      <PublicLayout hideNav={true}>
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-canvas gap-6">
          <p className="text-2xl font-playfair font-medium text-ink">Club not found.</p>
          <Link href="/explore">
            <button className="bg-surface-2 border border-border/80 text-ink px-6 py-2.5 rounded-full font-medium text-[14px] hover:border-accent-teal/50 hover:bg-surface-1 transition-all shadow-sm">
              Back to Explore
            </button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout hideNav={true}>
      <div className="relative isolate overflow-hidden min-h-screen">
        {/* Subtle grid texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_40%,transparent_100%)]" />
        
        {/* Soft Gold/Blue Glow */}
        <div className="fixed top-[5%] right-[10%] w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 sm:pt-28 pb-10 w-full">
          <Link href="/explore" className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-muted hover:text-ink mb-10 transition-colors bg-surface-2/50 border border-border/60 px-4 py-2 rounded-full backdrop-blur-md hover:border-accent-teal/30 shadow-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>

          {/* Club banner */}
          <div className="rounded-[24px] border border-border/60 overflow-hidden h-64 bg-surface-2 relative mb-12 shadow-soft">
            {club.banner ? (
              <img src={club.banner} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/80 to-[#0A1A17] flex items-center justify-center opacity-80">
                <span className="text-[120px] font-black text-canvas/5 select-none">{club.name[0]}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent"></div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
            {/* Left */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-10"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 -mt-24 relative z-10">
                {club.logo ? (
                  <div className="h-32 w-32 rounded-[24px] border-4 border-canvas bg-surface-1 overflow-hidden shrink-0 shadow-soft-lg">
                    <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-[24px] border-4 border-canvas bg-surface-2 flex items-center justify-center shrink-0 shadow-soft-lg">
                    <span className="text-4xl font-playfair font-bold text-ink">{club.name[0]}</span>
                  </div>
                )}
                <div className="sm:mt-16 sm:ml-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-[32px] font-playfair font-bold tracking-tight text-ink">
                      {club.name}
                    </h1>
                    {club.isVerified && <CheckCircle2 className="h-6 w-6 text-accent-teal" />}
                  </div>
                  {club.tagline && (
                    <p className="text-[16px] text-ink-muted/90 font-medium mb-4">{club.tagline}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="glass-pill px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-accent-teal shadow-sm">
                      {club.category}
                    </span>
                    <span className="text-[14px] text-ink-muted flex items-center gap-1.5 font-medium">
                      <Users className="h-4 w-4" />
                      {club._count?.members ?? 0} members
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {club.bio && (
                <section className="bg-surface-2/40 backdrop-blur-sm border border-border/60 rounded-3xl p-8 shadow-soft">
                  <h2 className="text-[20px] font-playfair font-medium text-ink mb-4">
                    About {club.name}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-ink-muted whitespace-pre-line">{club.bio}</p>
                </section>
              )}

              {/* Events */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[20px] font-playfair font-medium text-ink">
                    Upcoming Events
                  </h2>
                </div>
                {clubEvents.length === 0 ? (
                  <div className="border border-border/60 bg-surface-2/30 backdrop-blur-sm rounded-3xl p-12 text-center shadow-soft">
                    <CalendarDays className="h-10 w-10 text-ink-muted mx-auto mb-4 opacity-50" />
                    <p className="text-[15px] text-ink-muted font-medium">No published events from this club yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {clubEvents.map((ev) => (
                      <Link key={ev.id} href={`/events/${ev.slug}`}>
                        <div className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-2xl p-5 hover:border-accent-teal/40 transition-all shadow-sm hover:shadow-soft group flex items-center gap-6">
                          
                          {/* Date Block */}
                          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-canvas border border-border/80 shrink-0 group-hover:border-accent-teal/30 transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">
                              {new Date(ev.startAt).toLocaleString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-[22px] font-playfair font-bold text-ink leading-none mt-1">
                              {new Date(ev.startAt).getDate()}
                            </span>
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[16px] font-bold text-ink truncate group-hover:text-primary transition-colors">{ev.title}</h3>
                            <div className="flex items-center gap-4 mt-2">
                              {ev.venue && (
                                <span className="text-[13px] text-ink-muted flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span className="truncate max-w-[150px]">{ev.venue}</span>
                                </span>
                              )}
                              <span className="text-[13px] text-ink-muted flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5" />
                                {ev._count?.registrations ?? 0} registered
                              </span>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="hidden sm:block">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted bg-surface-1 border border-border/80 px-3 py-1.5 rounded-full">
                              {ev.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>

            {/* Right sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-6 lg:sticky lg:top-28"
            >
              {/* Join/leave */}
              <div className="bg-surface-2/80 backdrop-blur-xl border border-border/80 rounded-3xl p-8 shadow-soft-lg">
                <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-ink mb-6 pb-4 border-b border-border/60">
                  Membership
                </p>

                {joinError && (
                  <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400 font-medium">
                    {joinError}
                  </div>
                )}

                {joined ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 text-[14px] text-accent-teal font-medium bg-accent-teal/5 px-4 py-3 rounded-xl border border-accent-teal/20">
                      <CheckCircle2 className="h-5 w-5" />
                      You are a member!
                    </div>
                    <button 
                      className="w-full bg-surface-1 border border-border/80 text-ink px-4 py-3 rounded-xl font-semibold text-[14px] hover:border-red-500/50 hover:text-red-400 transition-all shadow-sm disabled:opacity-50" 
                      onClick={handleLeave} 
                      disabled={joining}
                    >
                      Leave Club
                    </button>
                  </div>
                ) : (
                  <button 
                    className="w-full bg-ink text-canvas hover:bg-ink/90 px-4 py-3.5 rounded-xl font-bold text-[14px] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                    onClick={handleJoin} 
                    disabled={joining}
                  >
                    {joining ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : user ? 'Join Club' : 'Sign in to Join'}
                  </button>
                )}
              </div>

              {/* Social links */}
              {(club.website || club.instagram || club.twitter) && (
                <div className="bg-surface-2/80 backdrop-blur-xl border border-border/80 rounded-3xl p-8 shadow-soft">
                  <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-ink mb-6 pb-4 border-b border-border/60">
                    Connect
                  </p>
                  <div className="flex flex-col gap-4">
                    {club.website && (
                      <a href={club.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[14px] font-medium text-ink-muted hover:text-accent-teal transition-colors">
                        <div className="w-8 h-8 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center">
                          <Globe className="h-4 w-4" />
                        </div>
                        Website
                      </a>
                    )}
                    {club.instagram && (
                      <a href={`https://instagram.com/${club.instagram}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[14px] font-medium text-ink-muted hover:text-accent-pink transition-colors">
                        <div className="w-8 h-8 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center">
                          @
                        </div>
                        @{club.instagram}
                      </a>
                    )}
                    {club.twitter && (
                      <a href={`https://twitter.com/${club.twitter}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[14px] font-medium text-ink-muted hover:text-accent-cyan transition-colors">
                        <div className="w-8 h-8 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center">
                          @
                        </div>
                        @{club.twitter}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

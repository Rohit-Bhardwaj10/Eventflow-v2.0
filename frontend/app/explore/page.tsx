'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { events, search, type Event } from '@/lib/api';
import { CalendarDays, MapPin, Users, Search, Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function ExplorePage() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const loadEvents = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await events.list(p, limit);
      setEventList(res.events);
      setTotalPages(res.meta.totalPages);
    } catch {
      setEventList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!query) loadEvents(page);
  }, [page, query, loadEvents]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      if (query === '') loadEvents(1);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await search.global(query);
        setEventList((res.events as Event[]) ?? []);
        setTotalPages(1);
      } catch {
        setEventList([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, loadEvents]);

  return (
    <PublicLayout hideNav={true}>
      <div className="relative isolate overflow-hidden min-h-screen">
        {/* Subtle grid texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_40%,transparent_100%)]" />
        
        {/* Soft Gold/Blue Glow */}
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[40%] left-[5%] w-[300px] h-[300px] bg-accent-teal/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 w-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-5 mb-16">
            <span className="glass-pill px-3 py-1 font-sans text-[11.5px] font-bold uppercase tracking-[0.15em] text-accent-teal shadow-sm">
              Discover
            </span>
            <h1 className="text-display-md text-ink font-playfair tracking-tight">Explore Campus Events</h1>
            <p className="text-[17px] leading-[28px] text-ink-muted max-w-2xl font-medium">
              Find exactly what you're looking for. From tech talks and hackathons to cultural nights and sports tryouts.
            </p>

            {/* Search Bar - Floating Glass Design */}
            <div className="mt-6 w-full max-w-2xl relative group">
              <div className="absolute inset-0 bg-accent-teal/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center bg-surface-2 border border-border/80 rounded-full px-6 py-4 shadow-soft-lg backdrop-blur-md transition-all group-focus-within:border-accent-teal/50">
                <Search className="h-5 w-5 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search events, clubs, or categories..."
                  className="bg-transparent border-none outline-none w-full ml-4 text-ink placeholder:text-ink-muted/60 text-[16px] font-medium"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
                {query && (
                  <button 
                    onClick={() => { setQuery(''); setPage(1); }}
                    className="ml-2 text-ink-muted hover:text-ink transition-colors bg-border/40 hover:bg-border p-1.5 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                )}
                <div className="h-6 w-px bg-border/80 mx-4"></div>
                <button className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors font-semibold text-[13px] tracking-wide">
                  <Filter className="h-4 w-4" /> Filters
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {(loading || searching) ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-border"></div>
                <div className="absolute inset-0 rounded-full border-2 border-accent-teal border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm font-medium text-ink-muted mt-2 tracking-wide uppercase">
                {searching ? 'Searching...' : 'Loading events...'}
              </p>
            </div>
          ) : eventList.length === 0 ? (
            <div className="border border-border/60 bg-surface-2/30 backdrop-blur-sm rounded-3xl p-16 flex flex-col items-center text-center shadow-soft">
              <div className="w-16 h-16 rounded-full bg-border/40 flex items-center justify-center mb-6">
                <CalendarDays className="h-7 w-7 text-ink-muted" />
              </div>
              <h3 className="text-xl font-playfair font-medium text-ink mb-2">No events found</h3>
              <p className="text-[15px] text-ink-muted max-w-md">
                {query ? `We couldn't find anything matching "${query}". Try adjusting your search terms.` : 'No published events right now. Check back later!'}
              </p>
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="mt-8 bg-surface-1 border border-border/80 text-ink px-6 py-2.5 rounded-full font-medium text-[14px] hover:border-accent-teal/50 hover:bg-surface-2 transition-all shadow-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {eventList.map((ev, i) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link href={`/events/${ev.slug}`} className="block h-full group">
                      <div className="flex flex-col h-full bg-surface-2 border border-border/80 rounded-[20px] overflow-hidden shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg hover:border-accent-teal/30">
                        {/* Cover Image Area */}
                        <div className="relative h-48 bg-primary overflow-hidden flex items-center justify-center border-b border-border/40">
                          {ev.coverImage ? (
                            <img
                              src={ev.coverImage}
                              alt={ev.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#0A1A17] opacity-80" />
                          )}
                          
                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-canvas/80 backdrop-blur-md border border-white/10 text-ink text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                              {ev.type === 'IN_PERSON' ? 'In Person' : ev.type === 'ONLINE' ? 'Online' : 'Hybrid'}
                            </span>
                            {/* Assuming there's a price field, mock it for now if paid */}
                            <span className="bg-accent-teal/20 backdrop-blur-md border border-accent-teal/30 text-accent-teal text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                              Free
                            </span>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-semibold text-accent-teal uppercase tracking-wide">
                              {formatDate(ev.startAt)}
                            </span>
                            <span className="text-[12px] font-medium text-ink-muted/80 line-clamp-1 max-w-[50%] text-right">
                              {ev.club.name}
                            </span>
                          </div>

                          <h3 className="text-[18px] font-bold text-ink leading-tight mb-2 group-hover:text-primary transition-colors">
                            {ev.title}
                          </h3>

                          <p className="text-[14px] leading-relaxed text-ink-muted line-clamp-2 mb-6 flex-1">
                            {ev.description}
                          </p>

                          {/* Footer Info */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/60">
                            {ev.venue && (
                              <div className="flex items-center gap-1.5 text-ink-muted">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="text-[12px] font-medium line-clamp-1">{ev.venue}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-ink-muted ml-auto">
                              <Users className="h-3.5 w-3.5" />
                              <span className="text-[12px] font-medium">{ev._count?.registrations ?? 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {!query && totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-4 mt-16">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 bg-surface-2 border border-border/80 px-4 py-2 rounded-full text-[14px] font-semibold text-ink transition-all hover:bg-surface-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <div className="bg-canvas border border-border/60 px-4 py-1.5 rounded-full shadow-inner">
                <span className="text-[13px] font-bold text-ink tracking-widest">
                  {page} <span className="text-ink-muted/50 font-normal">/</span> {totalPages}
                </span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 bg-surface-2 border border-border/80 px-4 py-2 rounded-full text-[14px] font-semibold text-ink transition-all hover:bg-surface-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { events, search, type Event } from '@/lib/api';
import { CalendarDays, MapPin, Users, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const accentCycle = [
  'accent-yellow',
  'accent-cyan',
  'accent-pink',
  'accent-lime',
] as const;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
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
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-5 mb-12">
          <Badge variant="cyan" className="w-fit -rotate-1">
            Discover
          </Badge>
          <h1 className="text-display-md text-ink">Explore Events</h1>
          <p className="text-sm text-ink-muted max-w-xl">
            Browse upcoming events from clubs across campus. Find something that excites you.
          </p>

          {/* Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <Input
                type="text"
                placeholder="Search events, clubs, categories..."
                className="pl-9"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            {query && (
              <Button variant="secondary" size="lg" onClick={() => { setQuery(''); setPage(1); }}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Loading */}
        {(loading || searching) ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-ink-muted">
              {searching ? 'Searching...' : 'Loading events...'}
            </p>
          </div>
        ) : eventList.length === 0 ? (
          <div className="border-[2px] border-border border-dashed p-16 text-center">
            <CalendarDays className="h-10 w-10 text-ink-muted mx-auto mb-4" />
            <p className="text-sm font-semibold text-ink-muted">
              {query ? `No events found for "${query}"` : 'No published events right now.'}
            </p>
            {query && (
              <Button variant="secondary" className="mt-4" onClick={() => setQuery('')}>
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {eventList.map((ev, i) => (
                <Link key={ev.id} href={`/events/${ev.slug}`}>
                  <Card
                    variant={accentCycle[i % accentCycle.length]}
                    className="flex flex-col cursor-pointer brutal-hover-lift p-0 overflow-hidden h-full"
                  >
                    {/* Cover image or placeholder */}
                    <div className="h-36 border-b-[2px] border-border bg-surface-1 flex items-center justify-center relative overflow-hidden">
                      {ev.coverImage ? (
                        <img
                          src={ev.coverImage}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[64px] font-black text-ink/10 select-none">
                          {ev.title[0]}
                        </span>
                      )}
                      {/* Type badge */}
                      <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[0.15em] bg-canvas border border-border px-2 py-1">
                        {ev.type === 'IN_PERSON' ? 'In Person' : ev.type === 'ONLINE' ? 'Online' : 'Hybrid'}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-canvas border border-border px-2 py-1">
                          {formatDate(ev.startAt)} · {formatTime(ev.startAt)}
                        </span>
                        <span className="text-[10px] text-ink-muted">{ev.club.name}</span>
                      </div>

                      <h3 className="text-sm font-black uppercase tracking-[-0.01em] text-ink mb-2 line-clamp-2">
                        {ev.title}
                      </h3>

                      <p className="text-xs text-ink-muted line-clamp-2 flex-1">
                        {ev.description}
                      </p>

                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50 flex-wrap">
                        {ev.venue && (
                          <span className="text-[10px] text-ink-muted flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {ev.venue}
                          </span>
                        )}
                        <span className="text-[10px] text-ink-muted flex items-center gap-1 ml-auto">
                          <Users className="h-3 w-3" />
                          {ev._count?.registrations ?? 0}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {!query && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <span className="text-caption text-ink-muted">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { clubs, type Club } from '@/lib/api';
import { Search, Users, Loader2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const categoryColors: Record<string, string> = {
  TECH: 'text-primary border-primary/40',
  CULTURAL: 'text-yellow-400 border-yellow-400/40',
  SPORTS: 'text-green-400 border-green-400/40',
  SOCIAL: 'text-pink-400 border-pink-400/40',
  ACADEMIC: 'text-cyan-400 border-cyan-400/40',
  ARTS: 'text-orange-400 border-orange-400/40',
  OTHER: 'text-ink-muted border-border',
};

export default function ClubsPage() {
  const [clubList, setClubList] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    clubs.list(page, limit)
      .then((res) => {
        setClubList(res.clubs ?? []);
        setTotalPages(res.meta.totalPages);
      })
      .catch(() => setClubList([]))
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = query
    ? clubList.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          (c.tagline ?? '').toLowerCase().includes(query.toLowerCase()),
      )
    : clubList;

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-5 mb-12">
          <Badge variant="yellow" className="w-fit rotate-1">
            Campus Clubs
          </Badge>
          <h1 className="text-display-md text-ink">Explore Clubs</h1>
          <p className="text-sm text-ink-muted max-w-xl">
            Discover student organisations across tech, culture, arts, sports, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <Input
                type="text"
                placeholder="Search clubs..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {query && (
              <Button variant="secondary" onClick={() => setQuery('')}>Clear</Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-ink-muted">Loading clubs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-[2px] border-border border-dashed p-16 text-center">
            <Users className="h-10 w-10 text-ink-muted mx-auto mb-4" />
            <p className="text-sm font-semibold text-ink-muted">
              {query ? `No clubs matching "${query}"` : 'No clubs available yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((club) => {
                const catColor = categoryColors[club.category] ?? categoryColors.OTHER;
                return (
                  <Link key={club.id} href={`/clubs/${club.slug}`}>
                    <div className="border-[2px] border-border bg-surface-1 shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all cursor-pointer h-full flex flex-col">
                      {/* Banner / logo area */}
                      <div className="h-28 bg-surface-2 border-b-[2px] border-border relative overflow-hidden flex items-center justify-center">
                        {club.banner ? (
                          <img src={club.banner} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-surface-1 to-surface-2 flex items-center justify-center">
                            <span className="text-5xl font-black text-ink/10">{club.name[0]}</span>
                          </div>
                        )}
                        {club.logo && (
                          <div className="absolute bottom-3 left-4 h-10 w-10 border-[2px] border-border bg-canvas overflow-hidden">
                            <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        {club.isVerified && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-sm font-black uppercase tracking-[-0.01em] text-ink line-clamp-1">
                            {club.name}
                          </h3>
                          <span className={`text-[9px] font-black uppercase tracking-[0.12em] border px-2 py-0.5 shrink-0 ${catColor}`}>
                            {club.category}
                          </span>
                        </div>

                        {club.tagline && (
                          <p className="text-xs text-ink-muted line-clamp-2 flex-1 mb-3">
                            {club.tagline}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[10px] text-ink-muted mt-auto">
                          <Users className="h-3 w-3" />
                          {club._count?.members ?? 0} members
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {!query && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <span className="text-caption text-ink-muted">{page} / {totalPages}</span>
                <Button variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
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

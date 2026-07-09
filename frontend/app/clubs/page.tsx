'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Input } from '@/components/ui/input';
import { clubs, type Club } from '@/lib/api';
import { Search, Users, Loader2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryColors: Record<string, string> = {
  TECH: 'text-accent-teal border-accent-teal/30 bg-accent-teal/5',
  CULTURAL: 'text-accent-gold border-accent-gold/30 bg-accent-gold/5',
  SPORTS: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5',
  SOCIAL: 'text-accent-pink border-accent-pink/30 bg-accent-pink/5',
  ACADEMIC: 'text-primary border-primary/30 bg-primary/5',
  ARTS: 'text-accent-orange border-accent-orange/30 bg-accent-orange/5',
  OTHER: 'text-ink-muted border-border/80 bg-surface-1',
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
    <PublicLayout hideNav={true}>
      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 mb-16 text-center sm:text-left items-center sm:items-start"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-gold/30 bg-accent-gold/5 text-accent-gold text-[12px] font-bold tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold"></span>
            </span>
            Campus Clubs
          </div>
          <h1 className="text-[48px] sm:text-[64px] font-playfair font-bold text-ink leading-tight tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-orange italic">Communities</span>
          </h1>
          <p className="text-[18px] text-ink-muted max-w-2xl leading-relaxed">
            Discover student organisations across tech, culture, arts, sports, and more. Find your tribe and get involved.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xl mt-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted group-focus-within:text-accent-gold transition-colors" />
              <input
                type="text"
                placeholder="Search clubs by name or tagline..."
                className="w-full bg-surface-2/60 backdrop-blur-md border border-border/80 rounded-2xl py-4 pl-12 pr-4 text-[15px] font-medium text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 transition-all shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {query && (
              <button 
                className="px-6 py-4 rounded-2xl font-bold text-[14px] bg-surface-2 border border-border/80 text-ink hover:bg-surface-1 transition-all shadow-sm"
                onClick={() => setQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent-gold/60" />
            <p className="text-[15px] font-medium text-ink-muted">Loading communities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-2/30 backdrop-blur-sm border border-border/60 rounded-[24px] p-20 text-center shadow-soft"
          >
            <Users className="h-12 w-12 text-ink-muted/40 mx-auto mb-5" />
            <p className="text-[16px] font-medium text-ink-muted">
              {query ? `No clubs matching "${query}"` : 'No clubs available yet.'}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((club, idx) => {
                  const catColor = categoryColors[club.category] ?? categoryColors.OTHER;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      key={club.id}
                    >
                      <Link href={`/clubs/${club.slug}`}>
                        <div className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-[24px] shadow-sm hover:shadow-soft hover:border-accent-gold/30 transition-all cursor-pointer h-full flex flex-col group relative overflow-hidden">
                          {/* Glass sheen effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

                          {/* Banner / logo area */}
                          <div className="h-32 bg-surface-2 border-b border-border/40 relative overflow-hidden flex items-center justify-center">
                            {club.banner ? (
                              <img src={club.banner} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/80 to-[#0A1A17] flex items-center justify-center opacity-80">
                                <span className="text-[64px] font-playfair font-bold text-canvas/5 select-none">{club.name[0]}</span>
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-transparent to-transparent"></div>

                            {club.logo ? (
                              <div className="absolute -bottom-2 left-6 h-16 w-16 rounded-[16px] border-[3px] border-canvas bg-surface-1 overflow-hidden shadow-sm">
                                <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="absolute -bottom-2 left-6 h-16 w-16 rounded-[16px] border-[3px] border-canvas bg-surface-2 flex items-center justify-center shadow-sm">
                                <span className="text-xl font-playfair font-bold text-ink">{club.name[0]}</span>
                              </div>
                            )}

                            {club.isVerified && (
                              <div className="absolute top-4 right-4 bg-canvas/40 backdrop-blur-md rounded-full p-1 shadow-sm">
                                <CheckCircle2 className="h-5 w-5 text-accent-gold" />
                              </div>
                            )}
                          </div>

                          <div className="p-6 pt-8 flex flex-col flex-1 relative z-10">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <h3 className="text-[20px] font-playfair font-bold text-ink line-clamp-1 group-hover:text-accent-gold transition-colors">
                                {club.name}
                              </h3>
                              <span className={`text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-1 shrink-0 ${catColor}`}>
                                {club.category}
                              </span>
                            </div>

                            {club.tagline && (
                              <p className="text-[14px] font-medium text-ink-muted line-clamp-2 flex-1 mb-5 leading-relaxed">
                                {club.tagline}
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted mt-auto">
                              <Users className="h-4 w-4" />
                              {club._count?.members ?? 0} members
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {!query && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                <button 
                  className="bg-surface-2 border border-border/80 text-ink px-5 py-2.5 rounded-full font-semibold text-[14px] hover:border-accent-gold/50 hover:bg-surface-1 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage((p) => Math.max(1, p - 1))} 
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <span className="text-[14px] font-bold text-ink-muted px-4">{page} / {totalPages}</span>
                <button 
                  className="bg-surface-2 border border-border/80 text-ink px-5 py-2.5 rounded-full font-semibold text-[14px] hover:border-accent-gold/50 hover:bg-surface-1 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}

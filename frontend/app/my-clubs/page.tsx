'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
import { users, clubs as clubsApi, type Club, ApiError } from '@/lib/api';
import {
  Users,
  Loader2,
  CheckCircle2,
  LogOut,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClubMembership {
  clubId: string;
  role: string;
  joinedAt: string;
  club: Club;
}

const roleConfig: Record<string, { label: string; cls: string }> = {
  FOLLOWER: { label: 'Follower', cls: 'text-ink-muted border-border/80' },
  MEMBER: { label: 'Member', cls: 'text-accent-teal border-accent-teal/30 bg-accent-teal/5' },
  ADMIN: { label: 'Admin', cls: 'text-accent-gold border-accent-gold/30 bg-accent-gold/5' },
  OWNER: { label: 'Owner', cls: 'text-accent-pink border-accent-pink/30 bg-accent-pink/5' },
};

export default function MyClubsPage() {
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState<string | null>(null);

  useEffect(() => {
    users.myClubs()
      .then((data) => setMemberships(data))
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleLeave(slug: string, clubId: string) {
    setLeaving(clubId);
    try {
      await clubsApi.leave(slug);
      setMemberships((prev) => prev.filter((m) => m.club.id !== clubId));
    } catch {}
    finally { setLeaving(null); }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-accent-cyan rounded-full" />
            <h1 className="text-[32px] font-playfair font-bold tracking-tight text-ink mb-1">My Clubs</h1>
            <p className="text-[15px] font-medium text-ink-muted">Clubs you&apos;ve joined on campus.</p>
          </div>
          <Link href="/clubs">
            <button className="bg-surface-2 border border-border/80 text-ink px-6 py-3 rounded-full font-semibold text-[14px] hover:border-accent-cyan/50 hover:bg-surface-1 transition-all shadow-sm flex items-center gap-2">
              Browse Clubs <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-accent-cyan/60" />
          </div>
        ) : memberships.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-2/30 backdrop-blur-sm border border-border/60 rounded-[24px] p-16 text-center shadow-soft"
          >
            <Users className="h-12 w-12 text-ink-muted/40 mx-auto mb-4" />
            <p className="text-[16px] font-medium text-ink-muted mb-6">
              You haven&apos;t joined any clubs yet.
            </p>
            <Link href="/clubs">
              <button className="bg-ink text-canvas hover:bg-ink/90 px-6 py-3 rounded-xl font-bold text-[14px] transition-all shadow-md">
                Explore Clubs
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {memberships.map(({ club, role, joinedAt }, idx) => {
                const roleInfo = roleConfig[role] ?? roleConfig.FOLLOWER;
                return (
                  <motion.div
                    key={club.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-[24px] shadow-sm hover:shadow-soft hover:border-accent-cyan/30 transition-all overflow-hidden flex flex-col group relative"
                  >
                    {/* Glass sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Banner */}
                    <div className="h-32 bg-surface-2 relative overflow-hidden border-b border-border/40">
                      {club.banner ? (
                        <img src={club.banner} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/80 to-[#0A1A17] flex items-center justify-center opacity-80">
                          <span className="text-[64px] font-black text-canvas/5 select-none font-playfair">
                            {club.name[0]}
                          </span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-transparent to-transparent"></div>

                      {/* Logo */}
                      {club.logo ? (
                        <div className="absolute -bottom-2 left-6 h-16 w-16 rounded-[16px] border-[3px] border-canvas bg-surface-1 overflow-hidden shadow-sm">
                          <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="absolute -bottom-2 left-6 h-16 w-16 rounded-[16px] border-[3px] border-canvas bg-surface-2 flex items-center justify-center shadow-sm">
                           <span className="text-xl font-playfair font-bold text-ink">{club.name[0]}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 pt-8 flex flex-col flex-1 relative z-10">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="text-[18px] font-playfair font-bold text-ink truncate group-hover:text-primary transition-colors">
                            {club.name}
                          </h3>
                          {club.isVerified && <CheckCircle2 className="h-4 w-4 text-accent-cyan shrink-0" />}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-1.5 shrink-0 ${roleInfo.cls}`}>
                          {roleInfo.label}
                        </span>
                      </div>

                      {club.tagline && (
                        <p className="text-[13px] font-medium text-ink-muted line-clamp-2 mb-4 leading-relaxed">{club.tagline}</p>
                      )}

                      <div className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted mb-6">
                        <Users className="h-3.5 w-3.5" />
                        {club._count?.members ?? 0} members
                        <span className="ml-auto font-medium">
                          Joined {new Date(joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Link href={`/clubs/${club.slug}`} className="flex-1">
                          <button className="w-full bg-surface-1 border border-border/80 text-ink px-4 py-2.5 rounded-xl font-semibold text-[13px] hover:border-accent-cyan/50 hover:bg-surface-1/50 transition-all shadow-sm">
                            View Club
                          </button>
                        </Link>
                        {(role === 'FOLLOWER' || role === 'MEMBER') && (
                          <button
                            className="bg-transparent text-ink-muted border border-border/60 px-3 py-2.5 rounded-xl hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/5 transition-all flex items-center justify-center disabled:opacity-50"
                            onClick={() => handleLeave(club.slug, club.id)}
                            disabled={leaving === club.id}
                            title="Leave Club"
                          >
                            {leaving === club.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                            ) : (
                              <LogOut className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

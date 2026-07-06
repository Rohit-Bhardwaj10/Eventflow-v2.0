'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { users, clubs as clubsApi, type Club, ApiError } from '@/lib/api';
import {
  Users,
  Loader2,
  CheckCircle2,
  LogOut,
  Compass,
} from 'lucide-react';

interface ClubMembership {
  clubId: string;
  role: string;
  joinedAt: string;
  club: Club;
}

const roleConfig: Record<string, { label: string; cls: string }> = {
  FOLLOWER: { label: 'Follower', cls: 'text-ink-muted border-border' },
  MEMBER: { label: 'Member', cls: 'text-primary border-primary/40' },
  ADMIN: { label: 'Admin', cls: 'text-yellow-400 border-yellow-400/40' },
  OWNER: { label: 'Owner', cls: 'text-green-400 border-green-400/40' },
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
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline text-ink mb-1">My Clubs</h1>
            <p className="text-sm text-ink-muted">Clubs you&apos;ve joined on campus.</p>
          </div>
          <Link href="/clubs">
            <Button variant="secondary" size="default">
              <Compass className="h-4 w-4 mr-1.5" />
              Browse Clubs
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : memberships.length === 0 ? (
          <div className="border-[2px] border-border border-dashed p-16 text-center">
            <Users className="h-10 w-10 text-ink-muted mx-auto mb-4" />
            <p className="text-sm font-semibold text-ink-muted">
              You haven&apos;t joined any clubs yet.
            </p>
            <Link href="/clubs">
              <Button variant="primary" className="mt-4">
                Explore Clubs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {memberships.map(({ club, role, joinedAt }) => {
              const roleInfo = roleConfig[role] ?? roleConfig.FOLLOWER;
              return (
                <div
                  key={club.id}
                  className="border-[2px] border-border bg-surface-1 shadow-brutal-sm overflow-hidden flex flex-col"
                >
                  {/* Banner */}
                  <div className="h-24 bg-surface-2 relative overflow-hidden">
                    {club.banner ? (
                      <img src={club.banner} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-1 to-surface-2 flex items-center justify-center">
                        <span className="text-[48px] font-black text-ink/10 select-none">
                          {club.name[0]}
                        </span>
                      </div>
                    )}
                    {/* Logo */}
                    {club.logo && (
                      <div className="absolute bottom-2 left-4 h-9 w-9 border-[2px] border-border bg-canvas overflow-hidden">
                        <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-sm font-black uppercase text-ink truncate">
                          {club.name}
                        </h3>
                        {club.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-[0.12em] border px-2 py-0.5 shrink-0 ${roleInfo.cls}`}>
                        {roleInfo.label}
                      </span>
                    </div>

                    {club.tagline && (
                      <p className="text-xs text-ink-muted line-clamp-2 mb-3">{club.tagline}</p>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-ink-muted mb-4">
                      <Users className="h-3 w-3" />
                      {club._count?.members ?? 0} members
                      <span className="ml-auto">
                        Joined {new Date(joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link href={`/clubs/${club.slug}`} className="flex-1">
                        <Button variant="secondary" size="default" className="w-full">
                          View Club
                        </Button>
                      </Link>
                      {(role === 'FOLLOWER' || role === 'MEMBER') && (
                        <Button
                          variant="tertiary"
                          size="default"
                          onClick={() => handleLeave(club.slug, club.id)}
                          disabled={leaving === club.id}
                        >
                          {leaving === club.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <LogOut className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
import { registrations, type Registration, ApiError } from '@/lib/api';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  Loader2,
  QrCode,
  Globe,
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

const statusConfig: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: 'Confirmed', cls: 'text-accent-teal border-accent-teal/30 bg-accent-teal/5' },
  WAITLISTED: { label: 'Waitlisted', cls: 'text-accent-gold border-accent-gold/30 bg-accent-gold/5' },
  CANCELLED: { label: 'Cancelled', cls: 'text-red-400 border-red-500/30 bg-red-500/5' },
  ATTENDED: { label: 'Attended ✓', cls: 'text-accent-pink border-accent-pink/30 bg-accent-pink/5' },
};

export default function MyTicketPage() {
  const { id } = useParams<{ id: string }>();
  const [reg, setReg] = useState<(Registration & { qrCodeDataUrl?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    registrations.get(id)
      .then(setReg)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-accent-pink/60" />
        </div>
      </AppLayout>
    );
  }

  if (notFound || !reg) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
          <p className="text-2xl font-playfair font-bold text-ink">Ticket not found.</p>
          <Link href="/my-events">
             <button className="bg-surface-2 border border-border/80 text-ink px-6 py-3 rounded-full font-semibold text-[14px] hover:border-accent-pink/50 hover:bg-surface-1 transition-all shadow-sm">
              Back to My Events
             </button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const status = statusConfig[reg.status] ?? statusConfig.CONFIRMED;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-6 pt-4">
        <Link href="/my-events" className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink-muted hover:text-ink transition-colors w-fit group">
          <div className="p-2 rounded-full bg-surface-1 border border-border/60 group-hover:border-ink/20 group-hover:bg-surface-2 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to My Events
        </Link>

        {/* Ticket Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-[32px] shadow-soft overflow-hidden relative"
        >
           {/* Decorative background glow */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent-pink/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Top stripe */}
          <div className="bg-gradient-to-r from-accent-pink to-accent-purple h-2" />

          <div className="p-8 sm:p-10 relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent-pink mb-2">
                  {reg.event.club.name}
                </p>
                <h1 className="text-[28px] font-playfair font-bold leading-[1.1] tracking-tight text-ink">
                  {reg.event.title}
                </h1>
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider border rounded-full px-4 py-2 shrink-0 ${status.cls}`}>
                {status.label}
              </span>
            </div>

            {/* Details grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8 border-t border-b border-border/40 py-8">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                   <CalendarDays className="h-4 w-4 text-accent-pink" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1">Date</p>
                  <p className="text-[14px] font-medium text-ink">
                    {formatDate(reg.event.startAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                   <Clock className="h-4 w-4 text-accent-pink" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1">Time</p>
                  <p className="text-[14px] font-medium text-ink">
                    {formatTime(reg.event.startAt)} – {formatTime(reg.event.endAt)}
                  </p>
                </div>
              </div>

              {reg.event.venue && (
                <div className="flex gap-4">
                   <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                     <MapPin className="h-4 w-4 text-accent-pink" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1">Venue</p>
                    <p className="text-[14px] font-medium text-ink">
                      {reg.event.venue}
                    </p>
                  </div>
                </div>
              )}

              {reg.event.meetingLink && (
                 <div className="flex gap-4">
                   <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                     <Globe className="h-4 w-4 text-accent-pink" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1">Join Online</p>
                    <a
                      href={reg.event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] font-medium text-accent-pink hover:underline"
                    >
                      Open Link
                    </a>
                  </div>
                </div>
              )}

              {reg.tier && (
                <div className="flex gap-4">
                   <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                     <Ticket className="h-4 w-4 text-accent-pink" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1">Ticket Type</p>
                    <p className="text-[14px] font-medium text-ink">
                      {reg.tier.name}
                      {reg.tier.price > 0 && ` · ₹${reg.tier.price}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-accent-pink" />
                  </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1">Registered At</p>
                  <p className="text-[14px] font-medium text-ink">
                    {formatDate(reg.registeredAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code section - uses a dashed cutout style */}
            <div className="flex flex-col items-center py-8 bg-canvas/30 rounded-2xl border border-dashed border-border/80">
              {reg.qrCodeDataUrl ? (
                <>
                  <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
                     <img src={reg.qrCodeDataUrl} alt="QR Code" className="h-48 w-48 rounded-lg" />
                  </div>
                  <p className="text-[12px] font-semibold text-ink-muted text-center max-w-[200px]">
                    Show this at the venue for check-in
                  </p>
                </>
              ) : (
                <>
                  <div className="h-24 w-24 rounded-2xl bg-surface-1 border border-border/60 flex items-center justify-center mb-4">
                     <QrCode className="h-10 w-10 text-ink-muted/50" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted text-center mb-2">
                    QR Code
                  </p>
                  <p className="text-[13px] font-mono font-medium text-ink bg-surface-1 px-3 py-1.5 rounded-lg border border-border/40">
                    {reg.qrToken}
                  </p>
                  <p className="text-[12px] font-medium text-ink-muted mt-3 text-center">
                    Show your Ticket ID at the venue
                  </p>
                </>
              )}
            </div>

            {/* Registration ID */}
            <div className="mt-8 text-center flex flex-col items-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted/70 mb-1">
                Registration ID
              </p>
              <p className="text-[11px] font-mono text-ink-muted/50">{reg.id}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 pb-10">
          <Link href={`/events/${reg.event.slug}`} className="flex-1">
            <button className="w-full bg-ink text-canvas hover:bg-ink/90 px-6 py-4 rounded-xl font-bold text-[14px] transition-all shadow-md">
              Event Details
            </button>
          </Link>
          <Link href="/my-events" className="flex-1">
            <button className="w-full px-6 py-4 rounded-xl font-bold text-[14px] bg-surface-2 border border-border/80 text-ink hover:bg-surface-1 transition-all shadow-sm">
              All My Events
            </button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

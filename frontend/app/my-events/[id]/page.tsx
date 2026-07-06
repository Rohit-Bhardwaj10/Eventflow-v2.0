'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
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
  CheckCircle2,
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

const statusConfig: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: 'Confirmed', cls: 'text-primary border-primary/40 bg-primary/10' },
  WAITLISTED: { label: 'Waitlisted', cls: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10' },
  CANCELLED: { label: 'Cancelled', cls: 'text-red-400 border-red-400/40 bg-red-400/10' },
  ATTENDED: { label: 'Attended ✓', cls: 'text-green-400 border-green-400/40 bg-green-400/10' },
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (notFound || !reg) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl font-black uppercase text-ink">Ticket not found.</p>
          <Link href="/my-events"><Button variant="secondary">Back to My Events</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const status = statusConfig[reg.status] ?? statusConfig.CONFIRMED;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <Link href="/my-events" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to My Events
        </Link>

        {/* Ticket Card */}
        <div className="border-[2px] border-border bg-surface-1 shadow-[8px_8px_0_0_var(--color-border)] overflow-hidden">
          {/* Top stripe */}
          <div className="bg-primary h-2" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary mb-1">
                  {reg.event.club.name}
                </p>
                <h1 className="text-xl font-black uppercase leading-[1.1] tracking-[-0.03em] text-ink">
                  {reg.event.title}
                </h1>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.14em] border px-3 py-1.5 shrink-0 ${status.cls}`}>
                {status.label}
              </span>
            </div>

            {/* Details grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6 border-t border-b border-border/50 py-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-muted mb-1">Date</p>
                <p className="text-sm font-semibold text-ink flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {formatDate(reg.event.startAt)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-muted mb-1">Time</p>
                <p className="text-sm font-semibold text-ink flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {formatTime(reg.event.startAt)} – {formatTime(reg.event.endAt)}
                </p>
              </div>
              {reg.event.venue && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-muted mb-1">Venue</p>
                  <p className="text-sm font-semibold text-ink flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {reg.event.venue}
                  </p>
                </div>
              )}
              {reg.event.meetingLink && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-muted mb-1">Join Online</p>
                  <a
                    href={reg.event.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary flex items-center gap-2 hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Open Link
                  </a>
                </div>
              )}
              {reg.tier && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-muted mb-1">Ticket Type</p>
                  <p className="text-sm font-semibold text-ink flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    {reg.tier.name}
                    {reg.tier.price > 0 && ` · ₹${reg.tier.price}`}
                  </p>
                </div>
              )}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-muted mb-1">Registered At</p>
                <p className="text-sm font-semibold text-ink">
                  {formatDate(reg.registeredAt)}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center py-6 border-[2px] border-dashed border-border bg-canvas">
              {reg.qrCodeDataUrl ? (
                <>
                  <img src={reg.qrCodeDataUrl} alt="QR Code" className="h-48 w-48 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-muted text-center">
                    Show this at the venue for check-in
                  </p>
                </>
              ) : (
                <>
                  <QrCode className="h-20 w-20 text-ink-muted mb-3" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted text-center">
                    QR Code
                  </p>
                  <p className="text-[10px] text-ink-muted mt-1 font-mono">
                    {reg.qrToken}
                  </p>
                  <p className="text-[10px] text-ink-muted mt-2 text-center">
                    Show your Ticket ID at the venue
                  </p>
                </>
              )}
            </div>

            {/* Registration ID */}
            <div className="mt-5 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-muted mb-1">
                Registration ID
              </p>
              <p className="text-xs font-mono text-ink-muted">{reg.id}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/events/${reg.event.slug}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Event Details
            </Button>
          </Link>
          <Link href="/my-events" className="flex-1">
            <Button variant="tertiary" className="w-full">
              All My Events
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <div className="fixed top-3 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <header className="pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-none border-[2px] border-border bg-surface-1/82 px-4 py-2 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-5">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center border-[2px] border-border bg-primary text-ink shadow-brutal-sm transition-transform group-hover:-translate-y-0.5">
                <span className="text-xs font-black">EF</span>
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-black uppercase tracking-[0.18em]">
                  Eventflow
                </span>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                  Campus operations
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              {[
                { href: '/#features', label: 'Features' },
                { href: '/#workflow', label: 'Workflow' },
                { href: '/#showcase', label: 'Showcase' },
                { href: '/#faq', label: 'FAQ' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-none border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-surface-2 hover:text-ink"
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="secondary" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Start free
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 flex flex-col pt-24">{children}</main>

      <footer className="border-t-[2px] border-border bg-surface-1 text-ink">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-[2px] border-border bg-primary text-ink shadow-brutal-sm">
                <span className="text-sm font-black">EF</span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em]">Eventflow</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  Built for campus organizers
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-ink-muted">
              A modern operations layer for clubs and event teams: publish, ticket,
              check in, measure, and follow up without spreadsheet drift.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn
              title="Product"
              links={[
                { href: '/#features', label: 'Features' },
                { href: '/#workflow', label: 'Workflow' },
                { href: '/#showcase', label: 'Showcase' },
              ]}
            />
            <FooterColumn
              title="Access"
              links={[
                { href: '/explore', label: 'Explore' },
                { href: '/login', label: 'Login' },
                { href: '/signup', label: 'Sign up' },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy' },
              ]}
            />
          </div>
        </div>

        <div className="border-t border-border/80 bg-canvas">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-[11px] uppercase tracking-[0.22em] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Eventflow</span>
            <span>Campus event management</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
        {title}
      </h4>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <div className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <header className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-white/20 bg-white/40 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150 md:px-6 transition-all duration-300">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-soft-sm transition-transform group-hover:-translate-y-0.5">
                <span className="text-lg font-semibold font-playfair italic"></span>
              </div> */}
              <div className="leading-tight">
                <span className="block text-[15px] font-semibold text-primary tracking-tight">
                  ClubSync
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2 text-[13px] font-medium text-ink-muted">
              {[
                { href: '/#features', label: 'Features' },
                { href: '/#workflow', label: 'Workflow' },
                { href: '/#showcase', label: 'Showcase' },
                { href: '/#faq', label: 'FAQ' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 transition-all hover:bg-white/80 hover:text-primary hover:shadow-soft-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden sm:block">
              <button className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-primary transition-colors">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-soft-sm transition-transform hover:-translate-y-0.5 hover:bg-primary-hover">
                Start free
              </button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="border-t border-border/60 bg-surface-1 text-ink">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-soft-sm">
                <span className="text-lg font-semibold font-playfair italic">C</span>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-primary tracking-tight">ClubSync</p>
                <p className="text-xs font-medium text-ink-muted mt-0.5">
                  Campus Events, Simplified.
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink-muted">
              Discover events, manage clubs, and never miss what&apos;s happening on campus. A modern operations layer for student leaders.
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

        <div className="border-t border-border/40 bg-canvas/50">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-xs font-medium text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 ClubSync</span>
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
    <div className="flex flex-col gap-5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
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

'use client';

import Link from 'next/link';
import { type ReactNode, useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

export function PublicLayout({ children, hideFooter = false, hideNav = false }: { children: ReactNode; hideFooter?: boolean; hideNav?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const diff = currentY - lastScrollY.current;

          // Show when scrolling up or at top; hide when scrolling down past threshold
          if (currentY < 80) {
            setVisible(true);
          } else if (diff < -4) {
            setVisible(true);   // scrolling up
          } else if (diff > 4) {
            setVisible(false);  // scrolling down
            setMobileMenuOpen(false);
          }

          setScrolled(currentY > 50);
          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#workflow', label: 'Workflow' },
    { href: '/#showcase', label: 'Showcase' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-slate-900">
      {/* Floating Navbar */}
      {!hideNav ? (
        <div
          className={`
            fixed top-4 md:top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none
            transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
            ${visible ? 'translate-y-0 opacity-100' : '-translate-y-[calc(100%+2rem)] opacity-0'}
          `}
        >
          <header
            className={`
              pointer-events-auto relative flex w-full max-w-5xl items-center justify-between gap-4
              rounded-[28px] px-5 py-3 md:px-6
              transition-all duration-500 ease-out
              ${scrolled
                ? 'border border-white/40 bg-white/35 shadow-[0_12px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.05),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-[64px] backdrop-saturate-[110%] backdrop-brightness-[1.04]'
                : 'border border-white/30 bg-white/28 shadow-[0_8px_32px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.03),inset_0_1.5px_0_rgba(255,255,255,0.85)] backdrop-blur-[56px] backdrop-saturate-[108%] backdrop-brightness-[1.03]'
              }
            `}
          >
            {/* Liquid specular highlight — top edge shimmer */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px] bg-gradient-to-r from-transparent via-white to-transparent" />
            {/* Inner glass depth layer */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/30 via-transparent to-black/[0.03]" />
            {/* Left-side catch light */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-1/3 rounded-l-[28px] bg-gradient-to-r from-white/20 to-transparent" />

            {/* Logo */}
            <div className="flex items-center gap-8 relative z-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="text-[15px] font-semibold text-slate-900 tracking-tight">
                  EventFlow<span className="text-primary">.</span>
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-0.5 text-[13px] font-medium text-slate-600">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-black/[0.06] hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 relative z-10">
              <Link href="/login" className="hidden sm:block">
                <button className="rounded-full px-4 py-2 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-black/[0.06] hover:text-slate-900">
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                {/* Glass-within-glass CTA pill */}
                <button className="rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 px-5 py-2 text-[13px] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:bg-slate-900 hover:scale-[1.03] hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                  Start free
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 rounded-full text-slate-600 hover:bg-black/[0.06] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            {/* Mobile Dropdown (Liquid Glass) */}
            <div
              className={`
                absolute top-[calc(100%+10px)] left-0 right-0 lg:hidden
                transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
              `}
            >
              <div className="flex flex-col gap-1 rounded-[22px] border border-white/25 bg-white/65 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.10),inset_0_1.5px_0_rgba(255,255,255,0.7)] backdrop-blur-[28px] backdrop-saturate-[200%]">
                {/* Top shimmer */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[22px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-[14px] px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-black/[0.05] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px w-full bg-black/[0.06] my-1 mx-1" style={{ width: 'calc(100% - 8px)' }} />
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full rounded-[14px] px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-black/[0.05] transition-colors text-left">
                    Log in
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full rounded-[14px] bg-slate-900/85 backdrop-blur-md px-4 py-3 text-[14px] font-medium text-white text-left transition-all hover:bg-slate-900">
                    Start free →
                  </button>
                </Link>
              </div>
            </div>
          </header>
        </div>
      ) : (
        <div className="fixed top-4 md:top-6 left-4 md:left-6 z-50 pointer-events-auto">
          <Link href="/">
            <button className="flex items-center gap-2 rounded-full border border-white/40 bg-white/50 backdrop-blur-md px-4 py-2.5 text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:bg-white/80 hover:text-slate-900 hover:scale-[1.02]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Home
            </button>
          </Link>
        </div>
      )}

      <main className="flex-1 flex flex-col">{children}</main>

      {!hideFooter && (
        <footer className="border-t border-border bg-canvas text-ink relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-accent-teal/30 to-transparent"></div>
          
          <div className="mx-auto flex max-w-[1200px] flex-col px-6 py-12 lg:px-0">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0">
              
              {/* Brand Side */}
              <div className="flex flex-col gap-4 max-w-sm">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-[18px] font-playfair font-bold text-primary tracking-tight">
                    EventFlow<span className="text-accent-teal">.</span>
                  </span>
                </Link>
                <p className="text-[14px] leading-relaxed text-ink-muted font-medium">
                  The all-in-one platform for college clubs to create, manage, and scale events seamlessly.
                </p>
              </div>

              {/* Links Side */}
              <div className="flex flex-wrap gap-16 sm:gap-24">
                <FooterColumn
                  title="Product"
                  links={[
                    { href: '/#features', label: 'Features' },
                    { href: '/#security', label: 'Security' },
                    { href: '/pricing', label: 'Pricing' },
                  ]}
                />
                <FooterColumn
                  title="Company"
                  links={[
                    { href: '/about', label: 'About Us' },
                    { href: '/contact', label: 'Contact' },
                    { href: '/terms', label: 'Terms & Privacy' },
                  ]}
                />
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between border-t border-border/60 pt-6">
              <span className="text-[13px] font-medium text-ink-muted/80">© {new Date().getFullYear()} EventFlow. All rights reserved.</span>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <a href="#" className="text-ink-muted hover:text-accent-teal transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="text-ink-muted hover:text-accent-teal transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
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
      <h4 className="text-[12px] font-bold uppercase tracking-wider text-primary">
        {title}
      </h4>
      <div className="flex flex-col gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[14px] font-medium text-ink-muted transition-colors hover:text-accent-teal"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

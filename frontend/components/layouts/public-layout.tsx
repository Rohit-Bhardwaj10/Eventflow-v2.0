'use client';

import Link from 'next/link';
import { type ReactNode, useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function PublicLayout({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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
      {/* Floating Navbar Container */}
      <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <header 
          className={`
            pointer-events-auto relative flex w-full max-w-5xl items-center justify-between gap-4 
            rounded-[24px] border border-white/30 px-4 py-3 md:px-6 
            transition-all duration-300 ease-out
            ${scrolled 
              ? 'bg-white/75 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-[24px] backdrop-saturate-[180%]' 
              : 'bg-white/55 shadow-[0_8px_32px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-[16px] backdrop-saturate-[150%]'}
          `}
        >
          {/* Specular Highlight (Glass Reflection) */}
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

          <div className="flex items-center gap-8 relative z-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="leading-tight">
                <span className="block text-[16px] font-semibold text-slate-900 tracking-tight">
                  ClubSync.
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-slate-600">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-black/5 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 relative z-10">
            <Link href="/login" className="hidden sm:block">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-black/5 hover:text-slate-900">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              {/* Glass-within-glass CTA */}
              <button className="rounded-full bg-slate-900/90 backdrop-blur-md px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-900 hover:scale-[1.02]">
                Start free
              </button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 rounded-full text-slate-600 hover:bg-black/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu (Liquid Glass) */}
          {mobileMenuOpen && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 p-2 lg:hidden">
              <div className="flex flex-col gap-1 rounded-[20px] border border-white/30 bg-white/75 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-[24px] backdrop-saturate-[180%]">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-black/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-[1px] w-full bg-black/5 my-2" />
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-black/5 transition-colors text-left">
                    Log in
                  </button>
                </Link>
              </div>
            </div>
          )}
        </header>
      </div>

      <main className="flex-1 flex flex-col">{children}</main>

      {!hideFooter && (
        <footer className="border-t border-slate-200/60 bg-slate-50 text-slate-900">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12">
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                  <span className="text-lg font-semibold font-serif italic">C</span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900 tracking-tight">ClubSync</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Campus Events, Simplified.
                  </p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
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

          <div className="border-t border-slate-200/40 bg-slate-100/50">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-xs font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>© 2026 ClubSync</span>
              <span>Campus event management</span>
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
    <div className="flex flex-col gap-5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
        {title}
      </h4>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

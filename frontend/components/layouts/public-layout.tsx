import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Marquee strip */}
      <div className="border-b-[3px] border-border bg-primary overflow-hidden py-2">
        <div className="marquee-track flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {[
                "EVENTS",
                "◆",
                "CLUBS",
                "◆",
                "CHECK-INS",
                "◆",
                "TICKETS",
                "◆",
                "CERTIFICATES",
                "◆",
                "ANALYTICS",
                "◆",
                "AI CO-PILOT",
                "◆",
              ].map((item, j) => (
                <span
                  key={`${i}-${j}`}
                  className="mx-6 text-caption text-ink font-bold"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-surface-1 px-6 border-b-[3px] border-border">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 bg-primary border-brutal-2 shadow-brutal-sm flex items-center justify-center group-hover:bg-accent-pink transition-colors">
              <span className="text-sm font-black">EF</span>
            </div>
            <span className="text-body font-bold uppercase tracking-tight">
              Eventflow
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/explore", label: "Explore" },
              { href: "/about", label: "About" },
              { href: "/pricing", label: "Pricing" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-body-sm font-bold uppercase hover:bg-surface-2 border-2 border-transparent hover:border-border transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="secondary" size="default">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="default">
              Get Started →
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="border-t-[3px] border-border bg-inverse-canvas text-inverse-ink mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary border-brutal-2 shadow-brutal-sm flex items-center justify-center">
                  <span className="text-sm font-black text-ink">EF</span>
                </div>
                <span className="text-headline font-black uppercase">
                  Eventflow
                </span>
              </div>
              <p className="text-body-lg text-inverse-ink/70 max-w-sm font-medium">
                The no-nonsense platform for college clubs to run events, sell
                tickets, scan check-ins, and issue certificates — all in one
                place.
              </p>
              <div className="flex gap-3">
                <BadgeLink href="/explore" color="yellow">
                  Explore Events
                </BadgeLink>
                <BadgeLink href="/signup" color="pink">
                  Start Free
                </BadgeLink>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <FooterColumn
                title="Product"
                links={[
                  { href: "/explore", label: "Explore" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/changelog", label: "Changelog" },
                ]}
              />
              <FooterColumn
                title="Company"
                links={[
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                  { href: "/careers", label: "Careers" },
                ]}
              />
              <FooterColumn
                title="Legal"
                links={[
                  { href: "/privacy", label: "Privacy" },
                  { href: "/terms", label: "Terms" },
                ]}
              />
            </div>
          </div>

          <div className="mt-16 pt-8 border-t-2 border-inverse-ink/20 flex flex-col sm:flex-row justify-between gap-4">
            <p className="text-caption text-inverse-ink/50">
              © 2026 Eventflow. Built for campus organizers.
            </p>
            <p className="text-caption text-inverse-ink/50">
              v2.0 — NEO-BRUTALIST EDITION
            </p>
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
      <h4 className="text-eyebrow text-primary">{title}</h4>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-body-sm font-semibold hover:text-primary transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function BadgeLink({
  href,
  color,
  children,
}: {
  href: string;
  color: "yellow" | "pink" | "cyan";
  children: React.ReactNode;
}) {
  const colors = {
    yellow: "bg-primary text-ink",
    pink: "bg-accent-pink text-ink",
    cyan: "bg-accent-cyan text-ink",
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center border-brutal-2 shadow-brutal-sm px-4 py-2 text-caption brutal-hover-lift ${colors[color]}`}
    >
      {children}
    </Link>
  );
}

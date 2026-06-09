import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 flex h-[56px] items-center justify-between bg-canvas/80 px-6 backdrop-blur-md border-b border-hairline">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-primary" />
            <span className="text-body-sm font-semibold text-ink">ClubSync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-body-sm text-ink-subtle">
            <Link href="/explore" className="hover:text-ink transition-colors">Explore</Link>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-ink transition-colors">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="secondary" size="default">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="default">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-canvas text-ink-subtle text-caption py-16 px-8 border-t border-hairline mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-primary" />
              <span className="font-semibold text-ink">ClubSync</span>
            </div>
            <p className="max-w-xs">
              The modern platform for college clubs to manage events, members, and operations.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-ink font-medium">Product</h4>
            <Link href="/explore" className="hover:text-ink transition-colors">Explore Events</Link>
            <Link href="/pricing" className="hover:text-ink transition-colors">Pricing</Link>
            <Link href="/changelog" className="hover:text-ink transition-colors">Changelog</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-ink font-medium">Company</h4>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/contact" className="hover:text-ink transition-colors">Contact</Link>
            <Link href="/careers" className="hover:text-ink transition-colors">Careers</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-ink font-medium">Legal</h4>
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

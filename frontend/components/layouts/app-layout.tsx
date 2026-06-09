import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 border-r border-hairline flex flex-col">
        <div className="h-[56px] flex items-center px-6 border-b border-hairline">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-primary" />
            <span className="text-body-sm font-semibold text-ink">ClubSync</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <div className="text-eyebrow text-ink-subtle px-2 mb-2">Menu</div>
          <Link href="/dashboard" className="px-2 py-1.5 text-body-sm text-ink hover:bg-surface-1 rounded-md transition-colors">Dashboard</Link>
          <Link href="/my-events" className="px-2 py-1.5 text-body-sm text-ink-muted hover:text-ink hover:bg-surface-1 rounded-md transition-colors">My Events</Link>
          <Link href="/my-clubs" className="px-2 py-1.5 text-body-sm text-ink-muted hover:text-ink hover:bg-surface-1 rounded-md transition-colors">My Clubs</Link>
          <Link href="/explore" className="px-2 py-1.5 text-body-sm text-ink-muted hover:text-ink hover:bg-surface-1 rounded-md transition-colors">Explore</Link>
        </nav>
        <div className="p-4 border-t border-hairline">
          <Link href="/profile">
            <div className="flex items-center gap-3 px-2 py-2 hover:bg-surface-1 rounded-md transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-surface-2" />
              <div className="flex flex-col">
                <span className="text-body-sm text-ink">Student Name</span>
                <span className="text-caption text-ink-subtle">View Profile</span>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-[56px] border-b border-hairline flex items-center justify-end px-8 shrink-0">
           <Button variant="secondary">Notifications</Button>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

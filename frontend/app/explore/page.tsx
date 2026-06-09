import { PublicLayout } from "@/components/layouts/public-layout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex flex-col">
        <div className="flex flex-col gap-6 mb-12">
          <h1 className="text-display-md text-ink">Explore Events</h1>
          <div className="flex items-center gap-4 max-w-2xl">
            <Input type="text" placeholder="Search events, clubs, or categories..." className="flex-1" />
            <Button variant="primary">Search</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dummy Event Cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} variant="default" className="flex flex-col cursor-pointer hover:bg-surface-2 transition-colors">
              <div className="h-48 bg-surface-3 -mx-6 -mt-6 mb-4 rounded-t-lg border-b border-hairline overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-surface-2 to-primary/20" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption text-primary">Oct 24 • 5:00 PM</span>
                <span className="text-caption text-ink-subtle">Tech Club</span>
              </div>
              <h3 className="text-card-title mb-2">AI & Future of Work Panel</h3>
              <p className="text-body-sm text-ink-muted line-clamp-2">
                Join industry leaders to discuss how AI is shaping the future of software engineering and design.
              </p>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

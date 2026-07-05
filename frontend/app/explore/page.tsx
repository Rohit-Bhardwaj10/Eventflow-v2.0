import { PublicLayout } from "@/components/layouts/public-layout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const accentColors = [
  "accent-yellow",
  "accent-cyan",
  "accent-pink",
  "accent-lime",
  "accent-yellow",
  "accent-cyan",
] as const;

export default function ExplorePage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex flex-col">
        <div className="flex flex-col gap-6 mb-12">
          <Badge variant="cyan" className="w-fit -rotate-1">
            Discover
          </Badge>
          <h1 className="text-display-md text-ink">Explore Events</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-2xl">
            <Input
              type="text"
              placeholder="Search events, clubs, categories..."
              className="flex-1"
            />
            <Button variant="primary" size="lg">
              Search →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              variant={accentColors[i - 1]}
              className="flex flex-col cursor-pointer brutal-hover-lift p-0 overflow-hidden"
            >
              <div className="h-36 border-b-[3px] border-border bg-surface-1 flex items-center justify-center">
                <span className="text-display-md text-ink/10 font-black">
                  {String(i).padStart(2, "0")}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="dark" className="text-[10px]">
                    Oct 24 • 5PM
                  </Badge>
                  <span className="text-caption text-ink-muted">Tech Club</span>
                </div>
                <h3 className="text-card-title uppercase mb-2">
                  AI & Future of Work Panel
                </h3>
                <p className="text-body-sm text-ink-muted line-clamp-2">
                  Join industry leaders to discuss how AI is shaping the future
                  of software engineering and design.
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

import { AppLayout } from "@/components/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-headline text-ink mb-2">Welcome back, Alex.</h1>
          <p className="text-body text-ink-muted">Here is what&apos;s happening around campus.</p>
        </div>

        {/* Upcoming Registered Events */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-subhead text-ink font-medium">Your Upcoming Events</h2>
            <Button variant="tertiary" size="default">View all</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="feature" className="flex items-center gap-6 p-4">
              <div className="h-20 w-20 bg-surface-3 rounded-md shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-2 to-primary/20" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-caption text-primary font-medium mb-1">Today • 6:00 PM</span>
                <h3 className="text-body text-ink font-medium">Design System Workshop</h3>
                <span className="text-caption text-ink-subtle mt-1">Design Club • Room 402</span>
              </div>
              <Button variant="secondary" className="shrink-0">Ticket</Button>
            </Card>
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-primary rounded-sm shrink-0" />
            <h2 className="text-subhead text-ink font-medium">For You</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="default" className="flex flex-col cursor-pointer hover:bg-surface-2 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-caption text-ink-muted">Tomorrow • 2:00 PM</span>
                </div>
                <h3 className="text-body text-ink font-medium mb-2">Intro to React Native</h3>
                <p className="text-body-sm text-ink-subtle mb-4 flex-1">
                  Based on your interest in web development and the Tech Club.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-caption text-ink-subtle">Tech Club</span>
                  <span className="text-caption text-primary font-medium">Free</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}

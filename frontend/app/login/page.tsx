import { PublicLayout } from "@/components/layouts/public-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card variant="default" className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="h-8 w-8 rounded-md bg-primary mb-6" />
            <h1 className="text-card-title text-ink mb-2">Log in to ClubSync</h1>
            <p className="text-body-sm text-ink-muted text-center">
              Enter your college email address to continue.
            </p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-body-sm text-ink">Email</label>
              <Input id="email" type="email" placeholder="student@college.edu" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-body-sm text-ink flex justify-between">
                Password
                <Link href="/forgot" className="text-primary hover:text-primary-hover">Forgot?</Link>
              </label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            
            <Button variant="primary" className="mt-4 w-full">Sign In</Button>
          </form>

          <div className="mt-8 text-center text-body-sm text-ink-subtle">
            Don&apos;t have an account? <Link href="/signup" className="text-ink hover:text-primary transition-colors">Sign up</Link>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}

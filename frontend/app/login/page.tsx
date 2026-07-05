import { PublicLayout } from "@/components/layouts/public-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <Card variant="default" className="w-full max-w-md relative">
          <Badge variant="yellow" className="absolute -top-3 -right-3 rotate-3">
            Welcome back
          </Badge>

          <div className="flex flex-col items-center mb-8 pt-2">
            <div className="h-12 w-12 bg-primary border-brutal-2 shadow-brutal-sm flex items-center justify-center mb-6">
              <span className="text-sm font-black">EF</span>
            </div>
            <h1 className="text-headline uppercase text-ink mb-2">
              Log in to Eventflow
            </h1>
            <p className="text-body-sm text-ink-muted text-center">
              Enter your college email to continue.
            </p>
          </div>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-caption text-ink">
                Email
              </label>
              <Input id="email" type="email" placeholder="student@college.edu" />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-caption text-ink flex justify-between items-center"
              >
                Password
                <Link
                  href="/forgot"
                  className="text-ink-muted hover:text-ink normal-case font-semibold"
                >
                  Forgot?
                </Link>
              </label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <Button variant="primary" className="mt-2 w-full" size="lg">
              Sign In →
            </Button>
          </form>

          <div className="mt-8 text-center text-body-sm text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-ink font-bold underline underline-offset-4 hover:text-accent-pink"
            >
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}

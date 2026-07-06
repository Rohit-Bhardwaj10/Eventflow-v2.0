'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Zap, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <Card variant="default" className="w-full max-w-md relative">
          <Badge variant="yellow" className="absolute -top-3 -right-3 rotate-3">
            Welcome back
          </Badge>

          <div className="flex flex-col items-center mb-8 pt-2">
            <div className="h-12 w-12 bg-primary border-[2px] border-border shadow-brutal-sm flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-ink" />
            </div>
            <h1 className="text-headline uppercase text-ink mb-2">Log in to Eventflow</h1>
            <p className="text-body-sm text-ink-muted text-center">
              Enter your college email to continue.
            </p>
          </div>

          {error && (
            <div className="mb-5 border-[2px] border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-semibold">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-caption text-ink">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
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
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button variant="primary" className="mt-2 w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In →'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-body-sm text-ink-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-ink font-bold underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}

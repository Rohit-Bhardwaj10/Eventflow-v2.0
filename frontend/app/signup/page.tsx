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

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, year ? parseInt(year) : undefined);
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
          <Badge variant="cyan" className="absolute -top-3 -right-3 -rotate-2">
            New account
          </Badge>

          <div className="flex flex-col items-center mb-8 pt-2">
            <div className="h-12 w-12 bg-primary border-[2px] border-border shadow-brutal-sm flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-ink" />
            </div>
            <h1 className="text-headline uppercase text-ink mb-2">Create your account</h1>
            <p className="text-body-sm text-ink-muted text-center">
              Join your campus on Eventflow.
            </p>
          </div>

          {error && (
            <div className="mb-5 border-[2px] border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-semibold">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-caption text-ink">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Aarav Mehta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-caption text-ink">
                College Email
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
              <label htmlFor="year" className="text-caption text-ink">
                Academic Year <span className="text-ink-muted normal-case font-normal">(optional)</span>
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={loading}
                className="border-[2px] border-border bg-canvas text-ink px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-caption text-ink">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm" className="text-caption text-ink">
                Confirm Password
              </label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button variant="primary" className="mt-2 w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create Account →'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-body-sm text-ink-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-ink font-bold underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}

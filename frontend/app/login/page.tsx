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
    <PublicLayout hideFooter hideNav>
      <div className="flex-1 flex min-h-[calc(100vh-4rem)] md:flex-row-reverse">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-500 font-sans">
                Sign in to manage your campus events.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
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
                  className="rounded-xl border-slate-200 shadow-sm focus:border-slate-400 focus:ring-slate-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 flex justify-between items-center"
                >
                  Password
                  <Link
                    href="/forgot"
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Forgot password?
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
                  className="rounded-xl border-slate-200 shadow-sm focus:border-slate-400 focus:ring-slate-400 transition-all"
                />
              </div>

              <Button 
                variant="primary" 
                className="mt-4 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20" 
                size="lg" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-slate-900 hover:underline underline-offset-4 transition-all"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-1/2 relative bg-slate-100">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/AI_Bg_039.png")' }}
          >
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

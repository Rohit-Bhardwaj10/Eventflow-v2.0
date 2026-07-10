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
    <PublicLayout hideFooter hideNav>
      <div className="flex-1 flex min-h-[calc(100vh-4rem)] md:flex-row-reverse">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 pt-32 sm:pt-16 lg:p-16 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-2">Create Account</h1>
              <p className="text-slate-500 font-sans">
                Join your campus on Eventflow.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
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
                  className="rounded-xl border-slate-200 shadow-sm focus:border-slate-400 focus:ring-slate-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
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
                  className="rounded-xl border-slate-200 shadow-sm focus:border-slate-400 focus:ring-slate-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="year" className="text-sm font-medium text-slate-700">
                  Academic Year <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
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
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
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
                  className="rounded-xl border-slate-200 shadow-sm focus:border-slate-400 focus:ring-slate-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirm" className="text-sm font-medium text-slate-700">
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
                    Creating account…
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-slate-900 hover:underline underline-offset-4 transition-all"
              >
                Log in
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

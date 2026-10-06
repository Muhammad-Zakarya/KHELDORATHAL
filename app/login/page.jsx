'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Code2, LogIn, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (data.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/customer');
        }
        router.refresh();
      } else {
        setError(data.error || 'Invalid login credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-12 cosmic-stars overflow-hidden">
      {/* Nebula Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-purple-500/30 bg-[#120934]/90 p-5 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex h-13 w-13 items-center justify-center rounded-2xl border border-purple-400/40 bg-purple-950/60 text-cyan-300 shadow-[0_0_20px_rgba(217,70,239,0.3)] mb-2 group hover:scale-110 transition-transform">
            <Code2 className="h-6 w-6 text-cyan-400" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words">Welcome Back</h1>
          <p className="text-xs text-purple-200/80">
            Sign in to access your KELDORATHAL dashboard, messages and orders.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/30 p-3.5 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-3 text-sm text-white placeholder-purple-300/40 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-3 text-sm text-white placeholder-purple-300/40 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] hover:scale-[1.01] disabled:opacity-50 transition-all"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-purple-500/20 text-center text-xs text-purple-300/80">
          Don&apos;t have an account yet?{' '}
          <Link
            href={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : '/signup'}
            className="font-bold text-cyan-300 hover:text-white hover:underline transition-colors"
          >
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-mono text-purple-300">Loading authentication...</div>}>
      <LoginForm />
    </Suspense>
  );
}

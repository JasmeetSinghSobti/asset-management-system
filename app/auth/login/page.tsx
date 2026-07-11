'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import Loader from '@/components/Loader';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If the session restores on refresh (or the user is already
  // signed in and lands here directly), send them home.
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace('/');
    router.refresh();
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  // Don't show the sign-in form while we're still checking for an
  // existing session, or once we know there is one and are about
  // to redirect away.
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-[#0F1613]">
      {/* Left panel — signature element */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-14 border-r border-[#2A3A34]">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #1C2E27 0%, transparent 45%), radial-gradient(circle at 80% 70%, #1C2E27 0%, transparent 50%)',
          }}
        />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.18]"
          viewBox="0 0 600 800"
          fill="none"
          aria-hidden="true"
        >
          {Array.from({ length: 26 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={30 * i + 20}
              x2="600"
              y2={30 * i + 20}
              stroke="#C9A46A"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full border border-[#C9A46A]/60 flex items-center justify-center">
            <span className="font-serif text-[#C9A46A] text-sm">Ω</span>
          </div>
          <span className="text-[#E8E3D8] tracking-[0.2em] text-xs uppercase">
            Ledger
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-serif text-[2.75rem] leading-[1.1] text-[#E8E3D8]">
            Every session,
            <br />
            accounted for.
          </p>
          <p className="mt-6 text-[#8FA79C] text-[15px] leading-relaxed">
            Sign in to pick up exactly where you left off. Your workspace, your
            history, your numbers — kept in order.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[#5C6E66] text-xs">
          <span className="font-serif text-[#C9A46A]">§</span>
          <span>Trusted by finance teams since day one</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-6 py-16 bg-[#F6F3EC] dark:bg-[#0F1613]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-full border border-[#C9A46A] flex items-center justify-center">
              <span className="font-serif text-[#8A6B3B] dark:text-[#C9A46A] text-sm">
                Ω
              </span>
            </div>
            <span className="text-[#2A2620] dark:text-[#E8E3D8] tracking-[0.2em] text-xs uppercase">
              Ledger
            </span>
          </div>

          <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-[#6B655A] dark:text-[#8FA79C] text-sm">
            Sign in with the account your admin set up for you.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C]"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#8A6B3B] dark:text-[#C9A46A] underline underline-offset-4 hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 pr-12 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A6B3B] dark:text-[#C9A46A] hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-[#A3402F] dark:text-[#E0836F]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#211E19] dark:bg-[#C9A46A] text-[#F6F3EC] dark:text-[#0F1613] py-3 text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6B3B] dark:focus-visible:ring-[#C9A46A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F3EC] dark:focus-visible:ring-offset-[#0F1613]"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#D8D2C2] dark:bg-[#2A3A34]" />
            <span className="text-xs text-[#A79F8E] dark:text-[#5C6E66] uppercase tracking-wide">
              or
            </span>
            <div className="h-px flex-1 bg-[#D8D2C2] dark:bg-[#2A3A34]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-6 w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] py-3 text-sm text-[#211E19] dark:text-[#E8E3D8] flex items-center justify-center gap-3 transition-colors hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6B3B] dark:focus-visible:ring-[#C9A46A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F3EC] dark:focus-visible:ring-offset-[#0F1613]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.99-3.11z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-10 text-center text-xs text-[#A79F8E] dark:text-[#5C6E66]">
            By continuing, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-[#6B655A] dark:hover:text-[#8FA79C]"
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-[#6B655A] dark:hover:text-[#8FA79C]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
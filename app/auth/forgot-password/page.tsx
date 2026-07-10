'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Enter the email tied to your account.');
      return;
    }

    setIsSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );
    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSubmitted(true);
  }

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
            Lost the
            <br />
            combination.
          </p>
          <p className="mt-6 text-[#8FA79C] text-[15px] leading-relaxed">
            It happens. Tell us your email and we'll send a link to set a new
            password.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[#5C6E66] text-xs">
          <span className="font-serif text-[#C9A46A]">§</span>
          <span>Links expire after 1 hour, for your security</span>
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

          {submitted ? (
            <div>
              <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
                Check your inbox
              </h1>
              <p className="mt-3 text-[#6B655A] dark:text-[#8FA79C] text-sm leading-relaxed">
                If an account exists for <strong>{email}</strong>, a reset link
                is on its way.
              </p>
              <Link
                href="/auth/login"
                className="mt-8 inline-block text-sm text-[#8A6B3B] dark:text-[#C9A46A] underline underline-offset-4 hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
                Reset your password
              </h1>
              <p className="mt-2 text-[#6B655A] dark:text-[#8FA79C] text-sm">
                Remembered it after all?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#8A6B3B] dark:text-[#C9A46A] underline underline-offset-4 hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
                >
                  Sign in
                </Link>
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-9 space-y-5"
                noValidate
              >
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
                  {isSubmitting ? 'Sending link…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

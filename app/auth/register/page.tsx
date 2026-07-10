'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import {
  validateRegisterForm,
  type RegisterFormValues,
} from '@/lib/validators/register';

const INITIAL_VALUES: RegisterFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, isLoading } = useAuth();

  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // If there's already a live session (restored on refresh, or the
  // user is already signed in and lands here directly), send them home
  // instead of letting them see the register form.
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  function updateField<K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validateRegisterForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    // Supabase Auth only ever handles email + password. Everything
    // else (name, phone) rides along as metadata and is picked up by
    // a database trigger that creates the `profiles` row server-side —
    // the client never inserts into `profiles` directly, and never
    // gets to set `role`.
    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          first_name: values.firstName.trim(),
          middle_name: values.middleName.trim() || null,
          last_name: values.lastName.trim(),
          phone: values.phone.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSubmitted(true);
  }

  async function handleGoogleSignUp() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  // Don't show the register form while we're still checking for an
  // existing session, or once we know there is one and are about to
  // redirect away.
  if (isLoading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F3EC] dark:bg-[#0F1613]">
        <span className="text-sm text-[#6B655A] dark:text-[#8FA79C]">Loading…</span>
      </div>
    );
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
            Open a new
            <br />
            ledger.
          </p>
          <p className="mt-6 text-[#8FA79C] text-[15px] leading-relaxed">
            One account, every workspace. It takes less than a minute to get set
            up.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[#5C6E66] text-xs">
          <span className="font-serif text-[#C9A46A]">§</span>
          <span>Free to start, no card required</span>
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
                We sent a confirmation link to <strong>{values.email}</strong>.
                Follow it to activate your account and sign in.
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
                Create your account
              </h1>
              <p className="mt-2 text-[#6B655A] dark:text-[#8FA79C] text-sm">
                Already registered?{' '}
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={values.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="Jordan"
                      className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={values.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Rivera"
                      className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="middleName"
                    className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
                  >
                    Middle name <span className="normal-case text-[#A79F8E]">(optional)</span>
                  </label>
                  <input
                    id="middleName"
                    type="text"
                    autoComplete="additional-name"
                    value={values.middleName}
                    onChange={(e) => updateField('middleName', e.target.value)}
                    placeholder="Alex"
                    className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 555 010 2938"
                    className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                  />
                </div>

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
                    value={values.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={values.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 pr-12 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A6B3B] dark:text-[#C9A46A] hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password"
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
                  {isSubmitting ? 'Creating account…' : 'Create account'}
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
                onClick={handleGoogleSignUp}
                className="mt-6 w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] py-3 text-sm text-[#211E19] dark:text-[#E8E3D8] flex items-center justify-center gap-3 transition-colors hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6B3B] dark:focus-visible:ring-[#C9A46A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F3EC] dark:focus-visible:ring-offset-[#0F1613]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
                By creating an account, you agree to our{' '}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
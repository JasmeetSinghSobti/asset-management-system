'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    // The invite link's #access_token fragment is picked up automatically
    // by the Supabase client on page load, so there's already a session
    // here — updateUser just attaches the password to it.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC] dark:bg-[#0F1613] px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
          Set your password
        </h1>
        <p className="mt-2 text-[#6B655A] dark:text-[#8FA79C] text-sm">
          You&apos;ve been invited — choose a password to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
            />
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
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-[#A3402F] dark:text-[#E0836F]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#211E19] dark:bg-[#C9A46A] text-[#F6F3EC] dark:text-[#0F1613] py-3 text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6B3B] dark:focus-visible:ring-[#C9A46A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F3EC] dark:focus-visible:ring-offset-[#0F1613]"
          >
            {isSubmitting ? 'Saving…' : 'Set password & continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
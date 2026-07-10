"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checkingLink, setCheckingLink] = useState(true);
  const [linkValid, setLinkValid] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // The recovery link from the email lands here with a token in the
  // URL; supabase-js exchanges it for a temporary session automatically.
  // We just need to confirm that session exists before showing the form.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setLinkValid(true);
        setCheckingLink(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setLinkValid(true);
      }
      setCheckingLink(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Fill in both fields to continue.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
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
              "radial-gradient(circle at 20% 20%, #1C2E27 0%, transparent 45%), radial-gradient(circle at 80% 70%, #1C2E27 0%, transparent 50%)",
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
            A fresh
            <br />
            combination.
          </p>
          <p className="mt-6 text-[#8FA79C] text-[15px] leading-relaxed">
            Choose a new password to get back into your workspace.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[#5C6E66] text-xs">
          <span className="font-serif text-[#C9A46A]">§</span>
          <span>Use at least 8 characters</span>
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

          {checkingLink ? (
            <p className="text-sm text-[#6B655A] dark:text-[#8FA79C]">
              Checking your link…
            </p>
          ) : !linkValid ? (
            <div>
              <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
                Link expired
              </h1>
              <p className="mt-3 text-[#6B655A] dark:text-[#8FA79C] text-sm leading-relaxed">
                This reset link is invalid or has already been used. Request
                a new one to continue.
              </p>
              <Link
                href="/auth/forgot-password"
                className="mt-8 inline-block text-sm text-[#8A6B3B] dark:text-[#C9A46A] underline underline-offset-4 hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
              >
                Request a new link
              </Link>
            </div>
          ) : submitted ? (
            <div>
              <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
                Password updated
              </h1>
              <p className="mt-3 text-[#6B655A] dark:text-[#8FA79C] text-sm leading-relaxed">
                Your password has been changed. Sign in with your new
                password to continue.
              </p>
              <button
                onClick={() => router.replace("/auth/login")}
                className="mt-8 w-full rounded-md bg-[#211E19] dark:bg-[#C9A46A] text-[#F6F3EC] dark:text-[#0F1613] py-3 text-sm tracking-wide transition-opacity hover:opacity-90"
              >
                Go to sign in
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
                Set a new password
              </h1>
              <p className="mt-2 text-[#6B655A] dark:text-[#8FA79C] text-sm">
                Make it something you haven't used before.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-9 space-y-5"
                noValidate
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3 pr-12 text-[#211E19] dark:text-[#E8E3D8] text-[15px] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A6B3B] dark:text-[#C9A46A] hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
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
                  {isSubmitting ? "Updating…" : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
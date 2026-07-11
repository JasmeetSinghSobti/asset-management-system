import Link from 'next/link';

export default function RegisterPage() {
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
          <span className="text-[#E8E3D8] tracking-[0.2em] text-xs uppercase">Ledger</span>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-serif text-[2.75rem] leading-[1.1] text-[#E8E3D8]">
            Every account,
            <br />
            vouched for.
          </p>
          <p className="mt-6 text-[#8FA79C] text-[15px] leading-relaxed">
            Accounts here are provisioned by your admin, not opened at the
            door. It keeps the ledger honest.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[#5C6E66] text-xs">
          <span className="font-serif text-[#C9A46A]">§</span>
          <span>Trusted by finance teams since day one</span>
        </div>
      </div>

      {/* Right panel — invite-only notice */}
      <div className="flex items-center justify-center px-6 py-16 bg-[#F6F3EC] dark:bg-[#0F1613]">
        <div className="w-full max-w-sm text-center">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-full border border-[#C9A46A] flex items-center justify-center">
              <span className="font-serif text-[#8A6B3B] dark:text-[#C9A46A] text-sm">Ω</span>
            </div>
            <span className="text-[#2A2620] dark:text-[#E8E3D8] tracking-[0.2em] text-xs uppercase">
              Ledger
            </span>
          </div>

          <h1 className="font-serif text-[2rem] text-[#211E19] dark:text-[#E8E3D8] leading-tight">
            Registration is invite-only
          </h1>
          <p className="mt-3 text-[#6B655A] dark:text-[#8FA79C] text-sm leading-relaxed">
            Accounts are created by your organization&apos;s admin. If you
            were expecting an invite, check your inbox for an email to set
            your password — otherwise, reach out to your admin.
          </p>

          <Link
            href="/auth/login"
            className="mt-8 inline-block text-sm text-[#8A6B3B] dark:text-[#C9A46A] underline underline-offset-4 hover:text-[#6B5129] dark:hover:text-[#E0BA82]"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
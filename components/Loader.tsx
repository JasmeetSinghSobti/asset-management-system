'use client';

export default function Loader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F3EC] dark:bg-[#0F1613]">
      <div className="flex flex-col items-center gap-6">
        {/* Spinning logo */}
        <div className="relative h-16 w-16">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C9A46A] border-r-[#C9A46A]/40 animate-spin" />

          {/* Inner logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[#8A6B3B] dark:text-[#C9A46A] text-2xl">
              Ω
            </span>
          </div>
        </div>

        {/* Brand name */}
        <span className="font-serif text-[#211E19] dark:text-[#E8E3D8] text-sm tracking-[0.3em] uppercase">
          Ledger
        </span>
      </div>
    </div>
  );
}

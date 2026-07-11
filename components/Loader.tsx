'use client';

export default function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-6">
        {/* Spinning logo */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C9A46A] border-r-[#C9A46A]/40 animate-spin" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[#8A6B3B] dark:text-[#C9A46A] text-2xl">
              Ω
            </span>
          </div>
        </div>

        <span className="font-serif text-[#211E19] dark:text-[#E8E3D8] text-sm tracking-[0.3em] uppercase">
          Ledger
        </span>
      </div>
    </div>
  );
}
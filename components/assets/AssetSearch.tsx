'use client';

import { Search } from 'lucide-react';

interface AssetSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AssetSearch({ value, onChange }: AssetSearchProps) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A79F8E]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by asset name or tag…"
        className="w-full rounded-full border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] py-2.5 pl-10 pr-4 text-sm text-[#211E19] dark:text-[#E8E3D8] placeholder:text-[#A79F8E] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]"
      />
    </div>
  );
}
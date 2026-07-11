'use client';

interface AssetFiltersProps {
  categories: string[];
  statuses: string[];
  locations: string[];
  category: string;
  status: string;
  location: string;
  onCategoryChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onLocationChange: (v: string) => void;
}

const selectClass =
  'rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-3 py-2 text-sm text-[#211E19] dark:text-[#E8E3D8] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]';

export default function AssetFilters({
  categories,
  statuses,
  locations,
  category,
  status,
  location,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
}: AssetFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={selectClass}>
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select value={location} onChange={(e) => onLocationChange(e.target.value)} className={selectClass}>
        <option value="">All locations</option>
        {locations.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
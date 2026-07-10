type AssetStatus = {
  label: string;
  count: number;
  color: string;
};

const STATUS_BREAKDOWN: AssetStatus[] = [
  { label: 'In use', count: 312, color: '#3F7A5C' },
  { label: 'Available', count: 84, color: '#8A6B3B' },
  { label: 'In repair', count: 19, color: '#C9915A' },
  { label: 'Retired', count: 27, color: '#8C8578' },
];

export function AssetStatsCard() {
  const total = STATUS_BREAKDOWN.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.1em] text-[#6B655A] dark:text-[#8FA79C]">
          Assets by status
        </p>
        <p className="font-serif text-lg text-[#211E19] dark:text-[#E8E3D8]">
          {total}
        </p>
      </div>

      {/* Stacked bar */}
      <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-[#EDE8DA] dark:bg-[#0F1613]">
        {STATUS_BREAKDOWN.map((s) => (
          <div
            key={s.label}
            style={{
              width: `${(s.count / total) * 100}%`,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {STATUS_BREAKDOWN.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[#4A453C] dark:text-[#8FA79C]">
                {s.label}
              </span>
            </div>
            <span className="text-[#211E19] dark:text-[#E8E3D8]">
              {s.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

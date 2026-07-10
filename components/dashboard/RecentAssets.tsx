type Asset = {
  id: string;
  name: string;
  category: string;
  status: 'In use' | 'Available' | 'In repair';
  addedOn: string;
};

const RECENT_ASSETS: Asset[] = [
  {
    id: 'AS-2291',
    name: 'MacBook Pro 14"',
    category: 'Laptop',
    status: 'In use',
    addedOn: 'Jul 8',
  },
  {
    id: 'AS-1187',
    name: 'Dell Monitor U2723Q',
    category: 'Monitor',
    status: 'Available',
    addedOn: 'Jul 7',
  },
  {
    id: 'AS-0932',
    name: 'Herman Miller Aeron',
    category: 'Furniture',
    status: 'In use',
    addedOn: 'Jul 6',
  },
  {
    id: 'AS-0871',
    name: 'iPhone 15 Pro',
    category: 'Mobile',
    status: 'In repair',
    addedOn: 'Jul 5',
  },
  {
    id: 'AS-0754',
    name: 'Logitech MX Master 3S',
    category: 'Peripheral',
    status: 'Available',
    addedOn: 'Jul 4',
  },
];

const STATUS_STYLES: Record<Asset['status'], string> = {
  'In use': 'bg-[#3F7A5C]/10 text-[#3F7A5C]',
  Available: 'bg-[#8A6B3B]/10 text-[#8A6B3B] dark:text-[#C9A46A]',
  'In repair': 'bg-[#C9915A]/15 text-[#C9915A]',
};

export function RecentAssets() {
  return (
    <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.1em] text-[#6B655A] dark:text-[#8FA79C]">
          Recently added assets
        </p>
        <a
          href="/dashboard/assets"
          className="text-xs text-[#8A6B3B] dark:text-[#C9A46A] underline underline-offset-4"
        >
          View all
        </a>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-[#A79F8E] border-b border-[#E4DFD1] dark:border-[#2A3A34]">
              <th className="pb-2 font-normal">Asset</th>
              <th className="pb-2 font-normal">Category</th>
              <th className="pb-2 font-normal">Status</th>
              <th className="pb-2 font-normal text-right">Added</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ASSETS.map((asset) => (
              <tr
                key={asset.id}
                className="border-b border-[#E4DFD1] dark:border-[#2A3A34] last:border-b-0"
              >
                <td className="py-2.5">
                  <p className="text-[#211E19] dark:text-[#E8E3D8]">
                    {asset.name}
                  </p>
                  <p className="text-xs text-[#A79F8E]">{asset.id}</p>
                </td>
                <td className="py-2.5 text-[#4A453C] dark:text-[#8FA79C]">
                  {asset.category}
                </td>
                <td className="py-2.5">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs ${
                      STATUS_STYLES[asset.status]
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="py-2.5 text-right text-[#4A453C] dark:text-[#8FA79C]">
                  {asset.addedOn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

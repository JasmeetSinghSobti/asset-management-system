import { Laptop, Monitor, Smartphone, Printer, Armchair, Package } from 'lucide-react';
import type { AssetCategory, AssetStatus } from '@/lib/types/asset';

export const CATEGORY_ICON: Record<AssetCategory, React.ComponentType<{ size?: number }>> = {
  Laptop,
  Desktop: Laptop,
  Monitor,
  Phone: Smartphone,
  Printer,
  Furniture: Armchair,
  Other: Package,
};

export const STATUS_BADGE: Record<AssetStatus, string> = {
  Available: '#3F7A5C',
  Assigned: '#8A6B3B',
  Repair: '#B98A2E',
  Retired: '#6B655A',
};
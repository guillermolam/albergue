import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { FancyCardMeta } from '../shared/FancyCard';
import { ImageCarousel } from './ImageCarousel';
import { WifiAccessCard } from './WifiAccessCard';

export interface Facility {
  id: string;
  title: string;
  description: string;
  detail: string;
  icon?: ReactNode;
  meta?: FancyCardMeta[];
  images?: string[];
  wifi?: { ssid: string; password: string };
}

interface FacilityDetailModalProps {
  facility: Facility | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacilityDetailModal({
  facility,
  open,
  onOpenChange,
}: Readonly<FacilityDetailModalProps>) {
  if (!facility) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-[#1A1A1A] bg-[#FFFFFF]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-sketch">
            {facility.icon && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#00AB39]">
                {facility.icon}
              </span>
            )}
            {facility.title}
          </DialogTitle>
        </DialogHeader>

        {facility.wifi && (
          <WifiAccessCard ssid={facility.wifi.ssid} password={facility.wifi.password} />
        )}

        <ImageCarousel images={facility.images ?? []} alt={facility.title} />

        {facility.meta && facility.meta.length > 0 && (
          <dl className="flex flex-wrap gap-2">
            {facility.meta.map((item) => (
              <div
                key={item.label}
                className="rounded-full border border-[#00AB39]/40 bg-[#E8F5E9] px-3 py-1 text-xs"
              >
                <dt className="inline text-[#5D4E37]/70">{item.label}: </dt>
                <dd className="inline font-semibold text-[#006B26]">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="text-sm leading-relaxed text-[#5D4E37]/80 font-handwritten">
          {facility.detail}
        </p>
      </DialogContent>
    </Dialog>
  );
}

// components/ClanBadge.tsx
'use client';
import Image from 'next/image';

interface ClanBadgeProps {
  badgeId?: number;
  size?: number;
}

export default function ClanBadge({ badgeId, size = 24 }: ClanBadgeProps) {
  if (!badgeId) return null;
  return (
    <Image
      src={`/badges/${badgeId}.png`}
      alt={`Clan badge #${badgeId}`}
      width={size}
      height={size}
    />
  );
}

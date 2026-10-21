// lib/format.ts
// Small display helpers

export const minutesSince = (date: string | Date) =>
  (Date.now() - new Date(date).getTime()) / 60000;

// "3 min ago", "2 h ago", "4 d ago"
export function timeAgo(date: string | Date) {
  const seconds = minutesSince(date) * 60;
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 60) return `${days} d ago`;
  if (days < 730) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// "BE" -> 🇧🇪
export function flag(countryCode?: string) {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

// "20261021T143534.000Z" (API format) -> Date
export const parseApiTime = (raw: string) =>
  new Date(
    raw.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}(\.\d+)?Z)$/,
      '$1-$2-$3T$4:$5:$6'
    )
  );

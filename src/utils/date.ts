import { format, parseISO } from 'date-fns';

// Ko'rsatish uchun sana: 23.07.2026.
export function formatKun(iso: string): string {
  return format(parseISO(iso), 'dd.MM.yyyy');
}

// Kun boshlanishi ISO (vaqt qismisiz taqqoslash uchun).
export function kunBoshi(d: Date): string {
  const nusxa = new Date(d);
  nusxa.setHours(0, 0, 0, 0);
  return nusxa.toISOString();
}

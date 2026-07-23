// Davr oraliqlari va foiz o'zgarishi — sof funksiyalar.

import { endOfMonth, startOfMonth, subMonths } from 'date-fns';

export type DavrTur = 'buOy' | 'otganOy' | 'ucOy';

export interface Oraliq {
  from: string; // ISO (kiritilgan chegara)
  to: string; // ISO (kiritilgan chegara)
}

export interface DavrNatija {
  joriy: Oraliq;
  oldingi: Oraliq; // taqqoslash uchun oldingi teng davr
}

function oraliq(boshi: Date, oxiri: Date): Oraliq {
  return { from: boshi.toISOString(), to: oxiri.toISOString() };
}

// Tanlangan davr uchun joriy va oldingi (taqqoslanadigan) oraliqlarni qaytaradi.
// `now` tashqaridan beriladi — funksiya sof va test qilinadi.
export function davrOraliq(tur: DavrTur, now: Date): DavrNatija {
  if (tur === 'buOy') {
    const oldMonth = subMonths(now, 1);
    return {
      joriy: oraliq(startOfMonth(now), endOfMonth(now)),
      oldingi: oraliq(startOfMonth(oldMonth), endOfMonth(oldMonth)),
    };
  }
  if (tur === 'otganOy') {
    const oy = subMonths(now, 1);
    const oldingiOy = subMonths(now, 2);
    return {
      joriy: oraliq(startOfMonth(oy), endOfMonth(oy)),
      oldingi: oraliq(startOfMonth(oldingiOy), endOfMonth(oldingiOy)),
    };
  }
  // ucOy: joriy oyni ham qo'shib oxirgi 3 oy; oldingi — undan avvalgi 3 oy.
  return {
    joriy: oraliq(startOfMonth(subMonths(now, 2)), endOfMonth(now)),
    oldingi: oraliq(startOfMonth(subMonths(now, 5)), endOfMonth(subMonths(now, 3))),
  };
}

// occurred_at oraliq ichidami (chegaralar kiritilgan).
export function oraliqIchida(occurredAt: string, o: Oraliq): boolean {
  return occurredAt >= o.from && occurredAt <= o.to;
}

// Foiz o'zgarishi: (joriy − oldingi) / |oldingi| * 100.
// Oldingi 0 bo'lsa foiz aniqlanmaydi → null (nol bo'linishdan qochamiz).
export function foizOzgarish(joriy: number, oldingi: number): number | null {
  if (oldingi === 0) {
    return null;
  }
  return ((joriy - oldingi) / Math.abs(oldingi)) * 100;
}

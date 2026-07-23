// Maqsadli fond hisob-kitobi — sof funksiyalar.
//
// Fondga o'tkazish KOCHIRISH turi, xarajat EMAS (CLAUDE.md 7-bo'lim). Fond alohida
// hisob (envelope) sifatida yuritiladi — umumiy xarajat statistikasiga ta'sir qilmaydi.

import { addMonths } from 'date-fns';

import type { FundMovementDirection } from './types';

export interface FondHarakat {
  direction: FundMovementDirection;
  amount: number;
}

// Fondda yig'ilgan summa: qo'shishlar − olishlar.
export function fondYigilgan(harakatlar: FondHarakat[]): number {
  return harakatlar.reduce((s, h) => s + (h.direction === 'qoshish' ? h.amount : -h.amount), 0);
}

export interface FondProgress {
  qolgan: number;
  foiz: number; // 0..100
}

export function fondProgress(yigilgan: number, maqsad: number): FondProgress {
  const qolgan = Math.max(0, maqsad - yigilgan);
  const foiz = maqsad > 0 ? Math.min(100, (yigilgan / maqsad) * 100) : 0;
  return { qolgan, foiz };
}

// Oylik reja asosida maqsadga yetish sanasi.
// Yetgan bo'lsa — now. Reja 0 yoki manfiy bo'lsa — aniqlab bo'lmaydi (null).
export function maqsadSanasi(
  yigilgan: number,
  maqsad: number,
  oylikReja: number,
  now: Date,
): Date | null {
  const qolgan = maqsad - yigilgan;
  if (qolgan <= 0) {
    return now;
  }
  if (oylikReja <= 0) {
    return null;
  }
  const oylar = Math.ceil(qolgan / oylikReja);
  return addMonths(now, oylar);
}

// Zaxira jamg'arma tavsiyasi: oylik zaruriy xarajatning 3 barobari.
export function zaxiraTavsiya(oylikXarajat: number): number {
  return oylikXarajat * 3;
}

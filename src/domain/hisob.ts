// Sof hisob-kitob mantig'i — UI'siz, DB'siz. Test bilan qoplanadi (CLAUDE.md 8-bo'lim).

import type { TransactionType } from './types';

// Hisob-kitob uchun tranzaksiyaning minimal shakli.
export interface HisobTx {
  type: TransactionType;
  amount: number;
}

// Xarajat yig'indisi — FAQAT `chiqim`.
// kochirish (fondga o'tkazish, valyuta almashtirish) va investitsiya xarajat EMAS
// (CLAUDE.md 7-bo'lim). Bu farq buzilmaydi.
export function xarajatYigindisi(txs: HisobTx[]): number {
  return txs.filter((t) => t.type === 'chiqim').reduce((s, t) => s + t.amount, 0);
}

// Kirim yig'indisi — faqat `kirim`.
export function kirimYigindisi(txs: HisobTx[]): number {
  return txs.filter((t) => t.type === 'kirim').reduce((s, t) => s + t.amount, 0);
}

// Sof foyda = kirim − chiqim (kochirish/investitsiya hisobga olinmaydi).
export function sofFoyda(txs: HisobTx[]): number {
  return kirimYigindisi(txs) - xarajatYigindisi(txs);
}

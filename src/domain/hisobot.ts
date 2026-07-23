// Hisobot ma'lumotini tayyorlash — sof funksiyalar (UI'siz, DB'siz). Test bilan qoplanadi.

import type { TransactionType } from './types';

// Hisobot uchun nomlari hal qilingan tranzaksiya.
export interface HisobotTx {
  sana: string;
  tur: TransactionType;
  kategoriya: string;
  hisob: string;
  kontragent: string;
  summa: number;
  izoh: string;
}

// Umumiy jadval: sarlavhalar (tilga bog'liq, tashqaridan) + qatorlar.
export interface Jadval {
  sarlavhalar: string[];
  qatorlar: (string | number)[][];
}

// Kategoriya bo'yicha yig'indi: har kategoriya uchun jami summa va yozuvlar soni.
export interface KategoriyaSatri {
  kategoriya: string;
  jami: number;
  soni: number;
}

export function kategoriyaBoyicha(txs: HisobotTx[]): KategoriyaSatri[] {
  const xarita = new Map<string, KategoriyaSatri>();
  for (const tx of txs) {
    const mavjud = xarita.get(tx.kategoriya) ?? { kategoriya: tx.kategoriya, jami: 0, soni: 0 };
    mavjud.jami += tx.summa;
    mavjud.soni += 1;
    xarita.set(tx.kategoriya, mavjud);
  }
  return [...xarita.values()].sort((a, b) => b.jami - a.jami);
}

// Kontragent bo'yicha hisob-kitob: kirim, chiqim va balans (kirim − chiqim).
export interface KontragentSatri {
  kontragent: string;
  kirim: number;
  chiqim: number;
  balans: number;
}

export function kontragentBoyicha(txs: HisobotTx[]): KontragentSatri[] {
  const xarita = new Map<string, KontragentSatri>();
  for (const tx of txs) {
    if (!tx.kontragent) {
      continue;
    }
    const mavjud = xarita.get(tx.kontragent) ?? {
      kontragent: tx.kontragent,
      kirim: 0,
      chiqim: 0,
      balans: 0,
    };
    if (tx.tur === 'kirim') {
      mavjud.kirim += tx.summa;
    } else if (tx.tur === 'chiqim') {
      mavjud.chiqim += tx.summa;
    }
    mavjud.balans = mavjud.kirim - mavjud.chiqim;
    xarita.set(tx.kontragent, mavjud);
  }
  return [...xarita.values()];
}

// --- Seriyalash ---

function csvMaydon(v: string | number): string {
  const s = String(v);
  // Vergul, qo'shtirnoq yoki yangi qator bo'lsa qo'shtirnoqqa olamiz.
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// Jadvalni CSV matniga aylantiradi (vergul ajratgich, standart — Excel/Sheets mos).
export function toCsv(jadval: Jadval): string {
  const barcha = [jadval.sarlavhalar, ...jadval.qatorlar];
  return barcha.map((qator) => qator.map(csvMaydon).join(',')).join('\n');
}

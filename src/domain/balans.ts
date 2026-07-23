// Hisob qoldig'i va umumiy qoldiq — sof funksiyalar (CLAUDE.md 8-bo'lim).

import type { AccountKind, TransactionType } from './types';

// Balans hisobi uchun tranzaksiyaning minimal shakli.
export interface BalansTx {
  type: TransactionType;
  amount: number;
  account_id: string;
  to_account_id: string | null;
}

// Balans hisobi uchun hisobning minimal shakli.
export interface BalansHisob {
  id: string;
  kind: AccountKind;
  initial_balance: number;
}

// Bitta hisob qoldig'i:
//   boshlang'ich + kirim − chiqim − (chiquvchi kochirish/investitsiya) + (kiruvchi kochirish).
// kochirish/investitsiya xarajat EMAS, lekin ular hisobdan pul CHIQARADI — qoldiqqa ta'sir qiladi.
export function hisobBalansi(hisob: BalansHisob, txs: BalansTx[]): number {
  let balans = hisob.initial_balance;
  for (const t of txs) {
    if (t.account_id === hisob.id) {
      if (t.type === 'kirim') {
        balans += t.amount;
      } else {
        // chiqim, kochirish, investitsiya — hisobdan chiqadi.
        balans -= t.amount;
      }
    }
    // Kochirish maqsad hisobiga tushadi.
    if (t.type === 'kochirish' && t.to_account_id === hisob.id) {
      balans += t.amount;
    }
  }
  return balans;
}

// Barcha hisoblar qoldig'i yig'indisi.
export function umumiyQoldiq(hisoblar: BalansHisob[], txs: BalansTx[]): number {
  return hisoblar.reduce((s, h) => s + hisobBalansi(h, txs), 0);
}

// Hisoblarni ko'rsatish tartibi: NAQD birinchi, keyin karta, bank, valyuta (CLAUDE.md Sprint 3).
const TARTIB: Record<AccountKind, number> = { naqd: 0, karta: 1, bank: 2, valyuta: 3 };

export function hisobTartibi<T extends { kind: AccountKind }>(hisoblar: T[]): T[] {
  return [...hisoblar].sort((a, b) => TARTIB[a.kind] - TARTIB[b.kind]);
}

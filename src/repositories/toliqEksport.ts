// To'liq ma'lumot eksporti uchun xom o'qish. Contour filtri majburiy (CLAUDE.md 2-bo'lim
// 3-qoida) — lekin o'chirilgan (deleted_at) yozuvlar ham qo'shiladi: eksport TO'LIQ bo'lsin
// (CLAUDE.md 2-bo'lim, 5-qoida — hech qanday cheklov yo'q).

import type { SmartaDb } from '../db/db';
import type { Contour } from '../domain/types';

const JADVALLAR = [
  'accounts',
  'categories',
  'transactions',
  'debts',
  'debt_payments',
  'funds',
  'fund_movements',
] as const;

// Konturdagi barcha jadvallarning barcha qatorlari (o'chirilganlar ham).
export async function toliqMalumot(
  db: SmartaDb,
  contour: Contour,
): Promise<Record<string, unknown[]>> {
  const natija: Record<string, unknown[]> = {};
  for (const jadval of JADVALLAR) {
    natija[jadval] = await db.getAllAsync(
      `SELECT * FROM ${jadval} WHERE contour = ? ORDER BY created_at`,
      [contour],
    );
  }
  return natija;
}

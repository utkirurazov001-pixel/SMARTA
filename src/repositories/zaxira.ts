// Ma'lumot zaxirasi tiklash. Eksport qilingan JSON dump'ni bazaga qayta yozadi.
// INSERT OR IGNORE — mavjud id'lar takrorlanmaydi (idempotent, xavfsiz).

import type { SmartaDb, SqlParam } from '../db/db';

// Har jadval uchun ruxsat etilgan ustunlar (SQL injection'dan himoya — kalitlar tekshiriladi).
const USTUNLAR: Record<string, string[]> = {
  accounts: [
    'id',
    'contour',
    'created_at',
    'updated_at',
    'deleted_at',
    'name',
    'kind',
    'currency',
    'initial_balance',
    'sort_order',
  ],
  categories: [
    'id',
    'contour',
    'created_at',
    'updated_at',
    'deleted_at',
    'group_key',
    'key',
    'name',
    'type',
    'sort_order',
    'is_system',
  ],
  transactions: [
    'id',
    'contour',
    'created_at',
    'updated_at',
    'deleted_at',
    'type',
    'amount',
    'account_id',
    'to_account_id',
    'category_id',
    'counterparty',
    'note',
    'occurred_at',
  ],
  debts: [
    'id',
    'contour',
    'created_at',
    'updated_at',
    'deleted_at',
    'direction',
    'counterparty',
    'principal',
    'annual_rate',
    'term_months',
    'payment_type',
    'start_date',
    'due_date',
    'status',
    'note',
  ],
  debt_payments: [
    'id',
    'contour',
    'created_at',
    'updated_at',
    'deleted_at',
    'debt_id',
    'amount',
    'principal_part',
    'interest_part',
    'paid_at',
    'transaction_id',
  ],
  funds: [
    'id',
    'contour',
    'created_at',
    'updated_at',
    'deleted_at',
    'name',
    'template_key',
    'target_amount',
    'monthly_plan',
    'target_date',
  ],
  fund_movements: [
    'id',
    'contour',
    'created_at',
    'updated_at',
    'deleted_at',
    'fund_id',
    'direction',
    'amount',
    'moved_at',
    'transaction_id',
  ],
};

// JSON dump'dan yozuvlarni tiklaydi. Tiklangan qatorlar sonini qaytaradi.
export async function tiklash(db: SmartaDb, dump: Record<string, unknown[]>): Promise<number> {
  let soni = 0;
  for (const [jadval, ruxsat] of Object.entries(USTUNLAR)) {
    const qatorlar = dump[jadval];
    if (!Array.isArray(qatorlar)) {
      continue;
    }
    for (const xom of qatorlar) {
      if (typeof xom !== 'object' || xom === null) {
        continue;
      }
      const row = xom as Record<string, unknown>;
      const cols = ruxsat.filter((c) => c in row);
      if (cols.length === 0) {
        continue;
      }
      const values = cols.map((c) => row[c] as SqlParam);
      const res = await db.runAsync(
        `INSERT OR IGNORE INTO ${jadval} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
        values,
      );
      soni += res.changes;
    }
  }
  return soni;
}

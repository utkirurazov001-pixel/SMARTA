// Repozitoriylar uchun umumiy CRUD asosi.
//
// MUHIM (CLAUDE.md 2-bo'lim 3-qoida, 7-bo'lim): har bir o'qish/yozish funksiyasi
// majburiy `contour` qabul qiladi va so'rovga `WHERE contour = ?` qo'shadi.
// Contour'siz ma'lumot qaytaradigan funksiya bu fayl orqali YOZIB BO'LMAYDI.

import type { SmartaDb, SqlParam } from '../db/db';
import type { BaseRow } from '../db/schema';
import type { Contour } from '../domain/types';
import { newId } from '../utils/id';
import { nowIso } from '../utils/time';

// Entity ustunlari (majburiylardan tashqari) — jadval nomi bilan birga.
export interface EntitySpec {
  table: string;
  // update paytida o'zgartirishga ruxsat etilgan ustunlar (contour/id o'zgarmaydi).
  updatable: readonly string[];
}

function baseInsertFields(contour: Contour): Record<string, SqlParam> {
  const now = nowIso();
  return {
    id: newId(),
    contour,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
}

// Yangi yozuv qo'shadi. `data` — entity'ga xos ustunlar (contour bu yerda emas).
export async function insertEntity<Row extends BaseRow>(
  db: SmartaDb,
  spec: EntitySpec,
  contour: Contour,
  data: Record<string, SqlParam>,
): Promise<Row> {
  const full = { ...baseInsertFields(contour), ...data };
  const cols = Object.keys(full);
  const placeholders = cols.map(() => '?').join(', ');
  const values = cols.map((c) => full[c]);
  await db.runAsync(
    `INSERT INTO ${spec.table} (${cols.join(', ')}) VALUES (${placeholders})`,
    values,
  );
  const created = await getEntityById<Row>(db, spec, contour, String(full.id));
  if (!created) {
    throw new Error(`insertEntity: ${spec.table} yozuvi qo'shilgandan keyin topilmadi`);
  }
  return created;
}

// id bo'yicha bitta yozuv (o'chirilmaganlar). Contour majburiy.
export async function getEntityById<Row extends BaseRow>(
  db: SmartaDb,
  spec: EntitySpec,
  contour: Contour,
  id: string,
): Promise<Row | null> {
  return db.getFirstAsync<Row>(
    `SELECT * FROM ${spec.table} WHERE id = ? AND contour = ? AND deleted_at IS NULL`,
    [id, contour],
  );
}

// Konturdagi barcha yozuvlar (o'chirilmaganlar), eng yangisi birinchi.
export async function listEntities<Row extends BaseRow>(
  db: SmartaDb,
  spec: EntitySpec,
  contour: Contour,
): Promise<Row[]> {
  return db.getAllAsync<Row>(
    `SELECT * FROM ${spec.table} WHERE contour = ? AND deleted_at IS NULL ORDER BY created_at DESC`,
    [contour],
  );
}

// Yozuvni yangilaydi. Faqat `spec.updatable` ustunlari o'zgaradi.
export async function updateEntity<Row extends BaseRow>(
  db: SmartaDb,
  spec: EntitySpec,
  contour: Contour,
  id: string,
  patch: Record<string, SqlParam>,
): Promise<Row | null> {
  const cols = Object.keys(patch).filter((c) => spec.updatable.includes(c));
  if (cols.length === 0) {
    return getEntityById<Row>(db, spec, contour, id);
  }
  const setClause = cols.map((c) => `${c} = ?`).join(', ');
  const values = cols.map((c) => patch[c]);
  await db.runAsync(
    `UPDATE ${spec.table} SET ${setClause}, updated_at = ? WHERE id = ? AND contour = ? AND deleted_at IS NULL`,
    [...values, nowIso(), id, contour],
  );
  return getEntityById<Row>(db, spec, contour, id);
}

// Soft delete — yozuv o'chmaydi, faqat deleted_at belgilanadi (CLAUDE.md 7-bo'lim).
export async function softDeleteEntity(
  db: SmartaDb,
  spec: EntitySpec,
  contour: Contour,
  id: string,
): Promise<boolean> {
  const now = nowIso();
  const res = await db.runAsync(
    `UPDATE ${spec.table} SET deleted_at = ?, updated_at = ? WHERE id = ? AND contour = ? AND deleted_at IS NULL`,
    [now, now, id, contour],
  );
  return res.changes > 0;
}

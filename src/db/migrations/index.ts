// Versiyalangan migratsiya tizimi. Kelajakda schema o'zgarsa, yangi migratsiya
// qo'shiladi — eskilari o'zgarmaydi. `PRAGMA user_version` orqali holat kuzatiladi,
// shuning uchun migratsiya ikki marta ishga tushsa ham xato bermaydi (idempotent).

import type { SmartaDb } from '../db';
import { CREATE_TABLES } from '../schema';

export interface Migration {
  version: number;
  up: string;
}

export const migrations: Migration[] = [
  {
    version: 1,
    up: CREATE_TABLES,
  },
];

async function joriyVersiya(db: SmartaDb): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  return row?.user_version ?? 0;
}

// Qo'llanmagan migratsiyalarni tartib bo'yicha qo'llaydi.
export async function runMigrations(db: SmartaDb): Promise<void> {
  let joriy = await joriyVersiya(db);
  const kutilgan = [...migrations].sort((a, b) => a.version - b.version);

  for (const m of kutilgan) {
    if (m.version > joriy) {
      await db.execAsync(m.up);
      // PRAGMA parametr qabul qilmaydi — versiya raqami migratsiyadan keladi, foydalanuvchidan emas.
      await db.execAsync(`PRAGMA user_version = ${m.version}`);
      joriy = m.version;
    }
  }
}

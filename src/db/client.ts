// Ilova uchun DB ulanishi. Bu fayl expo-sqlite'ni import qiladi — shuning uchun
// faqat ilova kodi tomonidan ishlatiladi (testlar node:sqlite adapteridan foydalanadi).

import * as SQLite from 'expo-sqlite';

import type { RunResult, SmartaDb, SqlParam } from './db';
import { runMigrations } from './migrations';
import { seedInitialData } from './seed';

const DB_NOMI = 'smarta.db';

// expo-sqlite'ni SmartaDb interfeysiga moslashtiradi.
function adaptExpo(db: SQLite.SQLiteDatabase): SmartaDb {
  return {
    execAsync: (sql: string) => db.execAsync(sql),
    runAsync: async (sql: string, params: SqlParam[] = []): Promise<RunResult> => {
      const res = await db.runAsync(sql, params);
      return { lastInsertRowId: res.lastInsertRowId, changes: res.changes };
    },
    getAllAsync: <T>(sql: string, params: SqlParam[] = []) => db.getAllAsync<T>(sql, params),
    getFirstAsync: <T>(sql: string, params: SqlParam[] = []) => db.getFirstAsync<T>(sql, params),
  };
}

let ulanish: SmartaDb | null = null;

// Bazani ochadi, migratsiya va seed'ni bir marta ishga tushiradi.
export async function openSmartaDb(): Promise<SmartaDb> {
  if (ulanish) {
    return ulanish;
  }
  const raw = await SQLite.openDatabaseAsync(DB_NOMI);
  await raw.execAsync('PRAGMA journal_mode = WAL;');
  await raw.execAsync('PRAGMA foreign_keys = ON;');
  const db = adaptExpo(raw);
  await runMigrations(db);
  await seedInitialData(db);
  ulanish = db;
  return db;
}

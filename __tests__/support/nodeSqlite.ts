// Test uchun SmartaDb adapteri — Node'ning ichki node:sqlite moduli ustida.
// Ilova kodi bu faylni import qilmaydi (faqat testlar), shuning uchun node:sqlite
// Metro bundle'iga tushmaydi. Repozitoriylar ilovadagi bilan aynan bir xil kodda sinaladi.

import { DatabaseSync } from 'node:sqlite';

import type { RunResult, SmartaDb, SqlParam } from '../../src/db/db';

export function createNodeTestDb(): SmartaDb {
  const db = new DatabaseSync(':memory:');
  return {
    execAsync: (sql: string) => {
      db.exec(sql);
      return Promise.resolve();
    },
    runAsync: (sql: string, params: SqlParam[] = []): Promise<RunResult> => {
      const res = db.prepare(sql).run(...params);
      return Promise.resolve({
        lastInsertRowId: Number(res.lastInsertRowid),
        changes: Number(res.changes),
      });
    },
    getAllAsync: <T>(sql: string, params: SqlParam[] = []): Promise<T[]> => {
      const rows = db.prepare(sql).all(...params) as T[];
      return Promise.resolve(rows);
    },
    getFirstAsync: <T>(sql: string, params: SqlParam[] = []): Promise<T | null> => {
      const row = db.prepare(sql).get(...params) as T | undefined;
      return Promise.resolve(row ?? null);
    },
  };
}

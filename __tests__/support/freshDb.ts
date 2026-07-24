import { createNodeTestDb } from './nodeSqlite';
import { runMigrations } from '../../src/db/migrations';
import type { SmartaDb } from '../../src/db/db';

// Migratsiya qo'llangan bo'sh test bazasi.
export async function freshDb(): Promise<SmartaDb> {
  const db = createNodeTestDb();
  await runMigrations(db);
  return db;
}

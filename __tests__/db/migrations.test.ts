import { createNodeTestDb } from '../support/nodeSqlite';
import { runMigrations } from '../../src/db/migrations';
import type { SmartaDb } from '../../src/db/db';

const JADVALLAR = [
  'accounts',
  'categories',
  'transactions',
  'debts',
  'debt_payments',
  'funds',
  'fund_movements',
];

async function jadvalBormi(db: SmartaDb, nom: string): Promise<boolean> {
  const row = await db.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    [nom],
  );
  return row !== null;
}

describe('runMigrations', () => {
  it('barcha jadvallarni yaratadi', async () => {
    const db = createNodeTestDb();
    await runMigrations(db);
    for (const t of JADVALLAR) {
      expect(await jadvalBormi(db, t)).toBe(true);
    }
  });

  it('ikki marta ishga tushsa xato bermaydi (idempotent)', async () => {
    const db = createNodeTestDb();
    await runMigrations(db);
    await expect(runMigrations(db)).resolves.toBeUndefined();
    const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    expect(row?.user_version).toBe(1);
  });
});

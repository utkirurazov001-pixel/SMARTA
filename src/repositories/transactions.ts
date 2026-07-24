import type { SmartaDb } from '../db/db';
import type { TransactionRow } from '../db/schema';
import type { Contour, TransactionType } from '../domain/types';
import {
  getEntityById,
  insertEntity,
  listEntities,
  softDeleteEntity,
  updateEntity,
  type EntitySpec,
} from './base';

const SPEC: EntitySpec = {
  table: 'transactions',
  updatable: [
    'type',
    'amount',
    'account_id',
    'to_account_id',
    'category_id',
    'counterparty',
    'note',
    'occurred_at',
  ],
};

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  accountId: string;
  toAccountId?: string | null;
  categoryId?: string | null;
  counterparty?: string | null;
  note?: string | null;
  occurredAt: string;
}

export function createTransaction(
  db: SmartaDb,
  contour: Contour,
  input: CreateTransactionInput,
): Promise<TransactionRow> {
  return insertEntity<TransactionRow>(db, SPEC, contour, {
    type: input.type,
    amount: input.amount,
    account_id: input.accountId,
    to_account_id: input.toAccountId ?? null,
    category_id: input.categoryId ?? null,
    counterparty: input.counterparty ?? null,
    note: input.note ?? null,
    occurred_at: input.occurredAt,
  });
}

export function getTransaction(
  db: SmartaDb,
  contour: Contour,
  id: string,
): Promise<TransactionRow | null> {
  return getEntityById<TransactionRow>(db, SPEC, contour, id);
}

export function listTransactions(db: SmartaDb, contour: Contour): Promise<TransactionRow[]> {
  return listEntities<TransactionRow>(db, SPEC, contour);
}

// Davr bo'yicha (occurred_at oralig'ida) tranzaksiyalar. Contour majburiy.
export function listTransactionsInRange(
  db: SmartaDb,
  contour: Contour,
  fromIso: string,
  toIso: string,
): Promise<TransactionRow[]> {
  return db.getAllAsync<TransactionRow>(
    `SELECT * FROM transactions
     WHERE contour = ? AND deleted_at IS NULL AND occurred_at >= ? AND occurred_at <= ?
     ORDER BY occurred_at DESC`,
    [contour, fromIso, toIso],
  );
}

export function updateTransaction(
  db: SmartaDb,
  contour: Contour,
  id: string,
  patch: Partial<CreateTransactionInput>,
): Promise<TransactionRow | null> {
  return updateEntity<TransactionRow>(db, SPEC, contour, id, {
    ...(patch.type !== undefined ? { type: patch.type } : {}),
    ...(patch.amount !== undefined ? { amount: patch.amount } : {}),
    ...(patch.accountId !== undefined ? { account_id: patch.accountId } : {}),
    ...(patch.toAccountId !== undefined ? { to_account_id: patch.toAccountId } : {}),
    ...(patch.categoryId !== undefined ? { category_id: patch.categoryId } : {}),
    ...(patch.counterparty !== undefined ? { counterparty: patch.counterparty } : {}),
    ...(patch.note !== undefined ? { note: patch.note } : {}),
    ...(patch.occurredAt !== undefined ? { occurred_at: patch.occurredAt } : {}),
  });
}

export function deleteTransaction(db: SmartaDb, contour: Contour, id: string): Promise<boolean> {
  return softDeleteEntity(db, SPEC, contour, id);
}

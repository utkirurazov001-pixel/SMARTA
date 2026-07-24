import type { SmartaDb } from '../db/db';
import type { AccountRow } from '../db/schema';
import type { AccountKind, Contour } from '../domain/types';
import {
  getEntityById,
  insertEntity,
  listEntities,
  softDeleteEntity,
  updateEntity,
  type EntitySpec,
} from './base';

const SPEC: EntitySpec = {
  table: 'accounts',
  updatable: ['name', 'kind', 'currency', 'initial_balance', 'sort_order'],
};

export interface CreateAccountInput {
  name: string;
  kind: AccountKind;
  currency?: string;
  initialBalance?: number;
  sortOrder?: number;
}

export function createAccount(
  db: SmartaDb,
  contour: Contour,
  input: CreateAccountInput,
): Promise<AccountRow> {
  return insertEntity<AccountRow>(db, SPEC, contour, {
    name: input.name,
    kind: input.kind,
    currency: input.currency ?? 'UZS',
    initial_balance: input.initialBalance ?? 0,
    sort_order: input.sortOrder ?? 0,
  });
}

export function getAccount(db: SmartaDb, contour: Contour, id: string): Promise<AccountRow | null> {
  return getEntityById<AccountRow>(db, SPEC, contour, id);
}

export function listAccounts(db: SmartaDb, contour: Contour): Promise<AccountRow[]> {
  return listEntities<AccountRow>(db, SPEC, contour);
}

export function updateAccount(
  db: SmartaDb,
  contour: Contour,
  id: string,
  patch: Partial<CreateAccountInput>,
): Promise<AccountRow | null> {
  return updateEntity<AccountRow>(db, SPEC, contour, id, {
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.kind !== undefined ? { kind: patch.kind } : {}),
    ...(patch.currency !== undefined ? { currency: patch.currency } : {}),
    ...(patch.initialBalance !== undefined ? { initial_balance: patch.initialBalance } : {}),
    ...(patch.sortOrder !== undefined ? { sort_order: patch.sortOrder } : {}),
  });
}

export function deleteAccount(db: SmartaDb, contour: Contour, id: string): Promise<boolean> {
  return softDeleteEntity(db, SPEC, contour, id);
}

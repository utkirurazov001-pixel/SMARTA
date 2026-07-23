import type { SmartaDb } from '../db/db';
import type { DebtRow } from '../db/schema';
import type { Contour, DebtDirection, DebtPaymentType } from '../domain/types';
import {
  getEntityById,
  insertEntity,
  listEntities,
  softDeleteEntity,
  updateEntity,
  type EntitySpec,
} from './base';

const SPEC: EntitySpec = {
  table: 'debts',
  updatable: [
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
};

export interface CreateDebtInput {
  direction: DebtDirection;
  counterparty: string;
  principal: number;
  annualRate?: number;
  termMonths?: number | null;
  paymentType?: DebtPaymentType | null;
  startDate?: string | null;
  dueDate?: string | null;
  note?: string | null;
}

export function createDebt(
  db: SmartaDb,
  contour: Contour,
  input: CreateDebtInput,
): Promise<DebtRow> {
  return insertEntity<DebtRow>(db, SPEC, contour, {
    direction: input.direction,
    counterparty: input.counterparty,
    principal: input.principal,
    annual_rate: input.annualRate ?? 0,
    term_months: input.termMonths ?? null,
    payment_type: input.paymentType ?? null,
    start_date: input.startDate ?? null,
    due_date: input.dueDate ?? null,
    status: 'ochiq',
    note: input.note ?? null,
  });
}

export function getDebt(db: SmartaDb, contour: Contour, id: string): Promise<DebtRow | null> {
  return getEntityById<DebtRow>(db, SPEC, contour, id);
}

export function listDebts(db: SmartaDb, contour: Contour): Promise<DebtRow[]> {
  return listEntities<DebtRow>(db, SPEC, contour);
}

export function listDebtsByDirection(
  db: SmartaDb,
  contour: Contour,
  direction: DebtDirection,
): Promise<DebtRow[]> {
  return db.getAllAsync<DebtRow>(
    `SELECT * FROM debts
     WHERE contour = ? AND deleted_at IS NULL AND direction = ?
     ORDER BY created_at DESC`,
    [contour, direction],
  );
}

export interface UpdateDebtInput extends Partial<CreateDebtInput> {
  status?: 'ochiq' | 'yopilgan';
}

export function updateDebt(
  db: SmartaDb,
  contour: Contour,
  id: string,
  patch: UpdateDebtInput,
): Promise<DebtRow | null> {
  return updateEntity<DebtRow>(db, SPEC, contour, id, {
    ...(patch.direction !== undefined ? { direction: patch.direction } : {}),
    ...(patch.counterparty !== undefined ? { counterparty: patch.counterparty } : {}),
    ...(patch.principal !== undefined ? { principal: patch.principal } : {}),
    ...(patch.annualRate !== undefined ? { annual_rate: patch.annualRate } : {}),
    ...(patch.termMonths !== undefined ? { term_months: patch.termMonths } : {}),
    ...(patch.paymentType !== undefined ? { payment_type: patch.paymentType } : {}),
    ...(patch.startDate !== undefined ? { start_date: patch.startDate } : {}),
    ...(patch.dueDate !== undefined ? { due_date: patch.dueDate } : {}),
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    ...(patch.note !== undefined ? { note: patch.note } : {}),
  });
}

export function deleteDebt(db: SmartaDb, contour: Contour, id: string): Promise<boolean> {
  return softDeleteEntity(db, SPEC, contour, id);
}

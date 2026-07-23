import type { SmartaDb } from '../db/db';
import type { DebtPaymentRow } from '../db/schema';
import type { Contour } from '../domain/types';
import { getEntityById, insertEntity, softDeleteEntity, type EntitySpec } from './base';

const SPEC: EntitySpec = {
  table: 'debt_payments',
  updatable: ['amount', 'principal_part', 'interest_part', 'paid_at', 'transaction_id'],
};

export interface CreateDebtPaymentInput {
  debtId: string;
  amount: number;
  principalPart?: number;
  interestPart?: number;
  paidAt: string;
  transactionId?: string | null;
}

export function createDebtPayment(
  db: SmartaDb,
  contour: Contour,
  input: CreateDebtPaymentInput,
): Promise<DebtPaymentRow> {
  return insertEntity<DebtPaymentRow>(db, SPEC, contour, {
    debt_id: input.debtId,
    amount: input.amount,
    principal_part: input.principalPart ?? 0,
    interest_part: input.interestPart ?? 0,
    paid_at: input.paidAt,
    transaction_id: input.transactionId ?? null,
  });
}

export function getDebtPayment(
  db: SmartaDb,
  contour: Contour,
  id: string,
): Promise<DebtPaymentRow | null> {
  return getEntityById<DebtPaymentRow>(db, SPEC, contour, id);
}

// Bitta qarzning to'lovlari, eng yangisi birinchi. Contour majburiy.
export function listDebtPayments(
  db: SmartaDb,
  contour: Contour,
  debtId: string,
): Promise<DebtPaymentRow[]> {
  return db.getAllAsync<DebtPaymentRow>(
    `SELECT * FROM debt_payments
     WHERE contour = ? AND deleted_at IS NULL AND debt_id = ?
     ORDER BY paid_at DESC`,
    [contour, debtId],
  );
}

export function deleteDebtPayment(db: SmartaDb, contour: Contour, id: string): Promise<boolean> {
  return softDeleteEntity(db, SPEC, contour, id);
}

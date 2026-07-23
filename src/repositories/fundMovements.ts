import type { SmartaDb } from '../db/db';
import type { FundMovementRow } from '../db/schema';
import type { Contour, FundMovementDirection } from '../domain/types';
import { getEntityById, insertEntity, softDeleteEntity, type EntitySpec } from './base';

const SPEC: EntitySpec = {
  table: 'fund_movements',
  updatable: ['direction', 'amount', 'moved_at', 'transaction_id'],
};

export interface CreateFundMovementInput {
  fundId: string;
  direction: FundMovementDirection;
  amount: number;
  movedAt: string;
  transactionId?: string | null;
}

export function createFundMovement(
  db: SmartaDb,
  contour: Contour,
  input: CreateFundMovementInput,
): Promise<FundMovementRow> {
  return insertEntity<FundMovementRow>(db, SPEC, contour, {
    fund_id: input.fundId,
    direction: input.direction,
    amount: input.amount,
    moved_at: input.movedAt,
    transaction_id: input.transactionId ?? null,
  });
}

export function getFundMovement(
  db: SmartaDb,
  contour: Contour,
  id: string,
): Promise<FundMovementRow | null> {
  return getEntityById<FundMovementRow>(db, SPEC, contour, id);
}

// Bitta fondning harakatlari, eng yangisi birinchi. Contour majburiy.
export function listFundMovements(
  db: SmartaDb,
  contour: Contour,
  fundId: string,
): Promise<FundMovementRow[]> {
  return db.getAllAsync<FundMovementRow>(
    `SELECT * FROM fund_movements
     WHERE contour = ? AND deleted_at IS NULL AND fund_id = ?
     ORDER BY moved_at DESC`,
    [contour, fundId],
  );
}

export function deleteFundMovement(db: SmartaDb, contour: Contour, id: string): Promise<boolean> {
  return softDeleteEntity(db, SPEC, contour, id);
}

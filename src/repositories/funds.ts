import type { SmartaDb } from '../db/db';
import type { FundRow } from '../db/schema';
import type { Contour } from '../domain/types';
import {
  getEntityById,
  insertEntity,
  listEntities,
  softDeleteEntity,
  updateEntity,
  type EntitySpec,
} from './base';

const SPEC: EntitySpec = {
  table: 'funds',
  updatable: ['name', 'template_key', 'target_amount', 'monthly_plan', 'target_date'],
};

export interface CreateFundInput {
  name: string;
  templateKey?: string | null;
  targetAmount?: number;
  monthlyPlan?: number;
  targetDate?: string | null;
}

export function createFund(
  db: SmartaDb,
  contour: Contour,
  input: CreateFundInput,
): Promise<FundRow> {
  return insertEntity<FundRow>(db, SPEC, contour, {
    name: input.name,
    template_key: input.templateKey ?? null,
    target_amount: input.targetAmount ?? 0,
    monthly_plan: input.monthlyPlan ?? 0,
    target_date: input.targetDate ?? null,
  });
}

export function getFund(db: SmartaDb, contour: Contour, id: string): Promise<FundRow | null> {
  return getEntityById<FundRow>(db, SPEC, contour, id);
}

export function listFunds(db: SmartaDb, contour: Contour): Promise<FundRow[]> {
  return listEntities<FundRow>(db, SPEC, contour);
}

export function updateFund(
  db: SmartaDb,
  contour: Contour,
  id: string,
  patch: Partial<CreateFundInput>,
): Promise<FundRow | null> {
  return updateEntity<FundRow>(db, SPEC, contour, id, {
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.templateKey !== undefined ? { template_key: patch.templateKey } : {}),
    ...(patch.targetAmount !== undefined ? { target_amount: patch.targetAmount } : {}),
    ...(patch.monthlyPlan !== undefined ? { monthly_plan: patch.monthlyPlan } : {}),
    ...(patch.targetDate !== undefined ? { target_date: patch.targetDate } : {}),
  });
}

export function deleteFund(db: SmartaDb, contour: Contour, id: string): Promise<boolean> {
  return softDeleteEntity(db, SPEC, contour, id);
}

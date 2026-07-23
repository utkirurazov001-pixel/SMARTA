import type { SmartaDb } from '../db/db';
import type { CategoryRow } from '../db/schema';
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
  table: 'categories',
  updatable: ['group_key', 'key', 'name', 'type', 'sort_order', 'is_system'],
};

export interface CreateCategoryInput {
  groupKey: string;
  // Tizim kategoriyasi uchun i18n kaliti; foydalanuvchi kategoriyasi uchun literal nom.
  key?: string | null;
  name?: string | null;
  type?: TransactionType | null;
  sortOrder?: number;
  isSystem?: boolean;
}

export function createCategory(
  db: SmartaDb,
  contour: Contour,
  input: CreateCategoryInput,
): Promise<CategoryRow> {
  return insertEntity<CategoryRow>(db, SPEC, contour, {
    group_key: input.groupKey,
    key: input.key ?? null,
    name: input.name ?? null,
    type: input.type ?? null,
    sort_order: input.sortOrder ?? 0,
    is_system: input.isSystem ? 1 : 0,
  });
}

export function getCategory(
  db: SmartaDb,
  contour: Contour,
  id: string,
): Promise<CategoryRow | null> {
  return getEntityById<CategoryRow>(db, SPEC, contour, id);
}

export function listCategories(db: SmartaDb, contour: Contour): Promise<CategoryRow[]> {
  return listEntities<CategoryRow>(db, SPEC, contour);
}

export function updateCategory(
  db: SmartaDb,
  contour: Contour,
  id: string,
  patch: Partial<CreateCategoryInput>,
): Promise<CategoryRow | null> {
  return updateEntity<CategoryRow>(db, SPEC, contour, id, {
    ...(patch.groupKey !== undefined ? { group_key: patch.groupKey } : {}),
    ...(patch.key !== undefined ? { key: patch.key } : {}),
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.type !== undefined ? { type: patch.type } : {}),
    ...(patch.sortOrder !== undefined ? { sort_order: patch.sortOrder } : {}),
    ...(patch.isSystem !== undefined ? { is_system: patch.isSystem ? 1 : 0 } : {}),
  });
}

export function deleteCategory(db: SmartaDb, contour: Contour, id: string): Promise<boolean> {
  return softDeleteEntity(db, SPEC, contour, id);
}

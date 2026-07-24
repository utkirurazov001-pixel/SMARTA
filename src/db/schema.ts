// Jadval ta'riflari va TypeScript qator turlari.
//
// Har jadvalda majburiy (CLAUDE.md 7-bo'lim): id (uuid), created_at, updated_at,
// deleted_at (soft delete), contour. Pul — butun son (tiyin yo'q, faqat butun so'm).
//
// DDL versiyalangan migratsiya orqali qo'llanadi (migrations/index.ts).

import type {
  AccountKind,
  Contour,
  DebtDirection,
  DebtPaymentType,
  FundMovementDirection,
  TransactionType,
} from '../domain/types';

// Har jadvalda takrorlanadigan majburiy ustunlar.
const MAJBURIY_USTUNLAR = `
  id TEXT PRIMARY KEY NOT NULL,
  contour TEXT NOT NULL CHECK (contour IN ('shaxsiy','biznes')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
`;

export const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS accounts (
  ${MAJBURIY_USTUNLAR},
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('naqd','karta','bank','valyuta')),
  currency TEXT NOT NULL DEFAULT 'UZS',
  initial_balance INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  ${MAJBURIY_USTUNLAR},
  group_key TEXT NOT NULL,
  key TEXT,
  name TEXT,
  type TEXT CHECK (type IN ('kirim','chiqim','kochirish','investitsiya')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_system INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
  ${MAJBURIY_USTUNLAR},
  type TEXT NOT NULL CHECK (type IN ('kirim','chiqim','kochirish','investitsiya')),
  amount INTEGER NOT NULL,
  account_id TEXT NOT NULL,
  to_account_id TEXT,
  category_id TEXT,
  counterparty TEXT,
  note TEXT,
  occurred_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS debts (
  ${MAJBURIY_USTUNLAR},
  direction TEXT NOT NULL CHECK (direction IN ('men_qarzdor','menga_qarzdor')),
  counterparty TEXT NOT NULL,
  principal INTEGER NOT NULL,
  annual_rate REAL NOT NULL DEFAULT 0,
  term_months INTEGER,
  payment_type TEXT CHECK (payment_type IN ('annuitet','differensial','muddatsiz')),
  start_date TEXT,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'ochiq' CHECK (status IN ('ochiq','yopilgan')),
  note TEXT
);

CREATE TABLE IF NOT EXISTS debt_payments (
  ${MAJBURIY_USTUNLAR},
  debt_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  principal_part INTEGER NOT NULL DEFAULT 0,
  interest_part INTEGER NOT NULL DEFAULT 0,
  paid_at TEXT NOT NULL,
  transaction_id TEXT
);

CREATE TABLE IF NOT EXISTS funds (
  ${MAJBURIY_USTUNLAR},
  name TEXT NOT NULL,
  template_key TEXT,
  target_amount INTEGER NOT NULL DEFAULT 0,
  monthly_plan INTEGER NOT NULL DEFAULT 0,
  target_date TEXT
);

CREATE TABLE IF NOT EXISTS fund_movements (
  ${MAJBURIY_USTUNLAR},
  fund_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('qoshish','olish')),
  amount INTEGER NOT NULL,
  moved_at TEXT NOT NULL,
  transaction_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_transactions_contour ON transactions (contour, deleted_at);
CREATE INDEX IF NOT EXISTS idx_categories_contour ON categories (contour, deleted_at);
CREATE INDEX IF NOT EXISTS idx_debts_contour ON debts (contour, deleted_at);
CREATE INDEX IF NOT EXISTS idx_funds_contour ON funds (contour, deleted_at);
`;

// --- Qator turlari (DB'dan qaytadigan shakl) ---

export interface BaseRow {
  id: string;
  contour: Contour;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AccountRow extends BaseRow {
  name: string;
  kind: AccountKind;
  currency: string;
  initial_balance: number;
  sort_order: number;
}

export interface CategoryRow extends BaseRow {
  group_key: string;
  key: string | null;
  name: string | null;
  type: TransactionType | null;
  sort_order: number;
  is_system: number;
}

export interface TransactionRow extends BaseRow {
  type: TransactionType;
  amount: number;
  account_id: string;
  to_account_id: string | null;
  category_id: string | null;
  counterparty: string | null;
  note: string | null;
  occurred_at: string;
}

export interface DebtRow extends BaseRow {
  direction: DebtDirection;
  counterparty: string;
  principal: number;
  annual_rate: number;
  term_months: number | null;
  payment_type: DebtPaymentType | null;
  start_date: string | null;
  due_date: string | null;
  status: 'ochiq' | 'yopilgan';
  note: string | null;
}

export interface DebtPaymentRow extends BaseRow {
  debt_id: string;
  amount: number;
  principal_part: number;
  interest_part: number;
  paid_at: string;
  transaction_id: string | null;
}

export interface FundRow extends BaseRow {
  name: string;
  template_key: string | null;
  target_amount: number;
  monthly_plan: number;
  target_date: string | null;
}

export interface FundMovementRow extends BaseRow {
  fund_id: string;
  direction: FundMovementDirection;
  amount: number;
  moved_at: string;
  transaction_id: string | null;
}

import { freshDb } from '../support/freshDb';
import {
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
  updateAccount,
} from '../../src/repositories/accounts';
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from '../../src/repositories/transactions';
import { createDebt, listDebts, updateDebt } from '../../src/repositories/debts';
import { createDebtPayment, listDebtPayments } from '../../src/repositories/debtPayments';
import { createFund, listFunds } from '../../src/repositories/funds';
import { createFundMovement, listFundMovements } from '../../src/repositories/fundMovements';

describe('accounts CRUD', () => {
  it('yaratadi, oqiydi, yangilaydi, soft-delete qiladi', async () => {
    const db = await freshDb();
    const acc = await createAccount(db, 'shaxsiy', { name: 'Naqd', kind: 'naqd' });
    expect(acc.id).toBeTruthy();
    expect(acc.contour).toBe('shaxsiy');

    const found = await getAccount(db, 'shaxsiy', acc.id);
    expect(found?.name).toBe('Naqd');

    const updated = await updateAccount(db, 'shaxsiy', acc.id, { name: 'Karta', kind: 'karta' });
    expect(updated).not.toBeNull();
    if (!updated) {
      throw new Error('updated null boʻlmasligi kerak');
    }
    expect(updated.name).toBe('Karta');
    expect(updated.kind).toBe('karta');
    // updated_at yaratilgandan oldin emas (teng yoki keyin).
    expect(updated.updated_at >= acc.updated_at).toBe(true);

    const removed = await deleteAccount(db, 'shaxsiy', acc.id);
    expect(removed).toBe(true);
    expect(await getAccount(db, 'shaxsiy', acc.id)).toBeNull();
    expect(await listAccounts(db, 'shaxsiy')).toHaveLength(0);
  });
});

describe('transactions CRUD', () => {
  it('yaratadi va ochiradi', async () => {
    const db = await freshDb();
    const acc = await createAccount(db, 'biznes', { name: 'Bank', kind: 'bank' });
    const tx = await createTransaction(db, 'biznes', {
      type: 'chiqim',
      amount: 150000,
      accountId: acc.id,
      occurredAt: '2026-07-01T10:00:00.000Z',
    });
    expect(tx.amount).toBe(150000);
    expect(await listTransactions(db, 'biznes')).toHaveLength(1);

    const upd = await updateTransaction(db, 'biznes', tx.id, { amount: 200000 });
    expect(upd?.amount).toBe(200000);

    await deleteTransaction(db, 'biznes', tx.id);
    expect(await listTransactions(db, 'biznes')).toHaveLength(0);
  });
});

describe('debts + payments CRUD', () => {
  it('qarz va tolov yaratadi', async () => {
    const db = await freshDb();
    const debt = await createDebt(db, 'shaxsiy', {
      direction: 'men_qarzdor',
      counterparty: 'Bank',
      principal: 10000000,
      annualRate: 24,
    });
    expect(await listDebts(db, 'shaxsiy')).toHaveLength(1);

    const pay = await createDebtPayment(db, 'shaxsiy', {
      debtId: debt.id,
      amount: 500000,
      principalPart: 300000,
      interestPart: 200000,
      paidAt: '2026-07-10T00:00:00.000Z',
    });
    expect(pay.debt_id).toBe(debt.id);
    expect(await listDebtPayments(db, 'shaxsiy', debt.id)).toHaveLength(1);

    const closed = await updateDebt(db, 'shaxsiy', debt.id, { status: 'yopilgan' });
    expect(closed?.status).toBe('yopilgan');
  });
});

describe('funds + movements CRUD', () => {
  it('fond va harakat yaratadi', async () => {
    const db = await freshDb();
    const fund = await createFund(db, 'shaxsiy', { name: 'Umra', targetAmount: 30000000 });
    expect(await listFunds(db, 'shaxsiy')).toHaveLength(1);

    const mv = await createFundMovement(db, 'shaxsiy', {
      fundId: fund.id,
      direction: 'qoshish',
      amount: 1000000,
      movedAt: '2026-07-15T00:00:00.000Z',
    });
    expect(mv.direction).toBe('qoshish');
    expect(await listFundMovements(db, 'shaxsiy', fund.id)).toHaveLength(1);
  });
});

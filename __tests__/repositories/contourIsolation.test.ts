import { freshDb } from '../support/freshDb';
import {
  createTransaction,
  getTransaction,
  listTransactions,
} from '../../src/repositories/transactions';
import { createAccount, getAccount } from '../../src/repositories/accounts';

// CLAUDE.md 2-bo'lim 3-qoida: biznes rejimi shaxsiy kontur ma'lumotini KO'RA OLMAYDI.
// Bu so'rov darajasidagi cheklov — quyida isbotlanadi.
describe('contour izolyatsiyasi', () => {
  it('biznes sorovi shaxsiy tranzaksiyani QAYTARMAYDI', async () => {
    const db = await freshDb();
    const shaxsiyAcc = await createAccount(db, 'shaxsiy', { name: 'Naqd', kind: 'naqd' });
    const biznesAcc = await createAccount(db, 'biznes', { name: 'Bank', kind: 'bank' });

    const shaxsiyTx = await createTransaction(db, 'shaxsiy', {
      type: 'chiqim',
      amount: 50000,
      accountId: shaxsiyAcc.id,
      occurredAt: '2026-07-01T00:00:00.000Z',
    });
    await createTransaction(db, 'biznes', {
      type: 'kirim',
      amount: 900000,
      accountId: biznesAcc.id,
      occurredAt: '2026-07-01T00:00:00.000Z',
    });

    const biznesTx = await listTransactions(db, 'biznes');
    expect(biznesTx).toHaveLength(1);
    expect(biznesTx.every((t) => t.contour === 'biznes')).toBe(true);
    expect(biznesTx.some((t) => t.id === shaxsiyTx.id)).toBe(false);

    // id bo'yicha ham: biznes konturi shaxsiy yozuvni id bilan ham ololmaydi.
    expect(await getTransaction(db, 'biznes', shaxsiyTx.id)).toBeNull();
    expect(await getAccount(db, 'biznes', shaxsiyAcc.id)).toBeNull();
  });

  it('shaxsiy sorovi biznes yozuvini QAYTARMAYDI', async () => {
    const db = await freshDb();
    const biznesAcc = await createAccount(db, 'biznes', { name: 'Bank', kind: 'bank' });
    const biznesTx = await createTransaction(db, 'biznes', {
      type: 'kirim',
      amount: 100000,
      accountId: biznesAcc.id,
      occurredAt: '2026-07-01T00:00:00.000Z',
    });

    expect(await listTransactions(db, 'shaxsiy')).toHaveLength(0);
    expect(await getTransaction(db, 'shaxsiy', biznesTx.id)).toBeNull();
  });
});

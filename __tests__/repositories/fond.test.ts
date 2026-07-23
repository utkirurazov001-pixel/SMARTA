import { freshDb } from '../support/freshDb';
import { createAccount } from '../../src/repositories/accounts';
import { createTransaction, listTransactions } from '../../src/repositories/transactions';
import { createFund } from '../../src/repositories/funds';
import { createFundMovement, listFundMovements } from '../../src/repositories/fundMovements';
import { fondYigilgan } from '../../src/domain/fond';
import { xarajatYigindisi } from '../../src/domain/hisob';

// CLAUDE.md Sprint 5 mezoni: fondga o'tkazish umumiy xarajat statistikasiga qo'shilmaydi.
describe('fond harakati xarajatga qoshilmaydi', () => {
  it('fondga qoshilgan pul chiqim statistikasiga tushmaydi', async () => {
    const db = await freshDb();
    const acc = await createAccount(db, 'shaxsiy', { name: 'Naqd', kind: 'naqd' });

    // Haqiqiy xarajat: 100 000.
    await createTransaction(db, 'shaxsiy', {
      type: 'chiqim',
      amount: 100000,
      accountId: acc.id,
      occurredAt: '2026-07-01T00:00:00.000Z',
    });

    // Fondga 500 000 qo'shildi (alohida daftar — tranzaksiya jurnaliga tushmaydi).
    const fund = await createFund(db, 'shaxsiy', { name: 'Umra', targetAmount: 30000000 });
    await createFundMovement(db, 'shaxsiy', {
      fundId: fund.id,
      direction: 'qoshish',
      amount: 500000,
      movedAt: '2026-07-02T00:00:00.000Z',
    });

    const txs = await listTransactions(db, 'shaxsiy');
    // Xarajat faqat 100 000 — fondga o'tkazish qo'shilmagan.
    expect(xarajatYigindisi(txs)).toBe(100000);

    const harakatlar = await listFundMovements(db, 'shaxsiy', fund.id);
    expect(fondYigilgan(harakatlar)).toBe(500000);
  });
});

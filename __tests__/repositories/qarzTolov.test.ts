import { freshDb } from '../support/freshDb';
import { createAccount } from '../../src/repositories/accounts';
import { createDebt, getDebt } from '../../src/repositories/debts';
import { listDebtPayments } from '../../src/repositories/debtPayments';
import { listTransactions } from '../../src/repositories/transactions';
import { qarzTolovQoshish } from '../../src/repositories/qarzTolov';

async function tayyorla() {
  const db = await freshDb();
  const acc = await createAccount(db, 'shaxsiy', { name: 'Naqd', kind: 'naqd' });
  const debt = await createDebt(db, 'shaxsiy', {
    direction: 'men_qarzdor',
    counterparty: 'Bank',
    principal: 10000000,
    annualRate: 24,
  });
  return { db, acc, debt };
}

describe('qarzTolovQoshish', () => {
  it('tolov ham qarz jurnaliga, ham asosiy jurnalga tushadi', async () => {
    const { db, acc, debt } = await tayyorla();
    const natija = await qarzTolovQoshish(db, 'shaxsiy', {
      debtId: debt.id,
      hisobId: acc.id,
      tolov: 500000,
      sana: '2026-07-10T00:00:00.000Z',
    });

    // Foiz/asosiy taqsimoti: 200 000 foiz, 300 000 asosiy.
    expect(natija.payment.interest_part).toBe(200000);
    expect(natija.payment.principal_part).toBe(300000);

    // Asosiy jurnalda bitta chiqim paydo boldi va to'lovga bog'langan.
    const txs = await listTransactions(db, 'shaxsiy');
    expect(txs).toHaveLength(1);
    expect(txs[0].type).toBe('chiqim');
    expect(txs[0].amount).toBe(500000);
    expect(natija.payment.transaction_id).toBe(txs[0].id);

    expect(await listDebtPayments(db, 'shaxsiy', debt.id)).toHaveLength(1);
  });

  it('menga qarzdor holatida qaytim kirim sifatida tushadi', async () => {
    const db = await freshDb();
    const acc = await createAccount(db, 'biznes', { name: 'Kassa', kind: 'naqd' });
    const debt = await createDebt(db, 'biznes', {
      direction: 'menga_qarzdor',
      counterparty: 'Mijoz',
      principal: 2000000,
      annualRate: 0,
    });
    await qarzTolovQoshish(db, 'biznes', {
      debtId: debt.id,
      hisobId: acc.id,
      tolov: 500000,
      sana: '2026-07-10T00:00:00.000Z',
    });
    const txs = await listTransactions(db, 'biznes');
    expect(txs[0].type).toBe('kirim');
  });

  it('qoldiq toliq yopilsa qarz statusi yopilgan boladi', async () => {
    const db = await freshDb();
    const acc = await createAccount(db, 'shaxsiy', { name: 'Naqd', kind: 'naqd' });
    const debt = await createDebt(db, 'shaxsiy', {
      direction: 'men_qarzdor',
      counterparty: 'Dokon',
      principal: 1000000,
      annualRate: 0,
    });
    const natija = await qarzTolovQoshish(db, 'shaxsiy', {
      debtId: debt.id,
      hisobId: acc.id,
      tolov: 1000000,
      sana: '2026-07-10T00:00:00.000Z',
    });
    expect(natija.yopildi).toBe(true);
    expect((await getDebt(db, 'shaxsiy', debt.id))?.status).toBe('yopilgan');
  });
});

import { freshDb } from '../support/freshDb';
import { createAccount, listAccounts } from '../../src/repositories/accounts';
import { createTransaction, listTransactions } from '../../src/repositories/transactions';
import { toliqMalumot } from '../../src/repositories/toliqEksport';
import { tiklash } from '../../src/repositories/zaxira';

describe('zaxira: eksport -> tiklash', () => {
  it('bir bazadan olib boshqasiga tiklaydi', async () => {
    const manba = await freshDb();
    const acc = await createAccount(manba, 'shaxsiy', { name: 'Naqd', kind: 'naqd' });
    await createTransaction(manba, 'shaxsiy', {
      type: 'chiqim',
      amount: 123000,
      accountId: acc.id,
      occurredAt: '2026-07-01T00:00:00.000Z',
    });
    const dump = await toliqMalumot(manba, 'shaxsiy');

    const yangi = await freshDb();
    const soni = await tiklash(yangi, dump);
    expect(soni).toBeGreaterThan(0);

    const txs = await listTransactions(yangi, 'shaxsiy');
    expect(txs).toHaveLength(1);
    expect(txs[0].amount).toBe(123000);
    // Hisob ham tiklandi (naqd urug' + tiklangan).
    expect((await listAccounts(yangi, 'shaxsiy')).some((a) => a.id === acc.id)).toBe(true);
  });

  it('ikki marta tiklansa takrorlamaydi (INSERT OR IGNORE)', async () => {
    const manba = await freshDb();
    const acc = await createAccount(manba, 'biznes', { name: 'Bank', kind: 'bank' });
    await createTransaction(manba, 'biznes', {
      type: 'kirim',
      amount: 500000,
      accountId: acc.id,
      occurredAt: '2026-07-01T00:00:00.000Z',
    });
    const dump = await toliqMalumot(manba, 'biznes');

    const yangi = await freshDb();
    await tiklash(yangi, dump);
    await tiklash(yangi, dump);
    expect(await listTransactions(yangi, 'biznes')).toHaveLength(1);
  });
});

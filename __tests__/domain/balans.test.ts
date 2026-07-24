import {
  hisobBalansi,
  hisobTartibi,
  umumiyQoldiq,
  type BalansHisob,
  type BalansTx,
} from '../../src/domain/balans';

const naqd: BalansHisob = { id: 'a1', kind: 'naqd', initial_balance: 1000000 };
const karta: BalansHisob = { id: 'a2', kind: 'karta', initial_balance: 0 };

const txs: BalansTx[] = [
  { type: 'kirim', amount: 500000, account_id: 'a1', to_account_id: null },
  { type: 'chiqim', amount: 200000, account_id: 'a1', to_account_id: null },
  { type: 'kochirish', amount: 300000, account_id: 'a1', to_account_id: 'a2' }, // a1 dan a2 ga
];

describe('hisobBalansi', () => {
  it('kirim qoshadi, chiqim va chiquvchi kochirish ayiradi', () => {
    // 1000000 + 500000 - 200000 - 300000 = 1000000
    expect(hisobBalansi(naqd, txs)).toBe(1000000);
  });

  it('kiruvchi kochirishni qoshadi', () => {
    // 0 + 300000 (a1 dan kelgan) = 300000
    expect(hisobBalansi(karta, txs)).toBe(300000);
  });
});

describe('umumiyQoldiq', () => {
  it('barcha hisoblar yigindisi', () => {
    expect(umumiyQoldiq([naqd, karta], txs)).toBe(1300000);
  });
});

describe('hisobTartibi', () => {
  it('NAQD birinchi keladi', () => {
    const tartiblangan = hisobTartibi([
      { kind: 'bank' as const },
      { kind: 'naqd' as const },
      { kind: 'karta' as const },
    ]);
    expect(tartiblangan.map((h) => h.kind)).toEqual(['naqd', 'karta', 'bank']);
  });
});

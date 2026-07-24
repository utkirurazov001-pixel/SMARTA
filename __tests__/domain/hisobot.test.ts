import {
  kategoriyaBoyicha,
  kontragentBoyicha,
  toCsv,
  type HisobotTx,
} from '../../src/domain/hisobot';

function tx(p: Partial<HisobotTx>): HisobotTx {
  return {
    sana: '2026-07-01',
    tur: 'chiqim',
    kategoriya: 'Transport',
    hisob: 'Naqd',
    kontragent: '',
    summa: 100000,
    izoh: '',
    ...p,
  };
}

describe('kategoriyaBoyicha', () => {
  it('kategoriya boyicha yigadi va kamayish tartibida beradi', () => {
    const r = kategoriyaBoyicha([
      tx({ kategoriya: 'Transport', summa: 100000 }),
      tx({ kategoriya: 'Transport', summa: 50000 }),
      tx({ kategoriya: 'Oziq-ovqat', summa: 300000 }),
    ]);
    expect(r[0]).toEqual({ kategoriya: 'Oziq-ovqat', jami: 300000, soni: 1 });
    expect(r[1]).toEqual({ kategoriya: 'Transport', jami: 150000, soni: 2 });
  });
});

describe('kontragentBoyicha', () => {
  it('kirim/chiqim/balansni hisoblaydi', () => {
    const r = kontragentBoyicha([
      tx({ kontragent: 'Ali', tur: 'kirim', summa: 500000 }),
      tx({ kontragent: 'Ali', tur: 'chiqim', summa: 200000 }),
    ]);
    expect(r[0]).toEqual({ kontragent: 'Ali', kirim: 500000, chiqim: 200000, balans: 300000 });
  });
  it('kontragentsiz yozuvni tashlab ketadi', () => {
    expect(kontragentBoyicha([tx({ kontragent: '' })])).toHaveLength(0);
  });
});

describe('toCsv', () => {
  it('sarlavha va qatorlarni beradi', () => {
    const csv = toCsv({ sarlavhalar: ['a', 'b'], qatorlar: [['1', '2']] });
    expect(csv).toBe('a,b\n1,2');
  });
  it('vergul va qoshtirnoqni ekranlaydi', () => {
    const csv = toCsv({ sarlavhalar: ['x'], qatorlar: [['Ali, Vali']] });
    expect(csv).toBe('x\n"Ali, Vali"');
  });
  it('1000 qatorni ishlaydi', () => {
    const qatorlar = Array.from({ length: 1000 }, (_, i) => [i, `k${i}`]);
    const csv = toCsv({ sarlavhalar: ['n', 'k'], qatorlar });
    expect(csv.split('\n')).toHaveLength(1001);
  });
});

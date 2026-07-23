import {
  fondProgress,
  fondYigilgan,
  maqsadSanasi,
  zaxiraTavsiya,
  type FondHarakat,
} from '../../src/domain/fond';

describe('fondYigilgan', () => {
  it('qoshish va olishni hisobga oladi', () => {
    const h: FondHarakat[] = [
      { direction: 'qoshish', amount: 1000000 },
      { direction: 'qoshish', amount: 500000 },
      { direction: 'olish', amount: 300000 },
    ];
    expect(fondYigilgan(h)).toBe(1200000);
  });
});

describe('fondProgress', () => {
  it('qolgan va foizni hisoblaydi', () => {
    expect(fondProgress(3000000, 10000000)).toEqual({ qolgan: 7000000, foiz: 30 });
  });
  it('maqsaddan oshsa foiz 100 va qolgan 0', () => {
    const p = fondProgress(12000000, 10000000);
    expect(p.qolgan).toBe(0);
    expect(p.foiz).toBe(100);
  });
  it('maqsad 0 bolsa foiz 0', () => {
    expect(fondProgress(0, 0)).toEqual({ qolgan: 0, foiz: 0 });
  });
});

describe('maqsadSanasi', () => {
  const now = new Date('2026-07-15T00:00:00.000Z');
  it('oylik reja asosida sanani beradi', () => {
    // qolgan 7 000 000, reja 1 000 000/oy -> 7 oy -> 2027-02
    const sana = maqsadSanasi(3000000, 10000000, 1000000, now);
    expect(sana?.toISOString().slice(0, 7)).toBe('2027-02');
  });
  it('reja 0 bolsa null', () => {
    expect(maqsadSanasi(3000000, 10000000, 0, now)).toBeNull();
  });
  it('allaqachon yetgan bolsa now', () => {
    expect(maqsadSanasi(10000000, 10000000, 500000, now)).toEqual(now);
  });
});

describe('zaxiraTavsiya', () => {
  it('oylik xarajatning 3 barobari', () => {
    expect(zaxiraTavsiya(2000000)).toBe(6000000);
  });
});

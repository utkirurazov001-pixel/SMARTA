import {
  annuitetTolov,
  ertaYopish,
  oylikFoizSumma,
  qarzQoldigi,
  tolovKamaytiradimi,
  tolovTaqsimot,
} from '../../src/domain/qarz';

describe('oylikFoizSumma', () => {
  it('yillik stavkani oyga boladi', () => {
    // 10 000 000 * 24% / 12 = 200 000
    expect(oylikFoizSumma(10000000, 24)).toBe(200000);
  });
  it('0% stavkada 0', () => {
    expect(oylikFoizSumma(10000000, 0)).toBe(0);
  });
});

describe('qarzQoldigi', () => {
  it('tolangan asosiy qismlarni ayiradi', () => {
    expect(qarzQoldigi(10000000, [{ principal_part: 300000 }, { principal_part: 200000 }])).toBe(
      9500000,
    );
  });
  it('toliq yopilgan qarz 0', () => {
    expect(qarzQoldigi(1000000, [{ principal_part: 1000000 }])).toBe(0);
  });
});

describe('tolovTaqsimot', () => {
  it('avval foizni, keyin asosiyni qoplaydi', () => {
    const { foizQismi, asosiyQismi } = tolovTaqsimot(10000000, 24, 500000);
    expect(foizQismi).toBe(200000);
    expect(asosiyQismi).toBe(300000);
  });
  it('tolov foizdan kam bolsa asosiy 0', () => {
    const { foizQismi, asosiyQismi } = tolovTaqsimot(10000000, 24, 150000);
    expect(foizQismi).toBe(150000);
    expect(asosiyQismi).toBe(0);
  });
});

describe('tolovKamaytiradimi (ogohlantirish)', () => {
  it('tolov foizdan katta bolsa qarz kamayadi', () => {
    expect(tolovKamaytiradimi(10000000, 24, 500000)).toBe(true);
  });
  it('tolov foizga teng yoki kam bolsa qarz kamaymaydi', () => {
    expect(tolovKamaytiradimi(10000000, 24, 200000)).toBe(false);
    expect(tolovKamaytiradimi(10000000, 24, 150000)).toBe(false);
  });
});

describe('ertaYopish', () => {
  it('qolda hisoblangan namuna bilan mos (24%, 500k/oy)', () => {
    // Q=10 000 000, i=0.02, P=500 000 -> n ≈ 25.8 -> 26 oy, foiz ≈ 2 898 000
    const r = ertaYopish(10000000, 24, 500000);
    expect(r).not.toBeNull();
    expect(r?.oylar).toBe(26);
    // ±2% ichida
    const kutilgan = 2898000;
    expect(Math.abs((r?.jamiFoiz ?? 0) - kutilgan) / kutilgan).toBeLessThan(0.02);
  });

  it('0% stavkada oylar = qoldiq/tolov, foiz 0', () => {
    const r = ertaYopish(1200000, 0, 100000);
    expect(r).toEqual({ oylar: 12, jamiFoiz: 0 });
  });

  it('tolov oylik foizdan kam bolsa null (qarz yopilmaydi)', () => {
    expect(ertaYopish(10000000, 24, 150000)).toBeNull();
  });

  it('qoldiq 0 bolsa null', () => {
    expect(ertaYopish(0, 24, 500000)).toBeNull();
  });
});

describe('annuitetTolov', () => {
  it('muddatsiz (0 oy) qarzda 0', () => {
    expect(annuitetTolov(10000000, 24, 0)).toBe(0);
  });
  it('0% stavkada teng bolib tolanadi', () => {
    expect(annuitetTolov(1200000, 0, 12)).toBe(100000);
  });
  it('foizli qarzda foizdan katta tolov chiqadi', () => {
    const p = annuitetTolov(10000000, 24, 24);
    expect(p).toBeGreaterThan(oylikFoizSumma(10000000, 24));
  });
});

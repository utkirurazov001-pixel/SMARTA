import { davrOraliq, foizOzgarish, oraliqIchida } from '../../src/domain/davr';

describe('davrOraliq', () => {
  const now = new Date('2026-07-15T12:00:00.000Z');

  it('buOy: joriy iyul, oldingi iyun', () => {
    const d = davrOraliq('buOy', now);
    expect(d.joriy.from.slice(0, 7)).toBe('2026-07');
    expect(d.oldingi.from.slice(0, 7)).toBe('2026-06');
  });

  it('otganOy: joriy iyun, oldingi may', () => {
    const d = davrOraliq('otganOy', now);
    expect(d.joriy.from.slice(0, 7)).toBe('2026-06');
    expect(d.oldingi.from.slice(0, 7)).toBe('2026-05');
  });

  it('ucOy: joriy may boshidan, oldingi undan avvalgi 3 oy', () => {
    const d = davrOraliq('ucOy', now);
    expect(d.joriy.from.slice(0, 7)).toBe('2026-05');
    expect(d.oldingi.from.slice(0, 7)).toBe('2026-02');
  });
});

describe('oraliqIchida', () => {
  const o = { from: '2026-07-01T00:00:00.000Z', to: '2026-07-31T23:59:59.999Z' };
  it('ichidagi sanani topadi', () => {
    expect(oraliqIchida('2026-07-15T00:00:00.000Z', o)).toBe(true);
  });
  it('tashqaridagi sanani rad etadi', () => {
    expect(oraliqIchida('2026-08-01T00:00:00.000Z', o)).toBe(false);
  });
});

describe('foizOzgarish', () => {
  it('oshishni foizda beradi', () => {
    expect(foizOzgarish(150, 100)).toBe(50);
  });
  it('kamayishni manfiy beradi', () => {
    expect(foizOzgarish(80, 100)).toBeCloseTo(-20);
  });
  it('oldingi 0 bolsa null', () => {
    expect(foizOzgarish(100, 0)).toBeNull();
  });
});

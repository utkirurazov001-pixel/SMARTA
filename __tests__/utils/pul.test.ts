import { NIQOB, pulMatni } from '../../src/utils/pul';

const B = { mln: 'mln', mlrd: 'mlrd' };

// CLAUDE.md Sprint 3 mezoni: yashirish tugmasi ekrandagi hech bir raqamni ochiq qoldirmaydi.
// Butun ilova pul ko'rsatishda shu funksiyaga tayanadi, shuning uchun bu yerda isbotlanadi.
describe('pulMatni — yashirin holat', () => {
  const summalar = [0, 999, 1500, 1500000, 22000000, 2300000000, -5000000];

  it('yashirin bolganda hech qanday raqam qaytarmaydi', () => {
    for (const s of summalar) {
      const matn = pulMatni(s, { yashirin: true, qisqa: true, birlik: B });
      expect(matn).toBe(NIQOB);
      expect(/[0-9]/.test(matn)).toBe(false);
    }
  });

  it('ochiq bolganda haqiqiy summani korsatadi', () => {
    expect(pulMatni(22000000, { yashirin: false, qisqa: true, birlik: B })).toBe('22,0 mln');
    expect(pulMatni(1500, { yashirin: false })).toBe('1 500');
  });
});

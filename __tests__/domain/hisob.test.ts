import { kirimYigindisi, sofFoyda, xarajatYigindisi, type HisobTx } from '../../src/domain/hisob';

const txs: HisobTx[] = [
  { type: 'kirim', amount: 1000000 },
  { type: 'chiqim', amount: 300000 },
  { type: 'chiqim', amount: 200000 },
  { type: 'kochirish', amount: 500000 }, // fondga o'tkazish — xarajat EMAS
  { type: 'investitsiya', amount: 400000 }, // investitsiya — xarajat EMAS
];

describe('hisob-kitob: kochirish/investitsiya xarajat EMAS', () => {
  it('xarajat yigindisi faqat chiqimni sanaydi', () => {
    expect(xarajatYigindisi(txs)).toBe(500000);
  });

  it('kochirish xarajatga qoshilmaydi', () => {
    const faqatKochirish: HisobTx[] = [{ type: 'kochirish', amount: 999999 }];
    expect(xarajatYigindisi(faqatKochirish)).toBe(0);
  });

  it('kirim yigindisi togri', () => {
    expect(kirimYigindisi(txs)).toBe(1000000);
  });

  it('sof foyda = kirim - chiqim (kochirish hisobsiz)', () => {
    expect(sofFoyda(txs)).toBe(500000);
  });
});

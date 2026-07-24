import { qisqaSom } from '../../src/utils/format';

const B = { mln: 'mln', mlrd: 'mlrd' };

describe('qisqaSom', () => {
  it('millionni qisqartiradi', () => {
    expect(qisqaSom(22000000, B)).toBe('22,0 mln');
    expect(qisqaSom(1500000, B)).toBe('1,5 mln');
  });
  it('milliardni qisqartiradi', () => {
    expect(qisqaSom(2300000000, B)).toBe('2,3 mlrd');
  });
  it('million dan kichigini toliq korsatadi', () => {
    expect(qisqaSom(999999, B)).toBe('999 999');
    expect(qisqaSom(0, B)).toBe('0');
  });
  it('manfiy summani belgilaydi', () => {
    expect(qisqaSom(-5000000, B)).toBe('-5,0 mln');
  });
});

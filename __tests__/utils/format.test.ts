import { formatSom, parseSomInput } from '../../src/utils/format';

describe('formatSom', () => {
  it('mingliklarni probel bilan ajratadi', () => {
    expect(formatSom(1500000)).toBe('1 500 000');
    expect(formatSom(0)).toBe('0');
    expect(formatSom(999)).toBe('999');
    expect(formatSom(22000000)).toBe('22 000 000');
  });

  it('manfiy summani belgilaydi', () => {
    expect(formatSom(-4500)).toBe('-4 500');
  });
});

describe('parseSomInput', () => {
  it('matndan raqamni ajratadi', () => {
    expect(parseSomInput('1 500 000')).toBe(1500000);
    expect(parseSomInput('400000som')).toBe(400000);
    expect(parseSomInput('')).toBe(0);
    expect(parseSomInput('abc')).toBe(0);
  });
});

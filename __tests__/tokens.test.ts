import { accentFor, colors } from '../src/theme/tokens';

// Sprint 0 smoke test: kontur bo'yicha aksent rangi mahsulotning signature elementi.
// Shaxsiy = qahrabo, biznes = ishkor (CLAUDE.md 5-bo'lim). Bu qoida buzilmasin.
describe('accentFor', () => {
  it('shaxsiy kontur uchun qahrabo qaytaradi', () => {
    expect(accentFor('shaxsiy')).toBe(colors.qahrabo);
  });

  it('biznes kontur uchun ishkor qaytaradi', () => {
    expect(accentFor('biznes')).toBe(colors.ishkor);
  });
});

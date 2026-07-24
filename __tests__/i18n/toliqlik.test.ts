import uzLat from '../../src/i18n/uz-lat.json';
import uzCyr from '../../src/i18n/uz-cyr.json';
import ru from '../../src/i18n/ru.json';

// Nuqtali kalitlar to'plamini yig'adi (barcha ichma-ich obyektlar bo'yicha).
function kalitlar(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return [prefix];
  }
  const natija: string[] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    natija.push(...kalitlar(v, prefix ? `${prefix}.${k}` : k));
  }
  return natija;
}

// CLAUDE.md 6-bo'lim: uch fayl bir vaqtda yangilanadi; biri qolib ketsa — xato.
describe('i18n toliqligi', () => {
  const uzLatKalit = new Set(kalitlar(uzLat));
  const uzCyrKalit = new Set(kalitlar(uzCyr));
  const ruKalit = new Set(kalitlar(ru));

  function yetishmayotgan(asos: Set<string>, boshqa: Set<string>): string[] {
    return [...asos].filter((k) => !boshqa.has(k));
  }

  it('uz-cyr uz-lat bilan bir xil kalitlarga ega', () => {
    expect(yetishmayotgan(uzLatKalit, uzCyrKalit)).toEqual([]);
    expect(yetishmayotgan(uzCyrKalit, uzLatKalit)).toEqual([]);
  });

  it('ru uz-lat bilan bir xil kalitlarga ega', () => {
    expect(yetishmayotgan(uzLatKalit, ruKalit)).toEqual([]);
    expect(yetishmayotgan(ruKalit, uzLatKalit)).toEqual([]);
  });
});

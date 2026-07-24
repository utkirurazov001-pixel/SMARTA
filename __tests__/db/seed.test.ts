import { freshDb } from '../support/freshDb';
import { seedInitialData } from '../../src/db/seed';
import { listCategories } from '../../src/repositories/categories';
import { listAccounts } from '../../src/repositories/accounts';

import uzLat from '../../src/i18n/uz-lat.json';
import uzCyr from '../../src/i18n/uz-cyr.json';
import ru from '../../src/i18n/ru.json';

// Nuqtali kalit bo'yicha JSON ichidan qiymatni oladi (masalan 'kategoriya.shaxsiy.oila').
function kalitBor(obj: unknown, path: string): boolean {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (typeof cur !== 'object' || cur === null || !(p in (cur as Record<string, unknown>))) {
      return false;
    }
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' && cur.length > 0;
}

describe('seedInitialData', () => {
  it('ikkala kontur uchun kategoriya va hisob qoshadi', async () => {
    const db = await freshDb();
    await seedInitialData(db);

    const shaxsiy = await listCategories(db, 'shaxsiy');
    const biznes = await listCategories(db, 'biznes');
    expect(shaxsiy).toHaveLength(9);
    expect(biznes).toHaveLength(9);
    expect(shaxsiy.every((c) => c.contour === 'shaxsiy')).toBe(true);
    expect(biznes.every((c) => c.contour === 'biznes')).toBe(true);

    expect(await listAccounts(db, 'shaxsiy')).toHaveLength(1);
    expect(await listAccounts(db, 'biznes')).toHaveLength(1);
  });

  it('ikki marta chaqirilsa takrorlamaydi (idempotent)', async () => {
    const db = await freshDb();
    await seedInitialData(db);
    await seedInitialData(db);
    expect(await listCategories(db, 'shaxsiy')).toHaveLength(9);
    expect(await listAccounts(db, 'shaxsiy')).toHaveLength(1);
  });

  it('har bir seed kategoriya kaliti uchala tilda mavjud', async () => {
    const db = await freshDb();
    await seedInitialData(db);
    const barcha = [
      ...(await listCategories(db, 'shaxsiy')),
      ...(await listCategories(db, 'biznes')),
    ];
    for (const c of barcha) {
      expect(c.key).toBeTruthy();
      const key = c.key as string;
      expect(kalitBor(uzLat, key)).toBe(true);
      expect(kalitBor(uzCyr, key)).toBe(true);
      expect(kalitBor(ru, key)).toBe(true);
      // Guruh kaliti ham uchala tilda bo'lsin.
      expect(kalitBor(uzLat, c.group_key)).toBe(true);
      expect(kalitBor(uzCyr, c.group_key)).toBe(true);
      expect(kalitBor(ru, c.group_key)).toBe(true);
    }
  });
});

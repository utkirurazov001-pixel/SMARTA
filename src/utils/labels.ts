import type { CategoryRow } from '../db/schema';

type TFn = (key: string) => string;

// Kategoriya nomi: tizim kategoriyasi uchun i18n kaliti orqali, foydalanuvchi
// kategoriyasi uchun literal nom. Sof funksiya — t tashqaridan beriladi.
export function kategoriyaNomi(cat: Pick<CategoryRow, 'key' | 'name'>, t: TFn): string {
  if (cat.key) {
    return t(cat.key);
  }
  return cat.name ?? '';
}

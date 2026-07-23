// Boshlang'ich ma'lumot: O'zbekiston uchun standart kategoriyalar va standart naqd hisob.
//
// Kategoriya nomlari i18n kalitlari orqali beriladi (uchala tilda mavjud — src/i18n).
// Seed idempotent: kontur uchun kategoriya allaqachon bo'lsa, qayta qo'shilmaydi.

import type { SmartaDb } from './db';
import type { Contour, TransactionType } from '../domain/types';
import { createCategory, listCategories } from '../repositories/categories';
import { createAccount, listAccounts } from '../repositories/accounts';

interface SeedCategory {
  key: string;
  groupKey: string;
  type: TransactionType;
}

// Shaxsiy kontur kategoriyalari (CLAUDE.md Sprint 1 ro'yxati).
const SHAXSIY: SeedCategory[] = [
  { key: 'kategoriya.shaxsiy.uy_rozgor', groupKey: 'guruh.turmush', type: 'chiqim' },
  { key: 'kategoriya.shaxsiy.transport', groupKey: 'guruh.turmush', type: 'chiqim' },
  { key: 'kategoriya.shaxsiy.soglik', groupKey: 'guruh.turmush', type: 'chiqim' },
  { key: 'kategoriya.shaxsiy.talim', groupKey: 'guruh.turmush', type: 'chiqim' },
  { key: 'kategoriya.shaxsiy.oila', groupKey: 'guruh.turmush', type: 'chiqim' },
  { key: 'kategoriya.shaxsiy.marosim', groupKey: 'guruh.ijtimoiy', type: 'chiqim' },
  { key: 'kategoriya.shaxsiy.yordam', groupKey: 'guruh.ijtimoiy', type: 'chiqim' },
  { key: 'kategoriya.shaxsiy.jamgarma', groupKey: 'guruh.moliya', type: 'kochirish' },
  { key: 'kategoriya.shaxsiy.qarz', groupKey: 'guruh.moliya', type: 'chiqim' },
];

// Biznes kontur kategoriyalari.
const BIZNES: SeedCategory[] = [
  { key: 'kategoriya.biznes.savdo_daromadi', groupKey: 'guruh.daromad', type: 'kirim' },
  { key: 'kategoriya.biznes.doimiy_xarajat', groupKey: 'guruh.xarajat', type: 'chiqim' },
  { key: 'kategoriya.biznes.ish_haqi', groupKey: 'guruh.xarajat', type: 'chiqim' },
  { key: 'kategoriya.biznes.soliq', groupKey: 'guruh.majburiyat', type: 'chiqim' },
  { key: 'kategoriya.biznes.tovar', groupKey: 'guruh.xarajat', type: 'chiqim' },
  { key: 'kategoriya.biznes.logistika', groupKey: 'guruh.xarajat', type: 'chiqim' },
  { key: 'kategoriya.biznes.marketing', groupKey: 'guruh.xarajat', type: 'chiqim' },
  { key: 'kategoriya.biznes.moliyaviy', groupKey: 'guruh.moliya', type: 'chiqim' },
  { key: 'kategoriya.biznes.investitsiya', groupKey: 'guruh.moliya', type: 'investitsiya' },
];

async function seedCategoriesFor(
  db: SmartaDb,
  contour: Contour,
  items: SeedCategory[],
): Promise<void> {
  const mavjud = await listCategories(db, contour);
  if (mavjud.length > 0) {
    return; // Idempotent: kontur allaqachon urug'langan.
  }
  let tartib = 0;
  for (const c of items) {
    await createCategory(db, contour, {
      groupKey: c.groupKey,
      key: c.key,
      type: c.type,
      sortOrder: tartib,
      isSystem: true,
    });
    tartib += 1;
  }
}

async function seedDefaultAccountFor(db: SmartaDb, contour: Contour): Promise<void> {
  const mavjud = await listAccounts(db, contour);
  if (mavjud.length > 0) {
    return;
  }
  await createAccount(db, contour, { name: 'Naqd', kind: 'naqd' });
}

// Ikki kontur uchun boshlang'ich ma'lumotni qo'yadi. Bir necha marta chaqirilsa xavfsiz.
export async function seedInitialData(db: SmartaDb): Promise<void> {
  await seedCategoriesFor(db, 'shaxsiy', SHAXSIY);
  await seedCategoriesFor(db, 'biznes', BIZNES);
  await seedDefaultAccountFor(db, 'shaxsiy');
  await seedDefaultAccountFor(db, 'biznes');
}

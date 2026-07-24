// Joriy kontur uchun hisob/kategoriya/tranzaksiya ma'lumotini yuklaydi.
// Ekranga qaytilganda avtomatik yangilanadi. Bosh ekran statistikasi va ro'yxat shunga tayanadi.

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { listAccounts } from '../repositories/accounts';
import { listCategories } from '../repositories/categories';
import { listTransactions } from '../repositories/transactions';
import { useSettings } from '../store/useSettings';
import { useDb } from './DbProvider';
import type { AccountRow, CategoryRow, TransactionRow } from './schema';

export interface Ledger {
  hisoblar: AccountRow[];
  kategoriyalar: Map<string, CategoryRow>;
  hisoblarMap: Map<string, AccountRow>;
  transactions: TransactionRow[];
  yuklandi: boolean;
}

const BOSH: Ledger = {
  hisoblar: [],
  kategoriyalar: new Map(),
  hisoblarMap: new Map(),
  transactions: [],
  yuklandi: false,
};

export function useLedger(): Ledger {
  const db = useDb();
  const contour = useSettings((s) => s.contour);
  const [holat, setHolat] = useState<Ledger>(BOSH);

  useFocusEffect(
    useCallback(() => {
      let tirik = true;
      void (async () => {
        const [a, c, tx] = await Promise.all([
          listAccounts(db, contour),
          listCategories(db, contour),
          listTransactions(db, contour),
        ]);
        if (!tirik) {
          return;
        }
        setHolat({
          hisoblar: a,
          kategoriyalar: new Map(c.map((x) => [x.id, x])),
          hisoblarMap: new Map(a.map((x) => [x.id, x])),
          transactions: tx,
          yuklandi: true,
        });
      })();
      return () => {
        tirik = false;
      };
    }, [db, contour]),
  );

  return holat;
}

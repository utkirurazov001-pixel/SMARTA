// Kontur qarzlarini yuklaydi va har biri uchun qoldiq + oylik foizni hisoblaydi.
// Ekranga qaytilganda avtomatik yangilanadi.

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { oylikFoizSumma, qarzQoldigi } from '../domain/qarz';
import { listDebtPayments } from '../repositories/debtPayments';
import { listDebts } from '../repositories/debts';
import { useSettings } from '../store/useSettings';
import { useDb } from './DbProvider';
import type { DebtRow } from './schema';

export interface QarzKorinish {
  debt: DebtRow;
  qoldiq: number;
  oylikFoiz: number;
}

export interface DebtsData {
  qarzlar: QarzKorinish[];
  yuklandi: boolean;
  // "Men qarzdorman" va ochiq qarzlar bo'yicha bu oy foizga ketadigan jami summa.
  buOyFoizga: number;
}

export function useDebts(): DebtsData {
  const db = useDb();
  const contour = useSettings((s) => s.contour);
  const [holat, setHolat] = useState<DebtsData>({
    qarzlar: [],
    yuklandi: false,
    buOyFoizga: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let tirik = true;
      void (async () => {
        const debts = await listDebts(db, contour);
        const korinishlar = await Promise.all(
          debts.map(async (debt) => {
            const tolovlar = await listDebtPayments(db, contour, debt.id);
            const qoldiq = qarzQoldigi(debt.principal, tolovlar);
            return { debt, qoldiq, oylikFoiz: oylikFoizSumma(qoldiq, debt.annual_rate) };
          }),
        );
        if (!tirik) {
          return;
        }
        const buOyFoizga = korinishlar
          .filter((k) => k.debt.direction === 'men_qarzdor' && k.debt.status === 'ochiq')
          .reduce((s, k) => s + k.oylikFoiz, 0);
        setHolat({ qarzlar: korinishlar, yuklandi: true, buOyFoizga });
      })();
      return () => {
        tirik = false;
      };
    }, [db, contour]),
  );

  return holat;
}

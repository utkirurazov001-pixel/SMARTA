// Kontur fondlarini yuklaydi va har biri uchun yig'ilgan summani hisoblaydi.
// Ekranga qaytilganda avtomatik yangilanadi.

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { fondYigilgan } from '../domain/fond';
import { listFundMovements } from '../repositories/fundMovements';
import { listFunds } from '../repositories/funds';
import { useSettings } from '../store/useSettings';
import { useDb } from './DbProvider';
import type { FundRow } from './schema';

export interface FondKorinish {
  fund: FundRow;
  yigilgan: number;
}

export interface FundsData {
  fondlar: FondKorinish[];
  yuklandi: boolean;
}

export function useFunds(): FundsData {
  const db = useDb();
  const contour = useSettings((s) => s.contour);
  const [holat, setHolat] = useState<FundsData>({ fondlar: [], yuklandi: false });

  useFocusEffect(
    useCallback(() => {
      let tirik = true;
      void (async () => {
        const funds = await listFunds(db, contour);
        const korinishlar = await Promise.all(
          funds.map(async (fund) => {
            const harakatlar = await listFundMovements(db, contour, fund.id);
            return { fund, yigilgan: fondYigilgan(harakatlar) };
          }),
        );
        if (!tirik) {
          return;
        }
        setHolat({ fondlar: korinishlar, yuklandi: true });
      })();
      return () => {
        tirik = false;
      };
    }, [db, contour]),
  );

  return holat;
}

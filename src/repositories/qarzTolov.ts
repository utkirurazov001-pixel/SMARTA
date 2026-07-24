// Qarz to'lovi xizmati: to'lov yozuvi ham qarz jurnaliga, ham asosiy tranzaksiya
// jurnaliga bir vaqtda tushadi — foydalanuvchi ikki marta kiritmaydi (CLAUDE.md Sprint 4).

import type { SmartaDb } from '../db/db';
import type { DebtPaymentRow, TransactionRow } from '../db/schema';
import type { Contour } from '../domain/types';
import { qarzQoldigi, tolovTaqsimot } from '../domain/qarz';
import { createDebtPayment, listDebtPayments } from './debtPayments';
import { getDebt, updateDebt } from './debts';
import { createTransaction } from './transactions';

export interface QarzTolovInput {
  debtId: string;
  hisobId: string;
  tolov: number;
  sana: string;
  qarzKategoriyaId?: string | null;
}

export interface QarzTolovNatija {
  payment: DebtPaymentRow;
  transaction: TransactionRow;
  yopildi: boolean;
}

// To'lovni yozadi: taqsimot (foiz/asosiy) + debt_payment + asosiy jurnal yozuvi.
// "Men qarzdorman" -> chiqim; "menga qarzdor" (qaytim) -> kirim.
export async function qarzTolovQoshish(
  db: SmartaDb,
  contour: Contour,
  input: QarzTolovInput,
): Promise<QarzTolovNatija> {
  const debt = await getDebt(db, contour, input.debtId);
  if (!debt) {
    throw new Error('Qarz topilmadi');
  }

  const tolovlar = await listDebtPayments(db, contour, input.debtId);
  const qoldiq = qarzQoldigi(debt.principal, tolovlar);
  const { foizQismi, asosiyQismi } = tolovTaqsimot(qoldiq, debt.annual_rate, input.tolov);

  const tur = debt.direction === 'men_qarzdor' ? 'chiqim' : 'kirim';
  const transaction = await createTransaction(db, contour, {
    type: tur,
    amount: input.tolov,
    accountId: input.hisobId,
    categoryId: input.qarzKategoriyaId ?? null,
    counterparty: debt.counterparty,
    note: null,
    occurredAt: input.sana,
  });

  const payment = await createDebtPayment(db, contour, {
    debtId: input.debtId,
    amount: input.tolov,
    principalPart: asosiyQismi,
    interestPart: foizQismi,
    paidAt: input.sana,
    transactionId: transaction.id,
  });

  const yopildi = qoldiq - asosiyQismi <= 0;
  if (yopildi) {
    await updateDebt(db, contour, input.debtId, { status: 'yopilgan' });
  }

  return { payment, transaction, yopildi };
}

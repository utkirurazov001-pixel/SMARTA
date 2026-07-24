// Umumiy domen turlari — UI'siz, DB'siz. Butun ilova shu turlarga tayanadi.

// Ikki kontur: shaxsiy va biznes. Hech qachon aralashmaydi (CLAUDE.md 2-bo'lim, 3-qoida).
export type Contour = 'shaxsiy' | 'biznes';

// Tranzaksiya turlari (CLAUDE.md 7-bo'lim).
// kochirish va investitsiya xarajat EMAS — bu farq buzilmaydi.
export type TransactionType = 'kirim' | 'chiqim' | 'kochirish' | 'investitsiya';

// Hisob turlari.
export type AccountKind = 'naqd' | 'karta' | 'bank' | 'valyuta';

// Qarz yo'nalishi: men qarzdorman yoki menga qarzdor.
export type DebtDirection = 'men_qarzdor' | 'menga_qarzdor';

// Qarz to'lov turi.
export type DebtPaymentType = 'annuitet' | 'differensial' | 'muddatsiz';

// Fond harakati yo'nalishi.
export type FundMovementDirection = 'qoshish' | 'olish';

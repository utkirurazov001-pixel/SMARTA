// Tayyor fond shablonlari. Nomlar i18n orqali (fond.template.*).

import type { Contour } from './types';

export interface FondShablon {
  key: string; // i18n kaliti (fond.template.<key>)
  contour?: Contour; // faqat shu konturda ko'rinadi; bo'lmasa — ikkalasida
  zaxira?: boolean; // zaxira jamg'arma — oylik xarajatning 3 barobari mantiqi
}

export const FOND_SHABLONLAR: FondShablon[] = [
  { key: 'umra' },
  { key: 'zaxira', zaxira: true },
  { key: 'yordam' },
  { key: 'soliq', contour: 'biznes' },
  { key: 'rivojlanish', contour: 'biznes' },
];

// Joriy konturga mos shablonlar.
export function shablonlarKontur(contour: Contour): FondShablon[] {
  return FOND_SHABLONLAR.filter((s) => !s.contour || s.contour === contour);
}

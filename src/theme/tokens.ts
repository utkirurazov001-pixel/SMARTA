// Dizayn tokenlari — CLAUDE.md 5-bo'lim.
// Aksent rangi kontur bo'yicha o'zgaradi: shaxsiy = qahrabo, biznes = ishkor.
// Bu mahsulotning signature elementi, tasodifiy emas.

import type { Contour } from '../domain/types';

export const colors = {
  siyoh: '#12212E', // asosiy matn, qoraymtir
  qogoz: '#F7F9F9', // fon
  ishkor: '#1B7F91', // BIZNES konturi aksenti
  qahrabo: '#B5761F', // SHAXSIY konturi aksenti
  yashil: '#2E6B4F', // kirim
  qizil: '#A3352C', // chiqim
  kul: '#5E6E77', // ikkilamchi matn
} as const;

// Kontur bo'yicha aksent rangi. Butun ilova shu funksiyaga tayanadi.
export function accentFor(contour: Contour): string {
  return contour === 'biznes' ? colors.ishkor : colors.qahrabo;
}

export const fonts = {
  // Sarlavha uchun
  sarlavha: 'Unbounded',
  // Asosiy matn uchun
  matn: 'Onest',
  // Raqamlar uchun — doim tabular-nums bilan ishlatiladi
  raqam: 'JetBrainsMono',
} as const;

// Pul summasi doim monospace shriftda va tabular-nums bilan ko'rsatiladi —
// daftar ustuni effekti (CLAUDE.md 5-bo'lim).
export const numeric = {
  fontFamily: fonts.raqam,
  fontVariant: ['tabular-nums'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

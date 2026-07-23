import { formatSom, qisqaSom, type SonBirlik } from './format';

// Yashirin holatda barcha pul raqami shu niqob bilan almashtiriladi (raqamsiz).
export const NIQOB = '••••••';

export interface PulMatniOpts {
  yashirin: boolean;
  qisqa?: boolean;
  birlik?: SonBirlik;
}

// Pul summasining ko'rsatiladigan matni. Yashirin bo'lsa — hech qanday raqam qaytmaydi.
export function pulMatni(amount: number, opts: PulMatniOpts): string {
  if (opts.yashirin) {
    return NIQOB;
  }
  if (opts.qisqa && opts.birlik) {
    return qisqaSom(amount, opts.birlik);
  }
  return formatSom(amount);
}

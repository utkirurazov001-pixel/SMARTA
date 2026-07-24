// Qarz/kredit moliyaviy formulalari — sof funksiyalar, test bilan qoplanadi.
//
// QAT'IY (CLAUDE.md 2-bo'lim 2-qoida): bu modulda hech qanday kredit taklifi,
// bank havolasi yoki refinansirovka tavsiyasi BO'LMAYDI. Faqat hisob-kitob.
//
// Pul — butun so'm. Stavka — yillik foiz (masalan 24 = 24%).

// Yillik stavkadan oylik stavka (kasr): 24% -> 0.02.
export function oylikStavka(yillikStavka: number): number {
  return yillikStavka / 100 / 12;
}

// Bu oy foizga ketadigan summa: qoldiq * (yillik/100) / 12. Bosh ko'rsatkich.
export function oylikFoizSumma(qoldiq: number, yillikStavka: number): number {
  return Math.round((qoldiq * (yillikStavka / 100)) / 12);
}

// Joriy qarz qoldig'i: boshlang'ich − to'langan asosiy qismlar.
export function qarzQoldigi(principal: number, tolovlar: { principal_part: number }[]): number {
  const asosiy = tolovlar.reduce((s, t) => s + t.principal_part, 0);
  return Math.max(0, principal - asosiy);
}

// To'lov shu qarzni kamaytiradimi? Oylik to'lov oylik foizdan katta bo'lsagina.
export function tolovKamaytiradimi(
  qoldiq: number,
  yillikStavka: number,
  oylikTolov: number,
): boolean {
  return oylikTolov > oylikFoizSumma(qoldiq, yillikStavka);
}

// To'lovni foiz va asosiy qismga ajratadi. Avval foiz qoplanadi, qolgani asosiyga.
export function tolovTaqsimot(
  qoldiq: number,
  yillikStavka: number,
  tolov: number,
): { foizQismi: number; asosiyQismi: number } {
  const foiz = oylikFoizSumma(qoldiq, yillikStavka);
  const foizQismi = Math.min(foiz, tolov);
  const asosiyQismi = Math.max(0, tolov - foizQismi);
  return { foizQismi, asosiyQismi };
}

// Annuitet oylik to'lov: P = Q*i / (1 − (1+i)^−n). 0% da Q/n. Muddatsiz (n<=0) da 0.
export function annuitetTolov(qoldiq: number, yillikStavka: number, oyMuddat: number): number {
  if (oyMuddat <= 0 || qoldiq <= 0) {
    return 0;
  }
  const i = oylikStavka(yillikStavka);
  if (i === 0) {
    return Math.round(qoldiq / oyMuddat);
  }
  const P = (qoldiq * i) / (1 - Math.pow(1 + i, -oyMuddat));
  return Math.round(P);
}

export interface ErtaYopish {
  oylar: number; // qarz to'liq yopiladigan oylar soni (yaxlitlangan yuqoriga)
  jamiFoiz: number; // shu davrda to'lanadigan jami foiz
}

// Erta yopish hisobi: n = −ln(1 − Q*i/P) / ln(1+i).
// 0% stavka -> n = Q/P. To'lov oylik foizdan kam bo'lsa qarz kamaymaydi -> null.
export function ertaYopish(
  qoldiq: number,
  yillikStavka: number,
  oylikTolov: number,
): ErtaYopish | null {
  if (qoldiq <= 0 || oylikTolov <= 0) {
    return null;
  }
  const i = oylikStavka(yillikStavka);
  if (i === 0) {
    const oylarF = qoldiq / oylikTolov;
    return { oylar: Math.ceil(oylarF), jamiFoiz: 0 };
  }
  const oylikFoiz = qoldiq * i;
  if (oylikTolov <= oylikFoiz) {
    // Bu to'lov bilan qarz kamaymaydi.
    return null;
  }
  const nF = -Math.log(1 - (qoldiq * i) / oylikTolov) / Math.log(1 + i);
  const jamiTolov = nF * oylikTolov;
  return { oylar: Math.ceil(nF), jamiFoiz: Math.round(jamiTolov - qoldiq) };
}

export interface ErtaYopishVariant {
  oylikTolov: number;
  natija: ErtaYopish | null;
  tejaladi: number | null; // asosiy variantga nisbatan tejaladigan foiz summasi
}

// Erta yopish variantlari: asosiy to'lov va uni oshirilgan ko'rinishlari (4 ta).
export function ertaYopishVariantlari(
  qoldiq: number,
  yillikStavka: number,
  asosiyTolov: number,
): ErtaYopishVariant[] {
  const koeffitsiyentlar = [1, 1.25, 1.5, 2];
  const asosiy = ertaYopish(qoldiq, yillikStavka, asosiyTolov);
  return koeffitsiyentlar.map((k) => {
    const oylikTolov = Math.round(asosiyTolov * k);
    const natija = ertaYopish(qoldiq, yillikStavka, oylikTolov);
    const tejaladi = asosiy && natija ? asosiy.jamiFoiz - natija.jamiFoiz : null;
    return { oylikTolov, natija, tejaladi };
  });
}

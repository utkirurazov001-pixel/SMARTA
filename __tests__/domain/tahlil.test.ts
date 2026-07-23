import { sanaTahlil, summaTahlil, tahlilQil } from '../../src/domain/tahlil';
import type { Contour } from '../../src/domain/types';

const NOW = new Date('2026-07-23T00:00:00.000Z');

describe('summaTahlil', () => {
  it('turli formatlarni oqiydi', () => {
    expect(summaTahlil('400 ming')).toBe(400000);
    expect(summaTahlil('400000')).toBe(400000);
    expect(summaTahlil('2 mln')).toBe(2000000);
    expect(summaTahlil('2,5 mln')).toBe(2500000);
    expect(summaTahlil('400k')).toBe(400000);
    expect(summaTahlil('1 mlrd')).toBe(1000000000);
    expect(summaTahlil('200 тыс')).toBe(200000);
  });
});

describe('sanaTahlil', () => {
  it('bugun va kecha', () => {
    expect(sanaTahlil('bugun benzin', NOW).sana?.slice(0, 10)).toBe('2026-07-23');
    expect(sanaTahlil('kecha non', NOW).sana?.slice(0, 10)).toBe('2026-07-22');
  });
  it('12-iyul kabi sana', () => {
    expect(sanaTahlil('12-iyul ijara', NOW).sana?.slice(0, 10)).toBe('2026-07-12');
  });
});

interface Namuna {
  contour: Contour;
  matn: string;
  summa: number;
  kategoriya?: string;
}

// 50 namuna — CLAUDE.md Sprint 7 mezoni: aniqlik kamida 80%.
const NAMUNALAR: Namuna[] = [
  {
    contour: 'shaxsiy',
    matn: '400 ming benzin',
    summa: 400000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'benzin 400000',
    summa: 400000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: '2 mln avtobus',
    summa: 2000000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'taksi 25 ming',
    summa: 25000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'non 15 ming',
    summa: 15000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: 'bozorlik 200 ming',
    summa: 200000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: "go'sht 80000",
    summa: 80000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: 'ijara 1,5 mln',
    summa: 1500000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: 'kommunal 300 ming',
    summa: 300000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: 'dori 45 ming',
    summa: 45000,
    kategoriya: 'kategoriya.shaxsiy.soglik',
  },
  {
    contour: 'shaxsiy',
    matn: 'apteka 60000',
    summa: 60000,
    kategoriya: 'kategoriya.shaxsiy.soglik',
  },
  {
    contour: 'shaxsiy',
    matn: 'maktab 500 ming',
    summa: 500000,
    kategoriya: 'kategoriya.shaxsiy.talim',
  },
  {
    contour: 'shaxsiy',
    matn: 'kurs 1 mln',
    summa: 1000000,
    kategoriya: 'kategoriya.shaxsiy.talim',
  },
  {
    contour: 'shaxsiy',
    matn: 'kitob 90 ming',
    summa: 90000,
    kategoriya: 'kategoriya.shaxsiy.talim',
  },
  {
    contour: 'shaxsiy',
    matn: 'bolalar 120 ming',
    summa: 120000,
    kategoriya: 'kategoriya.shaxsiy.oila',
  },
  {
    contour: 'shaxsiy',
    matn: "to'y 3 mln",
    summa: 3000000,
    kategoriya: 'kategoriya.shaxsiy.marosim',
  },
  {
    contour: 'shaxsiy',
    matn: 'mehmon 250 ming',
    summa: 250000,
    kategoriya: 'kategoriya.shaxsiy.marosim',
  },
  {
    contour: 'shaxsiy',
    matn: 'sadaqa 100 ming',
    summa: 100000,
    kategoriya: 'kategoriya.shaxsiy.yordam',
  },
  {
    contour: 'shaxsiy',
    matn: 'yordam 50000',
    summa: 50000,
    kategoriya: 'kategoriya.shaxsiy.yordam',
  },
  {
    contour: 'shaxsiy',
    matn: '400k benzin',
    summa: 400000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'бензин 400 минг',
    summa: 400000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'нон 15000',
    summa: 15000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: 'дори 45 минг',
    summa: 45000,
    kategoriya: 'kategoriya.shaxsiy.soglik',
  },
  {
    contour: 'shaxsiy',
    matn: 'такси 25000',
    summa: 25000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'аренда 1 млн',
    summa: 1000000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: 'заправка 400000',
    summa: 400000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'продукты 200 тыс',
    summa: 200000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: 'аптека 60 тыс',
    summa: 60000,
    kategoriya: 'kategoriya.shaxsiy.soglik',
  },
  {
    contour: 'shaxsiy',
    matn: 'врач 150 тыс',
    summa: 150000,
    kategoriya: 'kategoriya.shaxsiy.soglik',
  },
  {
    contour: 'shaxsiy',
    matn: 'kecha benzin 400 ming',
    summa: 400000,
    kategoriya: 'kategoriya.shaxsiy.transport',
  },
  {
    contour: 'shaxsiy',
    matn: 'bugun non 20 ming',
    summa: 20000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'shaxsiy',
    matn: '12-iyul ijara 1 mln',
    summa: 1000000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
  {
    contour: 'biznes',
    matn: 'savdo 5 mln',
    summa: 5000000,
    kategoriya: 'kategoriya.biznes.savdo_daromadi',
  },
  {
    contour: 'biznes',
    matn: 'sotildi 2,5 mln',
    summa: 2500000,
    kategoriya: 'kategoriya.biznes.savdo_daromadi',
  },
  {
    contour: 'biznes',
    matn: 'oylik 3 mln',
    summa: 3000000,
    kategoriya: 'kategoriya.biznes.ish_haqi',
  },
  {
    contour: 'biznes',
    matn: 'soliq 800 ming',
    summa: 800000,
    kategoriya: 'kategoriya.biznes.soliq',
  },
  {
    contour: 'biznes',
    matn: 'tovar 10 mln',
    summa: 10000000,
    kategoriya: 'kategoriya.biznes.tovar',
  },
  {
    contour: 'biznes',
    matn: 'xomashyo 4 mln',
    summa: 4000000,
    kategoriya: 'kategoriya.biznes.tovar',
  },
  {
    contour: 'biznes',
    matn: 'reklama 500 ming',
    summa: 500000,
    kategoriya: 'kategoriya.biznes.marketing',
  },
  {
    contour: 'biznes',
    matn: 'dostavka 150 ming',
    summa: 150000,
    kategoriya: 'kategoriya.biznes.logistika',
  },
  {
    contour: 'biznes',
    matn: 'ijara 2 mln',
    summa: 2000000,
    kategoriya: 'kategoriya.biznes.doimiy_xarajat',
  },
  {
    contour: 'biznes',
    matn: 'маош 3 млн',
    summa: 3000000,
    kategoriya: 'kategoriya.biznes.ish_haqi',
  },
  {
    contour: 'biznes',
    matn: 'налог 800 тыс',
    summa: 800000,
    kategoriya: 'kategoriya.biznes.soliq',
  },
  {
    contour: 'biznes',
    matn: 'реклама 500 минг',
    summa: 500000,
    kategoriya: 'kategoriya.biznes.marketing',
  },
  {
    contour: 'biznes',
    matn: 'выручка 5 млн',
    summa: 5000000,
    kategoriya: 'kategoriya.biznes.savdo_daromadi',
  },
  {
    contour: 'biznes',
    matn: 'товар 10 млн',
    summa: 10000000,
    kategoriya: 'kategoriya.biznes.tovar',
  },
  { contour: 'shaxsiy', matn: '1 mlrd', summa: 1000000000 },
  { contour: 'shaxsiy', matn: '2,5 mln', summa: 2500000 },
  { contour: 'shaxsiy', matn: '750000', summa: 750000 },
  {
    contour: 'shaxsiy',
    matn: 'internet 55 ming',
    summa: 55000,
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
  },
];

describe('tahlilQil — 50 namuna aniqligi', () => {
  it('kamida 80% toqri', () => {
    expect(NAMUNALAR).toHaveLength(50);
    let togri = 0;
    for (const n of NAMUNALAR) {
      const r = tahlilQil(n.matn, n.contour, NOW);
      const summaOk = r.summa === n.summa;
      const katOk = n.kategoriya === undefined || r.kategoriya === n.kategoriya;
      if (summaOk && katOk) {
        togri += 1;
      }
    }
    const aniqlik = togri / NAMUNALAR.length;
    expect(aniqlik).toBeGreaterThanOrEqual(0.8);
  });
});

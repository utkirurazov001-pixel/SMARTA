// Tez kiritish uchun kalit so'zlar lug'ati (uchala til). AI ISHLATILMAYDI — lokal qoidalar.
// Har yozuv kategoriya kalitiga bog'lanadi; kalit joriy konturda mavjud bo'lsagina taklif qilinadi.

import type { Contour, TransactionType } from './types';

export interface LugatYozuv {
  kalitlar: string[]; // pastki registrda
  kategoriya: string; // i18n / seed kategoriya kaliti
  tur: TransactionType;
  contour?: Contour; // faqat shu konturda; bo'lmasa — ikkalasida
}

// Tartib muhim: aniqroq/xosroq yozuvlar birinchi.
export const LUGAT: LugatYozuv[] = [
  // --- Shaxsiy ---
  {
    kalitlar: [
      'benzin',
      'yoqilgi',
      "yoqilg'i",
      'taksi',
      'avtobus',
      'moshina',
      'transport',
      'бензин',
      'такси',
      'автобус',
      'транспорт',
      'заправка',
      'ёқилғи',
    ],
    kategoriya: 'kategoriya.shaxsiy.transport',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  {
    kalitlar: [
      'non',
      'gosht',
      "go'sht",
      'bozorlik',
      'ovqat',
      'oziq',
      'sut',
      'choy',
      'meva',
      'нон',
      'гўшт',
      'бозорлик',
      'овқат',
      'сут',
      'еда',
      'продукты',
      'магазин',
    ],
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  {
    kalitlar: [
      'ijara',
      'kommunal',
      'svet',
      'gaz',
      'suv',
      'internet',
      'ижара',
      'коммунал',
      'свет',
      'газ',
      'сув',
      'аренда',
    ],
    kategoriya: 'kategoriya.shaxsiy.uy_rozgor',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  {
    kalitlar: [
      'dori',
      'shifokor',
      'kasalxona',
      'apteka',
      'дори',
      'шифокор',
      'касалхона',
      'аптека',
      'врач',
      'лекарство',
    ],
    kategoriya: 'kategoriya.shaxsiy.soglik',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  {
    kalitlar: [
      'maktab',
      'kurs',
      'universitet',
      'talim',
      "ta'lim",
      'kitob',
      'мактаб',
      'курс',
      'таълим',
      'китоб',
      'образование',
    ],
    kategoriya: 'kategoriya.shaxsiy.talim',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  {
    kalitlar: ['bolalar', 'oila', 'oyinchoq', "o'yinchoq", 'болалар', 'оила', 'дети', 'семья'],
    kategoriya: 'kategoriya.shaxsiy.oila',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  {
    kalitlar: [
      'toy',
      "to'y",
      'marosim',
      'mehmon',
      'sovga',
      "sovg'a",
      'тўй',
      'маросим',
      'меҳмон',
      'совға',
    ],
    kategoriya: 'kategoriya.shaxsiy.marosim',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  {
    kalitlar: ['sadaqa', 'xayriya', 'yordam', 'садақа', 'хайрия', 'ёрдам', 'помощь'],
    kategoriya: 'kategoriya.shaxsiy.yordam',
    tur: 'chiqim',
    contour: 'shaxsiy',
  },
  // --- Biznes ---
  {
    kalitlar: [
      'savdo',
      'sotildi',
      'daromad',
      'sotuv',
      'савдо',
      'сотилди',
      'даромад',
      'выручка',
      'продажа',
      'доход',
    ],
    kategoriya: 'kategoriya.biznes.savdo_daromadi',
    tur: 'kirim',
    contour: 'biznes',
  },
  {
    kalitlar: ['oylik', 'maosh', 'ish haqi', 'ойлик', 'маош', 'зарплата'],
    kategoriya: 'kategoriya.biznes.ish_haqi',
    tur: 'chiqim',
    contour: 'biznes',
  },
  {
    kalitlar: ['soliq', 'солиқ', 'налог'],
    kategoriya: 'kategoriya.biznes.soliq',
    tur: 'chiqim',
    contour: 'biznes',
  },
  {
    kalitlar: ['tovar', 'xomashyo', 'mahsulot', 'товар', 'хомашё', 'сырьё', 'закуп'],
    kategoriya: 'kategoriya.biznes.tovar',
    tur: 'chiqim',
    contour: 'biznes',
  },
  {
    kalitlar: ['yetkazib', 'dostavka', 'logistika', 'достака', 'доставка', 'логистика'],
    kategoriya: 'kategoriya.biznes.logistika',
    tur: 'chiqim',
    contour: 'biznes',
  },
  {
    kalitlar: ['reklama', 'marketing', 'реклама', 'маркетинг'],
    kategoriya: 'kategoriya.biznes.marketing',
    tur: 'chiqim',
    contour: 'biznes',
  },
  {
    kalitlar: ['ijara', 'arenda', 'kommunal', 'ижара', 'аренда', 'коммунал'],
    kategoriya: 'kategoriya.biznes.doimiy_xarajat',
    tur: 'chiqim',
    contour: 'biznes',
  },
];

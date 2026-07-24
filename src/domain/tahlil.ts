// Matn tahlili — tez kiritish uchun. AI ISHLATILMAYDI, faqat lokal qoidalar.
// Misol: "400 ming benzin" -> chiqim / Transport / 400 000 / bugun.
// Natija foydalanuvchiga TAKLIF sifatida ko'rsatiladi — ilova hech qachon jimgina yozmaydi.

import { addDays, setDate, setMonth, startOfDay } from 'date-fns';

import { LUGAT, type LugatYozuv } from './tahlilLugat';
import type { Contour, TransactionType } from './types';

// --- Summa ---

// "400 ming", "400000", "2 mln", "2,5 mln", "400k", "2 mlrd" -> butun so'm.
export function summaTahlil(matn: string): number | null {
  const m = matn
    .toLowerCase()
    .match(
      /(\d+(?:[.,]\d+)?)\s*(mlrd|milliard|млрд|миллиард|mln|million|млн|миллион|ming|минг|тыс|k)?/,
    );
  if (!m) {
    return null;
  }
  const son = parseFloat(m[1].replace(',', '.'));
  const b = m[2] ?? '';
  let kopaytma = 1;
  if (/mlrd|milliard|млрд|миллиард/.test(b)) {
    kopaytma = 1_000_000_000;
  } else if (/mln|million|млн|миллион/.test(b)) {
    kopaytma = 1_000_000;
  } else if (/ming|минг|тыс|k/.test(b)) {
    kopaytma = 1_000;
  }
  return Math.round(son * kopaytma);
}

// --- Sana ---

const OY_JADVAL: string[][] = [
  ['yanvar', 'январ'],
  ['fevral', 'феврал'],
  ['mart', 'март'],
  ['aprel', 'апрел'],
  ['may', 'май'],
  ['iyun', 'июн'],
  ['iyul', 'июл'],
  ['avgust', 'август'],
  ['sentyabr', 'сентябр'],
  ['oktyabr', 'октябр'],
  ['noyabr', 'ноябр'],
  ['dekabr', 'декабр'],
];

function oyIndeks(soz: string): number | null {
  const w = soz.toLowerCase();
  for (let i = 0; i < OY_JADVAL.length; i += 1) {
    if (OY_JADVAL[i].some((p) => w.startsWith(p))) {
      return i;
    }
  }
  return null;
}

export interface SanaNatija {
  sana: string | null; // ISO (kun boshi)
  token: string | null; // topilgan bo'lak (summadan ajratish uchun)
}

// "kecha", "bugun", "12-iyul" -> sana. Topilmasa null.
export function sanaTahlil(matn: string, now: Date): SanaNatija {
  const pas = matn.toLowerCase();
  const bugun = pas.match(/bugun|бугун|сегодня/);
  if (bugun) {
    return { sana: startOfDay(now).toISOString(), token: bugun[0] };
  }
  const kecha = pas.match(/kecha|кеча|вчера/);
  if (kecha) {
    return { sana: startOfDay(addDays(now, -1)).toISOString(), token: kecha[0] };
  }
  const m = pas.match(/(\d{1,2})[-.\s]*([a-zа-яёўғқҳ']+)/);
  if (m) {
    const oy = oyIndeks(m[2]);
    if (oy !== null) {
      let d = startOfDay(now);
      d = setMonth(d, oy);
      d = setDate(d, parseInt(m[1], 10));
      return { sana: d.toISOString(), token: m[0] };
    }
  }
  return { sana: null, token: null };
}

// --- Kategoriya ---

export function kategoriyaTahlil(matn: string, contour: Contour): LugatYozuv | null {
  const pas = matn.toLowerCase();
  for (const y of LUGAT) {
    if (y.contour && y.contour !== contour) {
      continue;
    }
    if (y.kalitlar.some((k) => pas.includes(k))) {
      return y;
    }
  }
  return null;
}

// --- Umumiy ---

export interface TahlilNatija {
  summa: number | null;
  sana: string; // ISO, standart — bugun
  kategoriya: string | null; // kategoriya kaliti
  tur: TransactionType;
  aniqlandi: boolean; // summa yoki kategoriya aniqlandimi
}

// O'rganish uchun barqaror kalit: summa/birlik/sana so'zlarisiz tavsifiy matn.
// "400 ming benzin kecha" -> "benzin".
export function orgatKalit(matn: string): string {
  return matn
    .toLowerCase()
    .replace(/\d+([.,]\d+)?/g, ' ')
    .replace(
      /\b(mlrd|milliard|млрд|миллиард|mln|million|млн|миллион|ming|минг|тыс|k|bugun|бугун|сегодня|kecha|кеча|вчера)\b/g,
      ' ',
    )
    .replace(/\s+/g, ' ')
    .trim();
}

export function tahlilQil(matn: string, contour: Contour, now: Date): TahlilNatija {
  const s = sanaTahlil(matn, now);
  // Sana bo'lagini olib tashlaymiz — "12-iyul"dagi 12 summa deb o'qilmasin.
  const qoldiq = s.token ? matn.toLowerCase().replace(s.token, ' ') : matn;
  const summa = summaTahlil(qoldiq);
  const kat = kategoriyaTahlil(matn, contour);
  return {
    summa,
    sana: s.sana ?? startOfDay(now).toISOString(),
    kategoriya: kat?.kategoriya ?? null,
    tur: kat?.tur ?? 'chiqim',
    aniqlandi: summa !== null || kat !== null,
  };
}

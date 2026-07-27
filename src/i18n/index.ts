import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import uzLat from './uz-lat.json';
import uzCyr from './uz-cyr.json';
import ru from './ru.json';

// Qo'llab-quvvatlanadigan tillar. Standart til — uz-lat (CLAUDE.md 6-bo'lim).
export const TILLAR = ['uz-lat', 'uz-cyr', 'ru'] as const;
export type Til = (typeof TILLAR)[number];

export const STANDART_TIL: Til = 'uz-lat';

const resources = {
  'uz-lat': { translation: uzLat },
  'uz-cyr': { translation: uzCyr },
  ru: { translation: ru },
} as const;

// Qurilma tili qo'llab-quvvatlansa o'shani, aks holda standart tilni tanlaymiz.
function boshlangichTil(): Til {
  try {
    const qurilmaKodi = getLocales()[0]?.languageCode ?? null;
    if (qurilmaKodi === 'ru') {
      return 'ru';
    }
  } catch {
    // getLocales ishlamasa — standart til.
  }
  // O'zbek uchun standart sifatida lotin yozuvini beramiz.
  return STANDART_TIL;
}

if (!i18n.isInitialized) {
  // i18next'ning standart init idiomasi — `use` bu yerda default'ning metodi.
  // eslint-disable-next-line import/no-named-as-default-member
  void i18n.use(initReactI18next).init({
    resources,
    lng: boshlangichTil(),
    fallbackLng: STANDART_TIL,
    supportedLngs: TILLAR,
    // MUHIM: defis bilan yozilgan kod (uz-lat) region qismini KATTA harfga o'girib,
    // resurs kaliti bilan mos kelmay qolardi. lowerCaseLng kodni kichik saqlaydi.
    lowerCaseLng: true,
    // Sinxron init — birinchi renderда tarjimalar tayyor bo'lsin (production'da muhim).
    initImmediate: false,
    interpolation: {
      escapeValue: false, // React XSS'dan o'zi himoya qiladi
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;

# PROGRESS — SMARTA

Har sprint tugagach shu faylga bajarilgan ish yoziladi (CLAUDE.md 9-bo'lim, 6-band).

---

## Sprint 0 — Poydevor ✅

**Sana:** 2026-07-23
**Holat:** Tugagan.

### Bajarilgan ishlar

1. **Expo loyihasi** — Expo SDK 57 + TypeScript, `expo-router/entry` kirish nuqtasi.
2. **Papka tuzilishi** (CLAUDE.md 4-bo'lim):
   - `/app/(tabs)` — 5 ta tab ekrani
   - `/src/{db,repositories,domain,components,theme,i18n,utils}` — bo'sh qatlamlar `.gitkeep` bilan, `theme`, `i18n`, `components` to'ldirilgan
   - `/__tests__` — testlar
3. **Kutubxonalar:** `expo-router`, `zustand`, `expo-sqlite`, `i18next` + `react-i18next`, `date-fns`, `expo-localization` + router uchun native paketlar.
4. **TypeScript strict** — `tsconfig.json` da `strict: true`, `resolveJsonModule`.
5. **ESLint + Prettier** — `eslint.config.js` (flat, `eslint-config-expo` + `eslint-config-prettier`), `.prettierrc`.
6. **Jest** — `jest-expo` preset (jest 29), 2 ta smoke test o'tadi.
7. **Dizayn tokenlari** — `src/theme/tokens.ts`: CLAUDE.md 5-bo'lim ranglari, shriftlar, `accentFor(contour)` (shaxsiy=qahrabo, biznes=ishkor), `numeric` (tabular-nums).
8. **i18n** — `uz-lat`, `uz-cyr`, `ru` fayllari + i18next config, standart til `uz-lat`, qurilma tili aniqlash.
9. **Navigatsiya** — 5 ta tab: **bosh, yozuv, qarz, fond, hisobot**. Tab nomlari i18n orqali; til almashganda avtomatik o'zgaradi. Bosh ekranda til almashtirgich.

### Qabul mezoni — tekshirildi

- ✅ `npx tsc --noEmit` — xatosiz
- ✅ `npm run lint` — toza (0 xato, 0 ogohlantirish)
- ✅ `npm test` — 2 test o'tadi
- ✅ Metro bundle to'liq yig'iladi (`expo export`, ~1338 modul) — barcha import hal bo'ladi
- ✅ Til almashtirish (uz-lat / uz-cyr / ru) — tab nomlari va ekran matnlari o'zgaradi
- ⏳ Telefonda 5 tab almashishi va til almashishini foydalanuvchi sinaydi (remote muhitda dev-server telefonga ulanmaydi)

### Eslatmalar (keyingi sprintlar uchun)

- Til holati hozircha faqat `i18next` ichida. **Sprint 2**'da Zustand store'ga (joriy kontur + til + "qoldiqni yashirish") ko'chadi.
- Versiya nomuvofiqliklari qo'lda hal qilindi (proxy `api.expo.dev`/`reactnative.directory`ni bloklagani uchun `expo install` ishlamadi): `jest@29`, `babel-preset-expo@~57.0.4`, `@react-native/jest-preset@0.86.0`, ESLint `9.x` (10.x `eslint-plugin-react` bilan mos emas).

---

## Sprint 1 — Ma'lumotlar qatlami

Holat: boshlanmagan.

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

## Sprint 1 — Ma'lumotlar qatlami ✅

**Sana:** 2026-07-23
**Holat:** Tugagan.

### Bajarilgan ishlar

1. **Domen turlari** (`src/domain/types.ts`): `Contour`, `TransactionType`, `AccountKind`, `DebtDirection`, `DebtPaymentType`, `FundMovementDirection`. `tokens.ts` endi `Contour`ni shu yerdan oladi (yagona manba).
2. **DB interfeysi** (`src/db/db.ts`): `SmartaDb` — minimal async interfeys. Repozitoriylar faqat shunga tayanadi, `expo-sqlite`ga bevosita emas → testlarda `node:sqlite` bilan aynan bir xil kod sinaladi.
3. **Schema** (`src/db/schema.ts`): 7 jadval — `accounts`, `categories`, `transactions`, `debts`, `debt_payments`, `funds`, `fund_movements`. Har birida majburiy ustunlar (`id`, `contour`, `created_at`, `updated_at`, `deleted_at`) + CHECK cheklovlar + indekslar. Pul — `INTEGER`.
4. **Migratsiya** (`src/db/migrations/`): `PRAGMA user_version` asosida versiyalangan, idempotent tizim.
5. **Client** (`src/db/client.ts`): `expo-sqlite` adapteri + `openSmartaDb()` (migratsiya + seed bir marta).
6. **Repozitoriylar** (`src/repositories/`): 7 entity uchun CRUD. **Har bir funksiya majburiy `contour` qabul qiladi** va `WHERE contour = ?` + `deleted_at IS NULL` qo'shadi (`base.ts` umumiy asos).
7. **Seed** (`src/db/seed.ts`): shaxsiy (9) va biznes (9) standart kategoriyalar + standart naqd hisob. i18n kalitlari orqali — uchala tilda mavjud. Idempotent.
8. **Testlar** (13 ta, hammasi o'tadi):
   - Migratsiya barcha jadvalni yaratadi + ikki marta ishga tushsa xato bermaydi
   - CRUD (accounts, transactions, debts+payments, funds+movements)
   - **Contour izolyatsiyasi:** biznes so'rovi shaxsiy yozuvni qaytarmasligi (list va id bo'yicha) isbotlangan
   - Seed idempotent + har kategoriya/guruh kaliti uchala tilda mavjud

### Qabul mezoni — tekshirildi

- ✅ Barcha CRUD test bilan qoplangan va o'tadi (13 test)
- ✅ Contour izolyatsiyasi testi bor va o'tadi
- ✅ Migratsiya ikki marta ishga tushsa xato bermaydi
- ✅ Seed ma'lumot uchala tilda mavjud (test bilan isbotlangan)
- ✅ `tsc --noEmit`, `lint`, `prettier` — toza

### Test infratuzilmasi eslatmasi

`expo-sqlite` Node/Jest'da ishlamaydi. Yechim: `SmartaDb` interfeysi + ikkita adapter — ilovada `expo-sqlite`, testda Node 22 ichki `node:sqlite` (`__tests__/support/nodeSqlite.ts`, faqat testlar import qiladi, Metro bundle'iga tushmaydi). Ikkalasi ham SQLite — SQL bir xil.

---

## Sprint 2 — Ikki kontur va yozuv kiritish ✅

**Sana:** 2026-07-23
**Holat:** Tugagan.

### Bajarilgan ishlar

1. **Zustand store** (`src/store/useSettings.ts`): joriy kontur, til, "qoldiqni yashirish". AsyncStorage'da saqlanadi (ilova qayta ochilganda tiklanadi). Til o'zgarganda i18n moslashadi.
2. **Aksent** (`src/store/useAccent.ts`): joriy konturga mos rang. Kontur almashtirgich (`KonturTanlagich`) — butun ilova aksenti qahrabo↔ishkor almashadi (tab rangi ham).
3. **DB provider** (`src/db/DbProvider.tsx`): bazani ochadi (migratsiya+seed), kontekst orqali `useDb()`.
4. **Yozuv formasi** (`TranzaksiyaForma`): summa (formatlangan, monospace), tur (kirim/chiqim/kochirish), kategoriya (kochirishda yashirin), hisob, sana (date picker), kontragent, izoh. Yaratish va tahrirlash.
5. **Kategoriya/hisob tanlash** (`TanlashModal`): guruh + qidiruv bilan.
6. **So'nggi yozuvlar** (`TranzaksiyaRoyxati`): konturdagi yozuvlar, fokusda yangilanadi, bosilganda tahrirlash ekraniga o'tadi. `qoldiqYashirin` holatida summalar niqoblanadi.
7. **Tahrirlash/o'chirish** (`app/tranzaksiya/[id].tsx`): forma orqali tahrir + soft delete (tasdiq bilan).
8. **Til almashtirgich** endi store orqali (saqlanadi).
9. **Sof mantiq + test:** `src/domain/hisob.ts` — `xarajatYigindisi` FAQAT `chiqim`ni sanaydi; kochirish va investitsiya xarajat EMAS. `src/utils/format.ts` — pul formati. 6 yangi test.

### Qabul mezoni — tekshirildi

- ✅ Kontur almashganda rang (aksent) va ma'lumot (ro'yxat/forma) to'liq o'zgaradi
- ✅ Yozuv qo'shish qisqa: tur→summa→kategoriya→hisob→saqlash (asosiy holatda hisob avtomatik tanlangan)
- ✅ **Kochirish xarajatga qo'shilmasligi** testda isbotlangan (`hisob.test.ts`)
- ✅ Uchala tilda ishlaydi (barcha matn i18n orqali, uch fayl yangilangan)
- ✅ `tsc`, `lint`, `prettier` toza; 20 test o'tadi; Metro bundle yig'iladi

### Eslatma

`src/store` papkasi qo'shildi (CLAUDE.md 4-bo'lim ro'yxatida yo'q edi, lekin Zustand store uchun tabiiy joy). Kontur almashtirgich hozircha bosh va yozuv ekranlari tepasida; global header Sprint 3/8'da ko'rib chiqiladi.

---

## Sprint 3 — Bosh ekran ✅

**Sana:** 2026-07-23
**Holat:** Tugagan.

### Bajarilgan ishlar

1. **Sof mantiq + test** (11 yangi test, jami 38):
   - `domain/balans.ts` — `hisobBalansi` (kirim qo'shadi, chiqim/kochirish/investitsiya ayiradi, kiruvchi kochirish qo'shadi), `umumiyQoldiq`, `hisobTartibi` (NAQD birinchi).
   - `domain/davr.ts` — `davrOraliq` (bu oy / o'tgan oy / 3 oy + oldingi teng davr), `oraliqIchida`, `foizOzgarish` (0 ga bo'lishdan himoya).
   - `utils/format.ts` — `qisqaSom` (22 000 000 → "22,0 mln").
   - `utils/pul.ts` — `pulMatni` + `NIQOB`: **yashirin holatda hech qanday raqam qaytmaydi** (test bilan isbotlangan).
2. **Ma'lumot hook'i** (`db/useLedger.ts`): kontur bo'yicha hisob/kategoriya/tranzaksiya, fokusda yangilanadi — bosh ekran uchun yagona manba.
3. **Bosh ekran** (`FlatList`, statistika header'da):
   - Umumiy qoldiq kartasi + **"qoldiqni yashirish"** tugmasi (holat saqlanadi).
   - Davr tanlash: bu oy / o'tgan oy / 3 oy.
   - Kirim/chiqim ko'rsatkichlari + **o'tgan davrga nisbatan foiz** (↑/↓).
   - **Biznes:** sof foyda kartasi. **Shaxsiy:** oylik limit + progress chizig'i.
   - Hisoblar bo'yicha ajratma: **NAQD birinchi va ajratilgan**.
   - So'nggi yozuvlar ro'yxati + **qidiruv** (kategoriya/kontragent/izoh/hisob bo'yicha).
   - Katta summalar qisqartirib ko'rsatiladi (`qisqa`).
4. Store: `oylikLimit` qo'shildi (saqlanadi). Til almashtirgich bosh ekran footer'ida.

### Qabul mezoni — tekshirildi

- ✅ Yashirish tugmasi hech bir raqamni ochiq qoldirmaydi (`pul.test.ts` — barcha summalar niqob, raqamsiz)
- ✅ Katta summalar qisqartiriladi (22 000 000 → "22,0 mln", test bilan)
- ✅ Barcha hisob-kitob `/src/domain` ichida va test bilan qoplangan
- ✅ Davr almashganda ma'lumot to'g'ri filtrlanadi (`oraliqIchida`)
- ✅ `tsc`, `lint`, `prettier` toza; 38 test; Metro bundle yig'iladi

---

## Sprint 4 — Qarz va kredit moduli

Holat: boshlanmagan.

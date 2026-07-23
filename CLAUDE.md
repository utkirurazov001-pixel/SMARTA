# CLAUDE.md — SMARTA

> Bu fayl repo ildizida turadi. Claude Code har sessiyada uni o'qiydi.
> Bu yerdagi qoidalar har qanday topshiriqdan ustun turadi.

---

## 1. Loyiha nima

**SMARTA** — O'zbekiston uchun kirim-chiqim hisobi platformasi.
Foydalanuvchi: mikro-tadbirkor (do'kon, hunarmand, haydovchi, YaTT), kichik biznes (MChJ) va oddiy fuqaro.

**Bir jumlada:** Har bir tadbirkorda ikkita pul bor — o'ziniki va ishniki. Smarta ularni bir ilovada saqlaydi, lekin hech qachon aralashtirmaydi.

**Domen:** smarta.uz

---

## 2. QAT'IY QOIDALAR — buzilmaydi

Bular mahsulot qarori. Texnik qulaylik uchun buzilmaydi.

1. **Reklama YO'Q.** Hech qanday reklama SDK, tracker, analytics uchinchi tomon xizmati qo'shilmaydi.
2. **Kredit taklifi YO'Q.** Ilova hech qachon kredit olishni tavsiya qilmaydi, kredit mahsuloti ko'rsatmaydi, kredit tashkilotiga havola bermaydi.
3. **SHAXSIY kontur izolyatsiyasi.** Biznes rejimidagi hech bir foydalanuvchi (buxgalter, direktor, kassir) shaxsiy kontur ma'lumotini KO'RA OLMAYDI. Bu — ma'lumotlar bazasi va so'rov darajasidagi cheklov, UI sozlamasi emas.
4. **Offline-first.** Ilova internetsiz to'liq ishlaydi. Tarmoq — ixtiyoriy kuchaytiruvchi, tayanch emas.
5. **Ma'lumot egaligi.** Foydalanuvchi istalgan vaqtda barcha ma'lumotini to'liq eksport qila oladi. Hech qanday cheklov yo'q.
6. **Pul harakati YO'Q.** Ilova pul o'tkazmaydi, to'lov qilmaydi, hisobot topshirmaydi. Faqat hisob yuritadi va o'qiydi.
7. **Uchinchi tomonga ma'lumot uzatilmaydi.** Foydalanuvchi moliyaviy ma'lumoti qurilmadan tashqariga faqat foydalanuvchining aniq roziligi bilan chiqadi.

Agar topshiriq shu qoidalardan biriga zid bo'lsa — **bajarma, to'xta va sabab bilan xabar ber.**

---

## 3. Texnologiya

Tanlov sababi: asoschi jamoasi bu stekni biladi (KetdikGo loyihasidan).

| Qatlam | Texnologiya |
|---|---|
| Mobil | React Native + Expo (SDK 54+), TypeScript |
| Lokal baza | SQLite (expo-sqlite) — asosiy saqlash joyi |
| Holat | Zustand |
| Navigatsiya | expo-router |
| i18n | i18next (uz-lat, uz-cyr, ru) |
| Sana | date-fns |
| Backend (keyingi faza) | Node.js + Express + PostgreSQL |

**MVP'da backend YO'Q.** Barcha ma'lumot qurilmada SQLite'da. Sinxronizatsiya keyingi fazada qo'shiladi — lekin ma'lumot modeli buni hisobga olib loyihalanadi (har yozuvda `uuid`, `updated_at`, `deleted_at`).

---

## 4. Papka tuzilishi

```
/app                  expo-router ekranlari
  /(tabs)             bosh, yozuv, qarz, fond, hisobot
/src
  /db                 schema.ts, migrations/, client.ts
  /repositories       har entity uchun CRUD (tranzaksiya, qarz, fond...)
  /domain             sof biznes mantiq — UI'siz, DB'siz, sof funksiyalar
  /components         qayta ishlatiladigan UI
  /theme              tokens.ts (rang, shrift, oraliq)
  /i18n               uz-lat.json, uz-cyr.json, ru.json
  /utils
/__tests__
```

**Qoida:** `/src/domain` ichida React ham, SQLite ham import qilinmaydi. Faqat sof funksiyalar — shuning uchun ular oson test qilinadi.

---

## 5. Dizayn tokenlari

```ts
export const colors = {
  siyoh:    '#12212E',  // asosiy matn, qoraymtir
  qogoz:    '#F7F9F9',  // fon
  ishkor:   '#1B7F91',  // BIZNES konturi aksenti
  qahrabo:  '#B5761F',  // SHAXSIY konturi aksenti
  yashil:   '#2E6B4F',  // kirim
  qizil:    '#A3352C',  // chiqim
  kul:      '#5E6E77',  // ikkilamchi matn
};
```

- Aksent rangi **kontur bo'yicha o'zgaradi**. Shaxsiy = qahrabo, Biznes = ishkor. Bu — mahsulotning signature elementi, tasodifiy emas.
- Shrift: sarlavha `Unbounded`, matn `Onest`, **raqamlar `JetBrains Mono` va doim `tabular-nums`**.
- Pul summasi doim o'ngga tekislanadi va monospace shriftda — daftar ustuni effekti.

---

## 6. i18n qoidalari

- Kodda **hech qachon** qattiq matn yozilmaydi. Faqat `t('kalit')`.
- Uch fayl bir vaqtda yangilanadi: `uz-lat.json`, `uz-cyr.json`, `ru.json`. Biri qolib ketsa — bu xato.
- Sana va son formati tilga qarab o'zgaradi.
- Standart til: `uz-lat`.

---

## 7. Ma'lumot modeli — asosiy tamoyillar

Har bir jadvalda majburiy: `id` (uuid), `created_at`, `updated_at`, `deleted_at` (soft delete), `contour` ('shaxsiy' | 'biznes').

**Tranzaksiya turlari:** `kirim` | `chiqim` | `kochirish` | `investitsiya`
Valyuta almashtirish va fondga o'tkazish — **`kochirish`**, xarajat EMAS. Bu farq buzilmaydi.

**Har bir so'rovda `contour` filtri majburiy.** Contour'siz so'rov yozish — xato.

---

## 8. Kod standartlari

- TypeScript `strict: true`. `any` ishlatilmaydi.
- Pul **tiyin/butun son** sifatida saqlanadi (`number`, so'mning 1/100 emas — O'zbekistonda tiyin ishlatilmaydi, shuning uchun butun so'm). Suzuvchi nuqta ishlatilmaydi.
- Hisob-kitob mantig'i `/src/domain` ichida va **test bilan qoplanadi**.
- Har funksiya bitta ish qiladi. 50 qatordan uzun komponent — bo'linadi.
- Kommentariya o'zbek yoki ingliz tilida, lekin **nima uchun** deb yoziladi, **nima qilyapti** deb emas.

---

## 9. Definition of Done — har topshiriq uchun

Topshiriq faqat quyidagilar bajarilganda tugagan hisoblanadi:

1. Kod yozilgan va TypeScript xatosiz kompilyatsiya bo'ladi (`npx tsc --noEmit`)
2. Lint toza (`npm run lint`)
3. Yangi mantiq uchun test yozilgan va o'tadi (`npm test`)
4. Uchala til fayli yangilangan
5. Ilova ishga tushadi va yangi ekran ochiladi
6. `PROGRESS.md` fayliga bajarilgan ish yozilgan
7. Qat'iy qoidalar (2-bo'lim) buzilmagan

**Bularning biri bajarilmasa — topshiriq tugamagan.** Keyingisiga o'tilmaydi.

---

## 10. Ish tartibi

- Har spring boshida `PROGRESS.md` o'qiladi — nima qilingan, nima qolgan.
- Kod yozishdan oldin **reja aytiladi**, tasdiq kutiladi.
- Bir vaqtda bitta spring bajariladi. Oldinga yugurilmaydi.
- Noaniqlik bo'lsa — **taxmin qilinmaydi, so'raladi.**
- Mavjud ishlaydigan kod buzilmaydi. Refaktoring alohida topshiriq sifatida so'raladi.

---

## 11. Hozircha QILINMAYDI

Bular keyingi fazalarda. MVP'ga kiritilmaydi, hatto oson bo'lsa ham:

- Backend va sinxronizatsiya
- Bank / Click / Payme integratsiyasi
- OCR (chek rasmidan o'qish)
- AI orqali kategoriyalash
- Jamoa va rollar
- Soliq hisoboti
- Ko'p korxona

Agar shulardan biri so'ralsa — eslatib qo'y va tasdiq so'ra.

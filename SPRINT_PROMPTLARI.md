# SMARTA — Claude Code uchun Sprint Promptlari

**Ishlatish tartibi:**
1. `CLAUDE.md` faylini repo ildiziga qo'ying
2. Quyidagi promptlarni **birma-bir** bering — hammasini birdan emas
3. Har sprint tugagach, o'zingiz sinab ko'ring, keyin keyingisiga o'ting
4. Xato chiqsa — keyingi spritga o'tmang, avval tuzating

**Umumiy muddat:** 8 sprint, taxminan 6–10 hafta (1 dasturchi + Claude Code)

---

## SPRINT 0 — Poydevor

```
CLAUDE.md faylini o'qi va to'liq amal qil.

VAZIFA: Expo + TypeScript loyihasini noldan yarat.

Bajariladigan ishlar:
1. Expo (SDK 54+) TypeScript shabloni bilan loyiha yarat
2. CLAUDE.md 4-bo'limidagi papka tuzilishini yarat (bo'sh fayllar bilan)
3. expo-router, zustand, expo-sqlite, i18next, date-fns o'rnat
4. TypeScript strict rejimini yoq
5. ESLint + Prettier sozla
6. Jest test muhitini sozla
7. src/theme/tokens.ts yarat — CLAUDE.md 5-bo'limidagi ranglar va shriftlar
8. src/i18n ga uchta bo'sh til fayli va i18next sozlamasi
9. 5 ta tab bilan expo-router navigatsiyasi: bosh, yozuv, qarz, fond, hisobot
   (hozircha har biri faqat sarlavha ko'rsatadi)
10. PROGRESS.md fayl yarat va Sprint 0 ni yoz

QABUL MEZONI:
- npx tsc --noEmit xatosiz o'tadi
- npm run lint toza
- npm test o'tadi (bitta smoke test bo'lsa ham)
- Ilova ishga tushadi, 5 ta tab o'rtasida almashish ishlaydi
- Til almashtirish (uz-lat / uz-cyr / ru) ishlaydi va tab nomlari o'zgaradi

Kod yozishdan oldin rejangni ayt, tasdiq kut.
```

---

## SPRINT 1 — Ma'lumotlar qatlami

```
CLAUDE.md ni o'qi. PROGRESS.md ni o'qi.

VAZIFA: SQLite ma'lumotlar bazasi va repozitoriy qatlami.

Jadvallar:
- accounts (hisob: naqd, karta, bank, valyuta)
- categories (guruh + kategoriya, kontur bo'yicha)
- transactions (asosiy yozuv)
- debts (qarz va kredit)
- debt_payments (qarz to'lovlari)
- funds (maqsadli fondlar)
- fund_movements (fondga qo'shish/olish)

Har jadvalda majburiy: id (uuid), created_at, updated_at, deleted_at, contour

Bajariladigan ishlar:
1. src/db/schema.ts — jadval ta'riflari
2. src/db/migrations/ — versiyalangan migratsiya tizimi (kelajakda schema o'zgarishi uchun)
3. src/db/client.ts — baza ulanishi va init
4. src/repositories/ — har entity uchun CRUD
5. MUHIM: har bir so'rov funksiyasi majburiy `contour` parametri qabul qiladi.
   Contour'siz ma'lumot qaytaradigan funksiya YOZILMAYDI.
6. Boshlang'ich ma'lumot (seed): O'zbekiston uchun standart kategoriyalar
   - Shaxsiy: uy-ro'zg'or, transport, sog'liq, ta'lim, oila, marosim va mehmon,
     yordam va sadaqa, jamg'arma, qarz
   - Biznes: savdo daromadi, doimiy xarajat, ish haqi, soliq va majburiy to'lov,
     tovar va xomashyo, logistika, marketing, moliyaviy, investitsiya
7. Repozitoriylar uchun testlar

QABUL MEZONI:
- Barcha CRUD test bilan qoplangan va o'tadi
- Contour izolyatsiyasi testi bor: biznes so'rovi shaxsiy yozuvni QAYTARMASLIGI isbotlangan
- Migratsiya ikki marta ishga tushsa xato bermaydi
- Seed ma'lumot uchala tilda mavjud

Rejangni ayt, tasdiq kut.
```

---

## SPRINT 2 — Ikki kontur va yozuv kiritish

```
CLAUDE.md va PROGRESS.md ni o'qi.

VAZIFA: Kontur almashtirish va tranzaksiya kiritish.

Bajariladigan ishlar:
1. Zustand store: joriy kontur (shaxsiy | biznes), til, "qoldiqni yashirish" holati
2. Kontur almashtirgich komponenti — ekran tepasida.
   Almashtirilganda butun ilovaning aksent rangi o'zgaradi (qahrabo <-> ishkor).
3. Yozuv qo'shish ekrani: summa, tur, kategoriya, hisob, sana, kontragent, izoh
4. Yozuvni tahrirlash va o'chirish (soft delete)
5. Kategoriya tanlash — guruh bo'yicha, qidiruv bilan
6. Tur: kirim / chiqim / kochirish. Kochirish xarajat sifatida hisoblanmaydi —
   bu domain qatlamida test bilan mustahkamlansin.

QABUL MEZONI:
- Kontur almashganda rang va ma'lumot to'liq o'zgaradi
- Yozuv qo'shish 10 soniyadan kam vaqt oladi (qadamlar soni bilan o'lchanadi)
- Kochirish turi hisobotda xarajatga qo'shilmasligi testi o'tadi
- Uchala tilda ishlaydi

Rejangni ayt, tasdiq kut.
```

---

## SPRINT 3 — Bosh ekran

```
CLAUDE.md va PROGRESS.md ni o'qi.

VAZIFA: Bosh ekran — qoldiq, hisoblar, statistika.

Bajariladigan ishlar:
1. Umumiy qoldiq (barcha hisoblar yig'indisi)
2. Hisob bo'yicha ajratma: NAQD birinchi va ajratilgan holda, keyin karta, bank
3. Davr tanlash: bu oy / o'tgan oy / 3 oy
4. Kirim va chiqim ko'rsatkichlari
5. O'tgan davr bilan taqqoslash (foizda, o'sish/pasayish belgisi bilan)
6. BIZNES konturida qo'shimcha: sof foyda (kirim - chiqim)
7. SHAXSIY konturida qo'shimcha: oylik xarajat limiti va progress chizig'i
8. "Qoldiqni yashirish" tugmasi — bosilganda BARCHA pul raqami niqoblanadi.
   Holat saqlanadi (ilova qayta ochilganda ham yashirin qoladi).
9. So'nggi yozuvlar ro'yxati — kategoriya va hisob ko'rsatilgan holda
10. Yozuv qidirish

QABUL MEZONI:
- Yashirish tugmasi ekrandagi hech bir raqamni ochiq qoldirmaydi (test bilan)
- Katta summalar qisqartirib ko'rsatiladi (22 000 000 -> "22,0 mln")
- Barcha hisob-kitob /src/domain ichida va test bilan qoplangan
- Davr almashganda ma'lumot to'g'ri filtrlanadi

Rejangni ayt, tasdiq kut.
```

---

## SPRINT 4 — Qarz va kredit moduli

```
CLAUDE.md va PROGRESS.md ni o'qi.
SMARTA_QARZ_KREDIT_MODULI_v1.0.json spetsifikatsiyasiga amal qil.

VAZIFA: Qarz moduli — mahsulotning eng muhim qismi.

Bajariladigan ishlar:
1. Qarz qo'shish: tur, kreditor, summa, foiz stavkasi, muddat, to'lov turi
2. Qarz ro'yxati: men qarzdorman / menga qarzdor, jami summalar
3. ENG MUHIM: bosh ko'rsatkich — "Bu oy foizga ketadi: X so'm"
   Formula: joriy_qoldiq * (yillik_stavka / 12)
   Ekranda eng ko'zga tashlanadigan joyda, qizil rangda.
4. To'lov yozuvi — asosiy qarz va foizga ajratilgan holda.
   To'lov avtomatik ravishda asosiy tranzaksiya jurnaliga ham tushadi.
   Foydalanuvchi ikki marta kiritmaydi.
5. Erta yopish kalkulyatori:
   n = -ln(1 - Q*i/P) / ln(1+i)
   Q = qoldiq, i = oylik stavka, P = oylik to'lov
   4-5 ta variant ko'rsatiladi: har birida necha oy, jami foiz, tejaladigan summa
6. OGOHLANTIRISH: agar oylik to'lov oylik foizdan kam bo'lsa —
   "Bu to'lov bilan qarz kamaymaydi" degan aniq ogohlantirish
7. Nasiya (biznes konturida): mijoz bo'yicha, muddati o'tganlar ajratilgan

QAT'IY: modulda hech qanday kredit taklifi, bank havolasi yoki
refinansirovka tavsiyasi BO'LMAYDI (CLAUDE.md 2-bo'lim, 2-qoida).

QABUL MEZONI:
- Erta yopish hisobi qo'lda hisoblangan namuna bilan ±2% ichida mos keladi
- Oylik to'lov foizdan kam holati 100% aniqlanadi — test bilan isbotlangan
- Barcha moliyaviy formula /src/domain ichida, sof funksiya sifatida, test bilan
- Chegaraviy holatlar test qilingan: 0% foiz, muddatsiz qarz, to'liq yopilgan qarz

Rejangni ayt, tasdiq kut.
```

---

## SPRINT 5 — Maqsadli fondlar

```
CLAUDE.md va PROGRESS.md ni o'qi.

VAZIFA: Fond moduli.

Bajariladigan ishlar:
1. Fond yaratish: nom, maqsad summasi, muddat, oylik reja
2. Tayyor shablonlar: Umra fondi, Zaxira jamg'arma, Yordam fondi,
   Soliq zaxirasi (biznes), Rivojlanish fondi (biznes)
3. Fondga pul qo'shish / olish — bu KOCHIRISH turi, xarajat emas
4. Progress ko'rsatkichi: yig'ilgan, qolgan, foiz
5. Oylik reja asosida hisob: "Bu sur'atda maqsadga falon sanada yetasiz"
6. Zaxira jamg'arma uchun maxsus mantiq: oylik zaruriy xarajatning 3 barobari

QABUL MEZONI:
- Fondga o'tkazish umumiy xarajat statistikasiga qo'shilmaydi (test bilan)
- Maqsad sanasi hisobi to'g'ri
- Fond bo'sh bo'lganda ham ekran to'g'ri ko'rinadi (empty state)

Rejangni ayt, tasdiq kut.
```

---

## SPRINT 6 — Hisobot va eksport

```
CLAUDE.md va PROGRESS.md ni o'qi.

VAZIFA: Hisobotlar va ma'lumot eksporti.

Bajariladigan ishlar:
1. Kirim-chiqim kitobi (davr bo'yicha) — XLSX va PDF
2. Kategoriya bo'yicha hisobot — XLSX va PDF
3. Kontragent bo'yicha hisob-kitob — XLSX
4. To'liq eksport — CSV + JSON, barcha ma'lumot, cheklovsiz
5. Fayl ulashish (expo-sharing)

QAT'IY: to'liq eksportda hech qanday cheklov, obuna talabi yoki
ma'lumot qisqartirishi BO'LMAYDI (CLAUDE.md 2-bo'lim, 5-qoida).

QABUL MEZONI:
- Har hisobot 3 bosishdan kam masofada
- 1000 ta yozuvli bazada hisobot 5 soniyadan tez tayyorlanadi
- Eksport qilingan fayl Excel va Google Sheets'da to'g'ri ochiladi
- Uchala tilda hisobot sarlavhalari to'g'ri

Rejangni ayt, tasdiq kut.
```

---

## SPRINT 7 — Tez kiritish (matn tahlili)

```
CLAUDE.md va PROGRESS.md ni o'qi.

VAZIFA: Matn orqali tez yozuv kiritish. AI ISHLATILMAYDI — lokal qoidalar.

Misol: foydalanuvchi "400 ming benzin" deb yozadi.
Ilova aniqlaydi: chiqim / Transport / 400 000 / bugun / naqd

Bajariladigan ishlar:
1. Summa tahlili: "400 ming", "400000", "2 mln", "2,5 mln", "400k"
2. Kategoriya tahlili: kalit so'zlar lug'ati (uchala tilda)
   benzin/gaz/yoqilg'i -> Transport
   non/go'sht/bozorlik -> Oziq-ovqat
   ijara -> Doimiy xarajat
   va hokazo
3. Sana tahlili: "kecha", "bugun", "12-iyul"
4. Natija foydalanuvchiga TAKLIF sifatida ko'rsatiladi.
   Ilova hech qachon jimgina yozmaydi — foydalanuvchi tasdiqlaydi.
5. O'rganish: foydalanuvchi tuzatgan tasnif eslab qolinadi va keyingi safar taklif qilinadi

QABUL MEZONI:
- 50 ta namuna jumlada aniqlik kamida 80% (test to'plami bilan o'lchanadi)
- Aniqlay olmagan holatda oddiy forma ochiladi — xato bermaydi
- Uchala til uchun kalit so'zlar mavjud

Rejangni ayt, tasdiq kut.
```

---

## SPRINT 8 — Sayqal va chiqarishga tayyorlash

```
CLAUDE.md va PROGRESS.md ni o'qi.

VAZIFA: Sifat, mosuvchanlik va chiqarishga tayyorlash.

Bajariladigan ishlar:
1. Bo'sh holat ekranlari — har bir ro'yxat uchun
2. Yuklanish holatlari
3. Xato holatlari va ularni tiklash
4. Accessibility: barcha tugmada aria/accessibility label,
   minimal teginish maydoni 44x44, kontrast tekshiruvi
5. Katta shrift rejimi qo'llab-quvvatlanishi (50+ yosh foydalanuvchi uchun)
6. Offline indikatori
7. Ma'lumot zaxirasi: lokal fayl sifatida saqlash va tiklash
8. Ilova qulfi: PIN yoki biometrika
9. Onboarding: 3 ta ekran — ikki kontur, tez yozuv, maxfiylik
10. To'liq regressiya testi

QABUL MEZONI:
- Barcha testlar o'tadi
- Katta shriftda hech bir ekran buzilmaydi
- Ilova qulfi ochilmaguncha hech qanday ma'lumot ko'rinmaydi
- Uchala til to'liq tarjima qilingan — yetishmayotgan kalit yo'q
- Yangi foydalanuvchi yordamsiz birinchi yozuvni kirita oladi
```

---

## Har sprintdan keyin o'zingiz tekshiring

1. Ilovani telefonda oching va yangi funksiyani ishlating
2. `npm test` va `npx tsc --noEmit` ni o'zingiz ishga tushiring
3. Uchala tilni almashtirib ko'ring
4. Kontur almashtirib ko'ring — ma'lumot aralashmaganini tekshiring
5. `PROGRESS.md` ni o'qing

**Xato topilsa — keyingi sprintga o'tmang.** Tuzatish uchun alohida prompt bering:

```
[Xato tavsifi]. Bu xatoni topib tuzat.
Tuzatishdan oldin sababini tushuntir.
Boshqa hech narsani o'zgartirma.
Tuzatgandan keyin tegishli test qo'sh.
```

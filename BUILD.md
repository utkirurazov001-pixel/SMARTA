# SMARTA — telefonda sinash va build

Ilova React Native + Expo (SDK 57). Telefonda sinashning uch yo'li bor. **Barcha buyruqlar o'z kompyuteringizda bajariladi** (bu yerdagi remote muhitda Expo serverlariga chiqish bloklangan).

Avval loyihani tayyorlang:

```bash
git clone https://github.com/utkirurazov001-pixel/SMARTA.git
cd SMARTA
npm install --legacy-peer-deps
```

---

## 1. Eng tez — Expo Go (build shart emas)

Telefonga **Expo Go** ilovasini o'rnating (Play Store / App Store), keyin:

```bash
npx expo start
```

- Android: Expo Go ichida QR-kodni skanerlang.
- iOS: Kamera bilan QR-kodni skanerlang → Expo Go ochiladi.

> Eslatma: kompyuter va telefon bir Wi-Fi'da bo'lsin. Ishlamasa `npx expo start --tunnel`.

Bu usul sinash uchun yetarli. Ba'zi native funksiyalar (biometrika) faqat haqiqiy build'da to'liq ishlaydi — quyida.

---

## 2. Android APK (o'rnatiladigan fayl) — EAS Build

Bepul Expo hisobi kerak (expo.dev). APK bulutda yig'iladi.

```bash
npm install -g eas-cli        # yoki har safar: npx eas-cli@latest
eas login                     # Expo hisobiga kirish (bepul)
eas build -p android --profile preview
```

- Birinchi build loyihani Expo'da ro'yxatdan o'tkazadi (`app.json`ga `projectId` yoziladi) — tasdiqlang.
- Yig'ilgach terminalda **APK yuklab olish havolasi** chiqadi. Telefonga yuklab, o'rnating (Android'da "Noma'lum manbalar"ga ruxsat kerak).

`preview` profili aynan APK beradi (`eas.json` da `buildType: apk`).

---

## 3. iOS build — EAS Build

iOS'da o'rnatish Apple ekotizimi tufayli murakkabroq:

### a) Haqiqiy iPhone'ga
Apple Developer hisobi kerak ($99/yil). EAS sertifikat/profil sozlashda yordam beradi:

```bash
eas build -p ios --profile preview
```

O'rnatish TestFlight yoki ad-hoc havola orqali (EAS ko'rsatadi).

### b) iOS Simulyator uchun (Mac + Xcode kerak, bepul)

```bash
eas build -p ios --profile simulator
```

Yig'ilgan `.app` faylni yuklab, Simulyatorga tashlang (drag-and-drop).

> Apple Developer hisobisiz haqiqiy iPhone'da sinashning yagona bepul yo'li — **1-usul (Expo Go)**.

---

## 4. Lokal build (ixtiyoriy)

Agar SDK'lar o'rnatilgan bo'lsa:

```bash
npx expo run:android    # Android SDK kerak
npx expo run:ios        # Mac + Xcode kerak
```

---

## Sifat tekshiruvi (build oldidan)

```bash
npm run typecheck   # tsc --noEmit
npm run lint
npm test
```

## Konfiguratsiya

- Ilova IDsi: `uz.smarta.app` (Android `package`, iOS `bundleIdentifier` — `app.json`).
- Build profillari: `eas.json` (`development`, `preview` → APK, `simulator`, `production`).

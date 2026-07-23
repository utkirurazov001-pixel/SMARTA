# SMARTA

O'zbekiston uchun kirim-chiqim hisobi platformasi. Har bir tadbirkorda ikkita pul bor — o'ziniki va ishniki. Smarta ularni bir ilovada saqlaydi, lekin hech qachon aralashtirmaydi.

**Domen:** smarta.uz

## Texnologiya

React Native + Expo (SDK 57), TypeScript (strict), expo-router, Zustand, SQLite (expo-sqlite), i18next (uz-lat / uz-cyr / ru), date-fns.

Offline-first, backend'siz MVP. Batafsil qoidalar — [`CLAUDE.md`](./CLAUDE.md), sprint rejasi — [`SPRINT_PROMPTLARI.md`](./SPRINT_PROMPTLARI.md), bajarilgan ish — [`PROGRESS.md`](./PROGRESS.md).

## Ishga tushirish

```bash
npm install --legacy-peer-deps
npm start          # Expo dev server
```

## Sifat tekshiruvi

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # jest
```

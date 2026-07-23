// Fayl eksporti va ulashish. Bu modul native modullarni import qiladi — faqat ilova
// kodi ishlatadi (testlar sof domen funksiyalarini tekshiradi).
//
// QAT'IY (CLAUDE.md 2-bo'lim, 5-qoida): to'liq eksportda hech qanday cheklov,
// obuna talabi yoki ma'lumot qisqartirishi YO'Q.

import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

import type { Jadval } from '../domain/hisobot';

async function ulash(uri: string): Promise<void> {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }
}

// Matnli fayl (CSV/JSON). CSV uchun BOM — Excel UTF-8'ni (kirill/lotin) to'g'ri o'qishi uchun.
export async function matnEksport(nom: string, matn: string, bom = false): Promise<void> {
  const uri = FileSystem.cacheDirectory + nom;
  await FileSystem.writeAsStringAsync(uri, (bom ? '﻿' : '') + matn, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  await ulash(uri);
}

// XLSX fayl — jadvaldan.
export async function xlsxEksport(nom: string, varaqNom: string, jadval: Jadval): Promise<void> {
  const ws = XLSX.utils.aoa_to_sheet([jadval.sarlavhalar, ...jadval.qatorlar]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, varaqNom);
  const b64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' }) as string;
  const uri = FileSystem.cacheDirectory + nom;
  await FileSystem.writeAsStringAsync(uri, b64, { encoding: FileSystem.EncodingType.Base64 });
  await ulash(uri);
}

function html(sarlavha: string, jadval: Jadval): string {
  const th = jadval.sarlavhalar.map((s) => `<th>${s}</th>`).join('');
  const tr = jadval.qatorlar
    .map((q) => `<tr>${q.map((c) => `<td>${String(c)}</td>`).join('')}</tr>`)
    .join('');
  return `<html><head><meta charset="utf-8"><style>
    body{font-family:sans-serif;padding:16px}
    h1{font-size:18px}
    table{border-collapse:collapse;width:100%;font-size:12px}
    th,td{border:1px solid #ccc;padding:4px 6px;text-align:left}
    th{background:#f0f0f0}
  </style></head><body><h1>${sarlavha}</h1>
  <table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></body></html>`;
}

// PDF fayl — jadvaldan (expo-print orqali).
export async function pdfEksport(sarlavha: string, jadval: Jadval): Promise<void> {
  const { uri } = await Print.printToFileAsync({ html: html(sarlavha, jadval) });
  await ulash(uri);
}

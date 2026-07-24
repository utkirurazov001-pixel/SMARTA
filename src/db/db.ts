// SmartaDb — minimal async DB interfeysi. Repozitoriylar faqat shu interfeysga
// tayanadi, expo-sqlite'ga bevosita EMAS. Shu tufayli testlarda node:sqlite adapteri
// bilan bir xil kod sinaladi, ilovada esa expo-sqlite ishlaydi.

export type SqlParam = string | number | null;

export interface RunResult {
  lastInsertRowId: number;
  changes: number;
}

export interface SmartaDb {
  // Bir yoki bir nechta statement (DDL, PRAGMA) ijro etadi.
  execAsync(sql: string): Promise<void>;
  // Bitta yozuv/o'zgartirish statement'i.
  runAsync(sql: string, params?: SqlParam[]): Promise<RunResult>;
  // Barcha qatorlarni qaytaradi.
  getAllAsync<T>(sql: string, params?: SqlParam[]): Promise<T[]>;
  // Birinchi qatorni yoki null qaytaradi.
  getFirstAsync<T>(sql: string, params?: SqlParam[]): Promise<T | null>;
}

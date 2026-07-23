// Yozuv vaqt tamg'alari uchun ISO-8601 sana-vaqt (UTC).
export function nowIso(): string {
  return new Date().toISOString();
}

// Pul — butun so'm (tiyin yo'q). Ko'rsatishda mingliklar probel bilan ajratiladi.

// 1500000 -> "1 500 000". Manfiy summalar "-" bilan.
export function formatSom(amount: number): string {
  const butun = Math.trunc(amount);
  const belgi = butun < 0 ? '-' : '';
  const abs = Math.abs(butun).toString();
  return belgi + abs.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Foydalanuvchi kiritgan matndan raqamni ajratadi: "1 500 000" yoki "1500000so'm" -> 1500000.
export function parseSomInput(input: string): number {
  const digits = input.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

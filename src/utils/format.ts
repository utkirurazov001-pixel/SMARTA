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

// Son qisqartmasi birliklari (tilga bog'liq — tashqaridan beriladi).
export interface SonBirlik {
  mln: string;
  mlrd: string;
}

function birKasr(x: number): string {
  // Bir kasr, vergul bilan: 22.0 -> "22,0".
  return x.toFixed(1).replace('.', ',');
}

// Katta summani qisqartiradi: 22000000 -> "22,0 mln". 1e6 dan kichigi to'liq ko'rsatiladi.
export function qisqaSom(n: number, b: SonBirlik): string {
  const belgi = n < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(n));
  if (abs >= 1_000_000_000) {
    return `${belgi}${birKasr(abs / 1_000_000_000)} ${b.mlrd}`;
  }
  if (abs >= 1_000_000) {
    return `${belgi}${birKasr(abs / 1_000_000)} ${b.mln}`;
  }
  return formatSom(n);
}

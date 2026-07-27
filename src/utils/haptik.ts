// Haptik javob (yengil tebranish) — saqlash kabi asosiy amallarda tasdiq hissi.
// Xatolar yutiladi — haptik ixtiyoriy kuchaytiruvchi, tayanch emas.
import * as Haptics from 'expo-haptics';

export function muvaffaqiyat(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function tegish(): void {
  void Haptics.selectionAsync().catch(() => {});
}

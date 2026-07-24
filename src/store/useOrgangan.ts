// O'rganish: foydalanuvchi tuzatgan tasnif eslab qolinadi va keyingi safar taklif qilinadi.
// Kalit (tavsifiy matn) -> tanlangan kategoriya id. AsyncStorage'da saqlanadi.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OrganganState {
  // Kontur bo'yicha ajratilgan xarita: `${contour}:${kalit}` -> categoryId.
  xarita: Record<string, string>;
  orgat: (kontur: string, kalit: string, categoryId: string) => void;
  ol: (kontur: string, kalit: string) => string | undefined;
}

function toKalit(kontur: string, kalit: string): string {
  return `${kontur}:${kalit}`;
}

export const useOrgangan = create<OrganganState>()(
  persist(
    (set, get) => ({
      xarita: {},
      orgat: (kontur, kalit, categoryId) => {
        if (!kalit) {
          return;
        }
        set((s) => ({ xarita: { ...s.xarita, [toKalit(kontur, kalit)]: categoryId } }));
      },
      ol: (kontur, kalit) => get().xarita[toKalit(kontur, kalit)],
    }),
    {
      name: 'smarta-organgan',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

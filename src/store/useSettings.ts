// Ilova sozlamalari: joriy kontur, til, "qoldiqni yashirish" holati.
// AsyncStorage'da saqlanadi — ilova qayta ochilganda tiklanadi (offline-first).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Contour } from '../domain/types';
import i18n, { STANDART_TIL, type Til } from '../i18n';

interface SettingsState {
  contour: Contour;
  til: Til;
  qoldiqYashirin: boolean;
  // Shaxsiy kontur oylik xarajat limiti (butun so'm). 0 — belgilanmagan.
  oylikLimit: number;
  setContour: (c: Contour) => void;
  setTil: (t: Til) => void;
  toggleQoldiq: () => void;
  setOylikLimit: (n: number) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      contour: 'shaxsiy',
      til: STANDART_TIL,
      qoldiqYashirin: false,
      oylikLimit: 0,
      setContour: (contour) => set({ contour }),
      setTil: (til) => {
        void i18n.changeLanguage(til);
        set({ til });
      },
      toggleQoldiq: () => set((s) => ({ qoldiqYashirin: !s.qoldiqYashirin })),
      setOylikLimit: (oylikLimit) => set({ oylikLimit }),
    }),
    {
      name: 'smarta-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        contour: s.contour,
        til: s.til,
        qoldiqYashirin: s.qoldiqYashirin,
        oylikLimit: s.oylikLimit,
      }),
      // Saqlangan til tiklanganda i18n ham moslashsin.
      onRehydrateStorage: () => (state) => {
        if (state?.til) {
          void i18n.changeLanguage(state.til);
        }
      },
    },
  ),
);

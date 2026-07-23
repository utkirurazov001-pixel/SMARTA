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
  setContour: (c: Contour) => void;
  setTil: (t: Til) => void;
  toggleQoldiq: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      contour: 'shaxsiy',
      til: STANDART_TIL,
      qoldiqYashirin: false,
      setContour: (contour) => set({ contour }),
      setTil: (til) => {
        void i18n.changeLanguage(til);
        set({ til });
      },
      toggleQoldiq: () => set((s) => ({ qoldiqYashirin: !s.qoldiqYashirin })),
    }),
    {
      name: 'smarta-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ contour: s.contour, til: s.til, qoldiqYashirin: s.qoldiqYashirin }),
      // Saqlangan til tiklanganda i18n ham moslashsin.
      onRehydrateStorage: () => (state) => {
        if (state?.til) {
          void i18n.changeLanguage(state.til);
        }
      },
    },
  ),
);

// Ilova holati: onboarding ko'rilganmi. AsyncStorage'da saqlanadi.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface IlovaHolat {
  onboardingKorildi: boolean;
  setOnboardingKorildi: (v: boolean) => void;
}

export const useIlovaHolat = create<IlovaHolat>()(
  persist(
    (set) => ({
      onboardingKorildi: false,
      setOnboardingKorildi: (onboardingKorildi) => set({ onboardingKorildi }),
    }),
    {
      name: 'smarta-ilova-holat',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

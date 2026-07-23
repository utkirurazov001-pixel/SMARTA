import { useEffect, useState, type ReactNode } from 'react';

import { useIlovaHolat } from '../store/useIlovaHolat';
import { pinBormi } from '../utils/qulf';
import Onboarding from './Onboarding';
import Qulf from './Qulf';

type QulfHolat = 'tekshirilmoqda' | 'qulflangan' | 'ochiq';

// Ilovaga kirish darvozasi: avval onboarding, keyin qulf. Ochilmaguncha ilova ko'rinmaydi.
export default function IlovaDarvoza({ children }: { children: ReactNode }) {
  const onboardingKorildi = useIlovaHolat((s) => s.onboardingKorildi);
  const setOnboardingKorildi = useIlovaHolat((s) => s.setOnboardingKorildi);

  const [gidratlandi, setGidratlandi] = useState(() => useIlovaHolat.persist.hasHydrated());
  const [qulf, setQulf] = useState<QulfHolat>('tekshirilmoqda');

  useEffect(() => {
    const unsub = useIlovaHolat.persist.onFinishHydration(() => setGidratlandi(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!(gidratlandi && onboardingKorildi)) {
      return;
    }
    let tirik = true;
    void (async () => {
      const bor = await pinBormi();
      if (tirik) {
        setQulf(bor ? 'qulflangan' : 'ochiq');
      }
    })();
    return () => {
      tirik = false;
    };
  }, [gidratlandi, onboardingKorildi]);

  if (!gidratlandi) {
    return null;
  }

  if (!onboardingKorildi) {
    return (
      <Onboarding
        onFinish={() => {
          // Onboardingdan so'ng shu sessiya ochiq — PIN yangi o'rnatilgan bo'lsa ham qayta so'ralmaydi.
          setQulf('ochiq');
          setOnboardingKorildi(true);
        }}
      />
    );
  }

  if (qulf === 'qulflangan') {
    return <Qulf onUnlock={() => setQulf('ochiq')} />;
  }

  if (qulf === 'tekshirilmoqda') {
    return null;
  }

  return <>{children}</>;
}

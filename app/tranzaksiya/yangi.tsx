import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import TranzaksiyaForma from '../../src/components/TranzaksiyaForma';

// To'liq forma orqali yangi yozuv qo'shish.
export default function YangiTranzaksiyaEkran() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: t('yozuv.yangi') }} />
      <TranzaksiyaForma onSaved={() => router.back()} />
    </>
  );
}

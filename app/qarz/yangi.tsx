import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import QarzForma from '../../src/components/QarzForma';

// Yangi qarz qo'shish ekrani.
export default function YangiQarzEkran() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: t('qarz.yangi') }} />
      <QarzForma onSaved={() => router.back()} />
    </>
  );
}

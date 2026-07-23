import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useAccent } from '../../src/store/useAccent';
import { colors } from '../../src/theme/tokens';

// 5 ta tab: bosh, yozuv, qarz, fond, hisobot.
// Tab nomlari i18n orqali; faol tab rangi joriy kontur aksenti (qahrabo/ishkor).
export default function TabsLayout() {
  const { t } = useTranslation();
  const accent = useAccent();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: colors.kul,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.bosh') }} />
      <Tabs.Screen name="yozuv" options={{ title: t('tabs.yozuv') }} />
      <Tabs.Screen name="qarz" options={{ title: t('tabs.qarz') }} />
      <Tabs.Screen name="fond" options={{ title: t('tabs.fond') }} />
      <Tabs.Screen name="hisobot" options={{ title: t('tabs.hisobot') }} />
    </Tabs>
  );
}

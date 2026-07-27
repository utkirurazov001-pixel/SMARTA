import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useAccent } from '../../src/store/useAccent';
import { colors, fonts } from '../../src/theme/tokens';

// 5 ta tab: bosh, yozuv, qarz, fond, hisobot.
// Tab nomlari i18n orqali; faol tab rangi joriy kontur aksenti (qahrabo/ishkor).
export default function TabsLayout() {
  const { t } = useTranslation();
  const accent = useAccent();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.qogoz },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.sarlavha, fontSize: 18, color: colors.siyoh },
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: colors.kul,
        tabBarLabelStyle: { fontFamily: fonts.matn, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.oq, borderTopColor: colors.chegara },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.bosh'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="yozuv"
        options={{
          title: t('tabs.yozuv'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="qarz"
        options={{
          title: t('tabs.qarz'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'card' : 'card-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fond"
        options={{
          title: t('tabs.fond'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hisobot"
        options={{
          title: t('tabs.hisobot'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

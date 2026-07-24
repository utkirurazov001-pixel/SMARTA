import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Unbounded_600SemiBold } from '@expo-google-fonts/unbounded';
import { Onest_400Regular } from '@expo-google-fonts/onest';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';

// i18next'ni ilova ishga tushishida bir marta ishga tushiramiz.
import '../src/i18n';
import { DbProvider } from '../src/db/DbProvider';
import IlovaDarvoza from '../src/components/IlovaDarvoza';
import OfflineIndikator from '../src/components/OfflineIndikator';
import { colors, fonts } from '../src/theme/tokens';

export default function RootLayout() {
  // Brend shriftlari token nomlariga moslab yuklanadi (CLAUDE.md 5-bo'lim).
  const [shriftYuklandi] = useFonts({
    Unbounded: Unbounded_600SemiBold,
    Onest: Onest_400Regular,
    JetBrainsMono: JetBrainsMono_500Medium,
  });

  if (!shriftYuklandi) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <IlovaDarvoza>
          <DbProvider>
            <OfflineIndikator />
            <Stack
              screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: colors.qogoz },
                headerShadowVisible: false,
                headerTintColor: colors.siyoh,
                headerTitleStyle: { fontFamily: fonts.sarlavha, fontSize: 18, color: colors.siyoh },
                contentStyle: { backgroundColor: colors.qogoz },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="tranzaksiya/[id]" options={{ presentation: 'modal' }} />
            </Stack>
          </DbProvider>
        </IlovaDarvoza>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

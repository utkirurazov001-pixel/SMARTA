import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// i18next'ni ilova ishga tushishida bir marta ishga tushiramiz.
import '../src/i18n';
import { DbProvider } from '../src/db/DbProvider';
import IlovaDarvoza from '../src/components/IlovaDarvoza';
import OfflineIndikator from '../src/components/OfflineIndikator';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <IlovaDarvoza>
          <DbProvider>
            <OfflineIndikator />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="tranzaksiya/[id]" options={{ presentation: 'modal' }} />
            </Stack>
          </DbProvider>
        </IlovaDarvoza>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

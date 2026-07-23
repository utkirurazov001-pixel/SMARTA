import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// i18next'ni ilova ishga tushishida bir marta ishga tushiramiz.
import '../src/i18n';
import { DbProvider } from '../src/db/DbProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <DbProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="tranzaksiya/[id]" options={{ presentation: 'modal' }} />
          </Stack>
        </DbProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

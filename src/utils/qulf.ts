// Ilova qulfi: PIN (expo-secure-store — qurilmada shifrlangan) va biometrika.
// Ma'lumot faqat qulf ochilgandan keyin ko'rinadi (CLAUDE.md Sprint 8).

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'smarta_pin';

export async function pinBormi(): Promise<boolean> {
  const v = await SecureStore.getItemAsync(PIN_KEY);
  return v !== null && v.length > 0;
}

export async function pinOrnat(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function pinTekshir(pin: string): Promise<boolean> {
  const v = await SecureStore.getItemAsync(PIN_KEY);
  return v !== null && v === pin;
}

export async function pinOchir(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function biometrikMavjud(): Promise<boolean> {
  const bor = await LocalAuthentication.hasHardwareAsync();
  const royxat = await LocalAuthentication.isEnrolledAsync();
  return bor && royxat;
}

export async function biometrikTekshir(): Promise<boolean> {
  const r = await LocalAuthentication.authenticateAsync();
  return r.success;
}

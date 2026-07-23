import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import KonturTanlagich from '../../src/components/KonturTanlagich';
import TranzaksiyaForma from '../../src/components/TranzaksiyaForma';
import { colors } from '../../src/theme/tokens';

// Yozuv qo'shish ekrani. Har fokusda forma yangi ochiladi (tez kiritish uchun).
export default function YozuvEkran() {
  const router = useRouter();
  const [kalit, setKalit] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setKalit((k) => k + 1);
    }, []),
  );

  return (
    <View style={styles.konteyner}>
      <KonturTanlagich />
      <TranzaksiyaForma key={kalit} onSaved={() => router.navigate('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
});

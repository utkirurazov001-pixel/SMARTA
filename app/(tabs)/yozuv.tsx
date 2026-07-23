import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import KonturTanlagich from '../../src/components/KonturTanlagich';
import TezKiritish from '../../src/components/TezKiritish';
import { useAccent } from '../../src/store/useAccent';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';

// Yozuv ekrani: tez kiritish (matn tahlili) birinchi; to'liq forma alohida.
export default function YozuvEkran() {
  const { t } = useTranslation();
  const router = useRouter();
  const accent = useAccent();
  const [kalit, setKalit] = useState(0);

  // Har fokusda tez kiritishni yangilaymiz.
  useFocusEffect(
    useCallback(() => {
      setKalit((k) => k + 1);
    }, []),
  );

  return (
    <ScrollView style={styles.konteyner} keyboardShouldPersistTaps="handled">
      <KonturTanlagich />
      <TezKiritish key={kalit} onSaved={() => router.navigate('/')} />
      <Pressable
        accessibilityRole="button"
        style={[styles.toliq, { borderColor: accent }]}
        onPress={() => router.push('/tranzaksiya/yangi')}
      >
        <Text style={[styles.toliqMatn, { color: accent }]}>{t('tez.toliq')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  toliq: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  toliqMatn: { fontFamily: fonts.sarlavha, fontSize: 15 },
});

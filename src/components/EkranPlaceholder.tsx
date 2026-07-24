import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, spacing } from '../theme/tokens';

type Props = {
  // Ekran sarlavhasi uchun i18n kaliti (masalan 'ekran.bosh')
  sarlavhaKalit: string;
};

// Sprint 0 uchun vaqtinchalik ekran: faqat sarlavha va "keyin to'ldiriladi" izohi.
// Keyingi sprintlarda har biri o'z mazmuni bilan almashtiriladi.
export default function EkranPlaceholder({ sarlavhaKalit }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.konteyner}>
      <Text style={styles.sarlavha}>{t(sarlavhaKalit)}</Text>
      <Text style={styles.izoh}>{t('ekran.tayyor')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  konteyner: {
    flex: 1,
    backgroundColor: colors.qogoz,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sarlavha: {
    fontFamily: fonts.sarlavha,
    fontSize: 22,
    color: colors.siyoh,
    textAlign: 'center',
  },
  izoh: {
    fontFamily: fonts.matn,
    fontSize: 14,
    color: colors.kul,
    textAlign: 'center',
  },
});

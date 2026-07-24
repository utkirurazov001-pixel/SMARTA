import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAccent } from '../store/useAccent';
import { useSettings } from '../store/useSettings';
import { colors, fonts, radius, soya, spacing } from '../theme/tokens';
import { tegish } from '../utils/haptik';
import PulMatn from './PulMatn';

interface Props {
  qoldiq: number;
}

// Umumiy qoldiq kartasi + "qoldiqni yashirish" (ko'z ikonkasi). Yashirish holati saqlanadi.
export default function QoldiqKarta({ qoldiq }: Props) {
  const { t } = useTranslation();
  const accent = useAccent();
  const yashirin = useSettings((s) => s.qoldiqYashirin);
  const toggle = useSettings((s) => s.toggleQoldiq);

  return (
    <View style={styles.karta}>
      <View style={styles.tepa}>
        <Text style={styles.yorliq}>{t('bosh.qoldiq')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={yashirin ? t('bosh.korsat') : t('bosh.yashir')}
          onPress={() => {
            tegish();
            toggle();
          }}
          hitSlop={12}
        >
          <Ionicons name={yashirin ? 'eye-off-outline' : 'eye-outline'} size={22} color={accent} />
        </Pressable>
      </View>
      <PulMatn amount={qoldiq} yashirin={yashirin} som style={[styles.summa, { color: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  karta: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.oq,
    gap: spacing.sm,
    ...soya,
  },
  tepa: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yorliq: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
  summa: { fontSize: 30 },
});

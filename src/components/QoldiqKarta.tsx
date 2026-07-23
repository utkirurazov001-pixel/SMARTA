import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAccent } from '../store/useAccent';
import { useSettings } from '../store/useSettings';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import PulMatn from './PulMatn';

interface Props {
  qoldiq: number;
}

// Umumiy qoldiq kartasi + "qoldiqni yashirish" tugmasi. Yashirish holati saqlanadi.
export default function QoldiqKarta({ qoldiq }: Props) {
  const { t } = useTranslation();
  const accent = useAccent();
  const yashirin = useSettings((s) => s.qoldiqYashirin);
  const toggle = useSettings((s) => s.toggleQoldiq);

  return (
    <View style={styles.karta}>
      <View style={styles.tepa}>
        <Text style={styles.yorliq}>{t('bosh.qoldiq')}</Text>
        <Pressable accessibilityRole="button" onPress={toggle} hitSlop={8}>
          <Text style={[styles.tugma, { color: accent }]}>
            {yashirin ? t('bosh.korsat') : t('bosh.yashir')}
          </Text>
        </Pressable>
      </View>
      <PulMatn
        amount={qoldiq}
        yashirin={yashirin}
        qisqa
        style={[styles.summa, { color: accent }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  karta: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.qogoz,
    gap: spacing.sm,
  },
  tepa: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yorliq: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
  tugma: { fontFamily: fonts.matn, fontSize: 14 },
  summa: { fontSize: 34 },
});

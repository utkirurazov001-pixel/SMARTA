import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, radius, soya, spacing } from '../theme/tokens';
import PulMatn from './PulMatn';

interface Props {
  yorliq: string;
  qiymat: number;
  rang?: string;
  qoldiqYashirin: boolean;
  // O'tgan davrga nisbatan foiz. null — taqqoslab bo'lmaydi, undefined — ko'rsatilmaydi.
  foiz?: number | null;
}

// Kirim/chiqim/sof foyda ko'rsatkichi + o'tgan davr bilan taqqoslash.
export default function StatKarta({ yorliq, qiymat, rang, qoldiqYashirin, foiz }: Props) {
  const { t } = useTranslation();
  const rangQiymat = rang ?? colors.siyoh;

  return (
    <View style={styles.karta}>
      <Text style={styles.yorliq}>{yorliq}</Text>
      <PulMatn
        amount={qiymat}
        yashirin={qoldiqYashirin}
        som
        style={[styles.qiymat, { color: rangQiymat }]}
      />
      {foiz !== undefined && foiz !== null ? (
        <Text style={[styles.foiz, { color: foiz >= 0 ? colors.yashil : colors.qizil }]}>
          {(foiz >= 0 ? '↑' : '↓') + ' ' + Math.abs(foiz).toFixed(1) + '% ' + t('bosh.taqqoslash')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  karta: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.oq,
    gap: spacing.xs,
    ...soya,
  },
  yorliq: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul },
  qiymat: { fontSize: 18 },
  foiz: { fontFamily: fonts.matn, fontSize: 11 },
});

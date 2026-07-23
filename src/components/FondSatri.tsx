import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FondKorinish } from '../db/useFunds';
import { fondProgress } from '../domain/fond';
import { useAccent } from '../store/useAccent';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import PulMatn from './PulMatn';

interface Props {
  korinish: FondKorinish;
  qoldiqYashirin: boolean;
  onPress: (id: string) => void;
}

// Fond ro'yxatidagi satr: nom, progress chizig'i, yig'ilgan / maqsad.
export default function FondSatri({ korinish, qoldiqYashirin, onPress }: Props) {
  const accent = useAccent();
  const { fund, yigilgan } = korinish;
  const { foiz } = fondProgress(yigilgan, fund.target_amount);

  return (
    <Pressable accessibilityRole="button" style={styles.karta} onPress={() => onPress(fund.id)}>
      <View style={styles.tepa}>
        <Text style={styles.nom}>{fund.name}</Text>
        <Text style={styles.foiz}>{Math.round(foiz)}%</Text>
      </View>
      <View style={styles.chiziqFon}>
        <View style={[styles.chiziq, { width: `${foiz}%`, backgroundColor: accent }]} />
      </View>
      <View style={styles.pastki}>
        <PulMatn amount={yigilgan} yashirin={qoldiqYashirin} qisqa style={styles.kichik} />
        <PulMatn
          amount={fund.target_amount}
          yashirin={qoldiqYashirin}
          qisqa
          style={styles.kichik}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  karta: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  tepa: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nom: { fontFamily: fonts.matn, fontSize: 16, color: colors.siyoh },
  foiz: { fontFamily: fonts.raqam, fontVariant: ['tabular-nums'], fontSize: 14, color: colors.kul },
  chiziqFon: { height: 8, borderRadius: 4, backgroundColor: colors.qogoz, overflow: 'hidden' },
  chiziq: { height: 8, borderRadius: 4 },
  pastki: { flexDirection: 'row', justifyContent: 'space-between' },
  kichik: { fontSize: 12, color: colors.kul },
});

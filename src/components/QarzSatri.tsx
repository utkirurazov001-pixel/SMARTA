import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { QarzKorinish } from '../db/useDebts';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import PulMatn from './PulMatn';

interface Props {
  korinish: QarzKorinish;
  qoldiqYashirin: boolean;
  onPress: (id: string) => void;
}

// Qarz ro'yxatidagi bitta satr: kreditor, qoldiq, oylik foiz, holat.
export default function QarzSatri({ korinish, qoldiqYashirin, onPress }: Props) {
  const { t } = useTranslation();
  const { debt, qoldiq, oylikFoiz } = korinish;
  const yopilgan = debt.status === 'yopilgan';

  return (
    <Pressable accessibilityRole="button" style={styles.qator} onPress={() => onPress(debt.id)}>
      <View style={styles.chap}>
        <Text style={styles.nom}>{debt.counterparty}</Text>
        {yopilgan ? (
          <Text style={styles.yopilgan}>{t('qarz.yopilgan')}</Text>
        ) : (
          <Text style={styles.foiz}>
            {t('qarz.oylikFoiz')}: <PulMatn amount={oylikFoiz} yashirin={qoldiqYashirin} />
          </Text>
        )}
      </View>
      <PulMatn amount={qoldiq} yashirin={qoldiqYashirin} style={styles.qoldiq} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  qator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    gap: spacing.md,
  },
  chap: { flex: 1, gap: 2 },
  nom: { fontFamily: fonts.matn, fontSize: 16, color: colors.siyoh },
  foiz: { fontFamily: fonts.matn, fontSize: 12, color: colors.kul },
  yopilgan: { fontFamily: fonts.matn, fontSize: 12, color: colors.yashil },
  qoldiq: { fontSize: 16, color: colors.siyoh },
});

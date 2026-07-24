import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { AccountRow, CategoryRow, TransactionRow } from '../db/schema';
import { colors, fonts, numeric, spacing } from '../theme/tokens';
import { formatKun } from '../utils/date';
import { formatSom } from '../utils/format';
import { kategoriyaNomi } from '../utils/labels';
import { NIQOB } from '../utils/pul';

interface Props {
  tx: TransactionRow;
  kategoriya?: CategoryRow;
  hisob?: AccountRow;
  qoldiqYashirin: boolean;
  onPress: (id: string) => void;
}

// Ro'yxatdagi bitta yozuv satri. Sof taqdimot — ma'lumot tashqaridan keladi.
export default function TranzaksiyaSatri({
  tx,
  kategoriya,
  hisob,
  qoldiqYashirin,
  onPress,
}: Props) {
  const { t } = useTranslation();

  const belgi = tx.type === 'kirim' ? '+' : tx.type === 'chiqim' ? '−' : '';
  const rang =
    tx.type === 'kirim' ? colors.yashil : tx.type === 'chiqim' ? colors.qizil : colors.kul;
  const sarlavha = kategoriya ? kategoriyaNomi(kategoriya, t) : t(`tur.${tx.type}`);

  return (
    <Pressable accessibilityRole="button" style={styles.qator} onPress={() => onPress(tx.id)}>
      <View style={styles.chap}>
        <Text style={styles.katNom}>{sarlavha}</Text>
        <Text style={styles.izoh}>{(hisob?.name ?? '') + ' · ' + formatKun(tx.occurred_at)}</Text>
      </View>
      <Text style={[styles.summa, { color: rang }]}>
        {qoldiqYashirin ? NIQOB : `${belgi}${formatSom(tx.amount)}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  qator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.kul,
    gap: spacing.md,
  },
  chap: { flex: 1 },
  katNom: { fontFamily: fonts.matn, fontSize: 16, color: colors.siyoh },
  izoh: { fontFamily: fonts.matn, fontSize: 12, color: colors.kul, marginTop: 2 },
  summa: { ...numeric, fontSize: 16 },
});

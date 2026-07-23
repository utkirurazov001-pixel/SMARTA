import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { AccountRow, TransactionRow } from '../db/schema';
import { hisobBalansi, hisobTartibi } from '../domain/balans';
import { colors, fonts, spacing } from '../theme/tokens';
import PulMatn from './PulMatn';

interface Props {
  hisoblar: AccountRow[];
  transactions: TransactionRow[];
  qoldiqYashirin: boolean;
}

// Hisoblar bo'yicha ajratma: NAQD birinchi va ajratilgan, keyin karta, bank, valyuta.
export default function HisobRoyxati({ hisoblar, transactions, qoldiqYashirin }: Props) {
  const { t } = useTranslation();
  const tartiblangan = hisobTartibi(hisoblar);

  if (tartiblangan.length === 0) {
    return null;
  }

  return (
    <View style={styles.blok}>
      <Text style={styles.sarlavha}>{t('bosh.hisoblar')}</Text>
      {tartiblangan.map((h) => (
        <View key={h.id} style={[styles.qator, h.kind === 'naqd' && styles.naqd]}>
          <Text style={styles.nom}>{h.name}</Text>
          <PulMatn
            amount={hisobBalansi(h, transactions)}
            yashirin={qoldiqYashirin}
            style={styles.summa}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  blok: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.xs },
  sarlavha: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul, marginBottom: spacing.xs },
  qator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  naqd: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.kul,
  },
  nom: { fontFamily: fonts.matn, fontSize: 15, color: colors.siyoh },
  summa: { fontSize: 15, color: colors.siyoh },
});

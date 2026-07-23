import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useDb } from '../db/DbProvider';
import type { AccountRow, CategoryRow, TransactionRow } from '../db/schema';
import { listAccounts } from '../repositories/accounts';
import { listCategories } from '../repositories/categories';
import { listTransactions } from '../repositories/transactions';
import { useSettings } from '../store/useSettings';
import { colors, fonts, numeric, spacing } from '../theme/tokens';
import { formatKun } from '../utils/date';
import { formatSom } from '../utils/format';
import { kategoriyaNomi } from '../utils/labels';

interface Props {
  onPress: (id: string) => void;
  qoldiqYashirin?: boolean;
}

// Konturdagi so'nggi yozuvlar. Ekranga qaytilganda avtomatik yangilanadi.
export default function TranzaksiyaRoyxati({ onPress, qoldiqYashirin = false }: Props) {
  const { t } = useTranslation();
  const db = useDb();
  const contour = useSettings((s) => s.contour);

  const [txs, setTxs] = useState<TransactionRow[]>([]);
  const [kat, setKat] = useState<Map<string, CategoryRow>>(new Map());
  const [hisob, setHisob] = useState<Map<string, AccountRow>>(new Map());

  useFocusEffect(
    useCallback(() => {
      let tirik = true;
      void (async () => {
        const [a, c, tx] = await Promise.all([
          listAccounts(db, contour),
          listCategories(db, contour),
          listTransactions(db, contour),
        ]);
        if (!tirik) {
          return;
        }
        setHisob(new Map(a.map((x) => [x.id, x])));
        setKat(new Map(c.map((x) => [x.id, x])));
        setTxs(tx);
      })();
      return () => {
        tirik = false;
      };
    }, [db, contour]),
  );

  function belgi(tx: TransactionRow): string {
    if (tx.type === 'kirim') {
      return '+';
    }
    if (tx.type === 'chiqim') {
      return '−';
    }
    return '';
  }

  function rang(tx: TransactionRow): string {
    if (tx.type === 'kirim') {
      return colors.yashil;
    }
    if (tx.type === 'chiqim') {
      return colors.qizil;
    }
    return colors.kul;
  }

  function sarlavha(tx: TransactionRow): string {
    const c = tx.category_id ? kat.get(tx.category_id) : undefined;
    if (c) {
      return kategoriyaNomi(c, t);
    }
    return t(`tur.${tx.type}`);
  }

  if (txs.length === 0) {
    return (
      <View style={styles.bosh}>
        <Text style={styles.boshMatn}>{t('yozuv.bosh')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={txs}
      keyExtractor={(x) => x.id}
      contentContainerStyle={styles.royxat}
      renderItem={({ item }) => (
        <Pressable accessibilityRole="button" style={styles.qator} onPress={() => onPress(item.id)}>
          <View style={styles.chap}>
            <Text style={styles.katNom}>{sarlavha(item)}</Text>
            <Text style={styles.izoh}>
              {hisob.get(item.account_id)?.name ?? ''} · {formatKun(item.occurred_at)}
            </Text>
          </View>
          <Text style={[styles.summa, { color: rang(item) }]}>
            {qoldiqYashirin ? '••••' : `${belgi(item)}${formatSom(item.amount)}`}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  royxat: { paddingHorizontal: spacing.md },
  qator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.kul,
    gap: spacing.md,
  },
  chap: { flex: 1 },
  katNom: { fontFamily: fonts.matn, fontSize: 16, color: colors.siyoh },
  izoh: { fontFamily: fonts.matn, fontSize: 12, color: colors.kul, marginTop: 2 },
  summa: { ...numeric, fontSize: 16 },
  bosh: { padding: spacing.xl, alignItems: 'center' },
  boshMatn: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
});

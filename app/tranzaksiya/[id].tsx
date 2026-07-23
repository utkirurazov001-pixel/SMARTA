import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import TranzaksiyaForma from '../../src/components/TranzaksiyaForma';
import { useDb } from '../../src/db/DbProvider';
import type { TransactionRow } from '../../src/db/schema';
import { deleteTransaction, getTransaction } from '../../src/repositories/transactions';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts } from '../../src/theme/tokens';

// Bitta yozuvni tahrirlash yoki o'chirish (soft delete).
export default function TranzaksiyaEkran() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useDb();
  const router = useRouter();
  const contour = useSettings((s) => s.contour);

  const [tx, setTx] = useState<TransactionRow | null>(null);
  const [yuklandi, setYuklandi] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let tirik = true;
      void (async () => {
        const topildi = id ? await getTransaction(db, contour, id) : null;
        if (tirik) {
          setTx(topildi);
          setYuklandi(true);
        }
      })();
      return () => {
        tirik = false;
      };
    }, [db, contour, id]),
  );

  function ochirishSora() {
    Alert.alert(t('yozuv.ochirilsinmi'), undefined, [
      { text: t('umumiy.bekor'), style: 'cancel' },
      {
        text: t('yozuv.ochirish'),
        style: 'destructive',
        onPress: () => {
          if (id) {
            void deleteTransaction(db, contour, id).then(() => router.back());
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.konteyner}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('yozuv.tahrirlash'),
          headerRight: () =>
            tx ? (
              <Pressable accessibilityRole="button" onPress={ochirishSora} hitSlop={8}>
                <Text style={styles.ochir}>{t('yozuv.ochirish')}</Text>
              </Pressable>
            ) : null,
        }}
      />
      {!yuklandi ? (
        <View style={styles.markaz}>
          <ActivityIndicator color={colors.ishkor} />
        </View>
      ) : tx ? (
        <TranzaksiyaForma mavjud={tx} onSaved={() => router.back()} />
      ) : (
        <View style={styles.markaz}>
          <Text style={styles.yoq}>{t('yozuv.bosh')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  markaz: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ochir: { fontFamily: fonts.matn, fontSize: 15, color: colors.qizil },
  yoq: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
});

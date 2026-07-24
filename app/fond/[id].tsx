import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import PulMatn from '../../src/components/PulMatn';
import SegmentTanlagich from '../../src/components/SegmentTanlagich';
import { useDb } from '../../src/db/DbProvider';
import type { FundMovementRow, FundRow } from '../../src/db/schema';
import { fondProgress, fondYigilgan, maqsadSanasi } from '../../src/domain/fond';
import type { FundMovementDirection } from '../../src/domain/types';
import { createFundMovement, listFundMovements } from '../../src/repositories/fundMovements';
import { getFund } from '../../src/repositories/funds';
import { useAccent } from '../../src/store/useAccent';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';
import { formatKun, kunBoshi } from '../../src/utils/date';
import { formatSom, parseSomInput } from '../../src/utils/format';

export default function FondDetalEkran() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useDb();
  const accent = useAccent();
  const contour = useSettings((s) => s.contour);
  const qoldiqYashirin = useSettings((s) => s.qoldiqYashirin);

  const [fund, setFund] = useState<FundRow | null>(null);
  const [harakatlar, setHarakatlar] = useState<FundMovementRow[]>([]);
  const [summa, setSumma] = useState('');
  const [yonalish, setYonalish] = useState<FundMovementDirection>('qoshish');

  const yukla = useCallback(async () => {
    if (!id) {
      return;
    }
    const [f, m] = await Promise.all([
      getFund(db, contour, id),
      listFundMovements(db, contour, id),
    ]);
    setFund(f);
    setHarakatlar(m);
  }, [db, contour, id]);

  useFocusEffect(
    useCallback(() => {
      void yukla();
    }, [yukla]),
  );

  if (!fund) {
    return (
      <View style={styles.markaz}>
        <Stack.Screen options={{ headerShown: true, title: t('tabs.fond') }} />
        <Text style={styles.yoq}>{t('fond.bosh')}</Text>
      </View>
    );
  }

  const yigilgan = fondYigilgan(harakatlar);
  const { qolgan, foiz } = fondProgress(yigilgan, fund.target_amount);
  const sana = maqsadSanasi(yigilgan, fund.target_amount, fund.monthly_plan, new Date());

  async function saqla() {
    const miqdor = parseSomInput(summa);
    if (miqdor <= 0 || !id) {
      return;
    }
    await createFundMovement(db, contour, {
      fundId: id,
      direction: yonalish,
      amount: miqdor,
      movedAt: kunBoshi(new Date()),
    });
    setSumma('');
    await yukla();
  }

  return (
    <ScrollView style={styles.konteyner}>
      <Stack.Screen options={{ headerShown: true, title: fund.name }} />

      <View style={styles.karta}>
        <View style={styles.chiziqFon}>
          <View style={[styles.chiziq, { width: `${foiz}%`, backgroundColor: accent }]} />
        </View>
        <View style={styles.qator}>
          <Text style={styles.yorliq}>{t('fond.yigilgan')}</Text>
          <PulMatn amount={yigilgan} yashirin={qoldiqYashirin} qisqa style={styles.qiymat} />
        </View>
        <View style={styles.qator}>
          <Text style={styles.yorliq}>{t('fond.qolgan')}</Text>
          <PulMatn amount={qolgan} yashirin={qoldiqYashirin} qisqa style={styles.qiymat} />
        </View>
        {sana ? (
          <View style={styles.qator}>
            <Text style={styles.yorliq}>{t('fond.maqsadSana')}</Text>
            <Text style={styles.qiymat}>{formatKun(sana.toISOString())}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.blok}>
        <SegmentTanlagich
          accent={accent}
          value={yonalish}
          onChange={setYonalish}
          options={[
            { value: 'qoshish', label: t('fond.qoshish') },
            { value: 'olish', label: t('fond.olish') },
          ]}
        />
        <TextInput
          style={styles.maydon}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.kul}
          value={summa}
          onChangeText={(x) => setSumma(formatSom(parseSomInput(x)))}
        />
        <Pressable
          accessibilityRole="button"
          style={[styles.saqla, { backgroundColor: accent }]}
          onPress={() => void saqla()}
        >
          <Text style={styles.saqlaMatn}>{t('yozuv.saqlash')}</Text>
        </Pressable>
      </View>

      {harakatlar.length > 0 ? (
        <View style={styles.blok}>
          <Text style={styles.blokSarlavha}>{t('fond.harakatlar')}</Text>
          {harakatlar.map((h) => (
            <View key={h.id} style={styles.hQator}>
              <Text style={styles.hSana}>
                {t(`fond.${h.direction}`)} · {formatKun(h.moved_at)}
              </Text>
              <PulMatn amount={h.amount} yashirin={qoldiqYashirin} style={styles.hSumma} />
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  markaz: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.qogoz,
  },
  yoq: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
  karta: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  chiziqFon: { height: 10, borderRadius: 5, backgroundColor: colors.qogoz, overflow: 'hidden' },
  chiziq: { height: 10, borderRadius: 5 },
  qator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yorliq: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
  qiymat: {
    fontFamily: fonts.raqam,
    fontVariant: ['tabular-nums'],
    fontSize: 16,
    color: colors.siyoh,
  },
  blok: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  blokSarlavha: { fontFamily: fonts.sarlavha, fontSize: 15, color: colors.siyoh },
  maydon: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.raqam,
    fontVariant: ['tabular-nums'],
    fontSize: 18,
    color: colors.siyoh,
    textAlign: 'right',
  },
  saqla: { borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  saqlaMatn: { fontFamily: fonts.sarlavha, fontSize: 16, color: colors.qogoz },
  hQator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.kul,
    paddingTop: spacing.sm,
  },
  hSana: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul },
  hSumma: { fontSize: 14, color: colors.siyoh },
});

import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import ErtaYopishKarta from '../../src/components/ErtaYopishKarta';
import PulMatn from '../../src/components/PulMatn';
import TanlashModal, { type TanlovElement } from '../../src/components/TanlashModal';
import { useDb } from '../../src/db/DbProvider';
import type { AccountRow, DebtPaymentRow, DebtRow } from '../../src/db/schema';
import { oylikFoizSumma, qarzQoldigi, tolovKamaytiradimi } from '../../src/domain/qarz';
import { listAccounts } from '../../src/repositories/accounts';
import { listDebtPayments } from '../../src/repositories/debtPayments';
import { getDebt } from '../../src/repositories/debts';
import { qarzTolovQoshish } from '../../src/repositories/qarzTolov';
import { useAccent } from '../../src/store/useAccent';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';
import { formatKun, kunBoshi } from '../../src/utils/date';
import { formatSom, parseSomInput } from '../../src/utils/format';

export default function QarzDetalEkran() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useDb();
  const accent = useAccent();
  const contour = useSettings((s) => s.contour);
  const qoldiqYashirin = useSettings((s) => s.qoldiqYashirin);

  const [debt, setDebt] = useState<DebtRow | null>(null);
  const [tolovlar, setTolovlar] = useState<DebtPaymentRow[]>([]);
  const [hisoblar, setHisoblar] = useState<AccountRow[]>([]);
  const [summa, setSumma] = useState('');
  const [hisobId, setHisobId] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  const yukla = useCallback(async () => {
    if (!id) {
      return;
    }
    const [d, p, a] = await Promise.all([
      getDebt(db, contour, id),
      listDebtPayments(db, contour, id),
      listAccounts(db, contour),
    ]);
    setDebt(d);
    setTolovlar(p);
    setHisoblar(a);
    if (a.length > 0) {
      setHisobId((oldingi) => oldingi ?? a[0].id);
    }
  }, [db, contour, id]);

  useFocusEffect(
    useCallback(() => {
      void yukla();
    }, [yukla]),
  );

  if (!debt) {
    return (
      <View style={styles.markaz}>
        <Stack.Screen options={{ headerShown: true, title: t('tabs.qarz') }} />
        <Text style={styles.yoq}>{t('qarz.bosh')}</Text>
      </View>
    );
  }

  const qoldiq = qarzQoldigi(debt.principal, tolovlar);
  const oylikFoiz = oylikFoizSumma(qoldiq, debt.annual_rate);
  const kiritilgan = parseSomInput(summa);
  const kamaymaydi = kiritilgan > 0 && !tolovKamaytiradimi(qoldiq, debt.annual_rate, kiritilgan);

  async function tolovSaqla() {
    if (kiritilgan <= 0 || !hisobId || !id) {
      return;
    }
    await qarzTolovQoshish(db, contour, {
      debtId: id,
      hisobId,
      tolov: kiritilgan,
      sana: kunBoshi(new Date()),
    });
    setSumma('');
    await yukla();
  }

  const hisobElementlar: TanlovElement[] = hisoblar.map((h) => ({ id: h.id, nom: h.name }));
  const tanlanganHisob = hisoblar.find((h) => h.id === hisobId);

  return (
    <ScrollView style={styles.konteyner}>
      <Stack.Screen options={{ headerShown: true, title: debt.counterparty }} />

      {/* Qoldiq va bosh ko'rsatkich: bu oy foizga ketadi (qizil). */}
      <View style={styles.tepaKarta}>
        <Text style={styles.yorliq}>{t('qarz.qoldiq')}</Text>
        <PulMatn amount={qoldiq} yashirin={qoldiqYashirin} qisqa style={styles.qoldiq} />
        <Text style={[styles.yorliq, styles.foizYorliq]}>{t('qarz.oylikFoiz')}</Text>
        <PulMatn amount={oylikFoiz} yashirin={qoldiqYashirin} qisqa style={styles.foiz} />
      </View>

      {/* To'lov yozish — asosiy jurnalga ham avtomatik tushadi. */}
      <View style={styles.blok}>
        <Text style={styles.blokSarlavha}>{t('qarz.tolovYoz')}</Text>
        <TextInput
          style={styles.maydon}
          keyboardType="number-pad"
          placeholder={t('qarz.tolovSummasi')}
          placeholderTextColor={colors.kul}
          value={summa}
          onChangeText={(x) => setSumma(formatSom(parseSomInput(x)))}
        />
        <Pressable
          accessibilityRole="button"
          style={styles.hisobTanlov}
          onPress={() => setModal(true)}
        >
          <Text style={styles.hisobMatn}>{tanlanganHisob?.name ?? t('yozuv.hisob_tanlang')}</Text>
        </Pressable>
        {kamaymaydi ? <Text style={styles.ogoh}>⚠ {t('qarz.ogohlantirish')}</Text> : null}
        <Pressable
          accessibilityRole="button"
          style={[styles.saqla, { backgroundColor: accent }]}
          onPress={() => void tolovSaqla()}
        >
          <Text style={styles.saqlaMatn}>{t('yozuv.saqlash')}</Text>
        </Pressable>
      </View>

      <ErtaYopishKarta
        qoldiq={qoldiq}
        yillikStavka={debt.annual_rate}
        muddat={debt.term_months}
        qoldiqYashirin={qoldiqYashirin}
      />

      {/* To'lovlar tarixi */}
      {tolovlar.length > 0 ? (
        <View style={styles.blok}>
          <Text style={styles.blokSarlavha}>{t('qarz.tolovlar')}</Text>
          {tolovlar.map((p) => (
            <View key={p.id} style={styles.tolovQator}>
              <Text style={styles.tolovSana}>{formatKun(p.paid_at)}</Text>
              <PulMatn amount={p.amount} yashirin={qoldiqYashirin} style={styles.tolovSumma} />
            </View>
          ))}
        </View>
      ) : null}

      <TanlashModal
        visible={modal}
        sarlavha={t('yozuv.hisob_tanlang')}
        elementlar={hisobElementlar}
        accent={accent}
        onClose={() => setModal(false)}
        onSelect={(hid) => {
          setHisobId(hid);
          setModal(false);
        }}
      />
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
  tepaKarta: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    gap: spacing.xs,
  },
  yorliq: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul },
  foizYorliq: { marginTop: spacing.sm },
  qoldiq: { fontSize: 30, color: colors.siyoh },
  foiz: { fontSize: 22, color: colors.qizil },
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
  hisobTanlov: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  hisobMatn: { fontFamily: fonts.matn, fontSize: 16, color: colors.siyoh },
  ogoh: { fontFamily: fonts.matn, fontSize: 13, color: colors.qizil },
  saqla: { borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  saqlaMatn: { fontFamily: fonts.sarlavha, fontSize: 16, color: colors.qogoz },
  tolovQator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.kul,
    paddingTop: spacing.sm,
  },
  tolovSana: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
  tolovSumma: { fontSize: 14, color: colors.siyoh },
});

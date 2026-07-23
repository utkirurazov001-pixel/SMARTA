import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import DavrTanlagich from '../../src/components/DavrTanlagich';
import HisobRoyxati from '../../src/components/HisobRoyxati';
import KonturTanlagich from '../../src/components/KonturTanlagich';
import LimitKarta from '../../src/components/LimitKarta';
import QoldiqKarta from '../../src/components/QoldiqKarta';
import StatKarta from '../../src/components/StatKarta';
import TilTanlagich from '../../src/components/TilTanlagich';
import TranzaksiyaSatri from '../../src/components/TranzaksiyaSatri';
import { useLedger } from '../../src/db/useLedger';
import { umumiyQoldiq } from '../../src/domain/balans';
import { davrOraliq, foizOzgarish, oraliqIchida, type DavrTur } from '../../src/domain/davr';
import { kirimYigindisi, sofFoyda, xarajatYigindisi } from '../../src/domain/hisob';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts, spacing } from '../../src/theme/tokens';
import { kategoriyaNomi } from '../../src/utils/labels';

// Bosh ekran: qoldiq, hisoblar, davr statistikasi, so'nggi yozuvlar va qidiruv.
export default function BoshEkran() {
  const { t } = useTranslation();
  const router = useRouter();
  const { hisoblar, kategoriyalar, hisoblarMap, transactions } = useLedger();
  const contour = useSettings((s) => s.contour);
  const qoldiqYashirin = useSettings((s) => s.qoldiqYashirin);

  const [davr, setDavr] = useState<DavrTur>('buOy');
  const [qidiruv, setQidiruv] = useState('');

  const stat = useMemo(() => {
    const oraliqlar = davrOraliq(davr, new Date());
    const joriy = transactions.filter((tx) => oraliqIchida(tx.occurred_at, oraliqlar.joriy));
    const oldingi = transactions.filter((tx) => oraliqIchida(tx.occurred_at, oraliqlar.oldingi));
    return {
      joriy,
      kirim: kirimYigindisi(joriy),
      chiqim: xarajatYigindisi(joriy),
      foizKirim: foizOzgarish(kirimYigindisi(joriy), kirimYigindisi(oldingi)),
      foizChiqim: foizOzgarish(xarajatYigindisi(joriy), xarajatYigindisi(oldingi)),
      sof: sofFoyda(joriy),
      foizSof: foizOzgarish(sofFoyda(joriy), sofFoyda(oldingi)),
    };
  }, [transactions, davr]);

  const qoldiq = useMemo(() => umumiyQoldiq(hisoblar, transactions), [hisoblar, transactions]);

  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLowerCase();
    if (!q) {
      return stat.joriy;
    }
    return stat.joriy.filter((tx) => {
      const kat = tx.category_id ? kategoriyalar.get(tx.category_id) : undefined;
      const parcha = [
        kat ? kategoriyaNomi(kat, t) : t(`tur.${tx.type}`),
        tx.counterparty ?? '',
        tx.note ?? '',
        hisoblarMap.get(tx.account_id)?.name ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return parcha.includes(q);
    });
  }, [stat.joriy, qidiruv, kategoriyalar, hisoblarMap, t]);

  const tepa = (
    <View>
      <KonturTanlagich />
      <DavrTanlagich qiymat={davr} onChange={setDavr} />
      <QoldiqKarta qoldiq={qoldiq} />
      <View style={styles.statQator}>
        <StatKarta
          yorliq={t('tur.kirim')}
          qiymat={stat.kirim}
          rang={colors.yashil}
          qoldiqYashirin={qoldiqYashirin}
          foiz={stat.foizKirim}
        />
        <StatKarta
          yorliq={t('tur.chiqim')}
          qiymat={stat.chiqim}
          rang={colors.qizil}
          qoldiqYashirin={qoldiqYashirin}
          foiz={stat.foizChiqim}
        />
      </View>
      {contour === 'biznes' ? (
        <View style={styles.sof}>
          <StatKarta
            yorliq={t('bosh.sofFoyda')}
            qiymat={stat.sof}
            rang={stat.sof >= 0 ? colors.yashil : colors.qizil}
            qoldiqYashirin={qoldiqYashirin}
            foiz={stat.foizSof}
          />
        </View>
      ) : (
        <LimitKarta xarajat={stat.chiqim} qoldiqYashirin={qoldiqYashirin} />
      )}
      <HisobRoyxati
        hisoblar={hisoblar}
        transactions={transactions}
        qoldiqYashirin={qoldiqYashirin}
      />
      <TextInput
        style={styles.qidiruv}
        placeholder={t('yozuv.qidiruv')}
        placeholderTextColor={colors.kul}
        value={qidiruv}
        onChangeText={setQidiruv}
      />
      <Text style={styles.songgi}>{t('yozuv.songgi')}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.konteyner}
      data={royxat}
      keyExtractor={(x) => x.id}
      ListHeaderComponent={tepa}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <TranzaksiyaSatri
          tx={item}
          kategoriya={item.category_id ? kategoriyalar.get(item.category_id) : undefined}
          hisob={hisoblarMap.get(item.account_id)}
          qoldiqYashirin={qoldiqYashirin}
          onPress={(id) => router.push(`/tranzaksiya/${id}`)}
        />
      )}
      ListEmptyComponent={<Text style={styles.bosh}>{t('yozuv.bosh')}</Text>}
      ListFooterComponent={
        <View style={styles.futer}>
          <TilTanlagich />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  statQator: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md },
  sof: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  qidiruv: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.matn,
    color: colors.siyoh,
  },
  songgi: {
    fontFamily: fonts.matn,
    fontSize: 13,
    color: colors.kul,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  bosh: {
    fontFamily: fonts.matn,
    fontSize: 14,
    color: colors.kul,
    textAlign: 'center',
    padding: spacing.xl,
  },
  futer: { paddingVertical: spacing.lg, alignItems: 'center' },
});

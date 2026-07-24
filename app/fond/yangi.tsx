import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useDb } from '../../src/db/DbProvider';
import { useLedger } from '../../src/db/useLedger';
import { zaxiraTavsiya } from '../../src/domain/fond';
import { FOND_SHABLONLAR } from '../../src/domain/fondShablonlar';
import { davrOraliq, oraliqIchida } from '../../src/domain/davr';
import { xarajatYigindisi } from '../../src/domain/hisob';
import { createFund } from '../../src/repositories/funds';
import { useAccent } from '../../src/store/useAccent';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';
import { formatSom, parseSomInput } from '../../src/utils/format';

export default function YangiFondEkran() {
  const { t } = useTranslation();
  const router = useRouter();
  const db = useDb();
  const accent = useAccent();
  const contour = useSettings((s) => s.contour);
  const { shablon } = useLocalSearchParams<{ shablon?: string }>();
  const { transactions } = useLedger();

  const shablonObj = FOND_SHABLONLAR.find((s) => s.key === shablon);

  // Zaxira jamg'arma uchun: bu oylik xarajatning 3 barobari — tavsiya etilgan maqsad.
  const tavsiyaMaqsad = useMemo(() => {
    if (!shablonObj?.zaxira) {
      return 0;
    }
    const o = davrOraliq('buOy', new Date());
    const buOy = transactions.filter((tx) => oraliqIchida(tx.occurred_at, o.joriy));
    return zaxiraTavsiya(xarajatYigindisi(buOy));
  }, [shablonObj, transactions]);

  const [nom, setNom] = useState(shablon ? t(`fond.template.${shablon}`) : '');
  // null — foydalanuvchi hali maydonga tegmagan; shunda zaxira tavsiyasi ko'rsatiladi.
  const [qolMaqsad, setQolMaqsad] = useState<string | null>(null);
  const [reja, setReja] = useState('');
  const [xato, setXato] = useState<string | null>(null);

  const maqsad = qolMaqsad ?? (tavsiyaMaqsad > 0 ? formatSom(tavsiyaMaqsad) : '');

  async function saqla() {
    if (!nom.trim()) {
      setXato(t('fond.nom'));
      return;
    }
    await createFund(db, contour, {
      name: nom.trim(),
      templateKey: shablon ?? null,
      targetAmount: parseSomInput(maqsad),
      monthlyPlan: parseSomInput(reja),
    });
    router.back();
  }

  return (
    <ScrollView style={styles.konteyner} contentContainerStyle={styles.ichki}>
      <Stack.Screen options={{ headerShown: true, title: t('fond.yangi') }} />

      <Text style={styles.yorliq}>{t('fond.nom')}</Text>
      <TextInput style={styles.maydon} value={nom} onChangeText={setNom} />

      <Text style={styles.yorliq}>
        {t('fond.maqsad')}
        {tavsiyaMaqsad > 0 ? ` · ${t('fond.tavsiya')}` : ''}
      </Text>
      <TextInput
        style={styles.maydon}
        keyboardType="number-pad"
        value={maqsad}
        onChangeText={(x) => setQolMaqsad(formatSom(parseSomInput(x)))}
      />

      <Text style={styles.yorliq}>{t('fond.oylikReja')}</Text>
      <TextInput
        style={styles.maydon}
        keyboardType="number-pad"
        value={reja}
        onChangeText={(x) => setReja(formatSom(parseSomInput(x)))}
      />

      {xato ? <Text style={styles.xato}>{xato}</Text> : null}

      <Pressable
        accessibilityRole="button"
        style={[styles.saqla, { backgroundColor: accent }]}
        onPress={() => void saqla()}
      >
        <Text style={styles.saqlaMatn}>{t('yozuv.saqlash')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  ichki: { padding: spacing.md, gap: spacing.xs, paddingBottom: spacing.xl },
  yorliq: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul, marginTop: spacing.sm },
  maydon: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.matn,
    fontSize: 16,
    color: colors.siyoh,
  },
  xato: { fontFamily: fonts.matn, fontSize: 13, color: colors.qizil, marginTop: spacing.sm },
  saqla: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saqlaMatn: { fontFamily: fonts.sarlavha, fontSize: 16, color: colors.qogoz },
});

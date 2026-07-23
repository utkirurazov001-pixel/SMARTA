import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import KonturTanlagich from '../../src/components/KonturTanlagich';
import PulMatn from '../../src/components/PulMatn';
import QarzSatri from '../../src/components/QarzSatri';
import SegmentTanlagich from '../../src/components/SegmentTanlagich';
import { useDebts } from '../../src/db/useDebts';
import type { DebtDirection } from '../../src/domain/types';
import { useAccent } from '../../src/store/useAccent';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';

// Qarz moduli: bosh ko'rsatkich (bu oy foizga ketadi), yo'nalish bo'yicha ro'yxat.
export default function QarzEkran() {
  const { t } = useTranslation();
  const router = useRouter();
  const accent = useAccent();
  const { qarzlar, buOyFoizga } = useDebts();
  const qoldiqYashirin = useSettings((s) => s.qoldiqYashirin);

  const [yonalish, setYonalish] = useState<DebtDirection>('men_qarzdor');

  const filtrlangan = useMemo(
    () => qarzlar.filter((k) => k.debt.direction === yonalish),
    [qarzlar, yonalish],
  );
  const jami = useMemo(() => filtrlangan.reduce((s, k) => s + k.qoldiq, 0), [filtrlangan]);

  const tepa = (
    <View>
      <KonturTanlagich />
      {/* Bosh ko'rsatkich — eng ko'zga tashlanadigan joyda, qizil rangda. */}
      <View style={styles.foizKarta}>
        <Text style={styles.foizYorliq}>{t('qarz.buOyFoizga')}</Text>
        <PulMatn amount={buOyFoizga} yashirin={qoldiqYashirin} qisqa style={styles.foizSumma} />
      </View>

      <View style={styles.segment}>
        <SegmentTanlagich
          accent={accent}
          value={yonalish}
          onChange={setYonalish}
          options={[
            { value: 'men_qarzdor', label: t('qarz.menQarzdor') },
            { value: 'menga_qarzdor', label: t('qarz.mengaQarzdor') },
          ]}
        />
      </View>

      <View style={styles.jamiQator}>
        <Text style={styles.jamiYorliq}>{t('qarz.jami')}</Text>
        <PulMatn amount={jami} yashirin={qoldiqYashirin} qisqa style={styles.jamiSumma} />
      </View>

      <Pressable
        accessibilityRole="button"
        style={[styles.qoshish, { borderColor: accent }]}
        onPress={() => router.push('/qarz/yangi')}
      >
        <Text style={[styles.qoshishMatn, { color: accent }]}>+ {t('qarz.yangi')}</Text>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      style={styles.konteyner}
      data={filtrlangan}
      keyExtractor={(k) => k.debt.id}
      ListHeaderComponent={tepa}
      renderItem={({ item }) => (
        <QarzSatri
          korinish={item}
          qoldiqYashirin={qoldiqYashirin}
          onPress={(id) => router.push(`/qarz/${id}`)}
        />
      )}
      ListEmptyComponent={<Text style={styles.bosh}>{t('qarz.bosh')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  foizKarta: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: '#FBECEA',
    borderWidth: 1,
    borderColor: colors.qizil,
    gap: spacing.xs,
  },
  foizYorliq: { fontFamily: fonts.matn, fontSize: 14, color: colors.qizil },
  foizSumma: { fontSize: 30, color: colors.qizil },
  segment: { paddingHorizontal: spacing.md },
  jamiQator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  jamiYorliq: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
  jamiSumma: { fontSize: 18, color: colors.siyoh },
  qoshish: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  qoshishMatn: { fontFamily: fonts.sarlavha, fontSize: 15 },
  bosh: {
    fontFamily: fonts.matn,
    fontSize: 14,
    color: colors.kul,
    textAlign: 'center',
    padding: spacing.xl,
  },
});

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import FondSatri from '../../src/components/FondSatri';
import KonturTanlagich from '../../src/components/KonturTanlagich';
import { useFunds } from '../../src/db/useFunds';
import { shablonlarKontur } from '../../src/domain/fondShablonlar';
import { useAccent } from '../../src/store/useAccent';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';

// Fond moduli: maqsadli fondlar ro'yxati, progress, tayyor shablonlar.
export default function FondEkran() {
  const { t } = useTranslation();
  const router = useRouter();
  const accent = useAccent();
  const { fondlar } = useFunds();
  const contour = useSettings((s) => s.contour);
  const qoldiqYashirin = useSettings((s) => s.qoldiqYashirin);

  const shablonlar = shablonlarKontur(contour);

  const tepa = (
    <View>
      <KonturTanlagich />
      <Text style={styles.sarlavha}>{t('fond.shablonlar')}</Text>
      <View style={styles.shablonlar}>
        {shablonlar.map((s) => (
          <Pressable
            key={s.key}
            accessibilityRole="button"
            style={[styles.chip, { borderColor: accent }]}
            onPress={() => router.push(`/fond/yangi?shablon=${s.key}`)}
          >
            <Text style={[styles.chipMatn, { color: accent }]}>{t(`fond.template.${s.key}`)}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        style={[styles.qoshish, { backgroundColor: accent }]}
        onPress={() => router.push('/fond/yangi')}
      >
        <Text style={styles.qoshishMatn}>+ {t('fond.yangi')}</Text>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      style={styles.konteyner}
      data={fondlar}
      keyExtractor={(k) => k.fund.id}
      ListHeaderComponent={tepa}
      renderItem={({ item }) => (
        <FondSatri
          korinish={item}
          qoldiqYashirin={qoldiqYashirin}
          onPress={(id) => router.push(`/fond/${id}`)}
        />
      )}
      ListEmptyComponent={<Text style={styles.bosh}>{t('fond.bosh')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  sarlavha: {
    fontFamily: fonts.matn,
    fontSize: 13,
    color: colors.kul,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  shablonlar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipMatn: { fontFamily: fonts.matn, fontSize: 14 },
  qoshish: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  qoshishMatn: { fontFamily: fonts.sarlavha, fontSize: 15, color: colors.qogoz },
  bosh: {
    fontFamily: fonts.matn,
    fontSize: 14,
    color: colors.kul,
    textAlign: 'center',
    padding: spacing.xl,
  },
});

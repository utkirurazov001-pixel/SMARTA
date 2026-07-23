import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, radius, spacing } from '../theme/tokens';
import { TILLAR, type Til } from '../i18n';

// Sprint 0 til almashtirgich. Til holati keyingi sprintda Zustand store'ga ko'chadi;
// hozircha i18next'ning o'zi qayta render qilishga yetarli.
export default function TilTanlagich() {
  const { t, i18n } = useTranslation();
  const joriy = i18n.language as Til;

  const nomlar: Record<Til, string> = {
    'uz-lat': t('til.uz_lat'),
    'uz-cyr': t('til.uz_cyr'),
    ru: t('til.ru'),
  };

  return (
    <View style={styles.konteyner}>
      <Text style={styles.sarlavha}>{t('til.sarlavha')}</Text>
      <View style={styles.qator}>
        {TILLAR.map((til) => {
          const tanlangan = joriy === til;
          return (
            <Pressable
              key={til}
              accessibilityRole="button"
              accessibilityState={{ selected: tanlangan }}
              onPress={() => void i18n.changeLanguage(til)}
              style={[styles.tugma, tanlangan && styles.tugmaFaol]}
            >
              <Text style={[styles.tugmaMatn, tanlangan && styles.tugmaMatnFaol]}>
                {nomlar[til]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  konteyner: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  sarlavha: {
    fontFamily: fonts.matn,
    fontSize: 13,
    color: colors.kul,
  },
  qator: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tugma: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.kul,
  },
  tugmaFaol: {
    backgroundColor: colors.siyoh,
    borderColor: colors.siyoh,
  },
  tugmaMatn: {
    fontFamily: fonts.matn,
    fontSize: 14,
    color: colors.siyoh,
  },
  tugmaMatnFaol: {
    color: colors.qogoz,
  },
});

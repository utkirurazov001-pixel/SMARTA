import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, radius, spacing } from '../theme/tokens';
import { TILLAR, type Til } from '../i18n';
import { useSettings } from '../store/useSettings';

// Til almashtirgich. Tanlangan til Zustand store orqali saqlanadi (ilova qayta
// ochilganda tiklanadi).
export default function TilTanlagich() {
  const { t } = useTranslation();
  const joriy = useSettings((s) => s.til);
  const setTil = useSettings((s) => s.setTil);

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
              onPress={() => setTil(til)}
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

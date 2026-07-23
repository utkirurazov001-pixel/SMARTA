import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { Contour } from '../domain/types';
import { accentFor, colors, fonts, radius, spacing } from '../theme/tokens';
import { useSettings } from '../store/useSettings';

const KONTURLAR: Contour[] = ['shaxsiy', 'biznes'];

// Kontur almashtirgich. Tanlanganda butun ilova aksent rangi o'zgaradi
// (shaxsiy=qahrabo, biznes=ishkor) — mahsulotning signature elementi.
export default function KonturTanlagich() {
  const { t } = useTranslation();
  const contour = useSettings((s) => s.contour);
  const setContour = useSettings((s) => s.setContour);

  return (
    <View style={styles.qator}>
      {KONTURLAR.map((k) => {
        const faol = contour === k;
        const rang = accentFor(k);
        return (
          <Pressable
            key={k}
            accessibilityRole="button"
            accessibilityState={{ selected: faol }}
            onPress={() => setContour(k)}
            style={[styles.tugma, faol && { backgroundColor: rang, borderColor: rang }]}
          >
            <Text style={[styles.matn, faol && styles.matnFaol]}>{t(`kontur.${k}`)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  qator: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  tugma: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.kul,
    alignItems: 'center',
  },
  matn: { fontFamily: fonts.sarlavha, fontSize: 15, color: colors.siyoh },
  matnFaol: { color: colors.qogoz },
});

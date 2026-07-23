import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import KonturTanlagich from '../../src/components/KonturTanlagich';
import TilTanlagich from '../../src/components/TilTanlagich';
import TranzaksiyaRoyxati from '../../src/components/TranzaksiyaRoyxati';
import { useSettings } from '../../src/store/useSettings';
import { colors, spacing } from '../../src/theme/tokens';

// Bosh ekran. Sprint 2'da: kontur almashtirgich + so'nggi yozuvlar (tahrirlashga kirish).
// To'liq statistika Sprint 3'da keladi.
export default function BoshEkran() {
  const router = useRouter();
  const qoldiqYashirin = useSettings((s) => s.qoldiqYashirin);

  return (
    <View style={styles.konteyner}>
      <KonturTanlagich />
      <View style={styles.royxat}>
        <TranzaksiyaRoyxati
          qoldiqYashirin={qoldiqYashirin}
          onPress={(id) => router.push(`/tranzaksiya/${id}`)}
        />
      </View>
      <View style={styles.til}>
        <TilTanlagich />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  royxat: { flex: 1 },
  til: { paddingVertical: spacing.md, alignItems: 'center' },
});

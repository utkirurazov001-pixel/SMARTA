import { StyleSheet, View } from 'react-native';

import EkranPlaceholder from '../../src/components/EkranPlaceholder';
import TilTanlagich from '../../src/components/TilTanlagich';
import { colors, spacing } from '../../src/theme/tokens';

// Bosh ekran. Sprint 0'da qoldiq/statistika o'rniga til almashtirgichni ko'rsatamiz —
// shu orqali uch tilni sinash mumkin. Sprint 3'da to'liq mazmun keladi.
export default function BoshEkran() {
  return (
    <View style={styles.konteyner}>
      <EkranPlaceholder sarlavhaKalit="ekran.bosh" />
      <View style={styles.til}>
        <TilTanlagich />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  konteyner: {
    flex: 1,
    backgroundColor: colors.qogoz,
  },
  til: {
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
});

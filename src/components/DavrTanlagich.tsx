import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { DavrTur } from '../domain/davr';
import { useAccent } from '../store/useAccent';
import { spacing } from '../theme/tokens';
import SegmentTanlagich from './SegmentTanlagich';

interface Props {
  qiymat: DavrTur;
  onChange: (d: DavrTur) => void;
}

const TURLAR: DavrTur[] = ['buOy', 'otganOy', 'ucOy'];

// Davr tanlash: bu oy / o'tgan oy / 3 oy.
export default function DavrTanlagich({ qiymat, onChange }: Props) {
  const { t } = useTranslation();
  const accent = useAccent();
  return (
    <View style={styles.blok}>
      <SegmentTanlagich
        accent={accent}
        value={qiymat}
        onChange={onChange}
        options={TURLAR.map((x) => ({ value: x, label: t(`davr.${x}`) }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blok: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
});

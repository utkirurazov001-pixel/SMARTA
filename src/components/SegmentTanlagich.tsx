import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme/tokens';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  accent: string;
}

// Generik segment tanlagich (tur, davr va h.k. uchun). Faol segment aksent rangida.
export default function SegmentTanlagich<T extends string>({
  options,
  value,
  onChange,
  accent,
}: Props<T>) {
  return (
    <View style={styles.qator}>
      {options.map((o) => {
        const faol = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: faol }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, faol && { backgroundColor: accent, borderColor: accent }]}
          >
            <Text style={[styles.matn, faol && styles.matnFaol]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  qator: { flexDirection: 'row', gap: spacing.xs },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.kul,
    alignItems: 'center',
  },
  matn: { fontFamily: fonts.matn, fontSize: 14, color: colors.siyoh },
  matnFaol: { color: colors.qogoz },
});

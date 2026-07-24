import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '../theme/tokens';

interface Props {
  ikon: keyof typeof Ionicons.glyphMap;
  matn: string;
}

// Ro'yxatlar uchun bo'sh holat: yengil ikonka + tushuntirish. Jozibali va tinch.
export default function BoshHolat({ ikon, matn }: Props) {
  return (
    <View style={styles.blok}>
      <Ionicons name={ikon} size={48} color={colors.chegara} />
      <Text style={styles.matn}>{matn}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  blok: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 1.5,
    gap: spacing.sm,
  },
  matn: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul, textAlign: 'center' },
});

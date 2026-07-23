import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { numeric } from '../theme/tokens';
import { pulMatni } from '../utils/pul';

interface Props {
  amount: number;
  yashirin?: boolean;
  qisqa?: boolean;
  style?: StyleProp<TextStyle>;
}

// Pul summasini ko'rsatadi: monospace + tabular-nums. Yashirin holatda niqoblanadi,
// qisqa holatda katta son qisqartiriladi (22,0 mln).
export default function PulMatn({ amount, yashirin = false, qisqa = false, style }: Props) {
  const { t } = useTranslation();
  const matn = pulMatni(amount, {
    yashirin,
    qisqa,
    birlik: { mln: t('son.mln'), mlrd: t('son.mlrd') },
  });
  return <Text style={[styles.raqam, style]}>{matn}</Text>;
}

const styles = StyleSheet.create({
  raqam: numeric,
});

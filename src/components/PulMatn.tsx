import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { numeric, VALYUTA } from '../theme/tokens';
import { NIQOB, pulMatni } from '../utils/pul';

interface Props {
  amount: number;
  yashirin?: boolean;
  qisqa?: boolean;
  som?: boolean; // oxiriga "so'm" qo'shadi
  style?: StyleProp<TextStyle>;
}

// Pul summasini ko'rsatadi: monospace + tabular-nums. Yashirin holatda niqoblanadi,
// qisqa holatda katta son qisqartiriladi (22,0 mln). `som` — valyuta qo'shimchasi.
export default function PulMatn({
  amount,
  yashirin = false,
  qisqa = false,
  som = false,
  style,
}: Props) {
  const { t } = useTranslation();
  const matn = pulMatni(amount, {
    yashirin,
    qisqa,
    birlik: { mln: t('son.mln'), mlrd: t('son.mlrd') },
  });
  const koYidor = som && matn !== NIQOB ? `${matn} ${VALYUTA}` : matn;
  return <Text style={[styles.raqam, style]}>{koYidor}</Text>;
}

const styles = StyleSheet.create({
  raqam: numeric,
});

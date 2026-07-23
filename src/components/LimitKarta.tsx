import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useSettings } from '../store/useSettings';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { formatSom, parseSomInput } from '../utils/format';
import { NIQOB } from '../utils/pul';
import PulMatn from './PulMatn';

interface Props {
  xarajat: number;
  qoldiqYashirin: boolean;
}

// Shaxsiy kontur: oylik xarajat limiti va progress chizig'i. Limit 0 bo'lsa belgilanmagan.
export default function LimitKarta({ xarajat, qoldiqYashirin }: Props) {
  const { t } = useTranslation();
  const limit = useSettings((s) => s.oylikLimit);
  const setLimit = useSettings((s) => s.setOylikLimit);

  const nisbat = limit > 0 ? Math.min(1, xarajat / limit) : 0;
  const oshib = limit > 0 && xarajat > limit;

  return (
    <View style={styles.karta}>
      <View style={styles.tepa}>
        <Text style={styles.yorliq}>{t('bosh.limit')}</Text>
        <TextInput
          style={styles.kirit}
          keyboardType="number-pad"
          value={qoldiqYashirin ? '' : limit > 0 ? formatSom(limit) : ''}
          placeholder={qoldiqYashirin ? NIQOB : t('bosh.limitBelgilanmagan')}
          placeholderTextColor={colors.kul}
          editable={!qoldiqYashirin}
          onChangeText={(x) => setLimit(parseSomInput(x))}
        />
      </View>
      {limit > 0 ? (
        <>
          <View style={styles.chiziqFon}>
            <View
              style={[
                styles.chiziq,
                {
                  width: `${nisbat * 100}%`,
                  backgroundColor: oshib ? colors.qizil : colors.yashil,
                },
              ]}
            />
          </View>
          <View style={styles.pastki}>
            <PulMatn amount={xarajat} yashirin={qoldiqYashirin} style={styles.kichik} />
            <PulMatn amount={limit} yashirin={qoldiqYashirin} style={styles.kichik} />
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  karta: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    gap: spacing.sm,
  },
  tepa: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yorliq: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul },
  kirit: {
    fontFamily: fonts.raqam,
    fontVariant: ['tabular-nums'],
    fontSize: 15,
    color: colors.siyoh,
    minWidth: 120,
    textAlign: 'right',
    paddingVertical: 2,
  },
  chiziqFon: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.qogoz,
    overflow: 'hidden',
  },
  chiziq: { height: 8, borderRadius: 4 },
  pastki: { flexDirection: 'row', justifyContent: 'space-between' },
  kichik: { fontSize: 12, color: colors.kul },
});

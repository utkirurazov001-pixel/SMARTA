import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { annuitetTolov, ertaYopishVariantlari } from '../domain/qarz';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import PulMatn from './PulMatn';

interface Props {
  qoldiq: number;
  yillikStavka: number;
  muddat: number | null;
  qoldiqYashirin: boolean;
}

// Erta yopish kalkulyatori: asosiy to'lov va uni oshirilgan variantlar.
// Har birida oylar, jami foiz, tejaladigan summa.
export default function ErtaYopishKarta({ qoldiq, yillikStavka, muddat, qoldiqYashirin }: Props) {
  const { t } = useTranslation();

  const variantlar = useMemo(() => {
    const asosiy = annuitetTolov(qoldiq, yillikStavka, muddat && muddat > 0 ? muddat : 12);
    if (asosiy <= 0) {
      return [];
    }
    return ertaYopishVariantlari(qoldiq, yillikStavka, asosiy);
  }, [qoldiq, yillikStavka, muddat]);

  if (variantlar.length === 0) {
    return null;
  }

  return (
    <View style={styles.karta}>
      <Text style={styles.sarlavha}>{t('qarz.ertaYopish')}</Text>
      {variantlar.map((v, i) => (
        <View key={i} style={styles.qator}>
          <PulMatn amount={v.oylikTolov} yashirin={qoldiqYashirin} style={styles.tolov} />
          <View style={styles.ong}>
            {v.natija ? (
              <>
                <Text style={styles.oy}>
                  {v.natija.oylar} {t('qarz.oy')}
                </Text>
                <Text style={styles.foiz}>
                  {t('qarz.jamiFoiz')}:{' '}
                  <PulMatn amount={v.natija.jamiFoiz} yashirin={qoldiqYashirin} />
                </Text>
                {v.tejaladi && v.tejaladi > 0 ? (
                  <Text style={styles.tejaladi}>
                    {t('qarz.tejaladi')}: <PulMatn amount={v.tejaladi} yashirin={qoldiqYashirin} />
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.ogoh}>{t('qarz.ogohlantirish')}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  karta: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  sarlavha: { fontFamily: fonts.sarlavha, fontSize: 15, color: colors.siyoh },
  qator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.kul,
    paddingTop: spacing.sm,
  },
  tolov: { fontSize: 16, color: colors.siyoh },
  ong: { alignItems: 'flex-end', gap: 2 },
  oy: { fontFamily: fonts.matn, fontSize: 14, color: colors.siyoh },
  foiz: { fontFamily: fonts.matn, fontSize: 12, color: colors.kul },
  tejaladi: { fontFamily: fonts.matn, fontSize: 12, color: colors.yashil },
  ogoh: { fontFamily: fonts.matn, fontSize: 12, color: colors.qizil },
});

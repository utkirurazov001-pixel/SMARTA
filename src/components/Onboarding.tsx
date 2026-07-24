import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { colors, fonts, radius, spacing } from '../theme/tokens';
import { pinOrnat } from '../utils/qulf';

interface Props {
  onFinish: () => void;
}

const SLAYDLAR = ['s1', 's2', 's3'] as const;

// Uch ekranli onboarding: ikki kontur, tez yozuv, maxfiylik. Oxirida ixtiyoriy PIN.
export default function Onboarding({ onFinish }: Props) {
  const { t } = useTranslation();
  const [indeks, setIndeks] = useState(0);
  const [pin, setPin] = useState('');
  const [takror, setTakror] = useState('');
  const [xato, setXato] = useState<string | null>(null);

  const oxirgi = indeks === SLAYDLAR.length - 1;
  const slayd = SLAYDLAR[indeks];

  async function tugat() {
    if (pin.length > 0) {
      if (pin.length < 4 || pin !== takror) {
        setXato(t('qulf.mos_emas'));
        return;
      }
      await pinOrnat(pin);
    }
    onFinish();
  }

  return (
    <SafeAreaView style={styles.konteyner}>
      <Pressable accessibilityRole="button" style={styles.otkazish} onPress={() => void tugat()}>
        <Text style={styles.otkazishMatn}>{t('onboarding.otkazish')}</Text>
      </Pressable>

      <View style={styles.markaz}>
        <Text style={styles.sarlavha}>{t(`onboarding.${slayd}_sarlavha`)}</Text>
        <Text style={styles.matn}>{t(`onboarding.${slayd}_matn`)}</Text>

        {oxirgi ? (
          <View style={styles.pinBlok}>
            <TextInput
              style={styles.pin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              placeholder={t('qulf.ornating')}
              placeholderTextColor={colors.kul}
              value={pin}
              onChangeText={setPin}
              accessibilityLabel={t('qulf.ornating')}
            />
            {pin.length > 0 ? (
              <TextInput
                style={styles.pin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder={t('qulf.takrorlang')}
                placeholderTextColor={colors.kul}
                value={takror}
                onChangeText={setTakror}
                accessibilityLabel={t('qulf.takrorlang')}
              />
            ) : null}
            {xato ? <Text style={styles.xato}>{xato}</Text> : null}
          </View>
        ) : null}
      </View>

      <View style={styles.nuqtalar}>
        {SLAYDLAR.map((s, i) => (
          <View key={s} style={[styles.nuqta, i === indeks && styles.nuqtaFaol]} />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        style={styles.tugma}
        onPress={() => (oxirgi ? void tugat() : setIndeks((i) => i + 1))}
      >
        <Text style={styles.tugmaMatn}>
          {oxirgi ? t('onboarding.boshlash') : t('onboarding.keyingi')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz, padding: spacing.lg },
  otkazish: { alignSelf: 'flex-end', padding: spacing.sm, minHeight: 44, justifyContent: 'center' },
  otkazishMatn: { fontFamily: fonts.matn, fontSize: 14, color: colors.kul },
  markaz: { flex: 1, justifyContent: 'center', gap: spacing.md },
  sarlavha: { fontFamily: fonts.sarlavha, fontSize: 26, color: colors.siyoh },
  matn: { fontFamily: fonts.matn, fontSize: 16, color: colors.kul, lineHeight: 24 },
  pinBlok: { marginTop: spacing.lg, gap: spacing.sm },
  pin: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.raqam,
    fontSize: 18,
    color: colors.siyoh,
    letterSpacing: 8,
  },
  xato: { fontFamily: fonts.matn, fontSize: 13, color: colors.qizil },
  nuqtalar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  nuqta: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.kul, opacity: 0.4 },
  nuqtaFaol: { opacity: 1, backgroundColor: colors.ishkor },
  tugma: {
    backgroundColor: colors.siyoh,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  tugmaMatn: { fontFamily: fonts.sarlavha, fontSize: 16, color: colors.qogoz },
});

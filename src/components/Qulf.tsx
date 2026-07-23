import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { colors, fonts, radius, spacing } from '../theme/tokens';
import { biometrikMavjud, biometrikTekshir, pinTekshir } from '../utils/qulf';

interface Props {
  onUnlock: () => void;
}

// Qulf ekrani. Qulf ochilmaguncha hech qanday ma'lumot ko'rinmaydi.
export default function Qulf({ onUnlock }: Props) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [xato, setXato] = useState(false);
  const [bioBor, setBioBor] = useState(false);

  const bioOchish = useCallback(async () => {
    if (await biometrikTekshir()) {
      onUnlock();
    }
  }, [onUnlock]);

  useEffect(() => {
    let tirik = true;
    void (async () => {
      const bor = await biometrikMavjud();
      if (!tirik) {
        return;
      }
      setBioBor(bor);
      if (bor) {
        void bioOchish();
      }
    })();
    return () => {
      tirik = false;
    };
  }, [bioOchish]);

  async function tekshir(kiritilgan: string) {
    if (kiritilgan.length < 4) {
      return;
    }
    if (await pinTekshir(kiritilgan)) {
      onUnlock();
    } else {
      setXato(true);
      setPin('');
    }
  }

  return (
    <SafeAreaView style={styles.konteyner}>
      <View style={styles.markaz}>
        <Text style={styles.sarlavha}>{t('qulf.kiriting')}</Text>
        <TextInput
          style={styles.pin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          autoFocus
          value={pin}
          onChangeText={(x) => {
            setXato(false);
            setPin(x);
            void tekshir(x);
          }}
          accessibilityLabel={t('qulf.kiriting')}
        />
        {xato ? <Text style={styles.xato}>{t('qulf.xato')}</Text> : null}
        {bioBor ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('qulf.biometrik')}
            style={styles.bio}
            onPress={() => void bioOchish()}
          >
            <Text style={styles.bioMatn}>{t('qulf.biometrik')}</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  markaz: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  sarlavha: { fontFamily: fonts.sarlavha, fontSize: 20, color: colors.siyoh },
  pin: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    fontFamily: fonts.raqam,
    fontSize: 24,
    color: colors.siyoh,
    letterSpacing: 12,
    textAlign: 'center',
    minWidth: 180,
  },
  xato: { fontFamily: fonts.matn, fontSize: 14, color: colors.qizil },
  bio: { padding: spacing.md, minHeight: 44, justifyContent: 'center' },
  bioMatn: { fontFamily: fonts.matn, fontSize: 15, color: colors.ishkor },
});

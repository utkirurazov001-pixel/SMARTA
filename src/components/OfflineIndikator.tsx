import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Network from 'expo-network';
import { useTranslation } from 'react-i18next';

import { colors, fonts, spacing } from '../theme/tokens';

// Offline indikatori. Ilova offline-first — bu shunchaki holat belgisi, to'siq emas.
export default function OfflineIndikator() {
  const { t } = useTranslation();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let tirik = true;
    void Network.getNetworkStateAsync().then((s) => {
      if (tirik) {
        setOffline(!s.isConnected);
      }
    });
    const sub = Network.addNetworkStateListener((s) => setOffline(!s.isConnected));
    return () => {
      tirik = false;
      sub.remove();
    };
  }, []);

  if (!offline) {
    return null;
  }

  return <Text style={styles.banner}>{t('offline.matn')}</Text>;
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.siyoh,
    color: colors.qogoz,
    fontFamily: fonts.matn,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
});

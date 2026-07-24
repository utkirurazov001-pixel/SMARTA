// Bazani ochadi va kontekst orqali beradi. Baza tayyor bo'lguncha yuklanish ko'rsatiladi.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../theme/tokens';
import { openSmartaDb } from './client';
import type { SmartaDb } from './db';

const DbContext = createContext<SmartaDb | null>(null);

export function DbProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<SmartaDb | null>(null);

  useEffect(() => {
    let tirik = true;
    void openSmartaDb().then((d) => {
      if (tirik) {
        setDb(d);
      }
    });
    return () => {
      tirik = false;
    };
  }, []);

  if (!db) {
    return (
      <View style={styles.yuklanish}>
        <ActivityIndicator color={colors.ishkor} />
      </View>
    );
  }

  return <DbContext.Provider value={db}>{children}</DbContext.Provider>;
}

export function useDb(): SmartaDb {
  const db = useContext(DbContext);
  if (!db) {
    throw new Error('useDb DbProvider ichida ishlatilishi kerak');
  }
  return db;
}

const styles = StyleSheet.create({
  yuklanish: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.qogoz,
  },
});

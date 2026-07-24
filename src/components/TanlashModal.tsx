import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, radius, spacing } from '../theme/tokens';

export interface TanlovElement {
  id: string;
  nom: string;
  guruh?: string;
}

interface Props {
  visible: boolean;
  sarlavha: string;
  elementlar: TanlovElement[];
  accent: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

// Umumiy tanlash modali — qidiruv bilan. Kategoriya va hisob tanlash uchun ishlatiladi.
export default function TanlashModal({
  visible,
  sarlavha,
  elementlar,
  accent,
  onSelect,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [qidiruv, setQidiruv] = useState('');

  const filtrlangan = useMemo(() => {
    const q = qidiruv.trim().toLowerCase();
    if (!q) {
      return elementlar;
    }
    return elementlar.filter((e) => e.nom.toLowerCase().includes(q));
  }, [elementlar, qidiruv]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.fon}>
        <View style={styles.panel}>
          <View style={styles.tepa}>
            <Text style={styles.sarlavha}>{sarlavha}</Text>
            <Pressable accessibilityRole="button" onPress={onClose} hitSlop={8}>
              <Text style={[styles.yopish, { color: accent }]}>{t('umumiy.yopish')}</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.qidiruv}
            placeholder={t('yozuv.qidiruv')}
            placeholderTextColor={colors.kul}
            value={qidiruv}
            onChangeText={setQidiruv}
          />
          <FlatList
            data={filtrlangan}
            keyExtractor={(e) => e.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                style={styles.element}
                onPress={() => {
                  setQidiruv('');
                  onSelect(item.id);
                }}
              >
                {item.guruh ? <Text style={styles.guruh}>{item.guruh}</Text> : null}
                <Text style={styles.nom}>{item.nom}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fon: { flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-end' },
  panel: {
    backgroundColor: colors.qogoz,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    maxHeight: '80%',
  },
  tepa: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sarlavha: { fontFamily: fonts.sarlavha, fontSize: 17, color: colors.siyoh },
  yopish: { fontFamily: fonts.matn, fontSize: 15 },
  qidiruv: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.matn,
    color: colors.siyoh,
  },
  element: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.kul,
  },
  guruh: { fontFamily: fonts.matn, fontSize: 11, color: colors.kul },
  nom: { fontFamily: fonts.matn, fontSize: 16, color: colors.siyoh },
});

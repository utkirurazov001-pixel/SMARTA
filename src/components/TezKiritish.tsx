import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useDb } from '../db/DbProvider';
import { useLedger } from '../db/useLedger';
import { orgatKalit, tahlilQil } from '../domain/tahlil';
import { createTransaction } from '../repositories/transactions';
import { useAccent } from '../store/useAccent';
import { useOrgangan } from '../store/useOrgangan';
import { useSettings } from '../store/useSettings';
import { colors, fonts, radius, soya, spacing } from '../theme/tokens';
import { formatKun } from '../utils/date';
import { muvaffaqiyat } from '../utils/haptik';
import { kategoriyaNomi } from '../utils/labels';
import PulMatn from './PulMatn';
import TanlashModal, { type TanlovElement } from './TanlashModal';

interface Props {
  onSaved: () => void;
}

// Matn orqali tez yozuv. Natija TAKLIF sifatida ko'rsatiladi — foydalanuvchi tasdiqlaydi.
// Ilova hech qachon jimgina yozmaydi. Tuzatilgan kategoriya eslab qolinadi (o'rganish).
export default function TezKiritish({ onSaved }: Props) {
  const { t } = useTranslation();
  const db = useDb();
  const accent = useAccent();
  const contour = useSettings((s) => s.contour);
  const { kategoriyalar, hisoblar } = useLedger();
  const organganXarita = useOrgangan((s) => s.xarita);
  const orgat = useOrgangan((s) => s.orgat);

  const [matn, setMatn] = useState('');
  const [override, setOverride] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  const natija = useMemo(() => tahlilQil(matn, contour, new Date()), [matn, contour]);
  const kalit = orgatKalit(matn);

  const kategoriyalarRoyxat = useMemo(() => [...kategoriyalar.values()], [kategoriyalar]);
  const avtoKat = natija.kategoriya
    ? kategoriyalarRoyxat.find((c) => c.key === natija.kategoriya)
    : undefined;
  const organganId = kalit ? organganXarita[`${contour}:${kalit}`] : undefined;
  const tanlanganId = override ?? organganId ?? avtoKat?.id ?? null;
  const tanlanganKat = tanlanganId
    ? kategoriyalarRoyxat.find((c) => c.id === tanlanganId)
    : undefined;

  const tur = tanlanganKat?.type ?? natija.tur;
  const hisobId = hisoblar[0]?.id ?? null;

  async function saqla() {
    if (natija.summa === null || natija.summa <= 0 || !hisobId) {
      return;
    }
    await createTransaction(db, contour, {
      type: tur,
      amount: natija.summa,
      accountId: hisobId,
      categoryId: tanlanganId,
      occurredAt: natija.sana,
    });
    // O'rganish: shu tavsif uchun tanlangan kategoriyani eslab qolamiz.
    if (tanlanganId && kalit) {
      orgat(contour, kalit, tanlanganId);
    }
    muvaffaqiyat();
    setMatn('');
    setOverride(null);
    onSaved();
  }

  const elementlar: TanlovElement[] = kategoriyalarRoyxat.map((c) => ({
    id: c.id,
    nom: kategoriyaNomi(c, t),
    guruh: t(c.group_key),
  }));

  return (
    <View style={styles.karta}>
      <Text style={styles.sarlavha}>{t('tez.sarlavha')}</Text>
      <TextInput
        style={styles.kirit}
        placeholder={t('tez.joyholder')}
        placeholderTextColor={colors.kul}
        value={matn}
        onChangeText={(x) => {
          setMatn(x);
          setOverride(null);
        }}
      />

      {matn.trim().length > 0 ? (
        natija.summa !== null ? (
          <View style={styles.taklif}>
            <View style={styles.qator}>
              <Text style={[styles.turChip, { color: accent }]}>{t(`tur.${tur}`)}</Text>
              <PulMatn amount={natija.summa} style={styles.summa} />
            </View>
            <View style={styles.qator}>
              <Pressable
                accessibilityRole="button"
                style={styles.katTugma}
                onPress={() => setModal(true)}
              >
                <Text style={styles.katMatn}>
                  {tanlanganKat ? kategoriyaNomi(tanlanganKat, t) : t('yozuv.kategoriya_tanlang')}
                </Text>
              </Pressable>
              <Text style={styles.sana}>{formatKun(natija.sana)}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={[styles.tasdiq, { backgroundColor: accent }]}
              onPress={() => void saqla()}
            >
              <Text style={styles.tasdiqMatn}>{t('tez.tasdiqlash')}</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.aniqlanmadi}>{t('tez.aniqlanmadi')}</Text>
        )
      ) : null}

      <TanlashModal
        visible={modal}
        sarlavha={t('yozuv.kategoriya_tanlang')}
        elementlar={elementlar}
        accent={accent}
        onClose={() => setModal(false)}
        onSelect={(id) => {
          setOverride(id);
          setModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  karta: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.oq,
    borderRadius: radius.md,
    gap: spacing.sm,
    ...soya,
  },
  sarlavha: { fontFamily: fonts.sarlavha, fontSize: 15, color: colors.siyoh },
  kirit: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.matn,
    fontSize: 16,
    color: colors.siyoh,
  },
  taklif: { gap: spacing.sm },
  qator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  turChip: { fontFamily: fonts.sarlavha, fontSize: 14 },
  summa: { fontSize: 20, color: colors.siyoh },
  katTugma: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  katMatn: { fontFamily: fonts.matn, fontSize: 14, color: colors.siyoh },
  sana: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul },
  tasdiq: { borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center' },
  tasdiqMatn: { fontFamily: fonts.sarlavha, fontSize: 15, color: colors.qogoz },
  aniqlanmadi: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul },
});

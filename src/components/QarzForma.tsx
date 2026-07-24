import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useDb } from '../db/DbProvider';
import type { DebtDirection, DebtPaymentType } from '../domain/types';
import { createDebt } from '../repositories/debts';
import { useAccent } from '../store/useAccent';
import { useSettings } from '../store/useSettings';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { formatSom, parseSomInput } from '../utils/format';
import { muvaffaqiyat } from '../utils/haptik';
import SegmentTanlagich from './SegmentTanlagich';

interface Props {
  onSaved: () => void;
}

const YONALISHLAR: DebtDirection[] = ['men_qarzdor', 'menga_qarzdor'];
const TOLOV_TURLARI: DebtPaymentType[] = ['annuitet', 'differensial', 'muddatsiz'];

// Yangi qarz qo'shish formasi.
export default function QarzForma({ onSaved }: Props) {
  const { t } = useTranslation();
  const db = useDb();
  const accent = useAccent();
  const contour = useSettings((s) => s.contour);

  const [direction, setDirection] = useState<DebtDirection>('men_qarzdor');
  const [kreditor, setKreditor] = useState('');
  const [summa, setSumma] = useState('');
  const [stavka, setStavka] = useState('');
  const [muddat, setMuddat] = useState('');
  const [tolovTuri, setTolovTuri] = useState<DebtPaymentType>('annuitet');
  const [xato, setXato] = useState<string | null>(null);

  async function saqla() {
    const principal = parseSomInput(summa);
    if (principal <= 0) {
      setXato(t('yozuv.summa_kerak'));
      return;
    }
    await createDebt(db, contour, {
      direction,
      counterparty: kreditor.trim() || '—',
      principal,
      annualRate: Number(stavka.replace(',', '.')) || 0,
      termMonths: muddat ? parseInt(muddat, 10) : null,
      paymentType: tolovTuri,
    });
    muvaffaqiyat();
    onSaved();
  }

  return (
    <ScrollView style={styles.konteyner} contentContainerStyle={styles.ichki}>
      <Text style={styles.yorliq}>{t('qarz.tolovTuri')}</Text>
      <SegmentTanlagich
        accent={accent}
        value={direction}
        onChange={setDirection}
        options={YONALISHLAR.map((x) => ({
          value: x,
          label: x === 'men_qarzdor' ? t('qarz.menQarzdor') : t('qarz.mengaQarzdor'),
        }))}
      />

      <Text style={styles.yorliq}>{t('qarz.kreditor')}</Text>
      <TextInput style={styles.maydon} value={kreditor} onChangeText={setKreditor} />

      <Text style={styles.yorliq}>{t('yozuv.summa')}</Text>
      <TextInput
        style={styles.maydon}
        keyboardType="number-pad"
        value={summa}
        onChangeText={(x) => setSumma(formatSom(parseSomInput(x)))}
      />

      <Text style={styles.yorliq}>{t('qarz.stavka')}</Text>
      <TextInput
        style={styles.maydon}
        keyboardType="decimal-pad"
        value={stavka}
        onChangeText={setStavka}
      />

      <Text style={styles.yorliq}>{t('qarz.muddat')}</Text>
      <TextInput
        style={styles.maydon}
        keyboardType="number-pad"
        value={muddat}
        onChangeText={(x) => setMuddat(x.replace(/[^\d]/g, ''))}
      />

      <Text style={styles.yorliq}>{t('qarz.tolovTuri')}</Text>
      <SegmentTanlagich
        accent={accent}
        value={tolovTuri}
        onChange={setTolovTuri}
        options={TOLOV_TURLARI.map((x) => ({ value: x, label: t(`qarz.${x}`) }))}
      />

      {xato ? <Text style={styles.xato}>{xato}</Text> : null}

      <Pressable
        accessibilityRole="button"
        style={[styles.saqla, { backgroundColor: accent }]}
        onPress={() => void saqla()}
      >
        <Text style={styles.saqlaMatn}>{t('yozuv.saqlash')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  ichki: { padding: spacing.md, gap: spacing.xs, paddingBottom: spacing.xl },
  yorliq: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul, marginTop: spacing.sm },
  maydon: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.matn,
    fontSize: 16,
    color: colors.siyoh,
  },
  xato: { fontFamily: fonts.matn, fontSize: 13, color: colors.qizil, marginTop: spacing.sm },
  saqla: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saqlaMatn: { fontFamily: fonts.sarlavha, fontSize: 16, color: colors.qogoz },
});

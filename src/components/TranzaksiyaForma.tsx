import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { useDb } from '../db/DbProvider';
import type { AccountRow, CategoryRow, TransactionRow } from '../db/schema';
import type { TransactionType } from '../domain/types';
import { listAccounts } from '../repositories/accounts';
import { listCategories } from '../repositories/categories';
import { createTransaction, updateTransaction } from '../repositories/transactions';
import { useAccent } from '../store/useAccent';
import { useSettings } from '../store/useSettings';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { formatKun, kunBoshi } from '../utils/date';
import { formatSom, parseSomInput } from '../utils/format';
import { muvaffaqiyat } from '../utils/haptik';
import { kategoriyaNomi } from '../utils/labels';
import SegmentTanlagich from './SegmentTanlagich';
import TanlashModal, { type TanlovElement } from './TanlashModal';

const TURLAR: TransactionType[] = ['chiqim', 'kirim', 'kochirish'];

interface Props {
  mavjud?: TransactionRow;
  onSaved: () => void;
}

// Yozuv qo'shish/tahrirlash formasi. Kochirish uchun kategoriya ko'rsatilmaydi.
export default function TranzaksiyaForma({ mavjud, onSaved }: Props) {
  const { t } = useTranslation();
  const db = useDb();
  const accent = useAccent();
  const contour = useSettings((s) => s.contour);

  const [hisoblar, setHisoblar] = useState<AccountRow[]>([]);
  const [kategoriyalar, setKategoriyalar] = useState<CategoryRow[]>([]);

  const [tur, setTur] = useState<TransactionType>(mavjud?.type ?? 'chiqim');
  const [summa, setSumma] = useState(mavjud ? formatSom(mavjud.amount) : '');
  const [kategoriyaId, setKategoriyaId] = useState<string | null>(mavjud?.category_id ?? null);
  const [hisobId, setHisobId] = useState<string | null>(mavjud?.account_id ?? null);
  const [sana, setSana] = useState<string>(mavjud?.occurred_at ?? kunBoshi(new Date()));
  const [kontragent, setKontragent] = useState(mavjud?.counterparty ?? '');
  const [izoh, setIzoh] = useState(mavjud?.note ?? '');
  const [xato, setXato] = useState<string | null>(null);
  const [sanaOchiq, setSanaOchiq] = useState(false);
  const [modal, setModal] = useState<'kategoriya' | 'hisob' | null>(null);

  useEffect(() => {
    void (async () => {
      const [accs, cats] = await Promise.all([
        listAccounts(db, contour),
        listCategories(db, contour),
      ]);
      setHisoblar(accs);
      setKategoriyalar(cats);
      if (!mavjud && accs.length > 0 && !hisobId) {
        setHisobId(accs[0].id);
      }
    })();
    // contour o'zgarsa qayta yuklanadi; boshqa deps store'dan barqaror.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, contour]);

  const kategoriyaElementlar: TanlovElement[] = useMemo(
    () =>
      kategoriyalar
        .filter((c) => c.type === null || c.type === tur)
        .map((c) => ({ id: c.id, nom: kategoriyaNomi(c, t), guruh: t(c.group_key) })),
    [kategoriyalar, tur, t],
  );

  const hisobElementlar: TanlovElement[] = useMemo(
    () => hisoblar.map((h) => ({ id: h.id, nom: h.name })),
    [hisoblar],
  );

  const kategoriyaNom = kategoriyalar.find((c) => c.id === kategoriyaId);
  const hisobNom = hisoblar.find((h) => h.id === hisobId);

  function sanaOzgardi(_e: DateTimePickerEvent, tanlangan?: Date) {
    setSanaOchiq(Platform.OS === 'ios');
    if (tanlangan) {
      setSana(kunBoshi(tanlangan));
    }
  }

  async function saqla() {
    const miqdor = parseSomInput(summa);
    if (miqdor <= 0) {
      setXato(t('yozuv.summa_kerak'));
      return;
    }
    if (!hisobId) {
      setXato(t('yozuv.hisob_kerak'));
      return;
    }
    const data = {
      type: tur,
      amount: miqdor,
      accountId: hisobId,
      categoryId: tur === 'kochirish' ? null : kategoriyaId,
      counterparty: kontragent.trim() || null,
      note: izoh.trim() || null,
      occurredAt: sana,
    };
    if (mavjud) {
      await updateTransaction(db, contour, mavjud.id, data);
    } else {
      await createTransaction(db, contour, data);
    }
    muvaffaqiyat();
    onSaved();
  }

  return (
    <KeyboardAvoidingView
      style={styles.konteyner}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.ichki} keyboardShouldPersistTaps="handled">
        <Text style={styles.yorliq}>{t('yozuv.tur')}</Text>
        <SegmentTanlagich
          accent={accent}
          value={tur}
          onChange={(v) => setTur(v)}
          options={TURLAR.map((x) => ({ value: x, label: t(`tur.${x}`) }))}
        />

        <Text style={styles.yorliq}>{t('yozuv.summa')}</Text>
        <TextInput
          style={styles.summa}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.kul}
          value={summa}
          onChangeText={(x) => setSumma(formatSom(parseSomInput(x)))}
        />

        {tur !== 'kochirish' ? (
          <>
            <Text style={styles.yorliq}>{t('yozuv.kategoriya')}</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.tanlov}
              onPress={() => setModal('kategoriya')}
            >
              <Text style={styles.tanlovMatn}>
                {kategoriyaNom ? kategoriyaNomi(kategoriyaNom, t) : t('yozuv.kategoriya_tanlang')}
              </Text>
            </Pressable>
          </>
        ) : null}

        <Text style={styles.yorliq}>{t('yozuv.hisob')}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.tanlov}
          onPress={() => setModal('hisob')}
        >
          <Text style={styles.tanlovMatn}>
            {hisobNom ? hisobNom.name : t('yozuv.hisob_tanlang')}
          </Text>
        </Pressable>

        <Text style={styles.yorliq}>{t('yozuv.sana')}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.tanlov}
          onPress={() => setSanaOchiq(true)}
        >
          <Text style={styles.tanlovMatn}>{formatKun(sana)}</Text>
        </Pressable>
        {sanaOchiq ? (
          <DateTimePicker value={new Date(sana)} mode="date" onChange={sanaOzgardi} />
        ) : null}

        <Text style={styles.yorliq}>{t('yozuv.kontragent')}</Text>
        <TextInput
          style={styles.matnMaydon}
          value={kontragent}
          onChangeText={setKontragent}
          placeholderTextColor={colors.kul}
        />

        <Text style={styles.yorliq}>{t('yozuv.izoh')}</Text>
        <TextInput
          style={styles.matnMaydon}
          value={izoh}
          onChangeText={setIzoh}
          placeholderTextColor={colors.kul}
        />

        {xato ? <Text style={styles.xato}>{xato}</Text> : null}

        <Pressable
          accessibilityRole="button"
          style={[styles.saqla, { backgroundColor: accent }]}
          onPress={() => void saqla()}
        >
          <Text style={styles.saqlaMatn}>{t('yozuv.saqlash')}</Text>
        </Pressable>

        <TanlashModal
          visible={modal === 'kategoriya'}
          sarlavha={t('yozuv.kategoriya_tanlang')}
          elementlar={kategoriyaElementlar}
          accent={accent}
          onClose={() => setModal(null)}
          onSelect={(id) => {
            setKategoriyaId(id);
            setModal(null);
          }}
        />
        <TanlashModal
          visible={modal === 'hisob'}
          sarlavha={t('yozuv.hisob_tanlang')}
          elementlar={hisobElementlar}
          accent={accent}
          onClose={() => setModal(null)}
          onSelect={(id) => {
            setHisobId(id);
            setModal(null);
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  ichki: { padding: spacing.md, gap: spacing.xs, paddingBottom: spacing.xl },
  yorliq: { fontFamily: fonts.matn, fontSize: 13, color: colors.kul, marginTop: spacing.sm },
  summa: {
    fontFamily: fonts.raqam,
    fontVariant: ['tabular-nums'],
    fontSize: 28,
    color: colors.siyoh,
    textAlign: 'right',
    borderBottomWidth: 2,
    borderBottomColor: colors.kul,
    paddingVertical: spacing.xs,
  },
  tanlov: {
    borderWidth: 1,
    borderColor: colors.kul,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  tanlovMatn: { fontFamily: fonts.matn, fontSize: 16, color: colors.siyoh },
  matnMaydon: {
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

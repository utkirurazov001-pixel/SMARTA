import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import DavrTanlagich from '../../src/components/DavrTanlagich';
import KonturTanlagich from '../../src/components/KonturTanlagich';
import { useDb } from '../../src/db/DbProvider';
import { useLedger } from '../../src/db/useLedger';
import { davrOraliq, oraliqIchida, type DavrTur } from '../../src/domain/davr';
import {
  kategoriyaBoyicha,
  kontragentBoyicha,
  toCsv,
  type HisobotTx,
  type Jadval,
} from '../../src/domain/hisobot';
import { toliqMalumot } from '../../src/repositories/toliqEksport';
import { useAccent } from '../../src/store/useAccent';
import { useSettings } from '../../src/store/useSettings';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';
import { formatKun } from '../../src/utils/date';
import { matnEksport, pdfEksport, xlsxEksport } from '../../src/utils/eksport';
import { kategoriyaNomi } from '../../src/utils/labels';

// Hisobotlar va ma'lumot eksporti. Har hisobot 3 bosishdan kam masofada.
export default function HisobotEkran() {
  const { t } = useTranslation();
  const db = useDb();
  const accent = useAccent();
  const { kategoriyalar, hisoblarMap, transactions } = useLedger();
  const contour = useSettings((s) => s.contour);
  const [davr, setDavr] = useState<DavrTur>('buOy');

  // Tranzaksiyani hisobot satriga aylantiradi (nomlar hal qilingan).
  const boyit = useMemo(() => {
    return (tx: (typeof transactions)[number]): HisobotTx => {
      const kat = tx.category_id ? kategoriyalar.get(tx.category_id) : undefined;
      return {
        sana: formatKun(tx.occurred_at),
        tur: tx.type,
        kategoriya: kat ? kategoriyaNomi(kat, t) : t(`tur.${tx.type}`),
        hisob: hisoblarMap.get(tx.account_id)?.name ?? '',
        kontragent: tx.counterparty ?? '',
        summa: tx.amount,
        izoh: tx.note ?? '',
      };
    };
  }, [kategoriyalar, hisoblarMap, t]);

  const davrTxlar = useMemo(() => {
    const o = davrOraliq(davr, new Date());
    return transactions.filter((tx) => oraliqIchida(tx.occurred_at, o.joriy)).map(boyit);
  }, [transactions, davr, boyit]);

  const kun = new Date().toISOString().slice(0, 10);

  function kitobJadval(satrlar: HisobotTx[]): Jadval {
    return {
      sarlavhalar: [
        t('hisobot.ustun.sana'),
        t('hisobot.ustun.tur'),
        t('hisobot.ustun.kategoriya'),
        t('hisobot.ustun.hisob'),
        t('hisobot.ustun.kontragent'),
        t('hisobot.ustun.summa'),
        t('hisobot.ustun.izoh'),
      ],
      qatorlar: satrlar.map((x) => [
        x.sana,
        t(`tur.${x.tur}`),
        x.kategoriya,
        x.hisob,
        x.kontragent,
        x.summa,
        x.izoh,
      ]),
    };
  }

  function kategoriyaJadval(): Jadval {
    return {
      sarlavhalar: [
        t('hisobot.ustun.kategoriya'),
        t('hisobot.ustun.jami'),
        t('hisobot.ustun.soni'),
      ],
      qatorlar: kategoriyaBoyicha(davrTxlar).map((r) => [r.kategoriya, r.jami, r.soni]),
    };
  }

  function kontragentJadval(): Jadval {
    return {
      sarlavhalar: [
        t('hisobot.ustun.kontragent'),
        t('hisobot.ustun.kirim'),
        t('hisobot.ustun.chiqim'),
        t('hisobot.ustun.balans'),
      ],
      qatorlar: kontragentBoyicha(davrTxlar).map((r) => [
        r.kontragent,
        r.kirim,
        r.chiqim,
        r.balans,
      ]),
    };
  }

  async function toliqEksport(format: 'csv' | 'json') {
    if (format === 'json') {
      const data = await toliqMalumot(db, contour);
      await matnEksport(`smarta_${contour}_${kun}.json`, JSON.stringify(data, null, 2));
    } else {
      // CSV — to'liq jurnal (barcha tranzaksiyalar, davrsiz).
      const jadval = kitobJadval(transactions.map(boyit));
      await matnEksport(`smarta_${contour}_${kun}.csv`, toCsv(jadval), true);
    }
  }

  return (
    <ScrollView style={styles.konteyner}>
      <KonturTanlagich />
      <DavrTanlagich qiymat={davr} onChange={setDavr} />

      <Bolim sarlavha={t('hisobot.kirimChiqim')}>
        <Tugma
          matn="XLSX"
          accent={accent}
          onPress={() =>
            xlsxEksport(
              `smarta_kitob_${kun}.xlsx`,
              t('hisobot.kirimChiqim'),
              kitobJadval(davrTxlar),
            )
          }
        />
        <Tugma
          matn="PDF"
          accent={accent}
          onPress={() => pdfEksport(t('hisobot.kirimChiqim'), kitobJadval(davrTxlar))}
        />
      </Bolim>

      <Bolim sarlavha={t('hisobot.kategoriyaHisoboti')}>
        <Tugma
          matn="XLSX"
          accent={accent}
          onPress={() =>
            xlsxEksport(
              `smarta_kategoriya_${kun}.xlsx`,
              t('hisobot.kategoriyaHisoboti'),
              kategoriyaJadval(),
            )
          }
        />
        <Tugma
          matn="PDF"
          accent={accent}
          onPress={() => pdfEksport(t('hisobot.kategoriyaHisoboti'), kategoriyaJadval())}
        />
      </Bolim>

      <Bolim sarlavha={t('hisobot.kontragentHisoboti')}>
        <Tugma
          matn="XLSX"
          accent={accent}
          onPress={() =>
            xlsxEksport(
              `smarta_kontragent_${kun}.xlsx`,
              t('hisobot.kontragentHisoboti'),
              kontragentJadval(),
            )
          }
        />
      </Bolim>

      <Bolim sarlavha={t('hisobot.toliqEksport')} izoh={t('hisobot.toliqIzoh')}>
        <Tugma matn="CSV" accent={accent} onPress={() => toliqEksport('csv')} />
        <Tugma matn="JSON" accent={accent} onPress={() => toliqEksport('json')} />
      </Bolim>
    </ScrollView>
  );
}

function Bolim({
  sarlavha,
  izoh,
  children,
}: {
  sarlavha: string;
  izoh?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.bolim}>
      <Text style={styles.bolimSarlavha}>{sarlavha}</Text>
      {izoh ? <Text style={styles.bolimIzoh}>{izoh}</Text> : null}
      <View style={styles.tugmalar}>{children}</View>
    </View>
  );
}

function Tugma({
  matn,
  accent,
  onPress,
}: {
  matn: string;
  accent: string;
  onPress: () => void | Promise<void>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.tugma, { borderColor: accent }]}
      onPress={() => void onPress()}
    >
      <Text style={[styles.tugmaMatn, { color: accent }]}>{matn}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: colors.qogoz },
  bolim: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  bolimSarlavha: { fontFamily: fonts.sarlavha, fontSize: 15, color: colors.siyoh },
  bolimIzoh: { fontFamily: fonts.matn, fontSize: 12, color: colors.kul },
  tugmalar: { flexDirection: 'row', gap: spacing.sm },
  tugma: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tugmaMatn: { fontFamily: fonts.sarlavha, fontSize: 14 },
});

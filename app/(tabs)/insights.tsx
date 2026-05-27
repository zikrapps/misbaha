import { router } from 'expo-router';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { duas, prayerOrder } from '@/src/data/duas';
import { ActivityBars } from '@/src/features/insights/ActivityBars';
import { GardenSummary } from '@/src/features/insights/GardenSummary';
import { duaPreview, prayerLabel } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { useLanguage, useT } from '@/src/i18n/strings';
import { proseLayout } from '@/src/i18n/textLayout';
import { lastThirtyDays } from '@/src/store/date';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { spacing, useTheme } from '@/src/theme/theme';
import { sumRecordValues } from '@/src/utils/sumRecord';

export default function InsightsScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const language = useLanguage();
  const { typo } = theme;
  const { labelFont } = theme;
  const counts = useMisbahaStore((state) => state.counts);
  const dailyCounts = useMisbahaStore((state) => state.dailyCounts);
  const total = sumRecordValues(counts);
  const days = lastThirtyDays();
  const today = days[days.length - 1];
  const todayTotal = sumRecordValues(dailyCounts[today]);
  const activeDays = days.filter((day) => Object.values(dailyCounts[day] ?? {}).some(Boolean)).length;
  const perDay = Math.round(total / Math.max(1, activeDays));

  return (
    <Screen
      title={t.insights.title}
      subtitle={t.insights.subtitle}
      showSettingsAction
    >
      <GardenSummary total={total} counts={counts} />
      <View style={styles.stats}>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.today}</Text>
          <Text style={[styles.statValue, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>{formatNumber(todayTotal)}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.activeDays}</Text>
          <Text style={[styles.statValue, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>{formatNumber(activeDays)}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.perDay}</Text>
          <Text style={[styles.statValue, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>{formatNumber(perDay)}</Text>
        </Card>
      </View>

      <SectionTitle>{`${t.insights.thirtyDaysAgo} — ${t.insights.todayLabel}`}</SectionTitle>
      <Card>
        <ActivityBars
          values={days.map((day) => sumRecordValues(dailyCounts[day]))}
        />
        <View style={styles.axis}>
          <Text style={[styles.axisText, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.thirtyDaysAgo}</Text>
          <Text style={[styles.axisText, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.todayLabel}</Text>
        </View>
      </Card>

      <SectionTitle>{t.insights.tasbeehByPrayer}</SectionTitle>
      {prayerOrder.map((prayer) => {
        const prayerDuas = duas.filter((dua) => dua.prayer === prayer);
        const prayerTotal = prayerDuas.reduce((sum, dua) => sum + (counts[dua.id] ?? 0), 0);
        return (
          <Card key={prayer} style={styles.breakdown}>
            <View style={styles.breakdownHeader}>
              <Text style={[styles.breakdownTitle, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>
                {prayerLabel(prayer, language)}
              </Text>
              <Text style={[styles.breakdownTotal, { color: colors.oliveDark, fontSize: typo.subtitle }]}>{formatNumber(prayerTotal)}</Text>
            </View>
            {prayerDuas.map((dua) => {
              const value = counts[dua.id] ?? 0;
              const width = `${Math.min(100, (value / Math.max(1, prayerTotal)) * 100)}%` as DimensionValue;
              return (
                <View key={dua.id} style={styles.duaBreakdown}>
                  <Text style={[styles.duaName, proseLayout(language), { color: colors.muted, fontSize: typo.caption, fontFamily: labelFont }]}>
                    {duaPreview(dua, language)}
                  </Text>
                  <View style={[styles.track, { backgroundColor: colors.cream }]}>
                    <View style={[styles.fill, { width, backgroundColor: colors.olive }]} />
                  </View>
                  <Text style={[styles.duaCount, { color: colors.ink, fontSize: typo.caption }]}>{formatNumber(value)}</Text>
                </View>
              );
            })}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 21,
    marginTop: spacing.xs,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  axisText: {
    fontSize: 10,
  },
  breakdown: {
    gap: spacing.md,
  },
  breakdownHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownTitle: {
    fontSize: 20,
  },
  breakdownTotal: {
    fontSize: 18,
    fontWeight: '800',
  },
  duaBreakdown: {
    gap: spacing.xs,
  },
  duaName: {
    fontSize: 12,
  },
  track: {
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
    height: 8,
  },
  duaCount: {
    fontSize: 12,
    textAlign: 'right',
  },
});

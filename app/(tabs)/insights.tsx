import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { BadgesSection } from '@/src/features/badges/BadgesSection';
import { ActivityBars } from '@/src/features/insights/ActivityBars';
import { GardenSummary } from '@/src/features/insights/GardenSummary';
import { JourneySummary } from '@/src/features/insights/JourneySummary';
import { TodayGrowthCard } from '@/src/features/insights/TodayGrowthCard';
import { VisualizationToggle } from '@/src/features/insights/VisualizationToggle';
import { formatNumber } from '@/src/i18n/format';
import { useT } from '@/src/i18n/strings';
import { lastThirtyDays } from '@/src/store/date';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { spacing, useTheme } from '@/src/theme/theme';
import { normalizeVisualization } from '@/src/types/misbaha';
import { sumRecordValues } from '@/src/utils/sumRecord';

export default function InsightsScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const { typo } = theme;
  const { labelFont, proseLayout, proseInlineLayout, labelDecoration, mirrorRow } = theme;
  const counts = useMisbahaStore((state) => state.counts);
  const dailyCounts = useMisbahaStore((state) => state.dailyCounts);
  const visualization = useMisbahaStore((state) => normalizeVisualization(state.visualization));
  const setVisualization = useMisbahaStore((state) => state.setVisualization);
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
      <VisualizationToggle value={visualization} onChange={setVisualization} />
      <TodayGrowthCard todayTotal={todayTotal} mode={visualization} />
      {visualization === 'garden' ? (
        <GardenSummary total={total} counts={counts} />
      ) : visualization === 'earth' ? (
        <JourneySummary kind="earth" counts={counts} />
      ) : (
        <JourneySummary kind="space" counts={counts} />
      )}
      <View style={[styles.stats, mirrorRow]}>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, proseLayout, labelDecoration, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.today}</Text>
          <Text style={[styles.statValue, proseLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>{formatNumber(todayTotal)}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, proseLayout, labelDecoration, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.activeDays}</Text>
          <Text style={[styles.statValue, proseLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>{formatNumber(activeDays)}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, proseLayout, labelDecoration, { color: colors.muted, fontSize: typo.micro }]}>{t.insights.perDay}</Text>
          <Text style={[styles.statValue, proseLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>{formatNumber(perDay)}</Text>
        </Card>
      </View>

      <SectionTitle>{`${t.insights.thirtyDaysAgo} — ${t.insights.todayLabel}`}</SectionTitle>
      <Card>
        <ActivityBars
          values={days.map((day) => sumRecordValues(dailyCounts[day]))}
        />
        <View style={[styles.axis, mirrorRow]}>
          <Text style={[styles.axisText, proseInlineLayout, { color: colors.muted, fontSize: typo.micro }]}>
            {t.insights.thirtyDaysAgo}
          </Text>
          <Text style={[styles.axisText, proseInlineLayout, { color: colors.muted, fontSize: typo.micro }]}>
            {t.insights.todayLabel}
          </Text>
        </View>
      </Card>

      <SectionTitle>{t.badges.title}</SectionTitle>
      <BadgesSection />
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
});

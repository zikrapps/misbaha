import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop, Text as SvgText } from 'react-native-svg';

import { Card } from '@/src/components/Card';
import { ProseText } from '@/src/components/ProseText';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { BadgeSummaryCard } from '@/src/features/badges/BadgeSummaryCard';
import { DayTimelineCard } from '@/src/features/today/DayTimelineCard';
import { GoalGrid, GoalGridItem } from '@/src/features/goals/GoalGrid';
import { duas, duasById } from '@/src/data/duas';
import { duaPreview } from '@/src/i18n/duaText';
import { formatDashboardDate, formatNumber } from '@/src/i18n/format';
import { goalTitle } from '@/src/i18n/goalText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { todayKey } from '@/src/store/date';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { sumRecordValues } from '@/src/utils/sumRecord';
import { GoalPlan } from '@/src/types/misbaha';

type GoalSummary = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  percent: number;
  onPress: () => void;
};

function goalPercent(goal: GoalPlan, progress: Record<number, number>) {
  const total = goal.days.reduce((sum, day) => sum + day.target, 0);
  const done = goal.days.reduce((sum, day) => sum + Math.min(day.target, progress[day.day] ?? 0), 0);
  return Math.round((done / Math.max(1, total)) * 100);
}

function GoalSummaryCard({ item }: { item: GoalSummary }) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseLayout, labelDecoration, labelLineHeight, mirrorRow, alignStart } = theme;
  const isUrdu = theme.language === 'ur';

  return (
    <Pressable onPress={item.onPress} style={styles.goalTilePressable}>
      <Card style={[styles.goalCard, isUrdu && styles.goalCardUrdu]}>
        <View style={[styles.percentBadge, alignStart, { backgroundColor: colors.cream, borderColor: colors.line }]}>
          <Text
            style={[
              styles.percentValue,
              theme.proseInlineLayout,
              { color: colors.oliveDeep, fontFamily: labelFont, fontSize: typo.small },
            ]}
          >
            {formatNumber(item.percent)}%
          </Text>
        </View>
        <ProseText
          style={[styles.goalKind, labelDecoration, { color: colors.oliveDark, fontSize: typo.micro }]}
          numberOfLines={1}
        >
          {item.kind}
        </ProseText>
        <ProseText
          style={[
            styles.goalTitle,
            { color: colors.ink, fontFamily: labelFont, lineHeight: labelLineHeight(typo.body, 1.25) },
            isUrdu && styles.goalTitleUrdu,
          ]}
          numberOfLines={2}
        >
          {item.title}
        </ProseText>
        <ProseText
          style={[
            styles.goalSummary,
            { color: colors.muted, lineHeight: labelLineHeight(typo.small, 1.3) },
            isUrdu && styles.goalSummaryUrdu,
          ]}
          numberOfLines={isUrdu ? 2 : 3}
        >
          {item.summary}
        </ProseText>
      </Card>
    </Pressable>
  );
}

function HourlyTapsVisual({ values }: { values: number[] }) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseLayout, mirrorRow } = theme;
  const t = useT();
  const max = Math.max(1, ...values);
  const chartWidth = 312;
  const chartHeight = 128;
  const axisWidth = 34;
  const plotWidth = chartWidth - axisWidth;
  const step = plotWidth / (values.length - 1);
  const points = values.map((value, index) => ({
    x: axisWidth + index * step,
    y: chartHeight - (value / max) * (chartHeight - 16) - 4,
    value,
  }));
  const curvePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
  const areaPath = `${curvePath} L ${chartWidth} ${chartHeight} L ${axisWidth} ${chartHeight} Z`;
  const ticks = Array.from(new Set([max, Math.round(max / 2), 0])).sort((a, b) => b - a);

  return (
    <Card style={styles.visualCard}>
      <Text
        style={[
          styles.visualTitle,
          proseLayout,
          { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle + 4 },
        ]}
      >
        {t.today.todaysTaps}
      </Text>
      <Text
        style={[
          styles.visualCopy,
          proseLayout,
          { color: colors.muted, fontSize: typo.small, lineHeight: Math.round(typo.small * 1.45) },
        ]}
      >
        {t.today.hourlyHint}
      </Text>
      <View style={styles.hourlyChartWrap}>
        <Svg width="100%" height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}>
          <Defs>
            <LinearGradient id="hourlyFill" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor={colors.oliveDeep} stopOpacity="0.34" />
              <Stop offset="1" stopColor={colors.oliveDeep} stopOpacity="0.04" />
            </LinearGradient>
          </Defs>
          {ticks.map((tick, index) => {
            const y = chartHeight - (tick / max) * (chartHeight - 16) - 4;
            return (
              <SvgText key={`tick-${index}-${tick}`} x={0} y={tick === 0 ? chartHeight : y + 3} fill={colors.muted} fontSize={9}>
                {tick}
              </SvgText>
            );
          })}
          <Line x1={axisWidth - 8} x2={axisWidth - 8} y1={8} y2={chartHeight} stroke={colors.line} strokeWidth={1} />
          <Line x1={axisWidth} x2={chartWidth} y1={chartHeight} y2={chartHeight} stroke={colors.line} strokeWidth={1} />
          <Path d={areaPath} fill="url(#hourlyFill)" />
          <Path d={curvePath} fill="none" stroke={colors.oliveDeep} strokeWidth={4} strokeLinecap="round" />
          {points
            .filter((point) => point.value > 0)
            .map((point, index) => (
              <Circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r={3.5} fill={colors.card} stroke={colors.oliveDeep} strokeWidth={2} />
            ))}
        </Svg>
        <View style={styles.hourlyAxis}>
          <Text style={[styles.axisLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.today.chart12am}</Text>
          <Text style={[styles.axisLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.today.chart6am}</Text>
          <Text style={[styles.axisLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.today.chart12pm}</Text>
          <Text style={[styles.axisLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.today.chart6pm}</Text>
          <Text style={[styles.axisLabel, { color: colors.muted, fontSize: typo.micro }]}>{t.today.chart1159pm}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function TodayScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo } = theme;
  const t = useT();
  const language = useLanguage();
  const { labelFont, proseLayout, labelDecoration, mirrorRow } = theme;
  const counts = useMisbahaStore((state) => state.counts);
  const dailyCounts = useMisbahaStore((state) => state.dailyCounts);
  const events = useMisbahaStore((state) => state.events);
  const goals = useMisbahaStore((state) => state.goals);
  const goalProgress = useMisbahaStore((state) => state.goalProgress);
  const today = todayKey();
  const displayDate = formatDashboardDate(new Date(), language);
  const todayCounts = dailyCounts[today] ?? {};
  const totalToday = sumRecordValues(todayCounts);
  const lifetimeTotal = sumRecordValues(counts);
  const dailyDua = duas.find((dua) => dua.id === 'fajr-subhanallah') ?? duas[0];
  const dailyPercent = Math.round((Math.min(dailyDua.target, todayCounts[dailyDua.id] ?? 0) / dailyDua.target) * 100);
  const hourlyTaps = events
    .filter((event) => event.date === today)
    .reduce(
      (hours, event) => {
        const hour = new Date(event.createdAt).getHours();
        hours[hour] += event.amount;
        return hours;
      },
      Array.from({ length: 24 }, () => 0),
    );

  const summaries: GoalSummary[] = [
    {
      id: 'daily-goal',
      title: t.today.dailyTasbeeh,
      kind: t.today.dailyGoal,
      summary: `${duaPreview(dailyDua, language)} • ${formatNumber(todayCounts[dailyDua.id] ?? 0)}/${formatNumber(dailyDua.target)} ${t.common.today.toLowerCase()}`,
      percent: dailyPercent,
      onPress: () => router.push({ pathname: '/goals/[goalId]', params: { goalId: 'daily-goal' } }),
    },
    ...goals.slice(0, 3).map((goal) => {
      const firstDay = goal.days[0];
      const firstDua = duasById[firstDay.duaId];
      const percent = goalPercent(goal, goalProgress[goal.id] ?? {});
      const kind =
        goal.duration === 7
          ? t.today.weeklyGoal
          : goal.duration === 30
            ? t.today.monthlyGoal
            : goal.preset
              ? t.today.presetGoal
              : t.today.customGoal;

      return {
        id: goal.id,
        title: goalTitle(goal, language),
        kind,
        summary: `${formatNumber(goal.duration)} ${t.common.days} • ${firstDua ? duaPreview(firstDua, language) : ''} • ${formatNumber(percent)}% ${t.common.complete}`,
        percent,
        onPress: () => router.push({ pathname: '/goals/[goalId]', params: { goalId: goal.id } }),
      };
    }),
  ].slice(0, 4);

  return (
    <Screen
      title={t.today.title}
      subtitle={displayDate}
      showSettingsAction
    >
      <View style={[styles.hero, { backgroundColor: colors.oliveDeep }]}>
        <View style={[styles.heroStats, mirrorRow]}>
          <View style={styles.heroStatCol}>
            <Text style={[styles.heroLabel, proseLayout, labelDecoration, { color: colors.sand, fontSize: typo.caption }]}>
              {t.today.todayTaps}
            </Text>
            <Text
              style={[
                styles.heroValue,
                proseLayout,
                { color: colors.card, fontFamily: labelFont, fontSize: typo.title - 4 },
              ]}
            >
              {formatNumber(totalToday)}
            </Text>
          </View>
          <View style={styles.heroStatCol}>
            <Text style={[styles.heroLabel, proseLayout, labelDecoration, { color: colors.sand, fontSize: typo.caption }]}>
              {t.today.lifetime}
            </Text>
            <Text
              style={[
                styles.heroValue,
                proseLayout,
                { color: colors.card, fontFamily: labelFont, fontSize: typo.title - 4 },
              ]}
            >
              {formatNumber(lifetimeTotal)}
            </Text>
          </View>
        </View>
      </View>

      <DayTimelineCard />

      <SectionTitle>{t.today.goalFocus}</SectionTitle>
      <GoalGrid>
        {summaries.map((item) => (
          <GoalGridItem key={item.id}>
            <GoalSummaryCard item={item} />
          </GoalGridItem>
        ))}
      </GoalGrid>

      <SectionTitle>{t.today.dailyActivity}</SectionTitle>
      <HourlyTapsVisual values={hourlyTaps} />

      <SectionTitle>{t.badges.title}</SectionTitle>
      <BadgeSummaryCard />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.lg,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStatCol: {
    alignSelf: 'stretch',
    flex: 1,
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroValue: {
    fontSize: 28,
    marginTop: spacing.xs,
  },
  goalTilePressable: {
    flex: 1,
    width: '100%',
  },
  goalCard: {
    flex: 1,
    gap: spacing.sm,
    minHeight: 176,
  },
  goalCardUrdu: {
    minHeight: 188,
  },
  goalKind: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  goalTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  goalTitleUrdu: {
    marginTop: spacing.xs,
  },
  goalSummary: {
    fontSize: 11,
    lineHeight: 15,
  },
  goalSummaryUrdu: {
    marginTop: spacing.xs,
  },
  percentBadge: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  percentValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  visualCard: {
    gap: spacing.lg,
  },
  visualTitle: {
    fontSize: 22,
  },
  visualCopy: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  hourlyChartWrap: {
    gap: spacing.xs,
  },
  hourlyAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: {
    fontSize: 10,
  },
});

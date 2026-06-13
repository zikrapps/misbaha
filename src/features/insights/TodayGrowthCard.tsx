import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { Card } from '@/src/components/Card';
import { dailyGoalProgress } from '@/src/features/insights/dailyDhikrGoal';
import { GROWTH_SPROUT_ASSET } from '@/src/features/insights/visualizationAssets';
import { formatNumber } from '@/src/i18n/format';
import { proseFontStyle } from '@/src/i18n/textLayout';
import { useLanguage, useT } from '@/src/i18n/strings';
import { spacing, useTheme } from '@/src/theme/theme';
import { VisualizationMode } from '@/src/types/misbaha';

type TodayGrowthCardProps = {
  todayTotal: number;
  mode: VisualizationMode;
};

function growthOverline(mode: VisualizationMode, t: ReturnType<typeof useT>) {
  switch (mode) {
    case 'earth':
      return t.journey.yourEarth;
    case 'space':
      return t.journey.yourCosmos;
    default:
      return t.garden.yourGarden;
  }
}

function GoalProgressRing({ percent }: { percent: number }) {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const size = 72;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const percentSize = 13;

  return (
    <View style={[styles.ringWrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.line}
          strokeWidth={stroke}
          fill="none"
        />
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.oliveDeep}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.ringCopy}>
        <Text
          style={[
            styles.ringPercent,
            theme.proseCenterLayout,
            {
              color: colors.oliveDeep,
              fontFamily: theme.labelFont,
              fontSize: percentSize,
              lineHeight: theme.labelLineHeight(percentSize, 1.15),
            },
          ]}
        >
          {formatNumber(percent)}%
        </Text>
        <Text
          style={[
            styles.ringLabel,
            theme.proseCenterLayout,
            theme.labelDecoration,
            {
              color: colors.oliveDeep,
              fontFamily: theme.labelFont,
              lineHeight: theme.labelLineHeight(8, 1.25),
            },
          ]}
        >
          {t.garden.ofGoal}
        </Text>
      </View>
    </View>
  );
}

export function TodayGrowthCard({ todayTotal, mode }: TodayGrowthCardProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo } = theme;
  const language = useLanguage();
  const t = useT();
  const percent = dailyGoalProgress(todayTotal);

  return (
    <Card style={[styles.card, theme.mirrorRow]}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={GROWTH_SPROUT_ASSET}
        style={styles.sprout}
      />
      <View style={styles.copy}>
        <Text
          style={[
            styles.overline,
            theme.proseLayout,
            theme.labelDecoration,
            { color: colors.oliveDark, fontFamily: theme.labelFont },
          ]}
        >
          {growthOverline(mode, t)}
        </Text>
        <Text
          style={[
            styles.title,
            theme.proseLayout,
            { color: colors.oliveDeep, fontFamily: theme.labelFont, lineHeight: theme.labelLineHeight(16, 1.3) },
          ]}
        >
          {t.garden.todaysGrowth}
        </Text>
        <View style={[styles.countRow, theme.mirrorRow]}>
          <Text
            style={[
              styles.count,
              theme.proseInlineLayout,
              {
                color: colors.oliveDeep,
                fontFamily: theme.labelFont,
                fontSize: typo.title - 4,
                lineHeight: theme.labelLineHeight(typo.title - 4, 1.2),
              },
            ]}
          >
            {formatNumber(todayTotal)}
          </Text>
          <Text
            style={[
              styles.dhikrWord,
              theme.proseInlineLayout,
              {
                color: colors.oliveDark,
                fontFamily: theme.labelFont,
                fontStyle: proseFontStyle(language),
              },
            ]}
          >
            {t.garden.dhikrWord}
          </Text>
        </View>
      </View>
      <GoalProgressRing percent={percent} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sprout: {
    height: 76,
    width: 76,
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  overline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
  },
  countRow: {
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  count: {
    fontWeight: '700',
    lineHeight: 34,
  },
  dhikrWord: {
    fontSize: 14,
    lineHeight: 20,
  },
  ringWrap: {
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
    overflow: 'visible',
  },
  ringCopy: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  ringPercent: {
    fontWeight: '700',
  },
  ringLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
    textTransform: 'uppercase',
  },
});

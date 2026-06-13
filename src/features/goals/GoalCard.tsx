import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { getGoalTodayState } from '@/src/features/goals/goalProgress';
import { duaArabic, duaPreview } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { goalTitle } from '@/src/i18n/goalText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { GoalPlan } from '@/src/types/misbaha';

type GoalCardProps = {
  goal: GoalPlan;
  progress: Record<number, number>;
  onPress: () => void;
  variant?: 'full' | 'tile';
};

export function GoalCard({ goal, progress, onPress, variant = 'full' }: GoalCardProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo } = theme;
  const language = useLanguage();
  const t = useT();
  const { labelFont, arabicFont, proseLayout, arabicLayout, labelDecoration, labelLineHeight, mirrorRow } = theme;
  const isUrdu = language === 'ur';
  const isTile = variant === 'tile';
  const { completed, today, todayDua } = getGoalTodayState(goal, progress);
  if (!today) return null;

  return (
    <Pressable onPress={onPress} style={isTile ? styles.tilePressable : undefined}>
      <Card style={isTile ? [styles.cardTile, isUrdu && styles.cardTileUrdu] : styles.card}>
        <View style={[styles.header, isTile && styles.headerTile, mirrorRow]}>
          <View style={styles.headerCopy}>
            <Text
              style={[
                styles.title,
                isTile && styles.titleTile,
                proseLayout,
                { color: colors.ink, fontFamily: labelFont, lineHeight: labelLineHeight(isTile ? 15 : typo.subtitle, 1.25) },
                !isTile && { fontSize: typo.subtitle },
              ]}
              numberOfLines={2}
            >
              {goalTitle(goal, language)}
            </Text>
            <Text style={[styles.meta, proseLayout, { color: colors.muted, fontSize: typo.caption }]} numberOfLines={1}>
              {t.goals.dayProgress(Math.min(completed + 1, goal.duration), goal.duration, completed)}
            </Text>
          </View>
          <Icon name="leaf" color={colors.oliveDark} size={isTile ? 18 : 24} />
        </View>

        <View style={[styles.today, isTile && styles.todayTile, { backgroundColor: colors.cream }]}>
          <Text style={[styles.todayLabel, proseLayout, labelDecoration, { color: colors.muted, fontSize: typo.micro }]}>
            {t.goals.todayLabel}
          </Text>
          <Text
            style={[
              styles.duaName,
              proseLayout,
              isTile && styles.duaNameTile,
              {
                color: colors.muted,
                fontFamily: labelFont,
                fontSize: typo.caption,
                fontStyle: theme.proseFontStyle,
                lineHeight: labelLineHeight(typo.caption, 1.2),
              },
            ]}
            numberOfLines={isTile ? 2 : undefined}
          >
            {todayDua ? duaPreview(todayDua, language) : ''}
          </Text>
          {!isTile ? (
            <Text style={[styles.arabic, arabicLayout, { color: colors.ink, fontFamily: arabicFont }]}>
              {todayDua ? duaArabic(todayDua, language) : ''}
            </Text>
          ) : null}
          <Text style={[styles.count, proseLayout, { color: colors.oliveDark }]}>
            {formatNumber(progress[today.day] ?? 0)}/{formatNumber(today.target)}
          </Text>
        </View>

        <View style={styles.progressRow}>
          {goal.days.map((day) => (
            <View
              key={day.day}
              style={[
                styles.segment,
                isTile && styles.segmentTile,
                { backgroundColor: colors.line },
                (progress[day.day] ?? 0) >= day.target && { backgroundColor: colors.olive },
              ]}
            />
          ))}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tilePressable: {
    flex: 1,
    width: '100%',
  },
  card: {
    gap: spacing.md,
  },
  cardTile: {
    flex: 1,
    gap: spacing.sm,
    minHeight: 196,
  },
  cardTileUrdu: {
    minHeight: 208,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTile: {
    gap: spacing.xs,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.xs,
  },
  title: {
    fontSize: 20,
  },
  titleTile: {
    fontSize: 15,
  },
  meta: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
  today: {
    borderRadius: radii.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  todayTile: {
    flex: 1,
    padding: spacing.sm,
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  duaName: {
    fontSize: 12,
  },
  duaNameTile: {
    fontSize: 11,
  },
  arabic: {
    fontSize: 22,
    textAlign: 'right',
  },
  count: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 2,
  },
  segment: {
    borderRadius: radii.pill,
    flex: 1,
    height: 5,
  },
  segmentTile: {
    height: 4,
  },
});

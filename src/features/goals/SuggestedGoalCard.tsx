import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { goalDescription, goalDurationLabel, goalTitle } from '@/src/i18n/goalText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { proseLayout } from '@/src/i18n/textLayout';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { GoalPlan } from '@/src/types/misbaha';

type SuggestedGoalCardProps = {
  goal: GoalPlan;
  onStart: () => void;
};

export function SuggestedGoalCard({ goal, onStart }: SuggestedGoalCardProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo } = theme;
  const language = useLanguage();
  const t = useT();
  const { labelFont } = theme;

  return (
    <Card style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={[styles.durationBadge, { backgroundColor: colors.cream }]}>
          <Text style={[styles.durationText, { color: colors.oliveDark }]}>{goalDurationLabel(goal.duration, language)}</Text>
        </View>
        <Icon name="sprout" color={colors.oliveDark} size={18} />
      </View>
      <Text
        style={[styles.title, proseLayout(language), { color: colors.ink, fontFamily: labelFont, fontSize: typo.body }]}
        numberOfLines={2}
      >
        {goalTitle(goal, language)}
      </Text>
      <Text
        style={[
          styles.description,
          proseLayout(language),
          { color: colors.muted, fontFamily: labelFont, fontSize: typo.caption, lineHeight: Math.round(typo.caption * 1.45) },
        ]}
        numberOfLines={3}
      >
        {goalDescription(goal, language)}
      </Text>
      <Pressable onPress={onStart} style={[styles.start, { backgroundColor: colors.olive }]}>
        <Icon name="plus" color={colors.card} size={14} />
        <Text style={[styles.startText, { color: colors.card, fontSize: typo.caption }]}>{t.common.start}</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing.sm,
    minHeight: 156,
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    lineHeight: 19,
  },
  description: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  start: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  startText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

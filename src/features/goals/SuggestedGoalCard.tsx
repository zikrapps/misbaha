import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon, IconName } from '@/src/components/Icon';
import { GoalLibraryIcon, isGoalLibraryIcon } from '@/src/features/goals/goalLibraryIcons';
import { goalDescription, goalDurationLabel, goalTitle } from '@/src/i18n/goalText';
import { useLanguage, useT } from '@/src/i18n/strings';
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
  const { labelFont, proseLayout, proseInlineLayout, labelDecoration, labelLineHeight, mirrorRow, alignStart } =
    theme;
  const isUrdu = language === 'ur';

  return (
    <Card style={[styles.card, isUrdu && styles.cardUrdu]}>
      <View style={[styles.badgeRow, mirrorRow]}>
        <View style={[styles.durationBadge, alignStart, { backgroundColor: colors.cream }]}>
          <Text
            style={[styles.durationText, proseInlineLayout, labelDecoration, { color: colors.oliveDark }]}
          >
            {goalDurationLabel(goal.duration, language)}
          </Text>
        </View>
        <GoalCardCornerIcon icon={goal.icon} color={colors.oliveDark} />
      </View>
      <Text
        style={[
          styles.title,
          proseLayout,
          { color: colors.ink, fontFamily: labelFont, fontSize: typo.body, lineHeight: labelLineHeight(typo.body, 1.25) },
        ]}
        numberOfLines={2}
      >
        {goalTitle(goal, language)}
      </Text>
      <Text
        style={[
          styles.description,
          proseLayout,
          { color: colors.muted, fontFamily: labelFont, fontSize: typo.caption, lineHeight: labelLineHeight(typo.caption, 1.45) },
        ]}
        numberOfLines={isUrdu ? 2 : 3}
      >
        {goalDescription(goal, language)}
      </Text>
      <Pressable onPress={onStart} style={[styles.start, mirrorRow, alignStart, { backgroundColor: colors.olive }]}>
        <Icon name="plus" color={colors.card} size={14} />
        <Text style={[styles.startText, proseInlineLayout, { color: colors.card, fontSize: typo.caption }]}>
          {t.common.start}
        </Text>
      </Pressable>
    </Card>
  );
}

function goalIconName(icon: string | undefined): IconName {
  const names: IconName[] = [
    'back', 'beads', 'check', 'chevronDown', 'export', 'gear', 'globe', 'goal', 'haptic', 'leaf', 'link',
    'moonStars', 'open', 'plus', 'prayerMat', 'quran', 'reset', 'shuffle', 'sound', 'sprout', 'sunrise',
    'visualize',
  ];
  if (icon && names.includes(icon as IconName)) return icon as IconName;
  return 'sprout';
}

function GoalCardCornerIcon({ icon, color }: { icon: string | undefined; color: string }) {
  if (icon && isGoalLibraryIcon(icon)) {
    return <GoalLibraryIcon name={icon} color={color} size={18} />;
  }
  return <Icon name={goalIconName(icon)} color={color} size={18} />;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing.sm,
    minHeight: 156,
  },
  cardUrdu: {
    minHeight: 168,
  },
  badgeRow: {
    alignItems: 'center',
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
    borderRadius: radii.pill,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  startText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

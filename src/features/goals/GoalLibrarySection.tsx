import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { goalLibraryCategories } from '@/src/data/goalLibrary';
import { GoalGrid, GoalGridItem } from '@/src/features/goals/GoalGrid';
import { SuggestedGoalCard } from '@/src/features/goals/SuggestedGoalCard';
import { SectionTitle } from '@/src/components/Screen';
import { useT } from '@/src/i18n/strings';
import { GoalLibraryCategoryId } from '@/src/types/misbaha';
import { spacing, useTheme } from '@/src/theme/theme';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

const categoryTitleKey: Record<
  GoalLibraryCategoryId,
  'oneDay' | 'weekly' | 'thirtyDay' | 'ayyamBeed' | 'newMoon'
> = {
  oneDay: 'oneDay',
  weekly: 'weekly',
  thirtyDay: 'thirtyDay',
  ayyamBeed: 'ayyamBeed',
  newMoon: 'newMoon',
};

export function GoalLibrarySection() {
  const theme = useTheme();
  const t = useT();
  const startGoal = useMisbahaStore((state) => state.startGoal);
  const { labelFont, proseLayout } = theme;

  return (
    <View style={styles.root}>
      <SectionTitle>{t.goals.goalLibrary.title}</SectionTitle>
      <Text style={[styles.hint, proseLayout, { color: theme.colors.muted, fontFamily: labelFont }]}>
        {t.goals.goalLibrary.hint}
      </Text>
      {goalLibraryCategories.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={[styles.sectionTitle, proseLayout, { color: theme.colors.ink, fontFamily: labelFont }]}>
            {t.goals.goalLibrary[categoryTitleKey[section.id]]}
          </Text>
          <GoalGrid>
            {section.goals.map((goal) => (
              <GoalGridItem key={goal.id}>
                <SuggestedGoalCard
                  goal={goal}
                  onStart={() => {
                    const id = startGoal(goal);
                    router.push(`/goals/${id}`);
                  }}
                />
              </GoalGridItem>
            ))}
          </GoalGrid>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: spacing.xs,
    marginTop: -spacing.xs,
  },
  section: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
});

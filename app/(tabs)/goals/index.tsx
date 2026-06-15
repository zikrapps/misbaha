import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/src/components/Icon';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { buildRandomSurpriseGoal } from '@/src/data/presetGoals';
import { DuaSearchBar } from '@/src/features/duas/DuaSearchBar';
import { GoalCard } from '@/src/features/goals/GoalCard';
import { GoalGrid, GoalGridItem } from '@/src/features/goals/GoalGrid';
import { GoalLibrarySection } from '@/src/features/goals/GoalLibrarySection';
import { PlanNewGoalRow } from '@/src/features/goals/PlanNewGoalRow';
import { SuggestedGoalCard } from '@/src/features/goals/SuggestedGoalCard';
import { isActiveGoal, pickSuggestedGoals } from '@/src/features/goals/suggestedGoals';
import { useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, spacing, useTheme } from '@/src/theme/theme';

export default function GoalsScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const goals = useMisbahaStore((state) => state.goals);
  const goalProgress = useMisbahaStore((state) => state.goalProgress);
  const startGoal = useMisbahaStore((state) => state.startGoal);

  const suggested = useMemo(() => pickSuggestedGoals(goals, 4), [goals]);
  const activeGoals = useMemo(
    () => goals.filter((goal) => isActiveGoal(goal, goalProgress[goal.id] ?? {})),
    [goals, goalProgress],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        suggestedHint: {
          fontSize: 12,
          marginBottom: spacing.sm,
          marginTop: -spacing.xs,
          ...theme.proseLayout,
        },
        empty: {
          fontSize: 13,
          fontStyle: theme.proseFontStyle,
          marginBottom: spacing.md,
          ...theme.proseLayout,
        },
        surpriseGoal: {
          backgroundColor: colors.oliveDeep,
          borderRadius: radii.lg,
          padding: spacing.xl,
        },
        surpriseGoalContent: {
          alignItems: 'center',
          gap: spacing.md,
          ...theme.mirrorRow,
        },
        surpriseGoalCopy: {
          flex: 1,
          gap: spacing.xs,
        },
        surpriseGoalTitle: {
          color: colors.card,
          fontFamily: theme.labelFont,
          fontSize: 22,
          ...theme.proseLayout,
        },
        surpriseGoalHint: {
          color: colors.sand,
          fontFamily: theme.labelFont,
          fontSize: 13,
          ...theme.proseLayout,
        },
      }),
    [colors, theme.labelFont, theme.mirrorRow, theme.proseLayout, theme.proseFontStyle],
  );

  const handleSurpriseGoal = useCallback(() => {
    const id = startGoal(buildRandomSurpriseGoal());
    router.push(`/goals/${id}`);
  }, [startGoal]);

  return (
    <Screen
      title={t.goals.title}
      subtitle={t.goals.subtitle}
      showSettingsAction
    >
      <DuaSearchBar onSelect={(dua) => router.push(`/duas/${dua.id}`)} />

      <SectionTitle>{t.goals.yourPlans}</SectionTitle>
      {activeGoals.length > 0 ? (
        <GoalGrid>
          {activeGoals.map((goal) => (
            <GoalGridItem key={goal.id}>
              <GoalCard
                goal={goal}
                progress={goalProgress[goal.id] ?? {}}
                variant="tile"
                onPress={() => router.push(`/goals/${goal.id}`)}
              />
            </GoalGridItem>
          ))}
        </GoalGrid>
      ) : (
        <Text style={[styles.empty, { color: colors.muted }]}>{t.goals.empty}</Text>
      )}

      <Pressable
        accessibilityLabel={t.goals.surpriseNewGoal}
        accessibilityRole="button"
        style={styles.surpriseGoal}
        testID="surprise-goal-button"
        onPress={handleSurpriseGoal}
      >
        <View style={styles.surpriseGoalContent}>
          <Icon name="shuffle" color={colors.card} size={26} strokeWidth={2.2} />
          <View style={styles.surpriseGoalCopy}>
            <Text style={styles.surpriseGoalTitle}>{t.goals.surpriseNewGoal}</Text>
            <Text style={styles.surpriseGoalHint}>{t.goals.surpriseNewGoalHint}</Text>
          </View>
        </View>
      </Pressable>

      <PlanNewGoalRow onPress={() => router.push('/goals/create')} />

      {suggested.length > 0 ? (
        <>
          <SectionTitle>{t.goals.suggested}</SectionTitle>
          <Text style={[styles.suggestedHint, { color: colors.muted }]}>{t.goals.suggestedHint}</Text>
          <GoalGrid>
            {suggested.map((goal) => (
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
        </>
      ) : null}

      <GoalLibrarySection />
    </Screen>
  );
}

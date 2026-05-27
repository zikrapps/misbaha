import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/src/components/Icon';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { buildRandomSurpriseGoal } from '@/src/data/presetGoals';
import { GoalCard } from '@/src/features/goals/GoalCard';
import { GoalGrid, GoalGridItem } from '@/src/features/goals/GoalGrid';
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
        },
        empty: {
          fontSize: 13,
          fontStyle: 'italic',
          marginBottom: spacing.md,
        },
        surpriseGoal: {
          backgroundColor: colors.oliveDeep,
          borderRadius: radii.lg,
          padding: spacing.xl,
        },
        surpriseGoalContent: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: spacing.md,
        },
        surpriseGoalCopy: {
          flex: 1,
          gap: spacing.xs,
        },
        surpriseGoalTitle: {
          color: colors.card,
          fontFamily: theme.fonts.display,
          fontSize: 22,
        },
        surpriseGoalHint: {
          color: colors.sand,
          fontFamily: theme.labelFont,
          fontSize: 13,
        },
        newGoal: {
          alignItems: 'center',
          backgroundColor: colors.olive,
          borderRadius: radii.md,
          padding: spacing.lg,
        },
        newGoalContent: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        newGoalText: {
          color: colors.card,
          fontSize: 16,
        },
      }),
    [colors, theme.fonts.display, theme.labelFont],
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

      <Pressable style={styles.surpriseGoal} onPress={handleSurpriseGoal}>
        <View style={styles.surpriseGoalContent}>
          <Icon name="shuffle" color={colors.card} size={26} strokeWidth={2.2} />
          <View style={styles.surpriseGoalCopy}>
            <Text style={styles.surpriseGoalTitle}>{t.goals.surpriseNewGoal}</Text>
            <Text style={styles.surpriseGoalHint}>{t.goals.surpriseNewGoalHint}</Text>
          </View>
        </View>
      </Pressable>

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

      <Pressable style={styles.newGoal} onPress={() => router.push('/goals/create')}>
        <View style={styles.newGoalContent}>
          <Icon name="plus" color={colors.card} size={18} />
          <Text style={[styles.newGoalText, { color: colors.card, fontFamily: theme.fonts.display }]}>
            {t.goals.planNew}
          </Text>
        </View>
      </Pressable>
    </Screen>
  );
}

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { duas } from '@/src/data/duas';
import { buildGoalDays, presetGoals, suggestGoal } from '@/src/data/presetGoals';
import { duaPreview } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { goalDescription, goalTitle } from '@/src/i18n/goalText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { GoalDuration, GoalPlan } from '@/src/types/misbaha';

const durations: GoalDuration[] = [7, 10, 30];

export default function CreateGoalScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = useMemo(() => createStyles(colors, theme.fonts.display), [colors, theme.fonts.display]);
  const [duration, setDuration] = useState<GoalDuration>(7);
  const [mode, setMode] = useState<'surprise' | 'custom'>('surprise');
  const [offset, setOffset] = useState(0);
  const startGoal = useMisbahaStore((state) => state.startGoal);
  const language = useLanguage();
  const t = useT();

  const previewDays = useMemo(
    () => (mode === 'surprise' ? suggestGoal(duration).days : buildGoalDays(duration, offset)),
    [duration, mode, offset],
  );
  const matchingPresets = presetGoals.filter((goal) => goal.duration === duration);

  const begin = () => {
    const goal: GoalPlan = {
      id: `custom-${Date.now()}`,
      title: mode === 'surprise' ? t.goalCreate.surpriseTitlePattern(duration) : t.goalCreate.customTitle(duration),
      description:
        mode === 'surprise' ? t.goalCreate.surpriseDescriptionGenerated : t.goalCreate.customDescriptionGenerated,
      duration,
      days: previewDays,
      createdAt: Date.now(),
    };
    const id = startGoal(goal);
    router.replace(`/goals/${id}`);
  };

  return (
    <Screen title={t.goalCreate.title} subtitle={t.goalCreate.subtitle}>
      <Pressable onPress={() => router.back()} style={styles.done}>
        <Text style={styles.doneText}>‹ {t.common.done}</Text>
      </Pressable>

      <SectionTitle>{t.goalCreate.durationQuestion}</SectionTitle>
      <View style={styles.durationRow}>
        {durations.map((value) => (
          <Pressable
            key={value}
            onPress={() => setDuration(value)}
            style={[styles.duration, duration === value && styles.durationActive]}
          >
            <Text style={[styles.durationNumber, duration === value && styles.activeText]}>{formatNumber(value)}</Text>
            <Text style={[styles.durationLabel, duration === value && styles.activeText]}>{t.common.days}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle>{t.goalCreate.planQuestion}</SectionTitle>
      <View style={styles.modeRow}>
        <Pressable onPress={() => setMode('surprise')} style={[styles.mode, mode === 'surprise' && styles.modeActive]}>
          <View style={styles.modeTitleRow}>
            <Icon name="sprout" color={colors.oliveDark} size={19} />
            <Text style={styles.modeTitle}>{t.goalCreate.surpriseTitle}</Text>
          </View>
          <Text style={styles.modeCopy}>{t.goalCreate.surpriseDescription}</Text>
        </Pressable>
        <Pressable onPress={() => setMode('custom')} style={[styles.mode, mode === 'custom' && styles.modeActive]}>
          <View style={styles.modeTitleRow}>
            <Icon name="goal" color={colors.oliveDark} size={19} />
            <Text style={styles.modeTitle}>{t.goalCreate.customTitleLabel}</Text>
          </View>
          <Text style={styles.modeCopy}>{t.goalCreate.customDescription}</Text>
        </Pressable>
      </View>

      {mode === 'custom' ? (
        <Pressable style={styles.shuffle} onPress={() => setOffset((value) => value + 1)}>
          <Icon name="shuffle" color={colors.oliveDark} size={17} />
          <Text style={styles.shuffleText}>{t.goalCreate.shuffle}</Text>
        </Pressable>
      ) : null}

      <SectionTitle>{t.goalCreate.plansFor(duration)}</SectionTitle>
      {matchingPresets.map((preset) => (
        <Card key={preset.id} style={styles.presetCard}>
          <Text style={styles.planTitle}>{goalTitle(preset, language)}</Text>
          <Text style={styles.planDescription}>{goalDescription(preset, language)}</Text>
          <Pressable
            style={styles.presetStart}
            onPress={() => {
              const id = startGoal(preset);
              router.replace(`/goals/${id}`);
            }}
          >
            <Icon name="goal" color={colors.card} size={16} />
            <Text style={styles.presetStartText}>{t.goalCreate.startPlan}</Text>
          </Pressable>
        </Card>
      ))}

      <Card style={styles.preview}>
        {previewDays.slice(0, 7).map((day) => {
          const dua = duas.find((item) => item.id === day.duaId);
          return (
            <View key={day.day} style={styles.dayPreview}>
              <Text style={styles.dayBadge}>{formatNumber(day.day)}</Text>
              <Text style={styles.dayText}>{dua ? duaPreview(dua, language) : ''}</Text>
              <Text style={styles.dayTarget}>×{formatNumber(day.target)}</Text>
            </View>
          );
        })}
        {previewDays.length > 7 ? <Text style={styles.more}>{t.goalCreate.moreDays(previewDays.length - 7)}</Text> : null}
      </Card>

      <Pressable style={styles.begin} onPress={begin}>
        <Icon name="check" color={colors.card} size={18} />
        <Text style={styles.beginText}>{t.goalCreate.begin}</Text>
      </Pressable>
    </Screen>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors'], displayFont: string) {
  return StyleSheet.create({
    done: {
      alignSelf: 'flex-start',
      backgroundColor: colors.card,
      borderColor: colors.line,
      borderRadius: radii.pill,
      borderWidth: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    doneText: {
      color: colors.muted,
      fontFamily: displayFont,
    },
    durationRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    duration: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.line,
      borderRadius: radii.md,
      borderWidth: 1,
      flex: 1,
      padding: spacing.lg,
    },
    durationActive: {
      backgroundColor: colors.olive,
    },
    durationNumber: {
      color: colors.ink,
      fontFamily: displayFont,
      fontSize: 24,
    },
    durationLabel: {
      color: colors.muted,
      fontSize: 11,
    },
    activeText: {
      color: colors.card,
    },
    modeRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    mode: {
      backgroundColor: colors.card,
      borderColor: colors.line,
      borderRadius: radii.md,
      borderWidth: 1,
      flex: 1,
      padding: spacing.lg,
    },
    modeActive: {
      borderColor: colors.oliveDark,
      borderWidth: 2,
    },
    modeTitle: {
      color: colors.ink,
      fontFamily: displayFont,
      fontSize: 17,
    },
    modeTitleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
    },
    modeCopy: {
      color: colors.muted,
      fontSize: 12,
      marginTop: spacing.sm,
    },
    shuffle: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radii.md,
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'center',
      padding: spacing.md,
    },
    shuffleText: {
      color: colors.oliveDark,
      fontWeight: '800',
    },
    planTitle: {
      color: colors.ink,
      fontFamily: displayFont,
      fontSize: 18,
    },
    planDescription: {
      color: colors.muted,
      fontSize: 12,
      marginTop: spacing.xs,
    },
    presetCard: {
      gap: spacing.sm,
    },
    presetStart: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.oliveDeep,
      borderRadius: radii.pill,
      flexDirection: 'row',
      gap: spacing.xs,
      marginTop: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    presetStartText: {
      color: colors.card,
      fontSize: 12,
      fontWeight: '700',
    },
    preview: {
      gap: spacing.sm,
    },
    dayPreview: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.md,
    },
    dayBadge: {
      backgroundColor: colors.olive,
      borderRadius: radii.pill,
      color: colors.card,
      overflow: 'hidden',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    dayText: {
      color: colors.ink,
      flex: 1,
      fontFamily: displayFont,
    },
    dayTarget: {
      color: colors.muted,
    },
    more: {
      color: colors.muted,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    begin: {
      alignItems: 'center',
      backgroundColor: colors.olive,
      borderRadius: radii.md,
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'center',
      padding: spacing.lg,
    },
    beginText: {
      color: colors.card,
      fontFamily: displayFont,
      fontSize: 17,
    },
  });
}

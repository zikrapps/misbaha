import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { duas } from '@/src/data/duas';
import { presetGoals, suggestGoal } from '@/src/data/presetGoals';
import { DuaSearchBar } from '@/src/features/duas/DuaSearchBar';
import {
  addDuaToSlots,
  buildRandomCustomSlots,
  compactGoalDays,
  duaTarget,
  filledSlotCount,
  removeSlotAt,
  slotsToGoalDays,
  type CustomSlot,
} from '@/src/features/goals/customGoalPlan';
import { duaPlanLabel, duaTranslation } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { goalDescription, goalTitle } from '@/src/i18n/goalText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { mirrorRow, proseInlineLayout, proseLayout } from '@/src/i18n/textLayout';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { DuaRecord, GoalDuration, GoalPlan, Language } from '@/src/types/misbaha';

const durations: GoalDuration[] = [7, 10, 30];

export default function CreateGoalScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const language = useLanguage();
  const t = useT();
  const styles = useMemo(
    () => createStyles(colors, theme.fonts.display, theme.labelFont, language, theme.mirrorRow, theme.proseLayout),
    [colors, language, theme.fonts.display, theme.labelFont, theme.mirrorRow, theme.proseLayout],
  );
  const [duration, setDuration] = useState<GoalDuration>(7);
  const [mode, setMode] = useState<'surprise' | 'custom'>('surprise');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [customSlots, setCustomSlots] = useState<CustomSlot[]>(() => buildRandomCustomSlots(7, 0));
  const [replaceCursor, setReplaceCursor] = useState(0);
  const [goalName, setGoalName] = useState('');
  const startGoal = useMisbahaStore((state) => state.startGoal);

  useEffect(() => {
    if (mode !== 'custom') return;
    setCustomSlots(buildRandomCustomSlots(duration, shuffleSeed));
    setReplaceCursor(0);
  }, [duration, mode, shuffleSeed]);

  const surpriseDays = useMemo(() => suggestGoal(duration).days, [duration]);
  const previewDays = mode === 'surprise' ? surpriseDays : slotsToGoalDays(customSlots);
  const matchingPresets = presetGoals.filter((goal) => goal.duration === duration);
  const canSaveCustom = filledSlotCount(customSlots) > 0;

  const addDuaToPlan = (dua: DuaRecord) => {
    const result = addDuaToSlots(customSlots, dua.id, replaceCursor);
    setCustomSlots(result.slots);
    setReplaceCursor(result.nextCursor);
  };

  const removeDay = (day: number) => {
    setCustomSlots((current) => removeSlotAt(current, day));
  };

  const begin = () => {
    if (mode === 'custom') {
      const days = compactGoalDays(slotsToGoalDays(customSlots));
      if (days.length === 0) return;

      const trimmedName = goalName.trim();
      const goal: GoalPlan = {
        id: `custom-${Date.now()}`,
        title: trimmedName || t.goalCreate.customTitle(duration),
        description: t.goalCreate.customDescriptionGenerated,
        duration: days.length,
        days,
        createdAt: Date.now(),
      };
      const id = startGoal(goal);
      router.replace(`/goals/${id}`);
      return;
    }

    const goal: GoalPlan = {
      id: `custom-${Date.now()}`,
      title: t.goalCreate.surpriseTitlePattern(duration),
      description: t.goalCreate.surpriseDescriptionGenerated,
      duration,
      days: surpriseDays,
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
        <>
          <SectionTitle>{t.goalCreate.goalNameLabel}</SectionTitle>
          <TextInput
            accessibilityLabel={t.goalCreate.goalNameLabel}
            placeholder={t.goalCreate.goalNamePlaceholder}
            placeholderTextColor={colors.muted}
            style={styles.nameInput}
            value={goalName}
            onChangeText={setGoalName}
          />
          <DuaSearchBar addHint={t.duaSearch.addToGoalHint} onSelect={addDuaToPlan} />
          <Pressable style={styles.shuffle} onPress={() => setShuffleSeed((value) => value + 1)}>
            <Icon name="shuffle" color={colors.oliveDark} size={17} />
            <Text style={styles.shuffleText}>{t.goalCreate.shuffle}</Text>
          </Pressable>
        </>
      ) : null}

      {mode === 'surprise' ? (
        <>
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
        </>
      ) : null}

      <Card style={styles.preview}>
        {mode === 'custom'
          ? customSlots.map((duaId, index) => {
              const day = index + 1;
              const dua = duaId ? duas.find((item) => item.id === duaId) : undefined;
              return (
                <View key={day} style={[styles.dayPreview, !duaId && styles.dayPreviewEmpty]}>
                  <Text style={styles.dayBadge}>{formatNumber(day)}</Text>
                  <View style={styles.dayCopy}>
                    <Text style={[styles.dayText, !dua && styles.emptyDayText]}>
                      {dua ? duaPlanLabel(dua, language) : t.goalCreate.emptySlot}
                    </Text>
                    {dua && language === 'ur' ? (
                      <Text style={styles.dayTranslation}>{duaTranslation(dua, language)}</Text>
                    ) : null}
                  </View>
                  {dua ? <Text style={styles.dayTarget}>×{formatNumber(duaTarget(dua.id))}</Text> : null}
                  {dua ? (
                    <Pressable
                      accessibilityLabel={t.goalCreate.removeDay}
                      hitSlop={8}
                      onPress={() => removeDay(day)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            })
          : previewDays.map((day) => {
              const dua = duas.find((item) => item.id === day.duaId);
              return (
                <View key={day.day} style={styles.dayPreview}>
                  <Text style={styles.dayBadge}>{formatNumber(day.day)}</Text>
                  <View style={styles.dayCopy}>
                    <Text style={styles.dayText}>{dua ? duaPlanLabel(dua, language) : ''}</Text>
                    {language === 'ur' ? (
                      <Text style={styles.dayTranslation}>{dua ? duaTranslation(dua, language) : ''}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.dayTarget}>×{formatNumber(day.target)}</Text>
                </View>
              );
            })}
      </Card>

      <Pressable
        disabled={mode === 'custom' && !canSaveCustom}
        style={[styles.begin, mode === 'custom' && !canSaveCustom && styles.beginDisabled]}
        onPress={begin}
      >
        <Icon name="check" color={colors.card} size={18} />
        <Text style={styles.beginText}>{mode === 'custom' ? t.goalCreate.saveGoal : t.goalCreate.begin}</Text>
      </Pressable>
    </Screen>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  displayFont: string,
  labelFont: string,
  language: Language,
  mirrorRowStyle: ReturnType<typeof useTheme>['mirrorRow'],
  proseLayoutStyle: ReturnType<typeof proseLayout>,
) {
  const isUrdu = language === 'ur';
  const inline = proseInlineLayout(language);
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
    nameInput: {
      backgroundColor: colors.card,
      borderColor: colors.line,
      borderRadius: radii.md,
      borderWidth: 1,
      color: colors.ink,
      fontFamily: labelFont,
      fontSize: isUrdu ? 15 : 16,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...proseLayoutStyle,
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
      alignItems: 'flex-start',
      gap: spacing.md,
      ...mirrorRowStyle,
    },
    dayPreviewEmpty: {
      opacity: 0.72,
    },
    dayBadge: {
      backgroundColor: colors.olive,
      borderRadius: radii.pill,
      color: colors.card,
      overflow: 'hidden',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    dayCopy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    dayText: {
      color: colors.ink,
      fontFamily: labelFont,
      fontSize: isUrdu ? 14 : 15,
      fontWeight: isUrdu ? '700' : undefined,
      ...inline,
    },
    emptyDayText: {
      color: colors.muted,
      fontStyle: 'italic',
    },
    dayTranslation: {
      color: colors.muted,
      fontFamily: labelFont,
      fontSize: 12,
      ...inline,
    },
    dayTarget: {
      color: colors.muted,
      flexShrink: 0,
      fontWeight: '800',
      ...inline,
    },
    removeButton: {
      alignItems: 'center',
      backgroundColor: colors.cream,
      borderColor: colors.line,
      borderRadius: radii.pill,
      borderWidth: 1,
      height: 28,
      justifyContent: 'center',
      width: 28,
    },
    removeButtonText: {
      color: colors.muted,
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 20,
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
    beginDisabled: {
      opacity: 0.45,
    },
    beginText: {
      color: colors.card,
      fontFamily: displayFont,
      fontSize: 17,
    },
  });
}

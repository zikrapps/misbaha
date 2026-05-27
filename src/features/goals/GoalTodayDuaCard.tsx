import { useCallback } from 'react';
import { DimensionValue, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { Card } from '@/src/components/Card';
import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';
import { useDuaCountBump } from '@/src/features/duas/useDuaCountBump';
import { useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { formatNumber } from '@/src/i18n/format';
import { proseLayout } from '@/src/i18n/textLayout';
import { useLanguage, useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { spacing } from '@/src/theme/theme';
import { Language } from '@/src/types/misbaha';

export type GoalTodayDuaCardStyles = {
  todayCard: ViewStyle;
  overline: TextStyle;
  arabic: TextStyle;
  translation: TextStyle;
  progressLine: ViewStyle;
  progressNumber: TextStyle;
  target: TextStyle;
  track: ViewStyle;
  progressFill: ViewStyle;
  countHint: TextStyle;
  primary: ViewStyle;
  primaryText: TextStyle;
};

type GoalTodayDuaCardProps = {
  arabic: string;
  translation: string;
  todayProgress: number;
  todayTarget: number;
  tapWeight: number;
  language: Language;
  onCount: () => void;
  openCounterLabel: string;
  styles: GoalTodayDuaCardStyles;
};

export function GoalTodayDuaCard({
  arabic,
  translation,
  todayProgress,
  todayTarget,
  tapWeight,
  language,
  onCount,
  openCounterLabel,
  styles,
}: GoalTodayDuaCardProps) {
  const t = useT();
  const hapticsEnabled = useMisbahaStore((state) => state.hapticsEnabled);
  const onIncrement = useCallback(() => onCount(), [onCount]);
  const { feedback, showFeedback, bumpAt, onFeedbackFinish } = useDuaCountBump({
    hapticsEnabled,
    onIncrement,
  });
  const { gesture } = useDuaCountGestures({ onBump: bumpAt, doubleTapOnly: true });

  return (
    <Card style={styles.todayCard}>
      <View style={localStyles.body} pointerEvents="box-none">
        <GestureDetector gesture={gesture}>
          <View style={localStyles.tapCapture} collapsable={false}>
            <DuaTapFeedback
              feedbackKey={feedback.key}
              visible={showFeedback}
              x={feedback.x}
              y={feedback.y}
              onFinish={onFeedbackFinish}
            />
          </View>
        </GestureDetector>

        <Text style={styles.overline}>{t.goalDetail.todaysTasbeeh}</Text>
        <Text style={styles.arabic}>{arabic}</Text>
        <Text style={[styles.translation, proseLayout(language)]}>{translation}</Text>
        <View style={styles.progressLine}>
          <Text style={styles.progressNumber}>{formatNumber(todayProgress)}</Text>
          <Text style={styles.target}>/ {formatNumber(todayTarget)}</Text>
          <View style={styles.track}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, (todayProgress / todayTarget) * 100)}%` as DimensionValue },
              ]}
            />
          </View>
        </View>
        <Text style={styles.countHint}>{t.duas.doubleTapHint(tapWeight)}</Text>
      </View>

      <Pressable style={styles.primary} onPress={onCount}>
        <Text style={styles.primaryText}>{openCounterLabel}</Text>
      </Pressable>
    </Card>
  );
}

const localStyles = StyleSheet.create({
  body: {
    gap: spacing.md,
    overflow: 'visible',
    position: 'relative',
  },
  tapCapture: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
    zIndex: 1,
  },
});

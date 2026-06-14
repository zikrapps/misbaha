import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { Card } from '@/src/components/Card';
import { remainingCount } from '@/src/features/duas/countRemaining';
import { DuaContentBody, DuaReferenceLinks } from '@/src/features/duas/DuaContentBody';
import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';
import { DuaTargetProgress } from '@/src/features/duas/DuaTargetProgress';
import { useDuaCountBump } from '@/src/features/duas/useDuaCountBump';
import { useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { formatNumber } from '@/src/i18n/format';
import { useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { spacing, useTheme } from '@/src/theme/theme';
import { DuaRecord, Language } from '@/src/types/misbaha';

export type GoalTodayDuaCardStyles = {
  todayCard: ViewStyle;
  overline: TextStyle;
  arabic: TextStyle;
  translation: TextStyle;
  meta?: TextStyle;
  link?: TextStyle;
  linkRow?: ViewStyle;
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
  dua: DuaRecord;
  todayProgress: number;
  todayTarget: number;
  tapWeight: number;
  language: Language;
  /** Pass an amount to add that many counts; omit for one tap-weight increment. */
  onCount: (amount?: number) => void;
  openCounterLabel: string;
  styles: GoalTodayDuaCardStyles;
};

export function GoalTodayDuaCard({
  dua,
  todayProgress,
  todayTarget,
  tapWeight,
  language,
  onCount,
  openCounterLabel,
  styles,
}: GoalTodayDuaCardProps) {
  const t = useT();
  const { colors, labelFont } = useTheme();
  const hapticsEnabled = useMisbahaStore((state) => state.hapticsEnabled);
  const [completeAnimationKey, setCompleteAnimationKey] = useState(0);

  const onIncrement = useCallback(
    (times = 1) => {
      for (let i = 0; i < times; i += 1) {
        onCount();
      }
    },
    [onCount],
  );

  const { feedback, showFeedback, bumpAt, completeAt, onFeedbackFinish } = useDuaCountBump({
    hapticsEnabled,
    onIncrement,
  });

  const onHoldComplete = useCallback(
    (x: number, y: number) => {
      const remaining = remainingCount(todayProgress, todayTarget);
      if (remaining <= 0) return;
      setCompleteAnimationKey((value) => value + 1);
      completeAt(x, y);
      onCount(remaining);
    },
    [completeAt, onCount, todayProgress, todayTarget],
  );

  const { gesture } = useDuaCountGestures({
    onBump: bumpAt,
    doubleTapOnly: true,
    onHoldComplete,
  });

  return (
    <Card style={styles.todayCard}>
      <View style={localStyles.body} pointerEvents="box-none">
        <View pointerEvents="none" style={localStyles.visual}>
          <Text style={styles.overline}>{t.goalDetail.todaysTasbeeh}</Text>
          <DuaContentBody
            dua={dua}
            language={language}
            labelFont={labelFont}
            colors={colors}
            linkMode="auto"
            showReferenceLinks={false}
            textStyles={{
              arabic: styles.arabic,
              translation: styles.translation,
              meta: styles.meta,
              link: styles.link,
              linkRow: styles.linkRow,
            }}
          />
        </View>

        <DuaReferenceLinks
          dua={dua}
          language={language}
          labelFont={labelFont}
          colors={colors}
          linkMode="auto"
          style={localStyles.referenceLinks}
          textStyles={{
            link: styles.link,
            linkRow: styles.linkRow,
          }}
        />

        <View pointerEvents="none" style={localStyles.visual}>
          <View style={styles.progressLine}>
            <Text style={styles.progressNumber}>{formatNumber(todayProgress)}</Text>
            <Text style={styles.target}>/ {formatNumber(todayTarget)}</Text>
            <DuaTargetProgress
              completeAnimationKey={completeAnimationKey}
              fillStyle={styles.progressFill}
              progress={todayProgress}
              target={todayTarget}
              trackStyle={styles.track}
            />
          </View>
          <Text style={styles.countHint}>{t.duas.expandedCountHint(tapWeight)}</Text>
        </View>

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
      </View>

      <Pressable style={styles.primary} onPress={() => onCount()}>
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
  visual: {
    gap: spacing.md,
  },
  tapCapture: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
    zIndex: 2,
  },
  referenceLinks: {
    zIndex: 3,
  },
});

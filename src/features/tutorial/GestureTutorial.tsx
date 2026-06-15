import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/src/components/Icon';
import { TutorialStepAnimation } from '@/src/features/tutorial/TutorialStepAnimation';
import { getTutorialSteps } from '@/src/features/tutorial/tutorialSteps';
import { useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, spacing, useTheme } from '@/src/theme/theme';

export function GestureTutorial() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const { labelFont, proseLayout, proseInlineLayout, proseCenterLayout, labelDecoration, labelLineHeight } = theme;
  const visible = useMisbahaStore((state) => state.tutorialVisible);
  const tutorialSession = useMisbahaStore((state) => state.tutorialSession);
  const closeTutorial = useMisbahaStore((state) => state.closeTutorial);
  const steps = useMemo(() => getTutorialSteps(t), [t]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setStepIndex(0);
    }
  }, [tutorialSession, visible]);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      closeTutorial();
      return;
    }
    setStepIndex((current) => current + 1);
  };

  if (!visible || !step) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={closeTutorial}>
      <View style={[styles.backdrop, { backgroundColor: 'rgba(55, 44, 36, 0.58)' }]}>
        <SafeAreaView style={styles.safe}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <TutorialStepAnimation key={`${tutorialSession}-${step.id}`} stepId={step.id} />

            <Text style={[styles.stepLabel, proseCenterLayout, labelDecoration, { color: colors.muted, fontFamily: labelFont }]}>
              {t.tutorial.stepOf(stepIndex + 1, steps.length)}
            </Text>
            <Text
              style={[
                styles.title,
                proseCenterLayout,
                { color: colors.ink, fontFamily: labelFont, lineHeight: labelLineHeight(28, 1.2) },
              ]}
            >
              {step.title}
            </Text>
            <Text
              style={[
                styles.body,
                proseLayout,
                { color: colors.muted, fontFamily: labelFont, lineHeight: labelLineHeight(15, 1.5) },
              ]}
            >
              {step.body}
            </Text>

            <View style={styles.dots}>
              {steps.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: index === stepIndex ? colors.olive : colors.line,
                      width: index === stepIndex ? 18 : 7,
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={closeTutorial}
                style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
                testID="tutorial-skip"
              >
                <Text style={[styles.skipText, proseInlineLayout, { color: colors.muted, fontFamily: labelFont }]}>
                  {t.tutorial.skip}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={goNext}
                style={({ pressed }) => [
                  styles.nextButton,
                  { backgroundColor: colors.oliveDeep },
                  pressed && styles.pressed,
                ]}
                testID="tutorial-next"
              >
                <Text style={[styles.nextText, proseInlineLayout, { color: colors.card, fontFamily: labelFont }]}>
                  {isLast ? t.tutorial.finish : t.tutorial.next}
                </Text>
                {!isLast ? (
                  <View style={styles.nextChevron}>
                    <Icon name="chevronDown" color={colors.card} size={16} strokeWidth={2.4} />
                  </View>
                ) : null}
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  safe: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  dot: {
    borderRadius: radii.pill,
    height: 7,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    width: '100%',
  },
  skipButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    flexShrink: 0,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  nextChevron: {
    transform: [{ rotate: '-90deg' }],
  },
  nextText: {
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.86,
  },
});

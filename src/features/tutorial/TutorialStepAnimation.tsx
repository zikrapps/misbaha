import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { MODE_ICON_ASSETS } from '@/src/features/insights/visualizationAssets';

import { Icon } from '@/src/components/Icon';
import { radii, spacing, ThemeColors, useTheme } from '@/src/theme/theme';

type TutorialStepAnimationProps = {
  stepId: string;
};

export function TutorialStepAnimation({ stepId }: TutorialStepAnimationProps) {
  const { colors } = useTheme();

  switch (stepId) {
    case 'welcome':
      return <WelcomeAnimation colors={colors} />;
    case 'expand':
      return <ExpandAnimation colors={colors} />;
    case 'doubleTap':
      return <DoubleTapAnimation colors={colors} />;
    case 'duaDetail':
      return <DuaDetailAnimation colors={colors} />;
    case 'goals':
      return <GoalsAnimation colors={colors} />;
    case 'goalDetail':
      return <GoalDetailAnimation colors={colors} />;
    case 'today':
      return <TodayAnimation colors={colors} />;
    case 'visualize':
      return <VisualizeAnimation colors={colors} />;
    case 'settings':
      return <SettingsAnimation colors={colors} />;
    default:
      return null;
  }
}

function useLoop(build: (progress: Animated.Value) => Animated.CompositeAnimation) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const animation = build(progress);
    animation.start();
    return () => animation.stop();
    // build is fixed for the lifetime of each animation component instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return progress;
}

function DemoStage({ children, colors }: { children: ReactNode; colors: ThemeColors }) {
  return (
    <View style={[styles.stage, { backgroundColor: colors.cream, borderColor: colors.line }]}>
      {children}
    </View>
  );
}

function WelcomeAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop((value) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ),
  );

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.08] });
  const beadOpacity = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.35, 1, 0.35] });

  return (
    <DemoStage colors={colors}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon name="sprout" color={colors.oliveDeep} size={40} />
      </Animated.View>
      <View style={styles.beadRow}>
        {[0, 1, 2, 3, 4].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.bead,
              {
                backgroundColor: colors.olive,
                opacity: beadOpacity,
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -2 : 2],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </DemoStage>
  );
}

function ExpandAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.delay(700),
          Animated.timing(value, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
          Animated.delay(400),
        ]),
      ),
  );

  const cardHeight = progress.interpolate({ inputRange: [0, 1], outputRange: [52, 108] });
  const chevronRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const expandedOpacity = progress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 0, 1] });
  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.line, colors.olive],
  });

  return (
    <DemoStage colors={colors}>
      <Animated.View style={[styles.miniCard, { height: cardHeight, borderColor, backgroundColor: colors.card }]}>
        <View style={styles.miniRow}>
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <View style={[styles.miniChevron, { borderColor: colors.line, backgroundColor: colors.cream }]}>
              <Icon name="chevronDown" color={colors.oliveDark} size={16} strokeWidth={2.4} />
            </View>
          </Animated.View>
          <View style={styles.miniCopy}>
            <View style={[styles.line, { backgroundColor: colors.line, width: '72%' }]} />
            <Animated.View style={{ opacity: expandedOpacity, gap: 6 }}>
              <View style={[styles.line, { backgroundColor: colors.line, width: '100%', height: 10 }]} />
              <View style={[styles.line, { backgroundColor: colors.line, width: '88%' }]} />
              <View style={[styles.line, { backgroundColor: colors.line, width: '64%' }]} />
            </Animated.View>
          </View>
          <View style={[styles.miniCounter, { borderColor: colors.olive, backgroundColor: colors.card }]}>
            <Text style={[styles.miniCounterText, { color: colors.oliveDeep }]}>3</Text>
          </View>
        </View>
      </Animated.View>
    </DemoStage>
  );
}

function DoubleTapAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true }),
          Animated.delay(500),
        ]),
      ),
  );

  const firstRipple = {
    opacity: progress.interpolate({ inputRange: [0, 0.08, 0.22, 0.35], outputRange: [0, 0.7, 0.35, 0], extrapolate: 'clamp' }),
    transform: [{ scale: progress.interpolate({ inputRange: [0, 0.08, 0.35], outputRange: [0.3, 1, 1.6], extrapolate: 'clamp' }) }],
  };
  const secondRipple = {
    opacity: progress.interpolate({ inputRange: [0.18, 0.26, 0.4, 0.52], outputRange: [0, 0.7, 0.35, 0], extrapolate: 'clamp' }),
    transform: [{ scale: progress.interpolate({ inputRange: [0.18, 0.26, 0.52], outputRange: [0.3, 1, 1.6], extrapolate: 'clamp' }) }],
  };
  const dropY = progress.interpolate({ inputRange: [0.28, 0.55], outputRange: [-28, 18], extrapolate: 'clamp' });
  const dropOpacity = progress.interpolate({ inputRange: [0.28, 0.4, 0.58, 0.7], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' });

  return (
    <DemoStage colors={colors}>
      <View style={[styles.miniCard, styles.doubleTapCard, { backgroundColor: colors.sand, borderColor: colors.olive }]}>
        <View style={[styles.line, { backgroundColor: colors.line, width: '80%', alignSelf: 'center' }]} />
        <View style={[styles.line, { backgroundColor: colors.line, width: '60%', alignSelf: 'center' }]} />
      </View>
      <View style={styles.tapCenter} pointerEvents="none">
        <Animated.View style={[styles.ripple, { borderColor: colors.olive }, firstRipple]} />
        <Animated.View style={[styles.ripple, { borderColor: colors.olive }, secondRipple]} />
        <Animated.View style={{ opacity: dropOpacity, transform: [{ translateY: dropY }] }}>
          <Svg width={22} height={28} viewBox="0 0 28 34">
            <Path d="M14 1C8 9 4 15 4 21c0 7 4.8 12 10 12s10-5 10-12C24 15 20 9 14 1Z" fill={colors.sand} />
          </Svg>
        </Animated.View>
      </View>
    </DemoStage>
  );
}

function DuaDetailAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(Animated.timing(value, { toValue: 1, duration: 3600, easing: Easing.linear, useNativeDriver: true })),
  );

  const ripple = (start: number, end: number) => ({
    opacity: progress.interpolate({
      inputRange: [start, start + 0.06, end - 0.06, end],
      outputRange: [0, 0.65, 0.3, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [start, start + 0.06, end],
          outputRange: [0.35, 1, 1.45],
          extrapolate: 'clamp',
        }),
      },
    ],
  });
  const holdRing = {
    opacity: progress.interpolate({ inputRange: [0.62, 0.68, 0.88, 0.96], outputRange: [0, 0.55, 0.55, 0], extrapolate: 'clamp' }),
    transform: [{ scale: progress.interpolate({ inputRange: [0.62, 0.96], outputRange: [0.5, 1.35], extrapolate: 'clamp' }) }],
  };
  const labelOpacity = (start: number, end: number) =>
    progress.interpolate({
      inputRange: [start, start + 0.04, end - 0.04, end],
      outputRange: [0, 1, 1, 0],
      extrapolate: 'clamp',
    });

  return (
    <DemoStage colors={colors}>
      <View style={styles.phaseLabels}>
        <Animated.Text style={[styles.phaseLabel, { color: colors.oliveDark, opacity: labelOpacity(0, 0.24) }]}>
          Tap
        </Animated.Text>
        <Animated.Text style={[styles.phaseLabel, { color: colors.oliveDark, opacity: labelOpacity(0.28, 0.58) }]}>
          Double
        </Animated.Text>
        <Animated.Text style={[styles.phaseLabel, { color: colors.oliveDark, opacity: labelOpacity(0.6, 0.98) }]}>
          Hold
        </Animated.Text>
      </View>
      <View style={[styles.miniCard, styles.detailCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <View style={[styles.line, { backgroundColor: colors.line, width: '70%', alignSelf: 'flex-end' }]} />
        <View style={[styles.line, { backgroundColor: colors.line, width: '90%' }]} />
      </View>
      <View style={styles.tapCenter} pointerEvents="none">
        <Animated.View style={[styles.ripple, { borderColor: colors.olive }, ripple(0, 0.2)]} />
        <Animated.View style={[styles.ripple, { borderColor: colors.olive }, ripple(0.3, 0.5)]} />
        <Animated.View style={[styles.ripple, { borderColor: colors.olive }, ripple(0.38, 0.58)]} />
        <Animated.View style={[styles.holdRing, { backgroundColor: colors.olive }, holdRing]} />
      </View>
    </DemoStage>
  );
}

function GoalsAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.delay(600),
          Animated.timing(value, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.delay(300),
        ]),
      ),
  );

  const shuffleRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const tileScale = progress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0.85, 1, 1] });
  const tileOpacity = progress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 1] });

  return (
    <DemoStage colors={colors}>
      <Animated.View style={[styles.surpriseButton, { backgroundColor: colors.oliveDeep, transform: [{ scale: tileScale }] }]}>
        <Animated.View style={{ transform: [{ rotate: shuffleRotate }] }}>
          <Icon name="shuffle" color={colors.card} size={18} />
        </Animated.View>
        <View style={[styles.line, { backgroundColor: colors.card, width: 72, opacity: 0.85 }]} />
      </Animated.View>
      <View style={styles.goalTiles}>
        {[0, 1].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.goalTile,
              {
                backgroundColor: colors.card,
                borderColor: colors.line,
                opacity: tileOpacity,
                transform: [
                  { scale: tileScale },
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8 + index * 4, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[styles.line, { backgroundColor: colors.line, width: '80%' }]} />
            <View style={[styles.line, { backgroundColor: colors.line, width: '55%' }]} />
          </Animated.View>
        ))}
      </View>
    </DemoStage>
  );
}

function GoalDetailAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.delay(400),
        ]),
      ),
  );

  const swipeX = progress.interpolate({ inputRange: [0, 0.15, 0.55, 0.85, 1], outputRange: [0, 0, 56, 56, 0], extrapolate: 'clamp' });
  const swipeOpacity = progress.interpolate({ inputRange: [0, 0.5, 0.55, 0.85, 0.9], outputRange: [1, 1, 0.55, 0.55, 1], extrapolate: 'clamp' });
  const tapRipple = (start: number, end: number) => ({
    opacity: progress.interpolate({
      inputRange: [start, start + 0.07, end - 0.06, end],
      outputRange: [0, 0.65, 0.3, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [start, start + 0.07, end],
          outputRange: [0.35, 1, 1.45],
          extrapolate: 'clamp',
        }),
      },
    ],
  });
  const arrowOpacity = progress.interpolate({ inputRange: [0.52, 0.58, 0.82, 0.88], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' });

  return (
    <DemoStage colors={colors}>
      <Animated.View style={{ opacity: arrowOpacity, position: 'absolute', left: 18, zIndex: 2 }}>
        <Icon name="back" color={colors.olive} size={22} strokeWidth={2.4} />
      </Animated.View>
      <Animated.View
        style={[
          styles.miniCard,
          styles.goalDetailCard,
          {
            backgroundColor: colors.sand,
            borderColor: colors.olive,
            opacity: swipeOpacity,
            transform: [{ translateX: swipeX }],
          },
        ]}
      >
        <Text style={[styles.miniLabel, { color: colors.muted }]}>TODAY</Text>
        <View style={[styles.line, { backgroundColor: colors.line, width: '75%', alignSelf: 'flex-end' }]} />
        <View style={styles.tapCenterSmall} pointerEvents="none">
          <Animated.View style={[styles.rippleSmall, { borderColor: colors.olive }, tapRipple(0.05, 0.3)]} />
          <Animated.View style={[styles.rippleSmall, { borderColor: colors.olive }, tapRipple(0.14, 0.38)]} />
        </View>
      </Animated.View>
    </DemoStage>
  );
}

function TodayAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.delay(500),
        ]),
      ),
  );

  const heights = [0.35, 0.55, 0.75, 0.5, 0.9];
  return (
    <DemoStage colors={colors}>
      <View style={[styles.statRow, { backgroundColor: colors.oliveDeep }]}>
        <View style={[styles.line, { backgroundColor: colors.sand, width: 48, opacity: 0.7 }]} />
        <View style={[styles.line, { backgroundColor: colors.card, width: 32, height: 14 }]} />
      </View>
      <View style={styles.chartRow}>
        {heights.map((target, index) => {
          const barHeight = progress.interpolate({
            inputRange: [0, 0.25 + index * 0.12, 1],
            outputRange: [8, 8, 8 + target * 52],
            extrapolate: 'clamp',
          });
          return <Animated.View key={index} style={[styles.chartBar, { height: barHeight, backgroundColor: colors.olive }]} />;
        })}
      </View>
    </DemoStage>
  );
}

const VISUALIZE_MODES = ['garden', 'earth', 'space'] as const;

function VisualizeAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 3600, easing: Easing.linear, useNativeDriver: true }),
          Animated.delay(400),
        ]),
      ),
  );

  const gardenOpacity = progress.interpolate({
    inputRange: [0, 0.04, 0.28, 0.34],
    outputRange: [1, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const earthOpacity = progress.interpolate({
    inputRange: [0.3, 0.36, 0.62, 0.68],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const spaceOpacity = progress.interpolate({
    inputRange: [0.64, 0.7, 0.96, 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const gardenScale = progress.interpolate({ inputRange: [0, 0.2, 0.34], outputRange: [0.5, 1.05, 1], extrapolate: 'clamp' });
  const earthShift = progress.interpolate({ inputRange: [0.34, 0.62], outputRange: [0, 42], extrapolate: 'clamp' });
  const spaceRise = progress.interpolate({ inputRange: [0.68, 0.96], outputRange: [18, -10], extrapolate: 'clamp' });

  const modeHighlight = (index: number) =>
    progress.interpolate({
      inputRange: [index / 3, (index + 0.08) / 3, (index + 0.92) / 3, (index + 1) / 3],
      outputRange: [0, 1, 1, 0],
      extrapolate: 'clamp',
    });

  return (
    <DemoStage colors={colors}>
      <View style={[styles.modeTrack, { backgroundColor: colors.cream, borderColor: colors.oliveDark }]}>
        {VISUALIZE_MODES.map((mode, index) => (
          <View
            key={mode}
            style={[
              styles.modeSegment,
              index > 0 && [styles.modeSegmentDivider, { borderLeftColor: colors.oliveDark }],
            ]}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: colors.oliveDeep, opacity: modeHighlight(index) },
              ]}
            />
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={MODE_ICON_ASSETS[mode].inactive}
              style={styles.modeIcon}
            />
          </View>
        ))}
      </View>

      <View style={styles.visualScene}>
        <Animated.View style={[styles.visualLayer, { opacity: gardenOpacity, transform: [{ scale: gardenScale }] }]}>
          <Svg width={36} height={48} viewBox="0 0 36 48">
            <Circle cx={18} cy={16} r={14} fill={colors.olive} />
            <Rect x={15} y={26} width={6} height={16} rx={2} fill={colors.oliveDeep} />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.visualLayer, { opacity: earthOpacity, transform: [{ translateX: earthShift }] }]}>
          <Svg width={120} height={36} viewBox="0 0 120 36">
            <Path d="M0 28 L28 18 L56 24 L84 12 L120 20 L120 28 Z" fill={colors.line} opacity={0.55} />
            <Circle cx={18} cy={22} r={5} fill={colors.oliveDeep} />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.visualLayer, { opacity: spaceOpacity, transform: [{ translateY: spaceRise }] }]}>
          <Svg width={90} height={54} viewBox="0 0 90 54">
            <Circle cx={18} cy={14} r={2} fill={colors.sand} />
            <Circle cx={42} cy={8} r={1.5} fill={colors.sand} />
            <Circle cx={68} cy={18} r={2} fill={colors.sand} />
            <Circle cx={45} cy={34} r={10} fill={colors.olive} opacity={0.85} />
            <Path d="M45 18 L52 30 L38 30 Z" fill={colors.oliveDeep} />
          </Svg>
        </Animated.View>
      </View>
    </DemoStage>
  );
}

function SettingsAnimation({ colors }: { colors: ThemeColors }) {
  const progress = useLoop(
    (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.delay(400),
        ]),
      ),
  );

  const gearRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '120deg'] });
  const dialRotate = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['-28deg', '18deg', '42deg'] });
  const countScale = progress.interpolate({ inputRange: [0, 0.35, 0.55, 1], outputRange: [1, 1, 1.18, 1.18] });

  return (
    <DemoStage colors={colors}>
      <Animated.View style={{ transform: [{ rotate: gearRotate }] }}>
        <Icon name="gear" color={colors.oliveDark} size={28} />
      </Animated.View>
      <View style={[styles.dialWrap, { borderColor: colors.line, backgroundColor: colors.card }]}>
        <Animated.View style={[styles.dialNeedle, { backgroundColor: colors.oliveDeep, transform: [{ rotate: dialRotate }] }]} />
        <Animated.Text style={[styles.dialValue, { color: colors.oliveDeep, transform: [{ scale: countScale }] }]}>
          +3
        </Animated.Text>
      </View>
    </DemoStage>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    height: 152,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  beadRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  bead: {
    borderRadius: radii.pill,
    height: 10,
    width: 10,
  },
  miniCard: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    overflow: 'hidden',
    padding: spacing.sm,
    width: '88%',
  },
  doubleTapCard: {
    gap: spacing.sm,
    height: 72,
    justifyContent: 'center',
  },
  detailCard: {
    gap: spacing.sm,
    height: 72,
    justifyContent: 'center',
  },
  goalDetailCard: {
    gap: spacing.xs,
    height: 88,
    justifyContent: 'center',
    width: '78%',
  },
  miniRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  miniChevron: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  miniCopy: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  miniCounter: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  miniCounterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  miniLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  line: {
    borderRadius: radii.pill,
    height: 8,
  },
  tapCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapCenterSmall: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
  },
  ripple: {
    borderRadius: 999,
    borderWidth: 2,
    height: 52,
    position: 'absolute',
    width: 52,
  },
  rippleSmall: {
    borderRadius: 999,
    borderWidth: 2,
    height: 36,
    position: 'absolute',
    width: 36,
  },
  holdRing: {
    borderRadius: 999,
    height: 58,
    opacity: 0.18,
    position: 'absolute',
    width: 58,
  },
  phaseLabels: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.sm,
    zIndex: 3,
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    position: 'absolute',
    textTransform: 'uppercase',
  },
  surpriseButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  goalTiles: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '88%',
  },
  goalTile: {
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.sm,
  },
  statRow: {
    alignItems: 'center',
    borderRadius: radii.sm,
    flexDirection: 'row',
    height: 34,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    width: '88%',
  },
  chartRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
    height: 64,
    width: '78%',
  },
  chartBar: {
    borderRadius: radii.pill,
    flex: 1,
  },
  modeTrack: {
    borderRadius: radii.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    marginBottom: spacing.md,
    overflow: 'hidden',
    width: '88%',
  },
  modeSegment: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  modeSegmentDivider: {
    borderLeftWidth: 1,
  },
  modeIcon: {
    height: 22,
    width: 22,
  },
  visualScene: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    width: '100%',
  },
  visualLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialWrap: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1.5,
    height: 64,
    justifyContent: 'center',
    marginTop: spacing.sm,
    width: 64,
  },
  dialNeedle: {
    borderRadius: 2,
    height: 22,
    position: 'absolute',
    top: 10,
    width: 3,
  },
  dialValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 18,
  },
});

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/src/theme/theme';

const DROP_WIDTH = 34;
const DROP_HEIGHT = 42;
const RIPPLE_WAVES = 4;
const ANIMATION_MS = 980;

type DuaTapFeedbackProps = {
  visible: boolean;
  feedbackKey: number;
  x: number;
  y: number;
  nightMode?: boolean;
  onFinish?: () => void;
};

function RaindropIcon({ color }: { color: string }) {
  return (
    <Svg width={DROP_WIDTH} height={DROP_HEIGHT} viewBox="0 0 28 34">
      <Path
        d="M14 1C8 9 4 15 4 21c0 7 4.8 12 10 12s10-5 10-12C24 15 20 9 14 1Z"
        fill={color}
        opacity={0.92}
      />
    </Svg>
  );
}

export function DuaTapFeedback({ visible, feedbackKey, x, y, nightMode = false, onFinish }: DuaTapFeedbackProps) {
  const { colors } = useTheme();
  const dropColor = nightMode ? 'rgba(210, 205, 198, 0.9)' : colors.sand;
  const rippleStroke = nightMode ? 'rgba(150, 150, 158, 0.55)' : colors.olive;
  const impactFill = nightMode ? 'rgba(120, 120, 128, 0.28)' : colors.olive;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || feedbackKey === 0) {
      return;
    }

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: ANIMATION_MS,
      useNativeDriver: true,
    }).start(() => onFinish?.());
  }, [feedbackKey, onFinish, progress, visible]);

  if (!visible) {
    return null;
  }

  const dropFallStyle = {
    left: x - DROP_WIDTH / 2,
    opacity: progress.interpolate({
      inputRange: [0, 0.08, 0.52, 0.62, 1],
      outputRange: [0, 1, 1, 0.85, 0],
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 0.52],
          outputRange: [-DROP_HEIGHT - 8, y - DROP_HEIGHT * 0.88],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: progress.interpolate({
          inputRange: [0, 0.48, 0.55],
          outputRange: [0.92, 1.05, 0.98],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const impactStyle = {
    left: x - 28,
    top: y - 28,
    opacity: progress.interpolate({
      inputRange: [0.48, 0.58, 0.9, 1],
      outputRange: [0, 0.5, 0.22, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0.48, 0.72],
          outputRange: [0.25, 1.35],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.drop, dropFallStyle]}>
        <RaindropIcon color={dropColor} />
      </Animated.View>

      <Animated.View style={[styles.impact, { backgroundColor: impactFill }, impactStyle]} />

      {Array.from({ length: RIPPLE_WAVES }, (_, index) => {
        const delay = index * 0.07;
        const fadeStart = 0.46 + delay;
        const fadeMid = 0.58 + delay;
        const fadePeak = Math.min(0.99, 0.88 + delay);
        const ringStyle = {
          left: x - 70 - index * 18,
          top: y - 70 - index * 18,
          opacity: progress.interpolate({
            inputRange: [fadeStart, fadeMid, fadePeak, 1],
            outputRange: [0, 0.55 - index * 0.1, 0.18, 0],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [fadeStart, 1],
                outputRange: [0.15 + index * 0.05, 2.4 + index * 0.35],
                extrapolate: 'clamp',
              }),
            },
          ],
        };

        return (
          <Animated.View
            key={`ripple-${index}`}
            style={[
              styles.rippleRing,
              {
                width: 140 + index * 36,
                height: 140 + index * 36,
                borderRadius: 70 + index * 18,
                borderColor: rippleStroke,
                borderWidth: 2 - index * 0.25,
              },
              ringStyle,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  drop: {
    position: 'absolute',
    top: 0,
    zIndex: 3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  impact: {
    borderRadius: 999,
    height: 56,
    position: 'absolute',
    width: 56,
    zIndex: 1,
  },
  rippleRing: {
    position: 'absolute',
    zIndex: 2,
  },
});

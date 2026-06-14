import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { progressPercent } from '@/src/features/duas/countRemaining';

type DuaTargetProgressProps = {
  progress: number;
  target: number;
  /** Increment to replay a fill-to-full animation (e.g. after hold-to-complete). */
  completeAnimationKey?: number;
  trackStyle: StyleProp<ViewStyle>;
  fillStyle: StyleProp<ViewStyle>;
};

export function DuaTargetProgress({
  progress,
  target,
  completeAnimationKey = 0,
  trackStyle,
  fillStyle,
}: DuaTargetProgressProps) {
  const percent = progressPercent(progress, target);
  const animated = useRef(new Animated.Value(percent)).current;
  const lastCompleteKey = useRef(0);

  useEffect(() => {
    Animated.timing(animated, {
      toValue: percent,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [animated, percent]);

  useEffect(() => {
    if (completeAnimationKey === 0 || completeAnimationKey === lastCompleteKey.current) return;
    lastCompleteKey.current = completeAnimationKey;
    animated.stopAnimation((current) => {
      animated.setValue(typeof current === 'number' ? current : percent);
      Animated.timing(animated, {
        toValue: 100,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
  }, [animated, completeAnimationKey, percent]);

  const width = animated.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, trackStyle]}>
      <Animated.View style={[fillStyle, styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

import { PropsWithChildren, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const SWIPE_DISTANCE_PX = 72;
const SWIPE_VELOCITY = 650;

type SwipeBackProps = PropsWithChildren<{
  onBack: () => void;
}>;

export function SwipeBack({ children, onBack }: SwipeBackProps) {
  const goBack = useCallback(() => onBack(), [onBack]);

  const gesture = useMemo(
    () =>
      Gesture.Simultaneous(
        Gesture.Native(),
        Gesture.Pan()
          .activeOffsetX(24)
          .failOffsetY([-12, 12])
          .onEnd((event) => {
            if (event.translationX > SWIPE_DISTANCE_PX || event.velocityX > SWIPE_VELOCITY) {
              runOnJS(goBack)();
            }
          }),
      ),
    [goBack],
  );

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.root}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

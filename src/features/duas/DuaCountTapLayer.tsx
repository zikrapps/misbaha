import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ComposedGesture, GestureDetector } from 'react-native-gesture-handler';

import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';
import { TAB_BAR_HEIGHT } from '@/src/features/duas/useDuaCountGestures';

type DuaCountTapLayerProps = PropsWithChildren<{
  gesture: ComposedGesture;
  enabled: boolean;
  feedbackKey: number;
  showFeedback: boolean;
  x: number;
  y: number;
  nightMode?: boolean;
  onFeedbackFinish?: () => void;
  /** Reserve space above the tab bar (default 76). Set 0 on full-screen stacks without tabs. */
  tabBarInset?: number;
  style?: ViewStyle;
}>;

/**
 * Full-area tap target above the tab menu.
 *
 * - With children: gesture sits under an overlay content layer (detail screen).
 * - Without children: gesture-only underlay; scroll/content siblings render on top with
 *   pointerEvents pass-through (Tasbeeh list).
 */
export function DuaCountTapLayer({
  gesture,
  enabled,
  feedbackKey,
  showFeedback,
  x,
  y,
  nightMode = false,
  onFeedbackFinish,
  tabBarInset = TAB_BAR_HEIGHT,
  style,
  children,
}: DuaCountTapLayerProps) {
  if (!enabled) {
    return children ? <View style={[styles.fill, style]}>{children}</View> : null;
  }

  return (
    <View style={[styles.fill, style]} pointerEvents="box-none">
      <GestureDetector gesture={gesture}>
        <View style={[styles.tapCapture, { bottom: tabBarInset }]} collapsable={false}>
          <DuaTapFeedback
            feedbackKey={feedbackKey}
            visible={showFeedback}
            x={x}
            y={y}
            nightMode={nightMode}
            onFinish={onFeedbackFinish}
          />
        </View>
      </GestureDetector>
      {children ? (
        <View style={[styles.content, styles.contentPointer]}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    overflow: 'visible',
  },
  tapCapture: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
    zIndex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
    zIndex: 2,
  },
  contentPointer: {
    pointerEvents: 'box-none',
  },
});

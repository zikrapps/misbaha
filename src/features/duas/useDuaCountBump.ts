import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';

type UseDuaCountBumpOptions = {
  hapticsEnabled: boolean;
  /** Called once per gesture with how many tap-units to apply (double-tap passes 2). */
  onIncrement: (times?: number) => void;
};

export function useDuaCountBump({ hapticsEnabled, onIncrement }: UseDuaCountBumpOptions) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ key: 0, x: 0, y: 0 });

  const bumpAt = useCallback(
    (x: number, y: number, times = 1) => {
      const count = Math.max(1, times);
      onIncrement(count);
      setFeedback({ key: Date.now(), x, y });
      setShowFeedback(true);
      if (hapticsEnabled) {
        const style =
          count > 1 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light;
        Haptics.impactAsync(style).catch(() => undefined);
      }
    },
    [hapticsEnabled, onIncrement],
  );

  const completeAt = useCallback(
    (x: number, y: number) => {
      setFeedback({ key: Date.now(), x, y });
      setShowFeedback(true);
      if (hapticsEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
    },
    [hapticsEnabled],
  );

  return {
    feedback,
    showFeedback,
    bumpAt,
    completeAt,
    onFeedbackFinish: () => setShowFeedback(false),
  };
}

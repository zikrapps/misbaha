import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';

type UseDuaCountBumpOptions = {
  hapticsEnabled: boolean;
  onIncrement: () => void;
};

export function useDuaCountBump({ hapticsEnabled, onIncrement }: UseDuaCountBumpOptions) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ key: 0, x: 0, y: 0 });

  const bumpAt = useCallback(
    (x: number, y: number, times = 1) => {
      const count = Math.max(1, times);
      for (let i = 0; i < count; i += 1) {
        onIncrement();
      }
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

  return {
    feedback,
    showFeedback,
    bumpAt,
    onFeedbackFinish: () => setShowFeedback(false),
  };
}

import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  const {
    nextGestureKey,
    registerGestureCallbacks,
  } = require('./__tests__/helpers/gestureCallbacks');

  function mockBuildGestureChain(key: string) {
    const handlers: { onEnd?: (e: { x: number; y: number }) => void; onStart?: (e: { x: number; y: number }) => void } =
      {};
    const api = {
      enabled: () => api,
      numberOfTaps: () => api,
      maxDelay: () => api,
      minDuration: () => api,
      runOnJS: () => api,
      onEnd: (fn: (e: { x: number; y: number }) => void) => {
        handlers.onEnd = fn;
        registerGestureCallbacks(key, handlers);
        return api;
      },
      onStart: (fn: (e: { x: number; y: number }) => void) => {
        handlers.onStart = fn;
        registerGestureCallbacks(key, handlers);
        return api;
      },
    };
    return api;
  }

  return {
    GestureHandlerRootView: ({ children, style }: { children: React.ReactNode; style?: object }) =>
      React.createElement(View, { style }, children),
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    ScrollView: ({ children, style, contentContainerStyle }: {
      children: React.ReactNode;
      style?: object;
      contentContainerStyle?: object;
    }) => React.createElement(View, { style: [style, contentContainerStyle] }, children),
    Gesture: {
      Tap: () => mockBuildGestureChain(nextGestureKey('tap')),
      LongPress: () => mockBuildGestureChain(nextGestureKey('long')),
      Native: () => mockBuildGestureChain(nextGestureKey('native')),
      Exclusive: (...gestures: unknown[]) => gestures[gestures.length - 1],
      Simultaneous: (...gestures: unknown[]) => gestures[gestures.length - 1],
    },
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({ seekTo: jest.fn().mockResolvedValue(undefined), play: jest.fn() }),
}));

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(async () => ({ uri: 'file://goal.pdf' })),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(),
}));

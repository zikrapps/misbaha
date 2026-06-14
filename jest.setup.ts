import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
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
    const handlers: {
      onEnd?: (e: { x: number; y: number; translationX?: number; velocityX?: number }) => void;
      onStart?: (e: { x: number; y: number }) => void;
    } = {};
    const api = {
      enabled: () => api,
      numberOfTaps: () => api,
      maxDelay: () => api,
      minDuration: () => api,
      activeOffsetX: () => api,
      failOffsetY: () => api,
      runOnJS: () => api,
      onEnd: (fn: (e: { x: number; y: number; translationX?: number; velocityX?: number }) => void) => {
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
      Pan: () => mockBuildGestureChain(nextGestureKey('pan')),
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
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success' },
}));

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({ seekTo: jest.fn().mockResolvedValue(undefined), play: jest.fn() }),
}));

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(async () => ({ uri: 'file://goal.pdf' })),
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@/src/theme/UrduFontProvider', () => ({
  UrduFontProvider: ({ children }: { children: React.ReactNode }) => children,
  useUrduFontsReady: () => true,
}));

jest.mock('@expo-google-fonts/noto-naskh-arabic', () => ({
  NotoNaskhArabic_400Regular: 'NotoNaskhArabic_400Regular',
  NotoNaskhArabic_700Bold: 'NotoNaskhArabic_700Bold',
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(async () => [{ localUri: 'file://mock.png', uri: 'file://mock.png' }]),
  },
}));

const mockFetch = jest.fn(async () => ({
  arrayBuffer: async () => Uint8Array.from([137, 80, 78, 71]).buffer,
}));
globalThis.fetch = mockFetch as unknown as typeof fetch;
globalThis.btoa = (value: string) => Buffer.from(value, 'binary').toString('base64');

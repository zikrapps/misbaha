import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { TutorialHost } from '@/src/features/tutorial/TutorialHost';
import { useStoreHydrated } from '@/src/store/hydration';

/**
 * RN 0.81+ hides console.warn behind a Fusebox “open debugger” toast when no debugger
 * session is attached. Surface real warnings in LogBox so they can be fixed (Expo Go does this).
 */
if (__DEV__) {
  const fusebox = global as typeof globalThis & {
    __FUSEBOX_HAS_FULL_CONSOLE_SUPPORT__?: boolean;
  };
  fusebox.__FUSEBOX_HAS_FULL_CONSOLE_SUPPORT__ = false;
}

const SPLASH_MIN_MS = 1500;
const SPLASH_MAX_MS = 5000;

SplashScreen.setOptions({ fade: false });
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const hydrated = useStoreHydrated();
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const [splashDismissed, setSplashDismissed] = useState(false);

  const dismissSplash = useCallback(() => {
    if (splashDismissed) return;
    setSplashDismissed(true);
    hideSplash();
  }, [hideSplash, splashDismissed]);

  useEffect(() => {
    const timer = setTimeout(() => setMinSplashElapsed(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(dismissSplash, SPLASH_MAX_MS);
    return () => clearTimeout(timer);
  }, [dismissSplash]);

  useEffect(() => {
    if (hydrated && minSplashElapsed) {
      dismissSplash();
    }
  }, [dismissSplash, hydrated, minSplashElapsed]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        <TutorialHost ready={hydrated && splashDismissed} />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

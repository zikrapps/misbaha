import 'react-native-gesture-handler';

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Alert, I18nManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { BadgeUnlockHost } from '@/src/features/badges/BadgeUnlockHost';
import { TutorialHost } from '@/src/features/tutorial/TutorialHost';
import { isE2eEnabled } from '@/src/e2e/config';
import { syncLayoutDirection, reloadApp } from '@/src/i18n/rtl';
import { useT } from '@/src/i18n/strings';
import { useStoreHydrated } from '@/src/store/hydration';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { UrduFontProvider } from '@/src/theme/UrduFontProvider';

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

// SplashScreen.setOptions is unsupported in Expo Go; only call it in dev/prod builds.
if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
  SplashScreen.setOptions({ fade: true, duration: 250 });
}
SplashScreen.preventAutoHideAsync().catch(() => undefined);
I18nManager.allowRTL(true);

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <UrduFontProvider>
        <RootLayoutInner />
      </UrduFontProvider>
    </ErrorBoundary>
  );
}

function RootLayoutInner() {
  const hydrated = useStoreHydrated();
  const language = useMisbahaStore((state) => state.language);
  const t = useT();
  const rtlPromptShown = useRef(false);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [hydrated]);

  // Clear stale native RTL from older builds, then prompt for one full restart.
  useEffect(() => {
    if (!hydrated || rtlPromptShown.current || isE2eEnabled()) return;
    if (syncLayoutDirection(language)) {
      rtlPromptShown.current = true;
      Alert.alert(t.settings.restartTitle, t.settings.restartBody, [
        { text: t.common.cancel, style: 'cancel' },
        { text: t.settings.restartAction, onPress: reloadApp },
      ]);
    }
  }, [hydrated, language, t]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }} testID={hydrated && isE2eEnabled() ? 'app-ready' : undefined}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <TutorialHost ready={hydrated} />
      {hydrated && !isE2eEnabled() ? <BadgeUnlockHost /> : null}
    </GestureHandlerRootView>
  );
}

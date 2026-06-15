import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { useEffect, useRef } from 'react';

import { isE2eEnabled } from '@/src/e2e/config';
import { E2E_TAB_ROUTES, parseE2eTab } from '@/src/e2e/navigation';

export default function TestGoRoute() {
  const { tab } = useLocalSearchParams<{ tab: string }>();
  const navigationState = useRootNavigationState();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!navigationState?.key || appliedRef.current) return;
    appliedRef.current = true;

    const target = isE2eEnabled() ? parseE2eTab(typeof tab === 'string' ? tab : undefined) : null;
    const href = target ? E2E_TAB_ROUTES[target] : '/';

    // Defer one frame so the root navigator is fully mounted before we
    // navigate — a cold launch straight into this deep link can otherwise
    // fire router.replace before the Root Layout commits.
    const id = requestAnimationFrame(() => router.replace(href));
    return () => cancelAnimationFrame(id);
  }, [navigationState?.key, tab]);

  return null;
}

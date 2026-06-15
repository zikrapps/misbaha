import { router, useRootNavigationState } from 'expo-router';
import { useEffect, useRef } from 'react';

import { applyE2eReset } from '@/src/e2e/actions';
import { isE2eEnabled } from '@/src/e2e/config';

export default function TestResetRoute() {
  const navigationState = useRootNavigationState();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!navigationState?.key || appliedRef.current) return;
    appliedRef.current = true;
    if (isE2eEnabled()) {
      applyE2eReset();
    }
    // Defer one frame so the root navigator is fully mounted before we
    // navigate — a cold launch straight into this deep link can otherwise
    // fire router.replace before the Root Layout commits.
    const id = requestAnimationFrame(() => router.replace('/'));
    return () => cancelAnimationFrame(id);
  }, [navigationState?.key]);

  return null;
}

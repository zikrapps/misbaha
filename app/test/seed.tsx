import { router, useRootNavigationState } from 'expo-router';
import { useEffect, useRef } from 'react';

import { applyE2eSeed } from '@/src/e2e/actions';
import { isE2eEnabled } from '@/src/e2e/config';

export default function TestSeedRoute() {
  const navigationState = useRootNavigationState();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!navigationState?.key || appliedRef.current) return;
    appliedRef.current = true;
    if (isE2eEnabled()) {
      applyE2eSeed();
    }
    router.replace('/');
  }, [navigationState?.key]);

  return null;
}

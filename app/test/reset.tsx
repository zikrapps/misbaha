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
    router.replace('/');
  }, [navigationState?.key]);

  return null;
}

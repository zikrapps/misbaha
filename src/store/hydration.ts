import { useEffect, useState } from 'react';

import { useMisbahaStore } from '@/src/store/useMisbahaStore';

/** True after zustand persist has finished rehydrating from AsyncStorage. */
export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useMisbahaStore.persist.hasHydrated());

  useEffect(() => {
    if (useMisbahaStore.persist.hasHydrated()) {
      setHydrated(true);
      return undefined;
    }

    return useMisbahaStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
}

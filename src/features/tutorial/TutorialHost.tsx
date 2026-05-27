import { useEffect, useRef } from 'react';

import { GestureTutorial } from '@/src/features/tutorial/GestureTutorial';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

type TutorialHostProps = {
  ready: boolean;
};

export function TutorialHost({ ready }: TutorialHostProps) {
  const tutorialCompleted = useMisbahaStore((state) => state.tutorialCompleted);
  const tutorialVisible = useMisbahaStore((state) => state.tutorialVisible);
  const openTutorial = useMisbahaStore((state) => state.openTutorial);
  const autoStarted = useRef(false);

  useEffect(() => {
    if (!ready || autoStarted.current || tutorialCompleted || tutorialVisible) {
      return;
    }
    autoStarted.current = true;
    openTutorial();
  }, [openTutorial, ready, tutorialCompleted, tutorialVisible]);

  return <GestureTutorial />;
}

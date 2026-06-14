import { presetGoals } from '@/src/data/presetGoals';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { ThemeId } from '@/src/types/misbaha';

import { buildE2eTestSeed } from './testSeed';

const e2eDefaults = {
  tapWeight: 1,
  themeId: 'garden' as ThemeId,
  language: 'en' as const,
  visualization: 'garden' as const,
  clickSoundEnabled: true,
  hapticsEnabled: true,
  tutorialCompleted: true,
  tutorialVisible: false,
  tutorialSession: 0,
};

/** Reset persisted app state to a clean E2E baseline (no seed data). */
export function applyE2eReset(): void {
  useMisbahaStore.setState({
    ...e2eDefaults,
    counts: {},
    dailyCounts: {},
    events: [],
    goals: presetGoals,
    goalProgress: {},
  });
}

/** Apply the deterministic DevLoop test seed (2 badges, 1 complete goal, 1 in-progress goal). */
export function applyE2eSeed(): void {
  useMisbahaStore.setState({
    ...e2eDefaults,
    ...buildE2eTestSeed(),
  });
}

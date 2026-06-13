import { useMisbahaStore } from '@/src/store/useMisbahaStore';

export function resetStore() {
  useMisbahaStore.setState({
    counts: {},
    dailyCounts: {},
    events: [],
    goals: useMisbahaStore.getState().goals,
    goalProgress: {},
    tapWeight: 1,
    themeId: 'garden',
    language: 'en',
    visualization: 'garden',
    clickSoundEnabled: true,
    hapticsEnabled: true,
    tutorialCompleted: false,
    tutorialVisible: false,
    tutorialSession: 0,
  });
}

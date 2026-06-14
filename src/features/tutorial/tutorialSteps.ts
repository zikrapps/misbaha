import { IconName } from '@/src/components/Icon';
import { Strings } from '@/src/i18n/strings';

export type TutorialStep = {
  id: string;
  icon: IconName;
  title: string;
  body: string;
};

export function getTutorialSteps(t: Strings): TutorialStep[] {
  const { steps } = t.tutorial;
  return [
    { id: 'welcome', icon: 'sprout', title: steps.welcome.title, body: steps.welcome.body },
    { id: 'categories', icon: 'quran', title: steps.categories.title, body: steps.categories.body },
    { id: 'expand', icon: 'chevronDown', title: steps.expand.title, body: steps.expand.body },
    { id: 'count', icon: 'beads', title: steps.count.title, body: steps.count.body },
    { id: 'search', icon: 'search', title: steps.search.title, body: steps.search.body },
    { id: 'duaDetail', icon: 'open', title: steps.duaDetail.title, body: steps.duaDetail.body },
    { id: 'goals', icon: 'goal', title: steps.goals.title, body: steps.goals.body },
    { id: 'goalDetail', icon: 'back', title: steps.goalDetail.title, body: steps.goalDetail.body },
    { id: 'today', icon: 'sprout', title: steps.today.title, body: steps.today.body },
    { id: 'visualize', icon: 'visualize', title: steps.visualize.title, body: steps.visualize.body },
    { id: 'settings', icon: 'gear', title: steps.settings.title, body: steps.settings.body },
  ];
}

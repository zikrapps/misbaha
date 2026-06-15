import type { Href } from 'expo-router';

export type E2eTab = 'today' | 'tasbeeh' | 'goals' | 'visualize';

export const E2E_TAB_ROUTES: Record<E2eTab, Href> = {
  today: '/',
  tasbeeh: '/duas',
  goals: '/goals',
  visualize: '/insights',
};

export function parseE2eTab(value: string | undefined): E2eTab | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized in E2E_TAB_ROUTES) {
    return normalized as E2eTab;
  }
  return null;
}

export function e2eGoDeepLink(tab: E2eTab): string {
  return `misbaha://test/go/${tab}`;
}

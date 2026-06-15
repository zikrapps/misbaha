import { E2E_TAB_ROUTES, e2eGoDeepLink, parseE2eTab } from '@/src/e2e/navigation';

describe('e2e navigation', () => {
  it('maps tab slugs to app routes', () => {
    expect(E2E_TAB_ROUTES.today).toBe('/');
    expect(E2E_TAB_ROUTES.tasbeeh).toBe('/duas');
    expect(E2E_TAB_ROUTES.goals).toBe('/goals');
    expect(E2E_TAB_ROUTES.visualize).toBe('/insights');
  });

  it('parses tab slugs case-insensitively', () => {
    expect(parseE2eTab('Tasbeeh')).toBe('tasbeeh');
    expect(parseE2eTab(' GOALS ')).toBe('goals');
    expect(parseE2eTab('unknown')).toBeNull();
  });

  it('builds go deep links', () => {
    expect(e2eGoDeepLink('tasbeeh')).toBe('misbaha://test/go/tasbeeh');
  });
});

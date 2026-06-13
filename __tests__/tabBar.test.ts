import { scrollPastTabBar, tabBarHeight } from '@/src/theme/tabBar';

describe('tabBar helpers', () => {
  it('uses taller tab bars for Urdu labels', () => {
    expect(tabBarHeight('en')).toBe(76);
    expect(tabBarHeight('ur')).toBe(88);
    expect(scrollPastTabBar('ur', 12)).toBeGreaterThan(scrollPastTabBar('en', 12));
    expect(scrollPastTabBar('en')).toBeGreaterThan(76);
  });

  it('includes the safe area inset in scroll padding', () => {
    expect(scrollPastTabBar('en', 0)).toBeLessThan(scrollPastTabBar('en', 20));
  });
});

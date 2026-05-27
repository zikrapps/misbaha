import {
  APP_DISPLAY_NAME,
  LEGAL_ENTITY,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
  WEBSITE_URL,
} from '@/src/constants/legal';

describe('legal constants', () => {
  it('exposes Zikr Apps branding', () => {
    expect(LEGAL_ENTITY).toBe('Zikr Apps');
    expect(APP_DISPLAY_NAME).toBe('Misbaha');
    expect(SUPPORT_EMAIL).toBe('salam@zikrapps.com');
    expect(SUPPORT_MAILTO).toBe('mailto:salam@zikrapps.com');
    expect(WEBSITE_URL).toContain('zikrapps.com');
    expect(PRIVACY_POLICY_URL).toContain('privacy');
  });
});

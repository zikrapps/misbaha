import { DevSettings, I18nManager } from 'react-native';

import { isRtlLanguage, reloadApp, syncLayoutDirection } from '@/src/i18n/rtl';

describe('rtl helpers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('detects Urdu as the RTL language', () => {
    expect(isRtlLanguage('ur')).toBe(true);
    expect(isRtlLanguage('en')).toBe(false);
  });

  it('clears stale native RTL without forcing Urdu layout', () => {
    const allowSpy = jest.spyOn(I18nManager, 'allowRTL').mockImplementation(() => {});
    const forceSpy = jest.spyOn(I18nManager, 'forceRTL').mockImplementation(() => {});

    Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: true });
    expect(syncLayoutDirection('ur')).toBe(true);
    expect(allowSpy).toHaveBeenCalledWith(true);
    expect(forceSpy).toHaveBeenCalledWith(false);

    Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: false });
    expect(syncLayoutDirection('en')).toBe(false);
    expect(forceSpy).toHaveBeenCalledTimes(1);
  });

  it('reloads the bundle when DevSettings supports it', () => {
    const reload = jest.fn();
    Object.defineProperty(DevSettings, 'reload', { configurable: true, value: reload });

    reloadApp();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('ignores reload when DevSettings.reload is unavailable', () => {
    Object.defineProperty(DevSettings, 'reload', { configurable: true, value: undefined });
    expect(() => reloadApp()).not.toThrow();
  });
});

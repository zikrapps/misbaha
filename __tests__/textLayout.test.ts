import { I18nManager } from 'react-native';

import {
  alignStart,
  arabicLayout,
  directionStyle,
  lineHeightFor,
  mirrorRow,
  proseBlockLayout,
  proseCenterLayout,
  proseContainerLayout,
  proseInlineLayout,
  proseLayout,
} from '@/src/i18n/textLayout';

describe('proseLayout', () => {
  it('uses RTL for Urdu with full line width', () => {
    expect(proseLayout('ur')).toMatchObject({
      width: '100%',
      writingDirection: 'rtl',
      textAlign: expect.stringMatching(/left|right/),
    });
  });

  it('uses LTR for English', () => {
    expect(proseLayout('en')).toMatchObject({
      width: '100%',
      textAlign: 'left',
      writingDirection: 'ltr',
    });
  });

  it('centers Urdu text with RTL writing direction', () => {
    expect(proseCenterLayout('ur')).toMatchObject({
      textAlign: 'center',
      writingDirection: 'rtl',
    });
  });

  it('stretches scroll containers without Yoga direction', () => {
    expect(proseContainerLayout('ur')).toMatchObject({ alignSelf: 'stretch' });
  });

  it('mirrors Urdu rows when native RTL is off', () => {
    expect(mirrorRow('ur')).toEqual({ flexDirection: 'row-reverse' });
  });

  it('always right-aligns Arabic script', () => {
    expect(arabicLayout).toMatchObject({
      width: '100%',
      textAlign: 'right',
      writingDirection: 'rtl',
    });
  });

  it('covers inline, block, and legacy direction helpers', () => {
    expect(proseInlineLayout('en')).toMatchObject({ writingDirection: 'ltr' });
    expect(proseInlineLayout('ur')).toMatchObject({ writingDirection: 'rtl' });
    expect(proseBlockLayout('en')).toMatchObject({ width: '100%' });
    expect(directionStyle('ur')).toEqual({});
    expect(lineHeightFor('ur', 16)).toBeGreaterThan(lineHeightFor('en', 16));
  });

  it('adapts alignment when native RTL is still enabled', () => {
    Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: true });
    expect(proseLayout('en')).toMatchObject({ textAlign: 'right' });
    expect(proseLayout('ur')).toMatchObject({ textAlign: 'left' });
    expect(proseInlineLayout('en')).toMatchObject({ textAlign: 'right' });
    expect(mirrorRow('ur')).toEqual({ flexDirection: 'row' });
    expect(alignStart('ur')).toEqual({ alignSelf: 'flex-start' });
    Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: false });
  });
});

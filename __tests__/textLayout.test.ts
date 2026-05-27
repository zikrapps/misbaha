import { proseLayout } from '@/src/i18n/textLayout';

describe('proseLayout', () => {
  it('uses RTL for Urdu', () => {
    expect(proseLayout('ur')).toMatchObject({ textAlign: 'right', writingDirection: 'rtl' });
  });

  it('uses LTR for English', () => {
    expect(proseLayout('en')).toMatchObject({ textAlign: 'left', writingDirection: 'ltr' });
  });
});

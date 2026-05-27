import { getGardenZoom } from '@/src/features/insights/gardenZoom';
import { gardenZoomCaption } from '@/src/i18n/gardenText';

describe('gardenZoomCaption', () => {
  it('describes a barren garden', () => {
    expect(gardenZoomCaption(getGardenZoom(0), 0, 'en')).toMatch(/barren|خالی/i);
  });

  it('describes valley view before zoom', () => {
    const caption = gardenZoomCaption(getGardenZoom(4), 4, 'en');
    expect(caption).toContain('4');
  });

  it('shows only tree count once enough are planted in valley', () => {
    const caption = gardenZoomCaption(getGardenZoom(6), 6, 'en');
    expect(caption).not.toContain('more to reveal');
  });

  it('describes barren ranges in wide vista', () => {
    const zoom = getGardenZoom(8);
    const caption = gardenZoomCaption(zoom, 8, 'en');
    expect(caption.toLowerCase()).toMatch(/barren|range/);
  });

  it('describes mountain ranges when fill is high', () => {
    const zoom = getGardenZoom(40);
    const caption = gardenZoomCaption(zoom, 40, 'en');
    expect(caption).toMatch(/range/i);
  });

  it('uses singular range label for one layer', () => {
    const zoom = { ...getGardenZoom(40), rangeLayers: 1, fill: 0.5 };
    const caption = gardenZoomCaption(zoom, 10, 'en');
    expect(caption).toContain('1 range');
  });

  it('supports Urdu strings', () => {
    const caption = gardenZoomCaption(getGardenZoom(2), 2, 'ur');
    expect(caption.length).toBeGreaterThan(0);
  });
});

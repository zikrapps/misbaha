import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { duasById } from '@/src/data/duas';
import { presetGoals } from '@/src/data/presetGoals';
import {
  computeGoalPdfLayout,
  exportGoalPdf,
  goalPdfDayColumns,
  goalPdfHtml,
  goalPdfPreviewArabicSize,
  loadGoalPdfAssets,
} from '@/src/features/goals/exportGoalPdf';

const mockAssets = {
  appIconDataUri: 'data:image/png;base64,app-icon',
  zikrMarkDataUri: 'data:image/png;base64,zikr-mark',
};

describe('goal PDF export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
  });

  it('renders minimal mock layout with Arabic-only rows', () => {
    const portrait = goalPdfHtml(presetGoals[0], 'portrait', 'en', mockAssets);
    const landscape = goalPdfHtml(presetGoals[0], 'landscape', 'en', mockAssets);
    const urPortrait = goalPdfHtml(presetGoals[0], 'portrait', 'ur', {});

    expect(portrait).toContain('size: A4 portrait');
    expect(landscape).toContain('size: A4 landscape');
    expect(portrait).toContain('class="topbar"');
    expect(portrait).toContain('#4a6741');
    expect(portrait).toContain('class="content cols-1"');
    expect(landscape).toContain('duas-column');
    expect(portrait).toContain('class="arabic"');
    expect(portrait).toContain('Powered by Zikr Apps');
    expect(portrait).toContain('data:image/png;base64,app-icon');
    expect(portrait).not.toContain('frame-corner');
    expect(portrait).not.toContain('duaTranslation');
    expect(portrait).not.toContain('Glory be to Allah');
    expect(urPortrait).toContain('cols-1');
    expect(urPortrait).not.toContain('data:image/png;base64,app-icon');
  });

  it('embeds the full Arabic dua text without truncation', () => {
    const salawat = duasById['isha-salat-nabi']!.arabic;
    const html = goalPdfHtml(presetGoals[0], 'portrait', 'en', mockAssets);

    expect(html).toContain(salawat);
    expect(html).toContain('كَمَا بَارَكْتَ عَلَىٰ آلِ إِبْرَاهِيمَ');
    expect(html).not.toContain('text-overflow');
    expect(html).not.toContain('ellipsis');
  });

  it('renders Arabic for unknown dua ids', () => {
    const goal = {
      ...presetGoals[0],
      days: [{ day: 1, duaId: 'missing-dua', target: 5 }],
    };
    const html = goalPdfHtml(goal, 'portrait', 'ur', mockAssets);
    expect(html).toContain('missing-dua');
    expect(html).not.toContain('translation');
  });

  it('splits landscape goals into columns', () => {
    const singleColumn = goalPdfDayColumns(presetGoals[0].days.slice(0, 3), 'portrait', 1);
    expect(singleColumn).toHaveLength(1);

    const sevenDay = goalPdfDayColumns(presetGoals[0].days, 'landscape');
    expect(sevenDay).toHaveLength(2);
    expect(sevenDay[0]?.length).toBe(4);
    expect(sevenDay[1]?.length).toBe(3);

    const thirtyDay = goalPdfDayColumns(presetGoals[3].days, 'landscape');
    expect(thirtyDay).toHaveLength(3);
    expect(thirtyDay.every((column) => column.length === 10)).toBe(true);
  });

  it('computes single-page layouts for preset goals', () => {
    for (const goal of presetGoals) {
      for (const orientation of ['portrait', 'landscape'] as const) {
        const layout = computeGoalPdfLayout(goal, orientation);
        expect(layout.fontSize).toBeGreaterThanOrEqual(6);
        expect(layout.scale).toBeGreaterThan(0);
        expect(layout.scale).toBeLessThanOrEqual(1);
        expect(layout.columnCount).toBeGreaterThanOrEqual(1);

        const html = goalPdfHtml(goal, orientation, 'en', mockAssets);
        expect(html).toContain('page-break-inside: avoid');
        expect(html).toContain(`cols-${layout.columnCount}`);
      }
    }

    const longPortrait = computeGoalPdfLayout(presetGoals[3], 'portrait');
    expect(longPortrait.columnCount).toBe(2);

    const tenDayPortrait = computeGoalPdfLayout(presetGoals[1], 'portrait');
    expect(tenDayPortrait.columnCount).toBe(2);
  });

  it('loads branded assets for export', async () => {
    const assets = await loadGoalPdfAssets();
    expect(assets.appIconDataUri).toContain('data:image/png;base64,');
    expect(assets.zikrMarkDataUri).toContain('data:image/png;base64,');
  });

  it('returns empty data uris when asset loading yields no uri', async () => {
    const Asset = require('expo-asset').Asset;
    (Asset.loadAsync as jest.Mock).mockResolvedValueOnce([{ localUri: undefined, uri: undefined }]);
    (Asset.loadAsync as jest.Mock).mockResolvedValueOnce([{ localUri: undefined, uri: undefined }]);
    const assets = await loadGoalPdfAssets();
    expect(assets.appIconDataUri).toBe('');
    expect(assets.zikrMarkDataUri).toBe('');
  });

  it('exports and shares PDF when sharing is available', async () => {
    const result = await exportGoalPdf(presetGoals[0], 'portrait', 'en');
    expect(result.uri).toBe('file://goal.pdf');
    expect(result.shared).toBe(true);
    expect(Print.printToFileAsync).toHaveBeenCalled();
    expect(Sharing.shareAsync).toHaveBeenCalled();
  });

  it('returns uri when sharing is unavailable', async () => {
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValueOnce(false);
    const result = await exportGoalPdf(presetGoals[0], 'landscape');
    expect(result.uri).toBe('file://goal.pdf');
    expect(result.shared).toBe(false);
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
  });

  it('previews arabic size from the computed layout', () => {
    expect(goalPdfPreviewArabicSize(presetGoals[0], 'portrait')).toBeGreaterThanOrEqual(8);
  });

  it('scales overflowing goals down to fit one page', () => {
    const longArabic = 'ا'.repeat(4000);
    const goal = {
      ...presetGoals[0],
      duration: 40,
      days: Array.from({ length: 40 }, (_, index) => ({
        day: index + 1,
        duaId: `overflow-${index}`,
        target: 33,
      })),
    };

    const originalById = { ...duasById };
    Object.assign(duasById, {
      ...Object.fromEntries(goal.days.map((day) => [day.duaId, { id: day.duaId, arabic: longArabic }])),
    });

    const layout = computeGoalPdfLayout(goal, 'portrait');
    expect(layout.fontSize).toBe(6);
    expect(layout.scale).toBeLessThan(1);

    const html = goalPdfHtml(goal, 'portrait', 'ur', {});
    expect(html).toContain('transform: scale');
    expect(html).toMatch(/padding:\s*8px 14px/);

    Object.keys(duasById).forEach((key) => {
      if (key.startsWith('overflow-')) {
        delete duasById[key];
      }
    });
    Object.assign(duasById, originalById);
  });
});

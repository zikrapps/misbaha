import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { presetGoals } from '@/src/data/presetGoals';
import { exportGoalPdf, goalPdfHtml } from '@/src/features/goals/exportGoalPdf';

describe('goal PDF export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
  });

  it('renders portrait and landscape page sizing', () => {
    const portrait = goalPdfHtml(presetGoals[0], 'portrait');
    const landscape = goalPdfHtml(presetGoals[0], 'landscape');

    expect(portrait).toContain('size: A4 portrait');
    expect(landscape).toContain('size: 11in 8in');
    expect(landscape).toContain('Tasbih Fatimah');
  });

  it('renders Urdu rows and unknown dua ids', () => {
    const goal = {
      ...presetGoals[0],
      days: [{ day: 1, duaId: 'missing-dua', target: 5 }],
    };
    const html = goalPdfHtml(goal, 'portrait', 'ur');
    expect(html).toContain('missing-dua');
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
});

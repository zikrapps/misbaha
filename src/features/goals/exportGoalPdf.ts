import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { duasById } from '@/src/data/duas';
import { duaPreview, duaTranslation } from '@/src/i18n/duaText';
import { goalDescription, goalTitle } from '@/src/i18n/goalText';
import { getStrings } from '@/src/i18n/strings';
import { GoalPlan, Language } from '@/src/types/misbaha';

export type PdfOrientation = 'portrait' | 'landscape';

export type PdfExportResult = {
  uri: string;
  shared: boolean;
};

function pageCss(orientation: PdfOrientation) {
  return orientation === 'portrait'
    ? '@page { size: A4 portrait; margin: 18mm; }'
    : '@page { size: 11in 8in; margin: 14mm; }';
}

export function goalPdfHtml(goal: GoalPlan, orientation: PdfOrientation, language: Language = 'en') {
  const t = getStrings(language);
  const title = goalTitle(goal, language);
  const description = goalDescription(goal, language);
  const rows = goal.days
    .map((day) => {
      const dua = duasById[day.duaId];
      return `<tr>
        <td>${day.day}</td>
        <td><strong>${dua ? duaPreview(dua, language) : day.duaId}</strong><br/><span>${dua ? duaTranslation(dua, language) : ''}</span></td>
        <td class="arabic">${dua?.arabic ?? ''}</td>
        <td>${day.target}</td>
        <td class="box"></td>
      </tr>`;
    })
    .join('');

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        ${pageCss(orientation)}
        body { background: #f7f0df; color: #372c24; font-family: Georgia, serif; }
        h1 { font-size: 30px; margin-bottom: 4px; }
        p { color: #867b6b; margin-top: 0; }
        table { border-collapse: collapse; width: 100%; }
        th { color: #6f8f4e; font-size: 10px; letter-spacing: 2px; text-align: left; text-transform: uppercase; }
        td, th { border-bottom: 1px solid #ded1b2; padding: 10px 8px; vertical-align: top; }
        .arabic { direction: rtl; font-size: 20px; text-align: right; }
        .box { border: 1px solid #6f8f4e; height: 18px; width: 18px; }
        span { color: #867b6b; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>${description} • ${goal.duration} ${t.common.days} • ${orientation}</p>
      <table>
        <thead><tr><th>${t.common.day}</th><th>${t.goalDetail.todaysTasbeeh}</th><th>Arabic</th><th>Target</th><th>${t.common.complete}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
  </html>`;
}

export async function exportGoalPdf(
  goal: GoalPlan,
  orientation: PdfOrientation,
  language: Language = 'en',
): Promise<PdfExportResult> {
  const { uri } = await Print.printToFileAsync({ html: goalPdfHtml(goal, orientation, language) });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      dialogTitle: `${goalTitle(goal, language)} ${orientation} PDF`,
      mimeType: 'application/pdf',
    });
    return { uri, shared: true };
  }
  return { uri, shared: false };
}

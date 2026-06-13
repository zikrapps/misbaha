import { Asset } from 'expo-asset';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { LEGAL_ENTITY } from '@/src/constants/legal';
import { duasById } from '@/src/data/duas';
import { goalDescription, goalTitle } from '@/src/i18n/goalText';
import { getStrings } from '@/src/i18n/strings';
import { GoalDay, GoalPlan, Language } from '@/src/types/misbaha';

export type PdfOrientation = 'portrait' | 'landscape';

export type PdfExportResult = {
  uri: string;
  shared: boolean;
};

export type GoalPdfAssets = {
  appIconDataUri: string;
  zikrMarkDataUri: string;
};

export type GoalPdfLayout = {
  columnCount: number;
  fontSize: number;
  rowGap: number;
  headerSize: 'normal' | 'compact';
  scale: number;
};

const APP_ICON = require('@/assets/icon.png');
const ZIKR_MARK = require('@/assets/brand/zikr-mark-primary.png');

const MINIMAL = {
  bg: '#faf8f3',
  ink: '#2f2b26',
  olive: '#4a6741',
  line: '#e4ddd0',
  muted: '#8a8278',
  target: '#6b6b6b',
  onOlive: '#faf8f3',
} as const;

/** Usable A4 area in px at 96dpi after @page margins (portrait 10mm, landscape 8mm). */
const PAGE_PX: Record<PdfOrientation, { width: number; height: number }> = {
  portrait: { width: 718, height: 1047 },
  landscape: { width: 1062, height: 733 },
};

const PAGE_CHROME = {
  topbar: {
    portrait: { normal: 54, compact: 44 },
    landscape: { normal: 48, compact: 40 },
  },
  footer: 34,
  contentPadding: 24,
  columnGap: 16,
} as const;

const ROW_DAY_WIDTH = 28;
const ROW_CHROME = 15;
const ARABIC_LINE_HEIGHT = 1.35;
const MIN_FONT_SIZE = 6;

function pageCss(orientation: PdfOrientation) {
  return orientation === 'portrait'
    ? '@page { size: A4 portrait; margin: 10mm; }'
    : '@page { size: A4 landscape; margin: 8mm; }';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function splitIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const chunkSize = Math.ceil(items.length / columnCount);
  return Array.from({ length: columnCount }, (_, index) =>
    items.slice(index * chunkSize, (index + 1) * chunkSize),
  ).filter((column) => column.length > 0);
}

function columnOptions(orientation: PdfOrientation, dayCount: number): number[] {
  if (orientation === 'landscape') {
    if (dayCount > 20) return [3, 2];
    return [2];
  }
  if (dayCount > 8) return [2];
  return [1];
}

function availableContentHeight(orientation: PdfOrientation, headerSize: GoalPdfLayout['headerSize']) {
  const pageHeight = PAGE_PX[orientation].height;
  const topbar = PAGE_CHROME.topbar[orientation][headerSize];
  return pageHeight - topbar - PAGE_CHROME.footer - PAGE_CHROME.contentPadding;
}

function columnContentWidth(orientation: PdfOrientation, columnCount: number) {
  const innerWidth = PAGE_PX[orientation].width - 32;
  const gaps = (columnCount - 1) * PAGE_CHROME.columnGap;
  return (innerWidth - gaps) / columnCount;
}

function estimateArabicLines(arabic: string, fontSize: number, columnWidth: number) {
  const charsPerLine = Math.max(4, Math.floor(columnWidth / (fontSize * 0.48)));
  return Math.max(1, Math.ceil(arabic.length / charsPerLine));
}

function estimateContentHeight(
  days: GoalDay[],
  orientation: PdfOrientation,
  columnCount: number,
  fontSize: number,
) {
  const colWidth = columnContentWidth(orientation, columnCount);
  const arabicWidth = colWidth - ROW_DAY_WIDTH - 52;
  const columns = splitIntoColumns(days, columnCount);
  let maxColumnHeight = 0;

  for (const column of columns) {
    let height = 0;
    for (const day of column) {
      const arabic = duasById[day.duaId]?.arabic ?? day.duaId;
      const lines = estimateArabicLines(arabic, fontSize, arabicWidth);
      const textHeight = lines * fontSize * ARABIC_LINE_HEIGHT;
      height += ROW_CHROME + textHeight;
    }
    maxColumnHeight = Math.max(maxColumnHeight, height);
  }

  return maxColumnHeight;
}

function layoutScore(layout: GoalPdfLayout) {
  return layout.fontSize * 100 + layout.rowGap * 2 - layout.columnCount * 5;
}

function defaultColumnCount(orientation: PdfOrientation, dayCount: number) {
  return columnOptions(orientation, dayCount)[0] ?? 1;
}

export function computeGoalPdfLayout(goal: GoalPlan, orientation: PdfOrientation): GoalPdfLayout {
  const dayCount = goal.days.length;
  const columns = columnOptions(orientation, dayCount);
  let best: GoalPdfLayout | null = null;

  for (const headerSize of ['normal', 'compact'] as const) {
    const available = availableContentHeight(orientation, headerSize);

    for (const columnCount of columns) {
      for (let fontSize = 16; fontSize >= MIN_FONT_SIZE; fontSize -= 0.5) {
        const height = estimateContentHeight(goal.days, orientation, columnCount, fontSize);
        if (height <= available) {
          const candidate: GoalPdfLayout = {
            columnCount,
            fontSize,
            rowGap: 0,
            headerSize,
            scale: 1,
          };
          if (!best || layoutScore(candidate) > layoutScore(best)) best = candidate;
          break;
        }
      }
    }

    if (best?.headerSize === 'normal') break;
  }

  if (best) return best;

  const columnCount = defaultColumnCount(orientation, dayCount);
  const headerSize = 'compact';
  const available = availableContentHeight(orientation, headerSize);
  const fontSize = MIN_FONT_SIZE;
  const estimated = estimateContentHeight(goal.days, orientation, columnCount, fontSize);
  const scale = Math.min(1, (available / estimated) * 0.96);

  return { columnCount, fontSize, rowGap: 0, headerSize, scale };
}

export function goalPdfDayColumns(
  days: GoalPlan['days'],
  orientation: PdfOrientation,
  columnCount?: number,
) {
  const cols = columnCount ?? defaultColumnCount(orientation, days.length);
  if (cols <= 1) return [days];
  return splitIntoColumns(days, cols);
}

export function goalPdfPreviewArabicSize(goal: GoalPlan, orientation: PdfOrientation) {
  const layout = computeGoalPdfLayout(goal, orientation);
  return Math.max(8, Math.round(layout.fontSize * layout.scale * 0.72));
}

function buildDuaRows(days: GoalDay[], layout: GoalPdfLayout) {
  const fontSize = layout.fontSize * layout.scale;
  const rowPadding = layout.headerSize === 'compact' ? 5 : 7;

  return days
    .map((day) => {
      const dua = duasById[day.duaId];
      const arabic = dua?.arabic ?? day.duaId;
      return `<div class="dua-row" style="padding:${rowPadding}px 0">
        <span class="day">${day.day}</span>
        <p class="arabic" style="font-size:${fontSize.toFixed(1)}px">${escapeHtml(arabic)}</p>
        <span class="target">×${day.target}</span>
        <span class="box"></span>
      </div>`;
    })
    .join('');
}

function buildDuaColumns(goal: GoalPlan, layout: GoalPdfLayout) {
  if (layout.columnCount <= 1) {
    return `<div class="duas-column">${buildDuaRows(goal.days, layout)}</div>`;
  }

  const columns = splitIntoColumns(goal.days, layout.columnCount);
  const columnHtml = columns
    .map((days) => `<div class="duas-column">${buildDuaRows(days, layout)}</div>`)
    .join('');

  return columnHtml;
}

export function goalPdfHtml(
  goal: GoalPlan,
  orientation: PdfOrientation,
  language: Language = 'en',
  assets: Partial<GoalPdfAssets> = {},
) {
  const t = getStrings(language);
  const title = goalTitle(goal, language);
  const description = goalDescription(goal, language);
  const appIcon = assets.appIconDataUri ?? '';
  const zikrMark = assets.zikrMarkDataUri ?? '';
  const layout = computeGoalPdfLayout(goal, orientation);
  const duaColumns = buildDuaColumns(goal, layout);
  const isCompact = layout.headerSize === 'compact';
  const sheetScale = layout.scale < 1 ? layout.scale : 1;
  const daysLabel = `${goal.duration} ${t.common.days}`;

  return `<!doctype html>
  <html dir="ltr">
    <head>
      <meta charset="utf-8" />
      <style>
        ${pageCss(orientation)}
        * { box-sizing: border-box; }
        html, body {
          background: ${MINIMAL.bg};
          color: ${MINIMAL.ink};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          height: 100%;
          margin: 0;
        }
        body {
          display: flex;
          flex-direction: column;
          page-break-after: avoid;
          page-break-before: avoid;
          page-break-inside: avoid;
        }
        .sheet {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
          min-height: 0;
          page-break-inside: avoid;
          ${sheetScale < 1 ? `transform: scale(${sheetScale.toFixed(3)}); transform-origin: top center; width: ${(100 / sheetScale).toFixed(2)}%;` : ''}
        }
        .topbar {
          align-items: center;
          background: ${MINIMAL.olive};
          color: ${MINIMAL.onOlive};
          display: flex;
          flex-shrink: 0;
          gap: 12px;
          justify-content: space-between;
          padding: ${isCompact ? '8px 14px' : '10px 16px'};
        }
        .topbar-left {
          align-items: center;
          display: flex;
          gap: 10px;
          min-width: 0;
        }
        .app-icon {
          border-radius: 8px;
          flex-shrink: 0;
          height: ${isCompact ? 28 : 32}px;
          object-fit: cover;
          width: ${isCompact ? 28 : 32}px;
        }
        .topbar-copy { min-width: 0; }
        .topbar h1 {
          font-size: ${isCompact ? 14 : 16}px;
          font-weight: 700;
          margin: 0;
        }
        .topbar .meta {
          font-size: ${isCompact ? 9 : 10}px;
          margin-top: 2px;
          opacity: 0.88;
        }
        .topbar .days {
          flex-shrink: 0;
          font-size: ${isCompact ? 10 : 11}px;
          font-weight: 700;
          white-space: nowrap;
        }
        .content {
          display: grid;
          flex: 1;
          gap: 0 ${PAGE_CHROME.columnGap}px;
          grid-template-columns: repeat(${layout.columnCount}, minmax(0, 1fr));
          min-height: 0;
          padding: ${isCompact ? '10px 14px 8px' : '14px 16px 10px'};
        }
        .duas-column { min-width: 0; }
        .dua-row {
          align-items: start;
          border-bottom: 1px solid ${MINIMAL.line};
          display: grid;
          gap: 8px;
          grid-template-columns: ${ROW_DAY_WIDTH}px 1fr auto auto;
          page-break-inside: avoid;
        }
        .day {
          color: ${MINIMAL.olive};
          font-size: ${isCompact ? 10 : 11}px;
          font-weight: 800;
          min-width: ${ROW_DAY_WIDTH}px;
          text-align: center;
          white-space: nowrap;
        }
        .arabic {
          direction: rtl;
          font-family: 'Noto Naskh Arabic', 'Geeza Pro', 'Arabic Typesetting', serif;
          line-height: ${ARABIC_LINE_HEIGHT};
          margin: 0;
          overflow: visible;
          text-align: right;
          unicode-bidi: plaintext;
          white-space: normal;
          word-wrap: break-word;
        }
        .target {
          color: ${MINIMAL.target};
          font-size: ${isCompact ? 9 : 10}px;
          font-weight: 700;
          white-space: nowrap;
        }
        .box {
          border: 1px solid ${MINIMAL.olive};
          border-radius: 2px;
          flex-shrink: 0;
          height: 12px;
          margin-top: 2px;
          width: 12px;
        }
        .footer {
          align-items: center;
          border-top: 1px solid ${MINIMAL.line};
          color: ${MINIMAL.muted};
          display: flex;
          flex-shrink: 0;
          font-size: ${isCompact ? 9 : 10}px;
          gap: 6px;
          justify-content: center;
          padding: ${isCompact ? '7px 14px 10px' : '8px 16px 12px'};
        }
        .footer img {
          height: 12px;
          object-fit: contain;
          width: 12px;
        }
      </style>
    </head>
    <body>
      <div class="sheet">
        <header class="topbar">
          <div class="topbar-left">
            ${appIcon ? `<img class="app-icon" src="${appIcon}" alt="" />` : ''}
            <div class="topbar-copy">
              <h1>${escapeHtml(title)}</h1>
              <p class="meta">${escapeHtml(description)}</p>
            </div>
          </div>
          <div class="days">${escapeHtml(daysLabel)}</div>
        </header>
        <section class="content cols-${layout.columnCount}">
          ${duaColumns}
        </section>
        <footer class="footer">
          ${zikrMark ? `<img src="${zikrMark}" alt="" />` : ''}
          <span>Powered by ${LEGAL_ENTITY}</span>
        </footer>
      </div>
    </body>
  </html>`;
}

async function imageModuleToDataUri(moduleId: number): Promise<string> {
  const [asset] = await Asset.loadAsync(moduleId);
  const uri = asset.localUri ?? asset.uri;
  if (!uri) return '';

  const response = await fetch(uri);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]!);
  }

  const base64 = globalThis.btoa(binary);
  return `data:image/png;base64,${base64}`;
}

export async function loadGoalPdfAssets(): Promise<GoalPdfAssets> {
  const [appIconDataUri, zikrMarkDataUri] = await Promise.all([
    imageModuleToDataUri(APP_ICON),
    imageModuleToDataUri(ZIKR_MARK),
  ]);
  return { appIconDataUri, zikrMarkDataUri };
}

export async function exportGoalPdf(
  goal: GoalPlan,
  orientation: PdfOrientation,
  language: Language = 'en',
): Promise<PdfExportResult> {
  const assets = await loadGoalPdfAssets();
  const { uri } = await Print.printToFileAsync({
    html: goalPdfHtml(goal, orientation, language, assets),
  });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      dialogTitle: `${goalTitle(goal, language)} PDF`,
      mimeType: 'application/pdf',
    });
    return { uri, shared: true };
  }
  return { uri, shared: false };
}

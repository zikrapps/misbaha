import { useMemo } from 'react';

import {
  alignStart,
  arabicLayout,
  labelDecoration,
  lineHeightFor,
  mirrorRow,
  proseBlockLayout,
  proseCenterLayout,
  proseContainerLayout,
  proseFontStyle,
  proseInlineLayout,
  proseLayout,
} from '@/src/i18n/textLayout';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { getTheme, normalizeThemeId, typographyForLanguage } from '@/src/theme/palette';
import { useUrduFontsReady } from '@/src/theme/UrduFontProvider';
import { NOTO_NASKH_URDU } from '@/src/theme/urduFont';

export function useTheme() {
  const themeId = useMisbahaStore((state) => state.themeId);
  const language = useMisbahaStore((state) => state.language);
  const urduFontsReady = useUrduFontsReady();
  const theme = getTheme(normalizeThemeId(themeId));
  const urduFamily = urduFontsReady ? NOTO_NASKH_URDU : 'System';
  const typo = useMemo(() => typographyForLanguage(language), [language]);
  const proseLayoutStyle = useMemo(() => proseLayout(language), [language]);
  const proseInlineLayoutStyle = useMemo(() => proseInlineLayout(language), [language]);
  const proseCenterLayoutStyle = useMemo(() => proseCenterLayout(language), [language]);
  const proseContainerLayoutStyle = useMemo(() => proseContainerLayout(language), [language]);
  const proseBlockLayoutStyle = useMemo(() => proseBlockLayout(language), [language]);
  const mirrorRowStyle = useMemo(() => mirrorRow(language), [language]);
  const alignStartStyle = useMemo(() => alignStart(language), [language]);
  const labelDecorationStyle = useMemo(() => labelDecoration(language), [language]);
  const labelLineHeight = useMemo(
    () => (fontSize: number, latinRatio?: number) => lineHeightFor(language, fontSize, latinRatio),
    [language],
  );
  return {
    ...theme,
    language,
    typo,
    labelFont: language === 'ur' ? urduFamily : theme.fonts.display,
    arabicFont: language === 'ur' ? urduFamily : theme.fonts.arabic,
    proseFontStyle: proseFontStyle(language),
    proseLayout: proseLayoutStyle,
    proseInlineLayout: proseInlineLayoutStyle,
    proseCenterLayout: proseCenterLayoutStyle,
    proseContainerLayout: proseContainerLayoutStyle,
    proseBlockLayout: proseBlockLayoutStyle,
    mirrorRow: mirrorRowStyle,
    alignStart: alignStartStyle,
    labelDecoration: labelDecorationStyle,
    labelLineHeight,
    arabicLayout,
  };
}

import { proseFontStyle } from '@/src/i18n/textLayout';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { getTheme, normalizeThemeId, typographyForLanguage } from '@/src/theme/palette';

export function useTheme() {
  const themeId = useMisbahaStore((state) => state.themeId);
  const language = useMisbahaStore((state) => state.language);
  const theme = getTheme(normalizeThemeId(themeId));
  return {
    ...theme,
    language,
    typo: typographyForLanguage(language),
    labelFont: language === 'ur' ? theme.fonts.body : theme.fonts.display,
    proseFontStyle: proseFontStyle(language),
  };
}

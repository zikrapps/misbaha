import { Language, ThemeId } from '@/src/types/misbaha';

// Naskh reads well slightly larger than Latin, but it no longer needs the
// outsized boost that Nastaliq did to stay legible.
const URDU_FONT_SCALE = 1.15;

export const typography = {
  title: 32,
  subtitle: 15,
  body: 16,
  small: 12,
  arabic: 24,
};

export type AppTypography = {
  title: number;
  subtitle: number;
  body: number;
  small: number;
  caption: number;
  micro: number;
  arabic: number;
};

function scaleType(size: number, language: Language): number {
  return language === 'ur' ? Math.round(size * URDU_FONT_SCALE) : size;
}

export function typographyForLanguage(language: Language): AppTypography {
  return {
    title: scaleType(typography.title, language),
    subtitle: scaleType(typography.subtitle, language),
    body: scaleType(typography.body, language),
    small: scaleType(typography.small, language),
    caption: scaleType(11, language),
    micro: scaleType(10, language),
    arabic: typography.arabic,
  };
}

export type ThemeColors = {
  ink: string;
  muted: string;
  cream: string;
  parchment: string;
  sand: string;
  card: string;
  olive: string;
  oliveDark: string;
  oliveDeep: string;
  moss: string;
  blush: string;
  line: string;
  white: string;
};

/** Default palette (Garden) — also used as fallback for static imports. */
export const colors: ThemeColors = {
  ink: '#372c24',
  muted: '#867b6b',
  cream: '#f7f0df',
  parchment: '#fbf6e8',
  sand: '#e7d7b0',
  card: '#fffaf0',
  olive: '#6f8f4e',
  oliveDark: '#2d4a22',
  oliveDeep: '#213a18',
  moss: '#8fa367',
  blush: '#bf7b6e',
  line: '#ded1b2',
  white: '#ffffff',
};

export const themes: Record<
  ThemeId,
  {
    id: ThemeId;
    name: string;
    description: string;
    colors: ThemeColors;
    fonts: {
      display: string;
      body: string;
      arabic: string;
    };
  }
> = {
  garden: {
    id: 'garden',
    name: 'Garden',
    description: 'Cream parchment, olive ink, soft devotional warmth.',
    colors,
    fonts: {
      display: 'Georgia',
      body: 'System',
      arabic: 'Georgia',
    },
  },
  chromatic: {
    id: 'chromatic',
    name: 'Chromatic',
    description: 'Cool indigo-violet base with teal accents — readable and vivid.',
    colors: {
      ink: '#1a2138',
      muted: '#4d5672',
      cream: '#f2f4fb',
      parchment: '#e6eaf5',
      sand: '#cfd7f5',
      card: '#ffffff',
      olive: '#5b4fc7',
      oliveDark: '#4338a8',
      oliveDeep: '#2a2654',
      moss: '#0f766e',
      blush: '#b42356',
      line: '#ccd3e6',
      white: '#ffffff',
    },
    fonts: {
      display: 'Avenir',
      body: 'Avenir',
      arabic: 'Georgia',
    },
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    description: 'Warm rose clay, date-palm green, and softer rounded type.',
    colors: {
      ...colors,
      ink: '#3b2521',
      muted: '#8a6159',
      cream: '#fbefe7',
      parchment: '#fff7ef',
      sand: '#eccaa7',
      card: '#fff9f3',
      olive: '#7d8d58',
      oliveDark: '#44572a',
      oliveDeep: '#24341b',
      moss: '#9aa96f',
      blush: '#9f3f4b',
      line: '#e6c8bc',
      white: '#ffffff',
    },
    fonts: {
      display: 'Palatino',
      body: 'Trebuchet MS',
      arabic: 'Georgia',
    },
  },
  parchment: {
    id: 'parchment',
    name: 'Parchment',
    description: 'Warm grey parchment tones — ink and paper without color.',
    colors: {
      ink: '#353330',
      muted: '#78736a',
      cream: '#ece7dd',
      parchment: '#f5f1e8',
      sand: '#d8d2c6',
      card: '#faf8f3',
      olive: '#5c5954',
      oliveDark: '#45423e',
      oliveDeep: '#2e2c28',
      moss: '#8f8a82',
      blush: '#6a6560',
      line: '#cfc9bd',
      white: '#ffffff',
    },
    fonts: {
      display: 'Georgia',
      body: 'System',
      arabic: 'Georgia',
    },
  },
  fadedGold: {
    id: 'fadedGold',
    name: 'Faded Gold',
    description: 'Sun-bleached champagne — dusty wheat glass and quiet ceremonial warmth.',
    colors: {
      ink: '#5c4a32',
      muted: '#8a7a68',
      cream: '#f5efe0',
      parchment: '#ebe4d4',
      sand: '#e4d4af',
      card: '#fffcf5',
      olive: '#a89868',
      oliveDark: '#8b7355',
      oliveDeep: '#6b5a42',
      moss: '#c4b896',
      blush: '#9a7060',
      line: '#d8ccb0',
      white: '#ffffff',
    },
    fonts: {
      display: 'Georgia',
      body: 'System',
      arabic: 'Georgia',
    },
  },
};

const LEGACY_THEME_IDS: Record<string, ThemeId> = {
  midnight: 'chromatic',
  creased: 'parchment',
};

export function normalizeThemeId(themeId: string | undefined): ThemeId {
  if (themeId && themeId in themes) {
    return themeId as ThemeId;
  }
  if (themeId && LEGACY_THEME_IDS[themeId]) {
    return LEGACY_THEME_IDS[themeId];
  }
  return 'garden';
}

export function getTheme(themeId: ThemeId) {
  return themes[normalizeThemeId(themeId)] ?? themes.garden;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
};

export const raisedShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.18,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 14 },
  elevation: 10,
};

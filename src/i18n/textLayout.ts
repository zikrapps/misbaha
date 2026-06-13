import { I18nManager, TextStyle, ViewStyle } from 'react-native';

import { Language } from '@/src/types/misbaha';

/**
 * Naskh carries diacritics above/below the baseline so it wants a little more
 * room than Latin, but nowhere near Nastaliq's vertical stacking. Latin
 * label/body text is comfortable around 1.3×.
 */
const URDU_LINE_HEIGHT_RATIO = 1.5;
const LATIN_LINE_HEIGHT_RATIO = 1.32;

/** When native RTL is still active from an older build, start-edge is physical right. */
function urduTextAlign(): TextStyle['textAlign'] {
  return I18nManager.isRTL ? 'left' : 'right';
}

/** Script-aware line height. Pass a custom Latin ratio for tight UI labels. */
export function lineHeightFor(
  language: Language,
  fontSize: number,
  latinRatio: number = LATIN_LINE_HEIGHT_RATIO,
): number {
  return Math.round(fontSize * (language === 'ur' ? URDU_LINE_HEIGHT_RATIO : latinRatio));
}

/**
 * Letter spacing and uppercasing both break connected Urdu ligatures, so strip
 * them for Urdu while leaving the English label styling untouched.
 */
export function labelDecoration(language: Language): TextStyle {
  return language === 'ur' ? { letterSpacing: 0, textTransform: 'none' } : {};
}

/** Italic for English prose labels; normal for Urdu. */
export function proseFontStyle(language: Language): TextStyle['fontStyle'] {
  return language === 'ur' ? 'normal' : 'italic';
}

/**
 * Mirror a horizontal row for Urdu when native RTL is off. Skip when
 * `I18nManager.isRTL` is true so rows are not double-flipped.
 */
export function mirrorRow(language: Language): ViewStyle {
  if (language === 'ur' && !I18nManager.isRTL) {
    return { flexDirection: 'row-reverse' };
  }
  return { flexDirection: 'row' };
}

/** Pin chips/badges to the reading-start edge (physical right in Urdu). */
export function alignStart(language: Language): ViewStyle {
  if (language === 'ur') {
    return { alignSelf: I18nManager.isRTL ? 'flex-start' : 'flex-end' };
  }
  return { alignSelf: 'flex-start' };
}

/** Right-aligned RTL for Arabic script regardless of UI language. */
export const arabicLayout: TextStyle = {
  width: '100%',
  textAlign: 'right',
  writingDirection: 'rtl',
};

/** Wrapper for Arabic lines inside mixed LTR rows/cards. */
export const arabicBlockLayout: ViewStyle = {
  alignSelf: 'stretch',
  width: '100%',
};

/**
 * Block prose (titles, descriptions, section labels).
 *
 * Text must span the full line width or `textAlign` has no effect — RN shrinks
 * Text to the glyph run by default even inside a full-width wrapper View.
 */
export function proseLayout(language: Language): TextStyle {
  if (language === 'ur') {
    return {
      alignSelf: 'stretch',
      width: '100%',
      textAlign: urduTextAlign(),
      writingDirection: 'rtl',
    };
  }
  return {
    alignSelf: 'stretch',
    width: '100%',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: 'ltr',
  };
}

/** Compact copy inside a horizontal row — never set width here. */
export function proseInlineLayout(language: Language): TextStyle {
  if (language === 'ur') {
    return { textAlign: urduTextAlign(), writingDirection: 'rtl' };
  }
  return { textAlign: I18nManager.isRTL ? 'right' : 'left', writingDirection: 'ltr' };
}

/** RTL writing direction while keeping horizontal center alignment. */
export function proseCenterLayout(language: Language): TextStyle {
  if (language === 'ur') {
    return {
      textAlign: 'center',
      writingDirection: 'rtl',
    };
  }
  return {
    textAlign: 'center',
    writingDirection: 'ltr',
  };
}

/** Scroll content should stretch children; no Yoga direction flip. */
export function proseContainerLayout(_language: Language): ViewStyle {
  return { alignSelf: 'stretch' };
}

/** @deprecated Use mirrorRow — direction style conflicts with textAlign. */
export function directionStyle(_language: Language): ViewStyle {
  return {};
}

/** Optional full-width wrapper; Text carries its own width via proseLayout. */
export function proseBlockLayout(_language: Language): ViewStyle {
  return { alignSelf: 'stretch', width: '100%' };
}

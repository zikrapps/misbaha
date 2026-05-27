import { TextStyle } from 'react-native';

import { Language } from '@/src/types/misbaha';

/** Italic for English prose labels; normal for Urdu. */
export function proseFontStyle(language: Language): TextStyle['fontStyle'] {
  return language === 'ur' ? 'normal' : 'italic';
}

/** Right-aligned RTL prose (Urdu translations, descriptions, previews). */
export function proseLayout(language: Language): TextStyle {
  if (language === 'ur') {
    return {
      alignSelf: 'stretch',
      textAlign: 'right',
      writingDirection: 'rtl',
    };
  }
  return {
    alignSelf: 'stretch',
    textAlign: 'left',
    writingDirection: 'ltr',
  };
}

import { PropsWithChildren } from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

import { spacing, useTheme } from '@/src/theme/theme';

type ProseTextProps = TextProps & {
  inline?: boolean;
  centered?: boolean;
  style?: StyleProp<TextStyle>;
};

/** Applies language-aware RTL/LTR text layout on every line of copy. */
export function ProseText({ inline, centered, style, ...rest }: ProseTextProps) {
  const theme = useTheme();
  const layout = centered ? theme.proseCenterLayout : inline ? theme.proseInlineLayout : theme.proseLayout;
  return <Text {...rest} style={[layout, style]} />;
}

export function SectionTitle({ children }: PropsWithChildren) {
  const theme = useTheme();
  const isUrdu = theme.language === 'ur';
  return (
    <ProseText
      style={[
        {
          color: theme.colors.muted,
          fontFamily: theme.labelFont,
          fontSize: theme.typo.caption,
          fontWeight: '700',
          letterSpacing: isUrdu ? 0 : 3,
          marginTop: spacing.sm,
          textTransform: isUrdu ? 'none' : 'uppercase',
        },
      ]}
    >
      {children}
    </ProseText>
  );
}

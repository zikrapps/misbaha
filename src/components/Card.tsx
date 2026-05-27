import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { radii, shadow, spacing, useTheme } from '@/src/theme/theme';

export function Card({
  children,
  style,
  pointerEvents,
}: PropsWithChildren<{ style?: ViewStyle; pointerEvents?: ViewProps['pointerEvents'] }>) {
  const theme = useTheme();
  return (
    <View
      pointerEvents={pointerEvents}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.line }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadow,
  },
});

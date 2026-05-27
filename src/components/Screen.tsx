import { router } from 'expo-router';
import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/src/components/IconButton';
import { proseFontStyle, proseLayout } from '@/src/i18n/textLayout';
import { spacing, useTheme } from '@/src/theme/theme';

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showSettingsAction?: boolean;
}>;

export function Screen({ title, subtitle, action, showSettingsAction, children }: ScreenProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo } = theme;
  const headerAction =
    action ?? (showSettingsAction ? <IconButton name="gear" onPress={() => router.push('/settings')} /> : undefined);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.ink, fontFamily: theme.fonts.display, fontSize: typo.title }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[
                  styles.subtitle,
                  proseLayout(theme.language),
                  {
                    color: colors.muted,
                    fontFamily: theme.labelFont,
                    fontSize: typo.subtitle,
                    fontStyle: theme.proseFontStyle,
                  },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
          {headerAction}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SectionTitle({ children }: PropsWithChildren) {
  const theme = useTheme();
  return (
    <Text
      style={[
        styles.section,
        { color: theme.colors.muted, fontFamily: theme.fonts.body, fontSize: theme.typo.caption },
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  title: {},
  subtitle: {
    fontStyle: 'italic',
    marginTop: -2,
  },
  section: {
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
});

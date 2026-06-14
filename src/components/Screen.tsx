import { router } from 'expo-router';
import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/src/components/IconButton';
import { ProseText, SectionTitle } from '@/src/components/ProseText';
import { scrollPastTabBar } from '@/src/theme/tabBar';
import { spacing, useTheme } from '@/src/theme/theme';

export { SectionTitle };

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showSettingsAction?: boolean;
}>;

export function Screen({ title, subtitle, action, showSettingsAction, children }: ScreenProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, language } = theme;
  const insets = useSafeAreaInsets();
  const headerAction =
    action ?? (showSettingsAction ? <IconButton name="gear" onPress={() => router.push('/settings')} /> : undefined);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: colors.cream }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: scrollPastTabBar(language, insets.bottom) },
          theme.proseContainerLayout,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, theme.mirrorRow]}>
          <View style={styles.headerCopy}>
            <ProseText
              style={[
                styles.title,
                {
                  color: colors.ink,
                  fontFamily: theme.labelFont,
                  fontSize: typo.title,
                  lineHeight: theme.labelLineHeight(typo.title, 1.1),
                },
              ]}
            >
              {title}
            </ProseText>
            {subtitle ? (
              <ProseText
                style={[
                  styles.subtitle,
                  {
                    color: colors.muted,
                    fontFamily: theme.labelFont,
                    fontSize: typo.subtitle,
                    fontStyle: theme.proseFontStyle,
                    lineHeight: theme.labelLineHeight(typo.subtitle, 1.3),
                  },
                ]}
              >
                {subtitle}
              </ProseText>
            ) : null}
          </View>
          {headerAction ? <View style={styles.headerAction}>{headerAction}</View> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerAction: {
    flexGrow: 0,
    flexShrink: 0,
  },
  title: {},
  subtitle: {
    marginTop: -2,
  },
});

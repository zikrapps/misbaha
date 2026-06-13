import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/src/components/Icon';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';

type PlanNewGoalRowProps = {
  onPress: () => void;
};

export function PlanNewGoalRow({ onPress }: PlanNewGoalRowProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseLayout, mirrorRow, alignStart, labelLineHeight } = theme;
  const language = useLanguage();
  const t = useT();
  const chevron = language === 'ur' ? '‹' : '›';

  return (
    <Pressable
      accessibilityLabel={t.goals.planNew}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.shell,
        { backgroundColor: colors.parchment, borderColor: colors.line },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.stripe, { backgroundColor: colors.olive }]} />
      <View style={[styles.row, mirrorRow]}>
        <View style={[styles.iconCircle, { backgroundColor: `${colors.olive}24` }]}>
          <Icon name="sprout" color={colors.oliveDark} size={22} strokeWidth={2} />
        </View>
        <View style={[styles.copy, alignStart]}>
          <Text
            style={[
              styles.title,
              proseLayout,
              {
                color: colors.ink,
                fontFamily: labelFont,
                fontSize: typo.body,
                lineHeight: labelLineHeight(typo.body, 1.25),
              },
            ]}
          >
            {t.goals.planNew}
          </Text>
          <Text
            style={[
              styles.hint,
              proseLayout,
              {
                color: colors.muted,
                fontFamily: labelFont,
                fontSize: typo.caption,
                lineHeight: labelLineHeight(typo.caption, 1.45),
              },
            ]}
          >
            {t.goals.planNewHint}
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.olive }]}>{chevron}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  stripe: {
    width: 5,
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontWeight: '700',
  },
  hint: {},
  chevron: {
    fontSize: 22,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.88,
  },
});

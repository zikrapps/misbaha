import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { MODE_ICON_ASSETS } from '@/src/features/insights/visualizationAssets';
import { useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { VisualizationMode } from '@/src/types/misbaha';

type VisualizationToggleProps = {
  value: VisualizationMode;
  onChange: (mode: VisualizationMode) => void;
};

const MODES: VisualizationMode[] = ['garden', 'earth', 'space'];

export function VisualizationToggle({ value, onChange }: VisualizationToggleProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const isUrdu = theme.language === 'ur';

  const labels: Record<VisualizationMode, string> = {
    garden: t.journey.modeGarden,
    earth: t.journey.modeEarth,
    space: t.journey.modeSpace,
  };

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: colors.cream,
          borderColor: colors.oliveDark,
        },
      ]}
    >
      {MODES.map((mode, index) => {
        const active = mode === value;
        return (
          <Pressable
            key={mode}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(mode)}
            style={[
              styles.segment,
              index > 0 && [styles.segmentDivider, { borderLeftColor: colors.oliveDark }],
              active && { backgroundColor: colors.oliveDeep },
            ]}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={MODE_ICON_ASSETS[mode][active ? 'active' : 'inactive']}
              style={styles.icon}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                theme.labelDecoration,
                isUrdu && styles.labelUrdu,
                {
                  color: active ? colors.white : colors.oliveDark,
                  fontFamily: theme.labelFont,
                },
              ]}
            >
              {labels[mode]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  segment: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.xs,
    paddingVertical: 11,
  },
  segmentDivider: {
    borderLeftWidth: 1,
  },
  icon: {
    height: 22,
    width: 22,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.6,
    textTransform: 'uppercase',
  },
  labelUrdu: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 22,
  },
});

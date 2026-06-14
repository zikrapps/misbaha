import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';

import { Screen } from '@/src/components/Screen';
import { moodEmotions, MoodEmotion, MoodEmotionId } from '@/src/data/moodEmotions';
import { GoalLibraryIcon } from '@/src/features/goals/goalLibraryIcons';
import { useT } from '@/src/i18n/strings';
import type { ThemeColors } from '@/src/theme/palette';
import { radii, shadow, spacing, useTheme } from '@/src/theme/theme';

type TilePalette = {
  gradFrom: string;
  gradTo: string;
  fg: string;
};

function shade(hex: string, percent: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const amt = Math.round(2.55 * percent);
  const clamp = (n: number) => Math.max(0, Math.min(255, n + amt));
  const next = ((clamp(r) << 16) | (clamp(g) << 8) | clamp(b)).toString(16).padStart(6, '0');
  return `#${next}`;
}

function emotionPalette(emotion: MoodEmotion, colors: ThemeColors): TilePalette {
  const base =
    emotion.palette === 'blush'
      ? colors.blush
      : emotion.palette === 'sand'
        ? colors.sand
        : emotion.palette === 'oliveDeep'
          ? colors.oliveDeep
          : colors.olive;
  const lightFg = emotion.palette === 'sand';
  return {
    gradFrom: shade(base, 10),
    gradTo: shade(base, -14),
    fg: lightFg ? colors.ink : colors.white,
  };
}

function MoodEmotionTile({
  emotion,
  styles,
}: {
  emotion: MoodEmotion;
  styles: ReturnType<typeof createStyles>;
}) {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const palette = emotionPalette(emotion, colors);
  const label = t.mood.emotions[emotion.id as MoodEmotionId];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push(`/mood/${emotion.id}`)}
      style={({ pressed }) => [styles.tilePress, pressed && styles.tilePressed]}
    >
      <View style={styles.tile}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id={`mood-${emotion.id}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={palette.gradFrom} />
              <Stop offset="1" stopColor={palette.gradTo} />
            </SvgLinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#mood-${emotion.id})`} rx={radii.lg} />
        </Svg>
        <View style={styles.tileBody}>
          <View style={[styles.iconWrap, { borderColor: `${palette.fg}33` }]}>
            <GoalLibraryIcon name={emotion.icon} color={palette.fg} size={26} />
          </View>
          <Text style={[styles.tileLabel, { color: palette.fg, fontFamily: theme.labelFont }]}>{label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function MoodIndexScreen() {
  const t = useT();
  const styles = useMemo(() => createStyles(), []);

  return (
    <Screen title={t.mood.title} subtitle={t.mood.subtitle} showSettingsAction>
      <View style={styles.grid}>
        {moodEmotions.map((emotion) => (
          <View key={emotion.id} style={styles.cell}>
            <MoodEmotionTile emotion={emotion} styles={styles} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const createStyles = () =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    cell: {
      width: '47.5%',
    },
    tilePress: {
      borderRadius: radii.lg,
      ...shadow,
    },
    tilePressed: {
      opacity: 0.92,
      transform: [{ scale: 0.98 }],
    },
    tile: {
      aspectRatio: 1,
      borderRadius: radii.lg,
      overflow: 'hidden',
    },
    tileBody: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      padding: spacing.md,
    },
    iconWrap: {
      alignItems: 'center',
      borderRadius: radii.pill,
      borderWidth: 1,
      height: 52,
      justifyContent: 'center',
      width: 52,
    },
    tileLabel: {
      fontSize: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
  });

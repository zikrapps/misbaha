import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { IconButton } from '@/src/components/IconButton';
import { duasById } from '@/src/data/duas';
import { countStateColor } from '@/src/features/duas/countStateColor';
import { DuaContentBody } from '@/src/features/duas/DuaContentBody';
import { DuaCountTapLayer } from '@/src/features/duas/DuaCountTapLayer';
import { remainingCount } from '@/src/features/duas/countRemaining';
import { DuaTargetProgress } from '@/src/features/duas/DuaTargetProgress';
import { isNightDetailHours, nightDetailPalette, NightDetailPalette } from '@/src/features/duas/nightDetail';
import { useDuaCountBump } from '@/src/features/duas/useDuaCountBump';
import { useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { tabBarHeight } from '@/src/theme/tabBar';
import { duaTitle } from '@/src/i18n/duaText';
import { arabicLayout, mirrorRow, proseCenterLayout, proseFontStyle, proseLayout } from '@/src/i18n/textLayout';
import { formatNumber } from '@/src/i18n/format';
import { useLanguage, useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { AppTypography, radii, shadow, spacing, useTheme } from '@/src/theme/theme';

export default function DuaDetailScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const language = useLanguage();
  const t = useT();
  const { labelFont, arabicFont } = theme;
  const isNight = isNightDetailHours();
  const night = isNight ? nightDetailPalette : null;
  const styles = useMemo(
    () => createStyles(colors, labelFont, arabicFont, theme.typo, language, night),
    [colors, labelFont, arabicFont, theme.typo, language, night],
  );
  const { duaId } = useLocalSearchParams<{ duaId: string }>();
  const dua = duaId ? duasById[duaId] : undefined;
  const count = useMisbahaStore((state) => (duaId ? state.counts[duaId] ?? 0 : 0));
  const tapWeight = useMisbahaStore((state) => state.tapWeight);
  const hapticsEnabled = useMisbahaStore((state) => state.hapticsEnabled);
  const incrementDua = useMisbahaStore((state) => state.incrementDua);
  const [completeAnimationKey, setCompleteAnimationKey] = useState(0);

  const onIncrement = useCallback(
    (times = 1) => {
      if (!duaId) return;
      incrementDua(duaId, tapWeight * times);
    },
    [duaId, incrementDua, tapWeight],
  );

  const { feedback, showFeedback, bumpAt, completeAt, onFeedbackFinish } = useDuaCountBump({
    hapticsEnabled,
    onIncrement,
  });

  const onHoldComplete = useCallback(
    (x: number, y: number) => {
      if (!duaId || !dua) return;
      const remaining = remainingCount(count, dua.target);
      if (remaining <= 0) return;
      incrementDua(duaId, remaining);
      setCompleteAnimationKey((value) => value + 1);
      completeAt(x, y);
    },
    [completeAt, count, dua, duaId, incrementDua],
  );

  const countGesture = useDuaCountGestures({ onBump: bumpAt, onHoldComplete }).gesture;

  if (!dua || !duaId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Icon name="back" color={colors.card} />
            <Text style={styles.backText}>{t.common.back}</Text>
          </Pressable>
        </View>
        <Text style={styles.notFound}>{t.duas.notFound}</Text>
      </SafeAreaView>
    );
  }

  const countColor = countStateColor(count, dua.target, colors, night);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style={isNight ? 'light' : 'dark'} />
      <View style={styles.motif}>
        <Svg width="100%" height="100%" viewBox="0 0 360 760">
          <G opacity={isNight ? 0.05 : 0.13} stroke={night?.motif ?? colors.oliveDark} strokeWidth={1.2} fill="none">
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => {
                const cx = 44 + col * 92 + (row % 2) * 46;
                const cy = 66 + row * 92;
                return (
                  <G key={`${row}-${col}`}>
                    <Path d={`M${cx} ${cy - 34} L${cx + 34} ${cy} L${cx} ${cy + 34} L${cx - 34} ${cy} Z`} />
                    <Path d={`M${cx - 24} ${cy - 24} L${cx + 24} ${cy + 24} M${cx + 24} ${cy - 24} L${cx - 24} ${cy + 24}`} />
                    <Circle cx={cx} cy={cy} r={10} />
                  </G>
                );
              }),
            )}
          </G>
        </Svg>
      </View>

      <DuaCountTapLayer
        gesture={countGesture}
        enabled
        feedbackKey={feedback.key}
        showFeedback={showFeedback}
        x={feedback.x}
        y={feedback.y}
        nightMode={isNight}
        onFeedbackFinish={onFeedbackFinish}
        tabBarInset={tabBarHeight(language)}
        style={styles.tapLayer}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Icon name="back" color={night?.controlInk ?? colors.card} size={18} />
            <Text style={styles.backText}>{t.common.back}</Text>
          </Pressable>
          {isNight ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/settings')}
              style={styles.settingsButton}
            >
              <Icon name="gear" color={night?.controlInk ?? colors.card} size={20} strokeWidth={2.35} />
            </Pressable>
          ) : (
            <IconButton name="gear" onPress={() => router.push('/settings')} />
          )}
        </View>

        <View style={styles.tapZone}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{duaTitle(dua, language)}</Text>
            <Text style={styles.subtitle}>{t.duas.expandedCountHint(tapWeight)}</Text>
          </View>

          <Card style={styles.duaCard}>
            <DuaContentBody
              dua={dua}
              language={language}
              labelFont={labelFont}
              colors={colors}
              night={night}
              linkMode="auto"
              textStyles={{
                arabic: styles.arabic,
                translation: styles.translation,
                meta: styles.meta,
                link: styles.link,
                linkRow: styles.linkRow,
              }}
            />
          </Card>

          <View style={[styles.counterBadge, { borderColor: countColor }]}>
            <Text style={[styles.count, { color: countColor }]}>{formatNumber(count)}</Text>
            <Text style={styles.target}>/ {formatNumber(dua.target)}</Text>
          </View>

          <DuaTargetProgress
            completeAnimationKey={completeAnimationKey}
            fillStyle={[styles.progressFill, { backgroundColor: colors.olive }]}
            progress={count}
            target={dua.target}
            trackStyle={[styles.progressTrack, { backgroundColor: night?.line ?? colors.line }]}
          />
        </View>
      </DuaCountTapLayer>
    </SafeAreaView>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  displayFont: string,
  arabicFont: string,
  typo: AppTypography,
  language: 'en' | 'ur',
  night: NightDetailPalette | null,
) {
  const isUrdu = language === 'ur';
  const ink = night?.muted ?? colors.ink;
  const muted = night?.faint ?? colors.muted;
  const cardBg = night?.card ?? colors.card;
  const cardBorder = night?.line ?? colors.line;
  const canvas = night?.canvas ?? colors.cream;

  return StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: canvas,
  },
  tapLayer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    zIndex: 8,
    ...mirrorRow(language),
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: night?.controlBg ?? colors.oliveDeep,
    borderColor: night?.line ?? colors.oliveDark,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...(night ? {} : shadow),
  },
  ...(night
    ? {
        settingsButton: {
          alignItems: 'center',
          backgroundColor: night.controlBg,
          borderColor: night.line,
          borderRadius: radii.pill,
          borderWidth: 1.5,
          height: 40,
          justifyContent: 'center',
          width: 40,
        },
      }
    : {}),
  backText: {
    color: night?.controlInk ?? colors.card,
    fontFamily: displayFont,
    fontWeight: '700',
  },
  notFound: {
    color: night?.muted ?? colors.ink,
    fontFamily: displayFont,
    fontSize: typo.subtitle,
    lineHeight: Math.round(typo.subtitle * 1.45),
    padding: spacing.lg,
  },
  tapZone: {
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
    overflow: 'visible',
    padding: spacing.lg,
    paddingBottom: 112,
    position: 'relative',
    pointerEvents: 'none',
  },
  motif: {
    bottom: 0,
    left: 0,
    opacity: night ? 0.35 : 0.9,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  titleBlock: {
    alignItems: 'center',
  },
  title: {
    color: ink,
    fontFamily: displayFont,
    fontSize: typo.title,
    lineHeight: Math.round(typo.title * 1.2),
    ...proseCenterLayout(language),
  },
  subtitle: {
    color: muted,
    fontFamily: displayFont,
    fontSize: typo.caption,
    lineHeight: Math.round(typo.caption * 1.45),
    fontStyle: proseFontStyle(language),
    marginTop: spacing.xs,
    ...proseCenterLayout(language),
  },
  duaCard: {
    backgroundColor: cardBg,
    borderColor: cardBorder,
    gap: spacing.md,
    ...(night ? { shadowOpacity: 0, elevation: 0 } : {}),
  },
  arabic: {
    color: night?.arabic ?? colors.ink,
    fontFamily: arabicFont,
    fontSize: typo.arabic + (isUrdu ? 4 : 10) + (night ? 2 : 0),
    lineHeight: Math.round((typo.arabic + (isUrdu ? 4 : 10) + (night ? 2 : 0)) * 1.55),
    ...arabicLayout,
  },
  translation: {
    color: muted,
    fontFamily: displayFont,
    fontSize: isUrdu ? typo.body + 2 : typo.body,
    fontStyle: proseFontStyle(language),
    lineHeight: Math.round((isUrdu ? typo.body + 2 : typo.body) * 1.55),
    ...proseLayout(language),
  },
  meta: {
    color: muted,
    fontSize: typo.small,
    lineHeight: Math.round(typo.small * 1.45),
    ...proseLayout(language),
  },
  linkRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  link: {
    color: night?.muted ?? colors.olive,
    fontSize: typo.small,
    fontWeight: '700',
    lineHeight: Math.round(typo.small * 1.45),
  },
  counterBadge: {
    alignItems: 'baseline',
    alignSelf: 'center',
    backgroundColor: cardBg,
    borderColor: night?.countBorder ?? colors.line,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    ...(night ? {} : shadow),
  },
  count: {
    fontFamily: displayFont,
    fontSize: Math.round(46 * (isUrdu ? 1.15 : 1)),
  },
  target: {
    color: muted,
    fontFamily: displayFont,
    fontSize: typo.subtitle,
  },
  progressTrack: {
    alignSelf: 'stretch',
    borderRadius: radii.pill,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: 8,
  },
});
}

import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';

import { IconButton } from '@/src/components/IconButton';
import { duas, prayerOrder } from '@/src/data/duas';
import { DuaCounterRow } from '@/src/features/duas/DuaCounterRow';
import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';
import { useDuaCountBump } from '@/src/features/duas/useDuaCountBump';
import { useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { prayerLabel } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { useLanguage, useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { scrollPastTabBar, tabBarHeight } from '@/src/theme/tabBar';
import { radii, shadow, spacing, useTheme } from '@/src/theme/theme';
import type { ThemeColors } from '@/src/theme/palette';
import { DuaRecord } from '@/src/types/misbaha';
import { sumRecordValues } from '@/src/utils/sumRecord';

type CategoryId =
  | 'quranic'
  | 'prayer'
  | 'morning'
  | 'night'
  | 'salah'
  | 'relief'
  | 'remembrance'
  | 'heart'
  | 'daily'
  | 'ramadan';

// Quranic Duas pinned to the top-left of the grid per product spec.
const CATEGORY_ORDER: CategoryId[] = [
  'quranic',
  'prayer',
  'morning',
  'night',
  'salah',
  'relief',
  'remembrance',
  'heart',
  'daily',
  'ramadan',
];

// Solid-glyph motif per category. Rendered as a silhouette and tinted to the
// tile's foreground colour so the same artwork stays legible on every tile.
const MOTIFS: Record<CategoryId, ImageSourcePropType> = {
  quranic: require('@/assets/motifs/glyph-quran.png'),
  prayer: require('@/assets/motifs/glyph-prayer-mat.png'),
  morning: require('@/assets/motifs/glyph-sunrise.png'),
  night: require('@/assets/motifs/glyph-moon-stars.png'),
  salah: require('@/assets/motifs/glyph-prayer-mat.png'),
  relief: require('@/assets/motifs/glyph-sajdah.png'),
  remembrance: require('@/assets/motifs/glyph-dua.png'),
  heart: require('@/assets/motifs/glyph-sunrise.png'),
  daily: require('@/assets/motifs/glyph-tasbih.png'),
  ramadan: require('@/assets/motifs/glyph-lantern.png'),
};

type TilePalette = {
  gradFrom: string;
  gradTo: string;
  fg: string;
  meta: string;
  chipBorder: string;
};

/** Lighten or darken a hex color by a small percentage (positive = lighter). */
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

function tilePalette(id: CategoryId, colors: ThemeColors): TilePalette {
  switch (id) {
    case 'quranic':
      return {
        gradFrom: shade(colors.olive, 10),
        gradTo: shade(colors.olive, -14),
        fg: colors.white,
        meta: colors.cream,
        chipBorder: 'rgba(255,255,255,0.35)',
      };
    case 'prayer':
      return {
        gradFrom: shade(colors.blush, 10),
        gradTo: shade(colors.blush, -14),
        fg: colors.white,
        meta: colors.cream,
        chipBorder: 'rgba(255,255,255,0.35)',
      };
    case 'morning':
      return {
        gradFrom: shade(colors.sand, 8),
        gradTo: shade(colors.sand, -10),
        fg: colors.ink,
        meta: colors.oliveDark,
        chipBorder: 'rgba(55,44,36,0.22)',
      };
    case 'night':
      return {
        gradFrom: shade(colors.oliveDeep, 12),
        gradTo: shade(colors.oliveDeep, -10),
        fg: colors.cream,
        meta: colors.sand,
        chipBorder: 'rgba(247,240,223,0.35)',
      };
    case 'salah':
      return {
        gradFrom: shade(colors.moss, 12),
        gradTo: shade(colors.moss, -16),
        fg: colors.white,
        meta: colors.cream,
        chipBorder: 'rgba(255,255,255,0.35)',
      };
    case 'relief':
      return {
        gradFrom: shade(colors.oliveDark, 14),
        gradTo: shade(colors.oliveDark, -10),
        fg: colors.cream,
        meta: colors.sand,
        chipBorder: 'rgba(247,240,223,0.35)',
      };
    case 'remembrance':
      return {
        gradFrom: shade(colors.olive, -6),
        gradTo: shade(colors.olive, -28),
        fg: colors.white,
        meta: colors.cream,
        chipBorder: 'rgba(255,255,255,0.35)',
      };
    case 'heart':
      return {
        gradFrom: shade(colors.blush, -4),
        gradTo: shade(colors.blush, -26),
        fg: colors.white,
        meta: colors.cream,
        chipBorder: 'rgba(255,255,255,0.35)',
      };
    case 'daily':
      return {
        gradFrom: shade(colors.sand, -4),
        gradTo: shade(colors.sand, -22),
        fg: colors.ink,
        meta: colors.oliveDark,
        chipBorder: 'rgba(55,44,36,0.22)',
      };
    case 'ramadan':
      return {
        gradFrom: shade(colors.oliveDeep, 22),
        gradTo: shade(colors.oliveDeep, 2),
        fg: colors.cream,
        meta: colors.sand,
        chipBorder: 'rgba(247,240,223,0.35)',
      };
  }
}

export default function DuasScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const language = useLanguage();
  const { typo, labelFont, proseLayout, proseInlineLayout, proseContainerLayout, mirrorRow, alignStart } = theme;
  const insets = useSafeAreaInsets();
  const isUrdu = language === 'ur';
  const counts = useMisbahaStore((state) => state.counts);
  const tapWeight = useMisbahaStore((state) => state.tapWeight);
  const hapticsEnabled = useMisbahaStore((state) => state.hapticsEnabled);
  const incrementDua = useMisbahaStore((state) => state.incrementDua);
  const resetDua = useMisbahaStore((state) => state.resetDua);
  const total = sumRecordValues(counts);

  const [expandedCategory, setExpandedCategory] = useState<CategoryId | null>(null);
  const [expandedDuaId, setExpandedDuaId] = useState<string | null>(null);
  const countingActive = expandedDuaId != null;
  const scrollRef = useRef<ScrollView>(null);

  const categoryLabels: Record<CategoryId, string> = useMemo(
    () => ({
      quranic: t.duas.quranicDuas,
      prayer: t.duas.fivePrayers,
      morning: t.duas.morningAdhkar,
      night: t.duas.nightAdhkar,
      salah: t.duas.salahDuas,
      relief: t.duas.reliefDuas,
      remembrance: t.duas.remembranceDuas,
      heart: t.duas.heartDuas,
      daily: t.duas.dailyDuas,
      ramadan: t.duas.ramadanDuas,
    }),
    [t],
  );

  const categoryDuas: Record<CategoryId, DuaRecord[]> = useMemo(
    () =>
      CATEGORY_ORDER.reduce(
        (acc, id) => {
          acc[id] = duas.filter((d) => d.category === id);
          return acc;
        },
        {} as Record<CategoryId, DuaRecord[]>,
      ),
    [],
  );

  const onIncrement = useCallback(
    (times = 1) => {
      if (!expandedDuaId) return;
      incrementDua(expandedDuaId, tapWeight * times);
    },
    [expandedDuaId, incrementDua, tapWeight],
  );

  const { feedback, showFeedback, bumpAt, onFeedbackFinish } = useDuaCountBump({
    hapticsEnabled,
    onIncrement,
  });

  const { gesture: countGesture, resetTapWindow } = useDuaCountGestures({
    onBump: bumpAt,
    enabled: countingActive,
    doubleTapOnly: true,
  });

  const listGesture = useMemo(
    () => Gesture.Simultaneous(Gesture.Native(), countGesture),
    [countGesture],
  );

  const toggleCategory = useCallback((id: CategoryId) => {
    setExpandedCategory((current) => {
      const next = current === id ? null : id;
      // When opening a category, surface its dua list right away instead of
      // leaving the user scrolled down at a lower tile.
      if (next) {
        requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: true }));
      }
      return next;
    });
    // Switching/closing categories always exits per-dua counting mode.
    setExpandedDuaId(null);
  }, []);

  const toggleDuaExpanded = useCallback((duaId: string) => {
    setExpandedDuaId((current) => (current === duaId ? null : duaId));
  }, []);

  const renderRow = (dua: DuaRecord) => (
    <DuaCounterRow
      key={dua.id}
      count={counts[dua.id] ?? 0}
      countingActive={countingActive}
      dua={dua}
      expanded={expandedDuaId === dua.id}
      tapWeight={tapWeight}
      onIncrement={() => incrementDua(dua.id, tapWeight)}
      onOpen={() => router.push(`/duas/${dua.id}`)}
      onReset={() => resetDua(dua.id)}
      onToggleExpanded={() => toggleDuaExpanded(dua.id)}
    />
  );

  const passThrough = countingActive ? 'none' : 'auto';
  const passContainer = countingActive ? 'box-none' : 'auto';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: colors.cream,
        },
        root: {
          flex: 1,
        },
        scroll: {
          flex: 1,
        },
        content: {
          padding: spacing.lg,
          paddingBottom: scrollPastTabBar(language, insets.bottom),
          gap: spacing.lg,
          ...proseContainerLayout,
        },
        header: {
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingTop: spacing.lg,
          ...mirrorRow,
        },
        headerCopy: {
          flex: 1,
          minWidth: 0,
        },
        title: {
          color: colors.ink,
          fontFamily: labelFont,
          fontSize: typo.title,
          ...proseLayout,
        },
        subtitle: {
          color: colors.muted,
          fontFamily: labelFont,
          fontSize: typo.subtitle,
          fontStyle: theme.proseFontStyle,
          marginTop: -2,
          ...proseLayout,
        },
        totalRow: {
          alignItems: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.line,
          gap: spacing.sm,
          paddingBottom: spacing.md,
          ...mirrorRow,
        },
        totalLabel: {
          color: colors.muted,
          flex: 1,
          fontSize: typo.caption,
          fontWeight: '700',
          letterSpacing: language === 'ur' ? 0 : 3,
          textTransform: language === 'ur' ? 'none' : 'uppercase',
          ...proseLayout,
        },
        totalValue: {
          color: colors.ink,
          fontFamily: labelFont,
          fontSize: typo.subtitle,
          ...proseInlineLayout,
        },
        grid: {
          gap: spacing.md,
        },
        gridRow: {
          flexDirection: 'row',
          gap: spacing.md,
        },
        tile: {
          borderRadius: radii.lg,
          flex: 1,
          minHeight: isUrdu ? 196 : 158,
          overflow: 'hidden',
          ...shadow,
        },
        tileActive: {
          shadowOpacity: 0.18,
          shadowRadius: 20,
        },
        tileGraphic: {
          bottom: spacing.sm,
          height: 84,
          opacity: 0.16,
          position: 'absolute',
          right: spacing.sm,
          width: 84,
        },
        tileInner: {
          flex: 1,
          gap: spacing.sm,
          justifyContent: 'space-between',
          padding: spacing.md,
        },
        tileTopGroup: {
          gap: spacing.xs,
        },
        tileChip: {
          borderRadius: radii.pill,
          borderWidth: StyleSheet.hairlineWidth,
          paddingHorizontal: spacing.sm,
          paddingVertical: 3,
          ...alignStart,
        },
        tileChipText: {
          fontFamily: labelFont,
          fontSize: typo.micro,
          fontWeight: '600',
          ...proseLayout,
        },
        tileEyebrow: {
          fontFamily: labelFont,
          fontSize: typo.micro,
          fontWeight: '700',
          letterSpacing: language === 'ur' ? 0 : 1.4,
          marginTop: spacing.xs,
          textTransform: language === 'ur' ? 'none' : 'uppercase',
          ...proseLayout,
        },
        tileTitle: {
          fontFamily: labelFont,
          fontSize: typo.title - 6,
          fontWeight: '400',
          lineHeight: Math.round((typo.title - 6) * (language === 'ur' ? 1.4 : 1.12)),
          ...proseLayout,
        },
        tileDesc: {
          fontFamily: labelFont,
          fontSize: typo.caption,
          lineHeight: Math.round(typo.caption * (isUrdu ? 1.45 : 1.32)),
          opacity: 0.9,
          paddingBottom: isUrdu ? spacing.xs : 0,
          paddingRight: 64,
          ...proseLayout,
        },
        listSection: {
          gap: spacing.md,
          paddingTop: spacing.sm,
        },
        listHeader: {
          alignItems: 'center',
          gap: spacing.sm,
          ...mirrorRow,
        },
        listHeaderAccent: {
          borderRadius: radii.pill,
          height: 18,
          width: 4,
        },
        listHeaderTitle: {
          color: colors.ink,
          fontFamily: labelFont,
          fontSize: typo.subtitle + 2,
          fontWeight: '700',
          ...proseLayout,
        },
        subGroup: {
          gap: spacing.sm,
        },
        subGroupTitle: {
          color: colors.oliveDark,
          fontFamily: labelFont,
          fontSize: typo.subtitle,
          ...proseLayout,
        },
        feedback: {
          ...StyleSheet.absoluteFillObject,
          bottom: tabBarHeight(language),
        },
      }),
    [colors, alignStart, insets.bottom, isUrdu, labelFont, language, mirrorRow, proseContainerLayout, proseInlineLayout, proseLayout, theme.proseFontStyle, typo],
  );

  const renderTile = (id: CategoryId) => {
    const palette = tilePalette(id, colors);
    const expanded = expandedCategory === id;
    const gradientId = `tile-grad-${id}`;
    const duaCount = categoryDuas[id].length;
    // While counting, non-expanded tiles step out of the touch path so the
    // screen-wide double-tap counter receives gestures anywhere on screen.
    // The open tile stays tappable so it can be collapsed in one tap even
    // while a dua inside it is expanded/counting.
    const tileDisabled = countingActive && !expanded;
    return (
      <Pressable
        accessibilityLabel={categoryLabels[id]}
        accessibilityRole="button"
        accessibilityState={{ expanded, disabled: tileDisabled }}
        disabled={tileDisabled}
        key={id}
        onPress={() => toggleCategory(id)}
        style={({ pressed }) => [
          styles.tile,
          expanded && styles.tileActive,
          pressed ? { opacity: 0.92 } : null,
          tileDisabled ? { pointerEvents: 'none' } : null,
        ]}
      >
        <Svg height="100%" pointerEvents="none" style={StyleSheet.absoluteFill} width="100%">
          <Defs>
            <SvgLinearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
              <Stop offset="0" stopColor={palette.gradFrom} />
              <Stop offset="1" stopColor={palette.gradTo} />
            </SvgLinearGradient>
          </Defs>
          <Rect fill={`url(#${gradientId})`} height="100%" width="100%" />
        </Svg>

        <Image
          pointerEvents="none"
          resizeMode="contain"
          source={MOTIFS[id]}
          style={styles.tileGraphic}
          tintColor={palette.fg}
        />

        <View style={styles.tileInner}>
          <View style={styles.tileTopGroup}>
            <View style={[styles.tileChip, { borderColor: palette.chipBorder }]}>
              <Text style={[styles.tileChipText, { color: palette.fg }]}>
                {t.duas.tileDuaCount(duaCount)}
              </Text>
            </View>
            <View>
              <Text numberOfLines={1} style={[styles.tileEyebrow, { color: palette.meta }]}>
                {t.duas.tileEyebrows[id]}
              </Text>
              <Text numberOfLines={isUrdu ? 3 : 2} style={[styles.tileTitle, { color: palette.fg }]}>
                {categoryLabels[id]}
              </Text>
            </View>
          </View>
          <View>
            <Text numberOfLines={2} style={[styles.tileDesc, { color: palette.meta }]}>
              {t.duas.tileDescriptions[id]}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderCategoryBody = (id: CategoryId) => {
    if (id === 'prayer') {
      const general = categoryDuas.prayer.filter((d) => !d.prayer);
      return (
        <View pointerEvents={passContainer} style={styles.listSection}>
          {general.length > 0 ? (
            <View pointerEvents={passContainer} style={styles.subGroup}>
              <Text pointerEvents={passThrough} style={styles.subGroupTitle}>
                {t.duas.allPrayers}
              </Text>
              {general.map(renderRow)}
            </View>
          ) : null}
          {prayerOrder.map((prayer) => {
            const rows = categoryDuas.prayer.filter((d) => d.prayer === prayer);
            if (rows.length === 0) return null;
            return (
              <View key={prayer} pointerEvents={passContainer} style={styles.subGroup}>
                <Text pointerEvents={passThrough} style={styles.subGroupTitle}>
                  {prayerLabel(prayer, language)}
                </Text>
                {rows.map(renderRow)}
              </View>
            );
          })}
        </View>
      );
    }
    return (
      <View pointerEvents={passContainer} style={styles.listSection}>
        {categoryDuas[id].map(renderRow)}
      </View>
    );
  };

  const listContent = (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={countingActive ? resetTapWindow : undefined}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      <View pointerEvents={passContainer} style={styles.header}>
        <View pointerEvents={passThrough} style={styles.headerCopy}>
          <Text style={styles.title}>{t.duas.title}</Text>
          <Text style={styles.subtitle}>{t.duas.subtitle}</Text>
        </View>
        <IconButton name="gear" onPress={() => router.push('/settings')} />
      </View>

      <View pointerEvents={passThrough} style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t.duas.totalTaps}</Text>
        <Text style={styles.totalValue}>{formatNumber(total)}</Text>
      </View>

      <View pointerEvents={passContainer} style={styles.grid}>
        {expandedCategory ? (
          // Collapse the grid to just the open tile so its duas sit directly
          // below it and the remaining tiles step out of the way.
          <View pointerEvents={passContainer} style={styles.gridRow}>
            {renderTile(expandedCategory)}
            <View style={{ flex: 1 }} />
          </View>
        ) : (
          Array.from({ length: Math.ceil(CATEGORY_ORDER.length / 2) }, (_, rowIndex) => {
            const left = CATEGORY_ORDER[rowIndex * 2];
            const right = CATEGORY_ORDER[rowIndex * 2 + 1];
            return (
              <View key={left} pointerEvents={passContainer} style={styles.gridRow}>
                {renderTile(left)}
                {right ? renderTile(right) : <View style={{ flex: 1 }} />}
              </View>
            );
          })
        )}
      </View>

      {expandedCategory ? (
        <View pointerEvents={passContainer} style={styles.listSection}>
          <View pointerEvents={passThrough} style={styles.listHeader}>
            <View
              style={[
                styles.listHeaderAccent,
                { backgroundColor: tilePalette(expandedCategory, colors).gradFrom },
              ]}
            />
            <Text style={styles.listHeaderTitle}>{categoryLabels[expandedCategory]}</Text>
          </View>
          {renderCategoryBody(expandedCategory)}
        </View>
      ) : null}
    </ScrollView>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.root}>
        {countingActive ? (
          <GestureDetector gesture={listGesture}>{listContent}</GestureDetector>
        ) : (
          listContent
        )}

        {countingActive ? (
          <View pointerEvents="none" style={styles.feedback}>
            <DuaTapFeedback
              feedbackKey={feedback.key}
              visible={showFeedback}
              x={feedback.x}
              y={feedback.y}
              onFinish={onFeedbackFinish}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

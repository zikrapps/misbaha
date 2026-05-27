import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';

import { Icon, type IconName } from '@/src/components/Icon';
import { IconButton } from '@/src/components/IconButton';
import { duas, prayerOrder } from '@/src/data/duas';
import { DuaCounterRow } from '@/src/features/duas/DuaCounterRow';
import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';
import { useDuaCountBump } from '@/src/features/duas/useDuaCountBump';
import { TAB_BAR_HEIGHT, useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { prayerLabel } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { useLanguage, useT } from '@/src/i18n/strings';
import { proseLayout } from '@/src/i18n/textLayout';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, shadow, spacing, useTheme } from '@/src/theme/theme';
import type { ThemeColors } from '@/src/theme/palette';
import { DuaRecord } from '@/src/types/misbaha';
import { sumRecordValues } from '@/src/utils/sumRecord';

type CategoryId = 'quranic' | 'prayer' | 'morning' | 'night';

// Quranic Duas pinned to the top-left of the grid per product spec.
const CATEGORY_ORDER: CategoryId[] = ['quranic', 'prayer', 'morning', 'night'];

type TilePalette = {
  gradFrom: string;
  gradTo: string;
  fg: string;
  meta: string;
  motif: string;
  iconName: IconName;
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
        gradFrom: colors.olive,
        gradTo: shade(colors.olive, 8),
        fg: colors.white,
        meta: colors.cream,
        motif: colors.white,
        iconName: 'quran',
      };
    case 'prayer':
      return {
        gradFrom: colors.blush,
        gradTo: shade(colors.blush, 8),
        fg: colors.white,
        meta: colors.cream,
        motif: colors.white,
        iconName: 'prayerMat',
      };
    case 'morning':
      return {
        gradFrom: shade(colors.sand, 6),
        gradTo: colors.sand,
        fg: colors.ink,
        meta: colors.oliveDark,
        motif: colors.oliveDark,
        iconName: 'sunrise',
      };
    case 'night':
      return {
        gradFrom: shade(colors.oliveDeep, 14),
        gradTo: colors.oliveDeep,
        fg: colors.cream,
        meta: colors.sand,
        motif: colors.sand,
        iconName: 'moonStars',
      };
  }
}

export default function DuasScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const language = useLanguage();
  const { typo, labelFont } = theme;
  const counts = useMisbahaStore((state) => state.counts);
  const tapWeight = useMisbahaStore((state) => state.tapWeight);
  const hapticsEnabled = useMisbahaStore((state) => state.hapticsEnabled);
  const incrementDua = useMisbahaStore((state) => state.incrementDua);
  const resetDua = useMisbahaStore((state) => state.resetDua);
  const total = sumRecordValues(counts);

  const [expandedCategory, setExpandedCategory] = useState<CategoryId | null>(null);
  const [expandedDuaId, setExpandedDuaId] = useState<string | null>(null);
  const countingActive = expandedDuaId != null;

  const categoryLabels: Record<CategoryId, string> = useMemo(
    () => ({
      quranic: t.duas.quranicDuas,
      prayer: t.duas.fivePrayers,
      morning: t.duas.morningAdhkar,
      night: t.duas.nightAdhkar,
    }),
    [t],
  );

  const categoryDuas: Record<CategoryId, DuaRecord[]> = useMemo(
    () => ({
      quranic: duas.filter((d) => d.category === 'quranic'),
      prayer: duas.filter((d) => d.category === 'prayer'),
      morning: duas.filter((d) => d.category === 'morning'),
      night: duas.filter((d) => d.category === 'night'),
    }),
    [],
  );

  const onIncrement = useCallback(() => {
    if (!expandedDuaId) return;
    incrementDua(expandedDuaId, tapWeight);
  }, [expandedDuaId, incrementDua, tapWeight]);

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
    setExpandedCategory((current) => (current === id ? null : id));
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
          paddingBottom: 120,
          gap: spacing.lg,
        },
        header: {
          alignItems: 'flex-start',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: spacing.lg,
        },
        title: {
          color: colors.ink,
          fontFamily: theme.fonts.display,
          fontSize: typo.title,
        },
        subtitle: {
          color: colors.muted,
          fontFamily: labelFont,
          fontSize: typo.subtitle,
          fontStyle: theme.proseFontStyle,
          marginTop: -2,
        },
        totalRow: {
          alignItems: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.line,
          flexDirection: 'row',
          gap: spacing.sm,
          paddingBottom: spacing.md,
        },
        totalLabel: {
          color: colors.muted,
          fontSize: typo.caption,
          fontWeight: '700',
          letterSpacing: 3,
          textTransform: 'uppercase',
        },
        totalValue: {
          color: colors.ink,
          fontFamily: labelFont,
          fontSize: typo.subtitle,
        },
        grid: {
          gap: spacing.md,
        },
        gridRow: {
          flexDirection: 'row',
          gap: spacing.md,
        },
        tile: {
          aspectRatio: 0.82,
          borderRadius: radii.lg,
          flex: 1,
          overflow: 'hidden',
          ...shadow,
        },
        tileActive: {
          shadowOpacity: 0.18,
          shadowRadius: 20,
        },
        tileGraphic: {
          bottom: -14,
          opacity: 0.34,
          position: 'absolute',
          right: -14,
        },
        tileInner: {
          flex: 1,
          justifyContent: 'space-between',
          padding: spacing.lg,
        },
        tileEyebrow: {
          fontFamily: labelFont,
          fontSize: typo.micro,
          fontWeight: '700',
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        },
        tileTitle: {
          fontFamily: theme.fonts.display,
          fontSize: typo.title - 4,
          fontWeight: '700',
          lineHeight: Math.round((typo.title - 4) * 1.05),
        },
        tileChevron: {
          alignSelf: 'flex-end',
        },
        listSection: {
          gap: spacing.md,
          paddingTop: spacing.sm,
        },
        listHeader: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        listHeaderAccent: {
          borderRadius: radii.pill,
          height: 18,
          width: 4,
        },
        listHeaderTitle: {
          color: colors.ink,
          fontFamily: theme.fonts.display,
          fontSize: typo.subtitle + 2,
          fontWeight: '700',
        },
        subGroup: {
          gap: spacing.sm,
        },
        subGroupTitle: {
          color: colors.oliveDark,
          fontFamily: labelFont,
          fontSize: typo.subtitle,
        },
        feedback: {
          ...StyleSheet.absoluteFillObject,
          bottom: TAB_BAR_HEIGHT,
        },
      }),
    [colors, labelFont, theme.fonts.display, theme.proseFontStyle, typo],
  );

  const renderTile = (id: CategoryId) => {
    const palette = tilePalette(id, colors);
    const expanded = expandedCategory === id;
    // While counting, tiles step out of the touch path so the screen-wide
    // double-tap counter receives gestures anywhere on screen. User exits
    // counting from the dua row's chevron in the list below.
    return (
      <Pressable
        accessibilityLabel={categoryLabels[id]}
        accessibilityRole="button"
        accessibilityState={{ expanded, disabled: countingActive }}
        disabled={countingActive}
        key={id}
        onPress={() => toggleCategory(id)}
        style={({ pressed }) => [
          styles.tile,
          expanded && styles.tileActive,
          pressed ? { opacity: 0.92 } : null,
          countingActive ? { pointerEvents: 'none' } : null,
        ]}
      >
        <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
          <Defs>
            <SvgLinearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor={palette.gradFrom} />
              <Stop offset="1" stopColor={palette.gradTo} />
            </SvgLinearGradient>
          </Defs>
          <Rect fill={`url(#${gradientId})`} height="100%" width="100%" />
        </Svg>

        <View pointerEvents="none" style={styles.tileGraphic}>
          <Icon color={palette.motif} name={palette.iconName} size={132} strokeWidth={1.2} />
        </View>

        <View style={styles.tileInner}>
          <Text numberOfLines={1} style={[styles.tileEyebrow, { color: palette.meta }]}>
            {t.duas.tileEyebrows[id]}
          </Text>
          <Text numberOfLines={2} style={[styles.tileTitle, { color: palette.fg }]}>
            {categoryLabels[id]}
          </Text>
          <View style={[styles.tileChevron, { transform: [{ rotate: expanded ? '180deg' : '0deg' }] }]}>
            <Icon color={palette.fg} name="chevronDown" size={20} strokeWidth={2.4} />
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
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={countingActive ? resetTapWindow : undefined}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      <View pointerEvents={passContainer} style={styles.header}>
        <View pointerEvents={passThrough}>
          <Text style={styles.title}>{t.duas.title}</Text>
          <Text style={[styles.subtitle, proseLayout(language)]}>{t.duas.subtitle}</Text>
        </View>
        <IconButton name="gear" onPress={() => router.push('/settings')} />
      </View>

      <View pointerEvents={passThrough} style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t.duas.totalTaps}</Text>
        <Text style={styles.totalValue}>{formatNumber(total)}</Text>
      </View>

      <View pointerEvents={passContainer} style={styles.grid}>
        <View pointerEvents={passContainer} style={styles.gridRow}>
          {renderTile(CATEGORY_ORDER[0])}
          {renderTile(CATEGORY_ORDER[1])}
        </View>
        <View pointerEvents={passContainer} style={styles.gridRow}>
          {renderTile(CATEGORY_ORDER[2])}
          {renderTile(CATEGORY_ORDER[3])}
        </View>
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
    <SafeAreaView style={styles.safe}>
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

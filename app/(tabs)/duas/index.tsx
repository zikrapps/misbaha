import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/src/components/IconButton';
import { SectionTitle } from '@/src/components/Screen';
import { duas, prayerOrder } from '@/src/data/duas';
import { DuaCounterRow } from '@/src/features/duas/DuaCounterRow';
import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';
import { useDuaCountBump } from '@/src/features/duas/useDuaCountBump';
import { TAB_BAR_HEIGHT, useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { prayerLabel } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { proseLayout } from '@/src/i18n/textLayout';
import { useLanguage, useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { spacing, useTheme } from '@/src/theme/theme';
import { sumRecordValues } from '@/src/utils/sumRecord';

export default function DuasScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const language = useLanguage();
  const { typo } = theme;
  const { labelFont } = theme;
  const counts = useMisbahaStore((state) => state.counts);
  const tapWeight = useMisbahaStore((state) => state.tapWeight);
  const hapticsEnabled = useMisbahaStore((state) => state.hapticsEnabled);
  const incrementDua = useMisbahaStore((state) => state.incrementDua);
  const resetDua = useMisbahaStore((state) => state.resetDua);
  const total = sumRecordValues(counts);
  const [expandedDuaId, setExpandedDuaId] = useState<string | null>(null);
  const countingActive = expandedDuaId != null;

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

  const toggleExpanded = useCallback((duaId: string) => {
    setExpandedDuaId((current) => (current === duaId ? null : duaId));
  }, []);

  const renderRow = (dua: (typeof duas)[number]) => (
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
      onToggleExpanded={() => toggleExpanded(dua.id)}
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
        group: {
          gap: spacing.md,
        },
        groupTitle: {
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

      <View pointerEvents={passThrough}>
        <SectionTitle>{t.duas.fivePrayers}</SectionTitle>
      </View>
      <View pointerEvents={passContainer} style={styles.group}>
        <Text pointerEvents={passThrough} style={styles.groupTitle}>
          {t.duas.allPrayers}
        </Text>
        {duas.filter((dua) => dua.category === 'prayer' && !dua.prayer).map(renderRow)}
      </View>

      {prayerOrder.map((prayer) => (
        <View key={prayer} pointerEvents={passContainer} style={styles.group}>
          <Text pointerEvents={passThrough} style={styles.groupTitle}>
            {prayerLabel(prayer, language)}
          </Text>
          {duas.filter((dua) => dua.category === 'prayer' && dua.prayer === prayer).map(renderRow)}
        </View>
      ))}

      <View pointerEvents={passThrough}>
        <SectionTitle>{t.duas.morningAdhkar}</SectionTitle>
      </View>
      <View pointerEvents={passContainer}>{duas.filter((dua) => dua.category === 'morning').map(renderRow)}</View>

      <View pointerEvents={passThrough}>
        <SectionTitle>{t.duas.nightAdhkar}</SectionTitle>
      </View>
      <View pointerEvents={passContainer}>{duas.filter((dua) => dua.category === 'night').map(renderRow)}</View>

      <View pointerEvents={passThrough}>
        <SectionTitle>{t.duas.quranicDuas}</SectionTitle>
      </View>
      <View pointerEvents={passContainer}>{duas.filter((dua) => dua.category === 'quranic').map(renderRow)}</View>
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

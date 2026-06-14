import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { resolveTimelineDua, truncateArabic } from '@/src/data/dayTimelineResolve';
import {
  dayTimelineActiveSlot,
  dayTimelineAutoSupplicationId,
  dayTimelinePrimaryBySlot,
  dayTimelineProgress,
  dayTimelineReferenceShort,
  dayTimelineSkyPhase,
  dayTimelineSlotOrder,
  dayTimelineSupplicationById,
} from '@/src/data/dayTimelineSupplications';
import { DayTimelineDuaSheet } from '@/src/features/today/DayTimelineDuaSheet';
import { dayTimelineSlotLabel, dayTimelineSupplicationTitle } from '@/src/i18n/dayTimelineText';
import { duaArabic } from '@/src/i18n/duaText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { arabicLayout } from '@/src/i18n/textLayout';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { DayTimelineSlotId } from '@/src/types/misbaha';

const SKY_SIZE = 44;

const skyGradients: Record<
  ReturnType<typeof dayTimelineSkyPhase>,
  { top: string; bottom: string; accent: string }
> = {
  dawn: { top: '#f7c978', bottom: '#6b8fc7', accent: '#f5e6a8' },
  day: { top: '#87ceeb', bottom: '#4a90c2', accent: '#ffe066' },
  afternoon: { top: '#e8a857', bottom: '#5b7fa8', accent: '#ffd166' },
  sunset: { top: '#e07a5f', bottom: '#3d5a80', accent: '#f4a261' },
  night: { top: '#1a2744', bottom: '#0d1526', accent: '#c9d6ff' },
};

function SkyCircle({ phase }: { phase: ReturnType<typeof dayTimelineSkyPhase> }) {
  const palette = skyGradients[phase];
  const isNight = phase === 'night' || phase === 'sunset';

  return (
    <View style={styles.skyWrap}>
      <Svg width={SKY_SIZE} height={SKY_SIZE} viewBox={`0 0 ${SKY_SIZE} ${SKY_SIZE}`}>
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={palette.top} />
            <Stop offset="1" stopColor={palette.bottom} />
          </LinearGradient>
        </Defs>
        <Circle cx={SKY_SIZE / 2} cy={SKY_SIZE / 2} r={SKY_SIZE / 2 - 1} fill="url(#skyGrad)" />
        {isNight ? (
          <Circle cx={SKY_SIZE * 0.62} cy={SKY_SIZE * 0.38} r={7} fill={palette.accent} opacity={0.92} />
        ) : (
          <Circle cx={SKY_SIZE * 0.68} cy={SKY_SIZE * 0.32} r={8} fill={palette.accent} />
        )}
      </Svg>
      <View style={styles.skyIcon}>
        {isNight ? (
          <Icon name="moonStars" color={palette.accent} size={16} strokeWidth={1.8} />
        ) : (
          <Icon name="sunrise" color={palette.accent} size={16} strokeWidth={1.8} />
        )}
      </View>
    </View>
  );
}

export function DayTimelineCard() {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseLayout, labelDecoration, mirrorRow } = theme;
  const t = useT();
  const language = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const [slotOverride, setSlotOverride] = useState<DayTimelineSlotId | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const autoSlot = dayTimelineActiveSlot(now);
  const activeSlot = slotOverride ?? autoSlot;
  const supplicationId = slotOverride
    ? dayTimelinePrimaryBySlot[slotOverride]
    : dayTimelineAutoSupplicationId(now);
  const supplication = dayTimelineSupplicationById(supplicationId);
  const progress = dayTimelineProgress(now);
  const skyPhase = dayTimelineSkyPhase(activeSlot);

  const dua = useMemo(() => (supplication ? resolveTimelineDua(supplication) : undefined), [supplication]);
  const arabicPreview = dua ? truncateArabic(duaArabic(dua, language)) : '';
  const title = supplication ? dayTimelineSupplicationTitle(supplication.id, language) : '';
  const reference = supplication
    ? dayTimelineReferenceShort(supplication.quranReference ?? supplication.hadithReference)
    : '';

  const openSheet = () => {
    if (supplication) setSheetOpen(true);
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={[styles.headerRow, mirrorRow]}>
          <View style={styles.headerCopy}>
            <Text
              style={[
                styles.eyebrow,
                proseLayout,
                labelDecoration,
                { color: colors.oliveDark, fontSize: typo.micro },
              ]}
            >
              {t.dayTimeline.timeOfDay}
            </Text>
            {!slotOverride ? (
              <Text style={[styles.followHint, proseLayout, { color: colors.muted, fontSize: typo.micro }]}>
                {t.dayTimeline.followsClock}
              </Text>
            ) : null}
          </View>
          <SkyCircle phase={skyPhase} />
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.chipsRow}
          showsHorizontalScrollIndicator={false}
        >
          {dayTimelineSlotOrder.map((slot) => {
            const selected = slot === activeSlot;
            return (
              <Pressable
                key={slot}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSlotOverride((current) => (current === slot ? null : slot))}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? colors.oliveDeep : colors.cream,
                    borderColor: selected ? colors.oliveDark : colors.line,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: selected ? colors.white : colors.oliveDeep,
                      fontFamily: labelFont,
                      fontSize: typo.micro,
                    },
                  ]}
                >
                  {dayTimelineSlotLabel(slot, language)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { backgroundColor: colors.oliveDeep, width: `${Math.round(progress * 100)}%` }]} />
          <View
            style={[
              styles.progressMarker,
              { backgroundColor: colors.card, borderColor: colors.oliveDeep, left: `${Math.round(progress * 100)}%` },
            ]}
          />
        </View>

        {supplication ? (
          <Pressable
            accessibilityRole="button"
            accessibilityHint={t.dayTimeline.tapHint}
            onPress={openSheet}
            style={[styles.duaPill, { backgroundColor: colors.sand, borderColor: colors.line }]}
          >
            <Text
              style={[styles.duaArabic, arabicLayout, { color: colors.ink, fontSize: typo.small + 2 }]}
              numberOfLines={1}
            >
              {arabicPreview}
            </Text>
            <View style={[styles.duaMeta, mirrorRow]}>
              <Text
                style={[styles.duaTitle, proseLayout, { color: colors.oliveDeep, fontFamily: labelFont, fontSize: typo.micro }]}
                numberOfLines={1}
              >
                {title}
              </Text>
              {reference ? (
                <View style={[styles.refBadge, { backgroundColor: colors.card, borderColor: colors.line }]}>
                  <Text style={[styles.refText, { color: colors.oliveDark, fontFamily: labelFont, fontSize: 9 }]}>
                    {reference}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        ) : null}
      </Card>

      <DayTimelineDuaSheet supplication={sheetOpen && supplication ? supplication : null} onClose={() => setSheetOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  followHint: {
    marginTop: 2,
  },
  skyWrap: {
    height: SKY_SIZE,
    width: SKY_SIZE,
  },
  skyIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    gap: spacing.xs,
    paddingVertical: 2,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipText: {
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: 'rgba(33, 58, 24, 0.12)',
    borderRadius: radii.pill,
    height: 6,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    borderRadius: radii.pill,
    height: 6,
  },
  progressMarker: {
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 12,
    marginLeft: -6,
    marginTop: -3,
    position: 'absolute',
    top: 0,
    width: 12,
  },
  duaPill: {
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 4,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  duaArabic: {
    lineHeight: 22,
  },
  duaMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  duaTitle: {
    flex: 1,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  refBadge: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
  },
  refText: {
    fontWeight: '800',
  },
});

import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { resolveTimelineDua, truncateArabic } from '@/src/data/dayTimelineResolve';
import {
  dayTimelineActiveSlot,
  dayTimelineAutoSupplicationId,
  dayTimelinePrimaryBySlot,
  dayTimelineProgress,
  dayTimelineReferenceShort,
  dayTimelineSlotOrder,
  dayTimelineSupplicationById,
} from '@/src/data/dayTimelineSupplications';
import { DayTimelineDuaSheet } from '@/src/features/today/DayTimelineDuaSheet';
import { DayTimelineSlotIcon } from '@/src/features/today/DayTimelineSlotIcon';
import { dayTimelineSlotLabel, dayTimelineSupplicationTitle } from '@/src/i18n/dayTimelineText';
import { duaArabic } from '@/src/i18n/duaText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { arabicLayout } from '@/src/i18n/textLayout';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { DayTimelineSlotId } from '@/src/types/misbaha';

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

        <View style={styles.chipsRow}>
          {dayTimelineSlotOrder.map((slot) => {
            const selected = slot === activeSlot;
            return (
              <Pressable
                key={slot}
                accessibilityRole="button"
                accessibilityLabel={dayTimelineSlotLabel(slot, language)}
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
                <DayTimelineSlotIcon slot={slot} color={selected ? colors.white : colors.oliveDeep} size={26} />
              </Pressable>
            );
          })}
        </View>

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
  headerCopy: {
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
  chipsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  chip: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    overflow: 'visible',
    width: 44,
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

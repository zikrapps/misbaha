import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { dailyGoal } from '@/src/data/dailyGoal';
import { duasById } from '@/src/data/duas';
import { LEGAL_ENTITY } from '@/src/constants/legal';
import { exportGoalPdf, computeGoalPdfLayout, goalPdfDayColumns, goalPdfPreviewArabicSize, PdfOrientation } from '@/src/features/goals/exportGoalPdf';
import { getGoalTodayState } from '@/src/features/goals/goalProgress';
import { GoalTodayDuaCard } from '@/src/features/goals/GoalTodayDuaCard';
import { SwipeBack } from '@/src/features/goals/SwipeBack';
import { duaArabic, duaPlanLabel, duaPreview, duaTranslation } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { goalDescription, goalTitle } from '@/src/i18n/goalText';
import { getStrings, useLanguage, useT } from '@/src/i18n/strings';
import { arabicLayout, lineHeightFor, mirrorRow, proseCenterLayout, proseInlineLayout, proseLayout } from '@/src/i18n/textLayout';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { GoalPlan, Language } from '@/src/types/misbaha';
import { openExternalUrl } from '@/src/utils/openExternalUrl';

const emptyProgress: Record<number, number> = {};
const APP_ICON = require('@/assets/icon.png');
const ZIKR_MARK = require('@/assets/brand/zikr-mark-primary.png');

function isSahihReference(reference?: string) {
  return Boolean(reference?.includes('Sahih Muslim') || reference?.includes('Sahih al-Bukhari'));
}

type GoalDetailStyles = ReturnType<typeof createGoalDetailStyles>;

function DuaPreviewRow({
  day,
  arabicSize,
  styles,
}: {
  day: GoalPlan['days'][number];
  arabicSize: number;
  styles: GoalDetailStyles;
}) {
  const dua = duasById[day.duaId];

  return (
    <View style={styles.previewRow}>
      <Text style={styles.previewDay} numberOfLines={1}>
        {day.day}
      </Text>
      <View style={styles.previewArabicWrap}>
        <Text style={[styles.previewArabic, { fontSize: arabicSize, lineHeight: Math.round(arabicSize * 1.45) }]}>
          {dua?.arabic ?? day.duaId}
        </Text>
      </View>
      <Text style={styles.previewTarget}>×{day.target}</Text>
      <View style={styles.previewCheck} />
    </View>
  );
}

function PdfSheetPreview({
  goal,
  orientation,
  styles,
  language,
}: {
  goal: GoalPlan;
  orientation: PdfOrientation;
  styles: GoalDetailStyles;
  language: Language;
}) {
  const t = getStrings(language);
  const layout = computeGoalPdfLayout(goal, orientation);
  const columns = goalPdfDayColumns(goal.days, orientation, layout.columnCount);
  const arabicSize = goalPdfPreviewArabicSize(goal, orientation);
  const useMultiColumn = columns.length > 1;

  return (
    <View style={styles.previewSheet}>
      <View style={styles.previewTopbar}>
        <View style={styles.previewTopbarLeft}>
          <Image source={APP_ICON} style={styles.previewTopbarIcon} />
          <View style={styles.previewTopbarCopy}>
            <Text style={styles.previewTopbarTitle} numberOfLines={2}>
              {goalTitle(goal, language)}
            </Text>
            <Text style={styles.previewTopbarMeta} numberOfLines={2}>
              {goalDescription(goal, language)}
            </Text>
          </View>
        </View>
        <Text style={styles.previewTopbarDays}>
          {formatNumber(goal.duration)} {t.common.days}
        </Text>
      </View>
      <View style={[styles.previewContent, useMultiColumn && styles.previewContentColumns]}>
        {columns.map((column, columnIndex) => (
          <View key={`preview-col-${columnIndex}`} style={styles.previewColumn}>
            {column.map((day) => (
              <DuaPreviewRow key={day.day} day={day} arabicSize={arabicSize} styles={styles} />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.previewFooter}>
        <Image source={ZIKR_MARK} style={styles.previewZikrMark} />
        <Text style={styles.previewFooterText}>Powered by {LEGAL_ENTITY}</Text>
      </View>
    </View>
  );
}

function PdfPreview({
  goal,
  orientation,
  styles,
  language,
}: {
  goal: GoalPlan;
  orientation: PdfOrientation;
  styles: GoalDetailStyles;
  language: Language;
}) {
  const t = getStrings(language);

  return (
    <Card style={styles.previewCard}>
      <View style={styles.previewHeader}>
        <View style={styles.previewHeaderCopy}>
          <Text style={styles.previewLabel}>{t.goalDetail.pdfPreview}</Text>
          <Text style={styles.previewTitle}>
            {orientation === 'portrait' ? t.goalDetail.a4Portrait : t.goalDetail.landscape118}
          </Text>
        </View>
        <Text style={styles.previewMeta}>{formatNumber(goal.duration)} {t.common.days}</Text>
      </View>
      <PdfSheetPreview goal={goal} orientation={orientation} styles={styles} language={language} />
    </Card>
  );
}

export default function GoalDetailScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const language = useLanguage();
  const t = useT();
  const { labelFont, arabicFont } = theme;
  const styles = useMemo(
    () => createGoalDetailStyles(colors, labelFont, arabicFont, language),
    [colors, labelFont, arabicFont, language],
  );
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const [previewOrientation, setPreviewOrientation] = useState<PdfOrientation | null>(null);
  const storedGoal = useMisbahaStore((state) => state.goals.find((item) => item.id === goalId));
  const goal = goalId === 'daily-goal' ? dailyGoal : storedGoal;
  const progress = useMisbahaStore((state) => (goalId ? state.goalProgress[goalId] : undefined));
  const tapWeight = useMisbahaStore((state) => state.tapWeight);
  const incrementGoalDay = useMisbahaStore((state) => state.incrementGoalDay);
  const incrementDua = useMisbahaStore((state) => state.incrementDua);
  const goToGoals = useCallback(() => {
    router.replace('/goals');
  }, []);

  if (!goal) {
    return (
      <SwipeBack onBack={goToGoals}>
        <Screen title={t.goalDetail.notFound}>
          <Pressable onPress={goToGoals} style={styles.primary}>
            <Text style={styles.primaryText}>{t.goalDetail.backToGoals}</Text>
          </Pressable>
        </Screen>
      </SwipeBack>
    );
  }

  const goalProgress = progress ?? emptyProgress;
  const { today, todayDua, todayProgress } = getGoalTodayState(goal, goalProgress);
  if (!today) {
    return (
      <SwipeBack onBack={goToGoals}>
        <Screen title={t.goalDetail.notFound}>
          <Pressable onPress={goToGoals} style={styles.primary}>
            <Text style={styles.primaryText}>{t.goalDetail.backToGoals}</Text>
          </Pressable>
        </Screen>
      </SwipeBack>
    );
  }
  const references = goal.days
    .map((day) => duasById[day.duaId])
    .filter((dua) => isSahihReference(dua?.hadithReference) && dua?.hadithUrl)
    .filter((dua, index, all) => all.findIndex((item) => item?.hadithUrl === dua?.hadithUrl) === index);
  const isCustomGoal = goal.id.startsWith('custom-');

  const countToday = () => {
    incrementGoalDay(goal.id, today.day, tapWeight);
    incrementDua(today.duaId, tapWeight);
  };

  const share = async (orientation: PdfOrientation) => {
    try {
      const result = await exportGoalPdf(goal, orientation, language);
      if (!result.shared) {
        Alert.alert(t.goalDetail.pdfShareUnavailableTitle, t.goalDetail.pdfShareUnavailableBody);
      }
    } catch {
      Alert.alert(t.goalDetail.exportFailedTitle, t.goalDetail.exportFailedBody);
    }
  };

  const findCloseReference = () => {
    const query = encodeURIComponent(`${goal.title} ${todayDua?.transliteration ?? ''}`);
    void openExternalUrl(`https://sunnah.com/search?q=${query}`, t.common.linkUnavailable);
  };

  return (
    <SwipeBack onBack={goToGoals}>
      <Screen title={goalTitle(goal, language)} subtitle={t.goalDetail.dayOf(today.day, goal.duration)}>
        <Pressable onPress={goToGoals} style={styles.done}>
          <Icon name="back" color={colors.card} size={18} strokeWidth={2.4} />
          <Text style={styles.doneText}>{t.common.done}</Text>
        </Pressable>

      <Text style={styles.description}>{goalDescription(goal, language)}</Text>

      {todayDua ? (
        <GoalTodayDuaCard
          dua={todayDua}
          language={language}
          onCount={countToday}
          openCounterLabel={t.goalDetail.openCounter(tapWeight)}
          styles={{
            todayCard: styles.todayCard,
            overline: styles.overline,
            arabic: styles.arabic,
            translation: styles.translation,
            meta: styles.meta,
            link: styles.link,
            linkRow: styles.linkRow,
            progressLine: styles.progressLine,
            progressNumber: styles.progressNumber,
            target: styles.target,
            track: styles.track,
            progressFill: styles.progressFill,
            countHint: styles.countHint,
            primary: styles.primary,
            primaryText: styles.primaryText,
          }}
          tapWeight={tapWeight}
          todayProgress={todayProgress}
          todayTarget={today.target}
        />
      ) : null}

      <SectionTitle>{t.goalDetail.thePlan}</SectionTitle>
      <Card style={styles.plan}>
        {goal.days.map((day) => {
          const dua = duasById[day.duaId];
          const done = (goalProgress[day.day] ?? 0) >= day.target;
          return (
            <View key={day.day} style={styles.planRow}>
              <View style={[styles.check, done && styles.checkDone]}>
                {done ? (
                  <Icon name="check" color={colors.card} size={14} />
                ) : (
                  <Text style={styles.checkText}>{day.day}</Text>
                )}
              </View>
              <View style={styles.planCopy}>
                <Text style={styles.planTitle}>{dua ? duaPlanLabel(dua, language) : ''}</Text>
                <Text style={styles.planTranslation}>{dua ? duaTranslation(dua, language) : ''}</Text>
                <Text style={styles.planArabic}>{dua ? duaArabic(dua, language) : ''}</Text>
              </View>
              <Text style={styles.planTarget}>×{day.target}</Text>
            </View>
          );
        })}
      </Card>

      <SectionTitle>{t.goalDetail.references}</SectionTitle>
      <Card style={styles.references}>
        {references.length > 0 ? (
          references.map((dua) => (
            <Pressable
              key={dua.id}
              onPress={() => dua.hadithUrl && openExternalUrl(dua.hadithUrl, t.common.linkUnavailable)}
              style={styles.referenceRow}
            >
              <Icon name="link" color={colors.oliveDark} size={17} />
              <View style={styles.referenceCopy}>
                <Text style={styles.referenceTitle}>{dua.hadithReference}</Text>
                <Text style={styles.referenceMeta}>{dua ? duaPlanLabel(dua, language) : ''}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.referenceMeta}>{t.goalDetail.noReferences}</Text>
        )}
        {isCustomGoal ? (
          <Pressable onPress={findCloseReference} style={styles.findReferenceButton}>
            <Icon name="open" color={colors.card} size={16} />
            <Text style={styles.findReferenceText}>{t.goalDetail.findOnSunnah}</Text>
          </Pressable>
        ) : null}
      </Card>

      <SectionTitle>{t.goalDetail.export}</SectionTitle>
      <View style={styles.exportRow}>
        <Pressable style={styles.exportButton} onPress={() => setPreviewOrientation('portrait')}>
          <Icon name="export" color={colors.oliveDark} size={18} />
          <Text style={styles.exportText}>{t.goalDetail.previewPortrait}</Text>
        </Pressable>
        <Pressable style={styles.exportButton} onPress={() => setPreviewOrientation('landscape')}>
          <Icon name="export" color={colors.oliveDark} size={18} />
          <Text style={styles.exportText}>{t.goalDetail.previewLandscape}</Text>
        </Pressable>
      </View>
      {previewOrientation ? (
        <>
          <PdfPreview goal={goal} orientation={previewOrientation} styles={styles} language={language} />
          <View style={styles.previewActions}>
            <Pressable style={styles.cancelPreviewButton} onPress={() => setPreviewOrientation(null)}>
              <Text style={styles.cancelPreviewText}>{t.goalDetail.cancelPreview}</Text>
            </Pressable>
            <Pressable style={styles.generateButton} onPress={() => share(previewOrientation)}>
              <Icon name="export" color={colors.card} size={17} />
              <Text style={styles.generateText}>{t.goalDetail.generatePdf}</Text>
            </Pressable>
          </View>
        </>
      ) : null}
      </Screen>
    </SwipeBack>
  );
}

function createGoalDetailStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  displayFont: string,
  arabicFont: string,
  language: Language,
) {
  const isUrdu = language === 'ur';
  const block = proseLayout(language);
  const inline = proseInlineLayout(language);
  const centered = proseCenterLayout(language);
  return StyleSheet.create({
  done: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.oliveDeep,
    borderRadius: radii.md,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...mirrorRow(language),
  },
  doneText: {
    color: colors.card,
    fontFamily: displayFont,
    fontSize: 15,
    fontWeight: '700',
    ...inline,
  },
  description: {
    color: colors.muted,
    fontFamily: displayFont,
    fontStyle: isUrdu ? 'normal' : 'italic',
    lineHeight: isUrdu ? 26 : undefined,
    ...block,
  },
  todayCard: {
    gap: spacing.md,
    overflow: 'visible',
  },
  overline: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: isUrdu ? 0 : 2,
    textTransform: isUrdu ? 'none' : 'uppercase',
    ...block,
  },
  arabic: {
    color: colors.ink,
    fontFamily: arabicFont,
    fontSize: 32,
    lineHeight: 48,
    ...arabicLayout,
  },
  translation: {
    color: colors.muted,
    fontFamily: displayFont,
    fontSize: isUrdu ? 17 : undefined,
    fontStyle: isUrdu ? 'normal' : 'italic',
    lineHeight: isUrdu ? 26 : undefined,
    ...block,
  },
  meta: {
    color: colors.muted,
    fontFamily: displayFont,
    fontSize: 13,
    lineHeight: 18,
    ...block,
  },
  linkRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  link: {
    color: colors.olive,
    fontFamily: displayFont,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  progressLine: {
    alignItems: 'center',
    gap: spacing.sm,
    ...mirrorRow(language),
  },
  progressNumber: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 30,
    ...inline,
  },
  target: {
    color: colors.muted,
    fontSize: 16,
    ...inline,
  },
  track: {
    backgroundColor: colors.line,
    borderRadius: radii.pill,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.olive,
    height: 8,
  },
  countHint: {
    color: colors.muted,
    fontFamily: displayFont,
    fontSize: 11,
    lineHeight: 16,
    ...block,
  },
  primary: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.olive,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  primaryText: {
    color: colors.card,
    fontFamily: displayFont,
    fontSize: 16,
    ...centered,
  },
  plan: {
    gap: spacing.sm,
  },
  planRow: {
    alignItems: 'flex-start',
    gap: spacing.md,
    ...mirrorRow(language),
  },
  check: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radii.pill,
    height: 28,
    justifyContent: 'center',
    width: 34,
  },
  checkDone: {
    backgroundColor: colors.olive,
  },
  checkText: {
    color: colors.oliveDark,
    fontSize: 12,
    fontWeight: '800',
  },
  planCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  planTitle: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: isUrdu ? 14 : undefined,
    fontWeight: isUrdu ? '700' : undefined,
    ...block,
  },
  planTranslation: {
    color: colors.muted,
    fontFamily: displayFont,
    fontSize: 13,
    fontStyle: isUrdu ? 'normal' : 'italic',
    lineHeight: lineHeightFor(language, 13, 1.45),
    ...block,
  },
  planArabic: {
    color: colors.muted,
    fontFamily: arabicFont,
    fontSize: 13,
    ...arabicLayout,
  },
  planTarget: {
    color: colors.muted,
    fontWeight: '800',
    ...inline,
  },
  references: {
    gap: spacing.md,
  },
  referenceRow: {
    alignItems: 'flex-start',
    gap: spacing.md,
    ...mirrorRow(language),
  },
  referenceCopy: {
    flex: 1,
    minWidth: 0,
  },
  referenceTitle: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 15,
    ...block,
  },
  referenceMeta: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    ...block,
  },
  findReferenceButton: {
    alignItems: 'center',
    backgroundColor: colors.oliveDeep,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.md,
  },
  findReferenceText: {
    color: colors.card,
    fontWeight: '800',
  },
  previewCard: {
    gap: spacing.md,
  },
  previewHeader: {
    alignItems: 'flex-start',
    gap: spacing.sm,
    justifyContent: 'space-between',
    ...mirrorRow(language),
  },
  previewHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  previewLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  previewTitle: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 18,
    marginTop: spacing.xs,
  },
  previewMeta: {
    color: colors.oliveDark,
    flexShrink: 0,
    fontWeight: '800',
  },
  previewSheet: {
    backgroundColor: '#faf8f3',
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  previewTopbar: {
    alignItems: 'center',
    backgroundColor: '#4a6741',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  previewTopbarLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  previewTopbarIcon: {
    borderRadius: 8,
    flexShrink: 0,
    height: 32,
    width: 32,
  },
  previewTopbarCopy: {
    flex: 1,
    minWidth: 0,
  },
  previewTopbarTitle: {
    color: '#faf8f3',
    fontFamily: displayFont,
    fontSize: 15,
    fontWeight: '700',
  },
  previewTopbarMeta: {
    color: '#faf8f3',
    fontSize: 10,
    marginTop: 2,
    opacity: 0.88,
  },
  previewTopbarDays: {
    color: '#faf8f3',
    flexShrink: 0,
    fontSize: 11,
    fontWeight: '700',
  },
  previewContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  previewContentColumns: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewColumn: {
    flex: 1,
    minWidth: 0,
  },
  previewRow: {
    alignItems: 'flex-start',
    borderBottomColor: '#e4ddd0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    width: '100%',
  },
  previewDay: {
    color: '#4a6741',
    flexShrink: 0,
    fontSize: 11,
    fontWeight: '800',
    minWidth: 26,
    textAlign: 'center',
    width: 26,
  },
  previewArabicWrap: {
    flex: 1,
    minWidth: 0,
  },
  previewArabic: {
    color: colors.ink,
    fontFamily: arabicFont,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  previewTarget: {
    color: '#6b6b6b',
    flexShrink: 0,
    fontSize: 10,
    fontWeight: '700',
    paddingTop: 2,
  },
  previewCheck: {
    borderColor: '#4a6741',
    borderRadius: 2,
    borderWidth: 1,
    flexShrink: 0,
    height: 12,
    marginTop: 3,
    width: 12,
  },
  previewFooter: {
    alignItems: 'center',
    borderTopColor: '#e4ddd0',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  previewZikrMark: {
    height: 12,
    width: 12,
  },
  previewFooterText: {
    color: '#8a8278',
    fontSize: 10,
  },
  previewActions: {
    gap: spacing.md,
    ...mirrorRow(language),
  },
  cancelPreviewButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  cancelPreviewText: {
    color: colors.muted,
    fontWeight: '800',
  },
  generateButton: {
    alignItems: 'center',
    backgroundColor: colors.oliveDeep,
    borderRadius: radii.md,
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.md,
    ...mirrorRow(language),
  },
  generateText: {
    color: colors.card,
    fontWeight: '800',
  },
  exportRow: {
    gap: spacing.md,
    ...mirrorRow(language),
  },
  exportButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  exportText: {
    color: colors.oliveDark,
    fontWeight: '800',
    ...centered,
  },
});
}

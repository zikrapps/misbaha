import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { dailyGoal } from '@/src/data/dailyGoal';
import { duasById } from '@/src/data/duas';
import { exportGoalPdf, PdfOrientation } from '@/src/features/goals/exportGoalPdf';
import { getGoalTodayState } from '@/src/features/goals/goalProgress';
import { GoalTodayDuaCard } from '@/src/features/goals/GoalTodayDuaCard';
import { SwipeBack } from '@/src/features/goals/SwipeBack';
import { duaPreview, duaTranslation } from '@/src/i18n/duaText';
import { formatNumber } from '@/src/i18n/format';
import { goalDescription, goalTitle } from '@/src/i18n/goalText';
import { getStrings, useLanguage, useT } from '@/src/i18n/strings';
import { proseLayout } from '@/src/i18n/textLayout';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { GoalPlan, Language } from '@/src/types/misbaha';
import { openExternalUrl } from '@/src/utils/openExternalUrl';

const emptyProgress: Record<number, number> = {};

function isSahihReference(reference?: string) {
  return Boolean(reference?.includes('Sahih Muslim') || reference?.includes('Sahih al-Bukhari'));
}

type GoalDetailStyles = ReturnType<typeof createGoalDetailStyles>;

function PrintedPageImage({
  goal,
  orientation,
  colors,
  styles,
  language,
}: {
  goal: GoalPlan;
  orientation: PdfOrientation;
  colors: ReturnType<typeof useTheme>['colors'];
  styles: GoalDetailStyles;
  language: Language;
}) {
  const t = getStrings(language);
  const isLandscape = orientation === 'landscape';
  const width = isLandscape ? 320 : 230;
  const height = isLandscape ? 226 : 320;
  const columns = isLandscape ? 15 : 10;
  const cellGap = 3;
  const startX = 18;
  const startY = 72;
  const cellWidth = (width - startX * 2 - cellGap * (columns - 1)) / columns;
  const cellHeight = isLandscape ? 16 : 18;
  const calendarRows = Math.ceil(goal.days.length / columns);
  const listStartY = startY + calendarRows * (cellHeight + cellGap) + 14;
  const rowHeight = isLandscape ? 18 : 20;
  const availableRows = Math.max(3, Math.floor((height - listStartY - 22) / rowHeight));
  const visibleList = goal.days.slice(0, availableRows);
  const remainingList = goal.days.length - visibleList.length;

  return (
    <View style={styles.printImageWrap}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect x={2} y={2} width={width - 4} height={height - 4} rx={8} fill={colors.parchment} stroke={colors.line} strokeWidth={2} />
        <Circle cx={width - 34} cy={34} r={14} fill="none" stroke={colors.olive} strokeWidth={4} opacity={0.55} />
        <SvgText x={18} y={30} fill={colors.ink} fontSize={16} fontFamily="Georgia" fontWeight="700">
          {goalTitle(goal, language).slice(0, 24)}
        </SvgText>
        <SvgText x={18} y={48} fill={colors.muted} fontSize={8}>
          {t.goalDetail.calendarPlan} • {orientation}
        </SvgText>
        <Line x1={18} x2={width - 18} y1={62} y2={62} stroke={colors.line} />
        {goal.days.map((day, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          const x = startX + col * (cellWidth + cellGap);
          const y = startY + row * (cellHeight + cellGap);
          return (
            <G key={day.day}>
              <Rect x={x} y={y} width={cellWidth} height={cellHeight} rx={5} fill={colors.card} stroke={colors.line} />
              <SvgText x={x + cellWidth / 2} y={y + (isLandscape ? 11 : 12)} fill={colors.oliveDark} fontSize={isLandscape ? 7 : 8} fontWeight="700" textAnchor="middle">
                {day.day}
              </SvgText>
            </G>
          );
        })}
        <SvgText x={18} y={listStartY} fill={colors.ink} fontSize={9} fontWeight="700">
          {t.goalDetail.duasInPlan}
        </SvgText>
        {visibleList.map((day, index) => {
          const dua = duasById[day.duaId];
          const y = listStartY + 18 + index * rowHeight;
          return (
            <G key={`list-${day.day}`}>
              <Circle cx={24} cy={y - 4} r={5} fill={colors.olive} />
              <SvgText x={22.2} y={y - 1.5} fill={colors.card} fontSize={5.5} fontWeight="700">
                {day.day}
              </SvgText>
              <SvgText x={34} y={y - 6} fill={colors.ink} fontSize={7.5} fontWeight="700">
                {(dua ? duaPreview(dua, language) : day.duaId).slice(0, isLandscape ? 34 : 24)}
              </SvgText>
              <SvgText x={width - 18} y={y - 6} fill={colors.oliveDark} fontSize={7.5} fontWeight="700" textAnchor="end">
                x{day.target}
              </SvgText>
              <SvgText x={34} y={y + 4} fill={colors.muted} fontSize={6}>
                {(dua ? duaTranslation(dua, language) : '').slice(0, isLandscape ? 52 : 34)}
              </SvgText>
            </G>
          );
        })}
        {remainingList > 0 ? (
          <SvgText x={width / 2} y={height - 16} fill={colors.muted} fontSize={7} fontStyle="italic" textAnchor="middle">
            {t.goalDetail.moreDuas(remainingList)}
          </SvgText>
        ) : null}
      </Svg>
    </View>
  );
}

function PdfPreview({
  goal,
  orientation,
  styles,
  colors,
  language,
}: {
  goal: GoalPlan;
  orientation: PdfOrientation;
  styles: GoalDetailStyles;
  colors: ReturnType<typeof useTheme>['colors'];
  language: Language;
}) {
  const t = getStrings(language);
  const previewDays = goal.days.slice(0, orientation === 'portrait' ? 8 : 5);
  const remaining = goal.days.length - previewDays.length;

  return (
    <Card style={styles.previewCard}>
      <View style={styles.previewHeader}>
        <View>
          <Text style={styles.previewLabel}>{t.goalDetail.pdfPreview}</Text>
          <Text style={styles.previewTitle}>
            {orientation === 'portrait' ? t.goalDetail.a4Portrait : t.goalDetail.landscape118}
          </Text>
        </View>
        <Text style={styles.previewMeta}>{formatNumber(goal.duration)} {getStrings(language).common.days}</Text>
      </View>
      <PrintedPageImage goal={goal} orientation={orientation} colors={colors} styles={styles} language={language} />
      <View style={[styles.previewPage, orientation === 'landscape' && styles.previewPageLandscape]}>
        <Text style={styles.previewPageTitle}>{t.goalDetail.calendarView}</Text>
        <Text style={styles.previewDescription}>{t.goalDetail.calendarHint}</Text>
        <View style={styles.calendarGrid}>
          {goal.days.map((day) => (
            <View key={day.day} style={styles.calendarCell}>
              <Text style={styles.calendarLabel}>{t.goalDetail.day}</Text>
              <Text style={styles.calendarNumber}>{day.day}</Text>
            </View>
          ))}
        </View>
        {previewDays.map((day) => {
          const dua = duasById[day.duaId];
          return (
            <View key={day.day} style={styles.previewRow}>
              <Text style={styles.previewDay}>{day.day}</Text>
              <View style={styles.previewCopy}>
                <Text style={styles.previewDua}>{dua ? duaPreview(dua, language) : day.duaId}</Text>
                <Text style={styles.previewArabic}>{dua?.arabic}</Text>
              </View>
              <Text style={styles.previewTarget}>×{day.target}</Text>
            </View>
          );
        })}
        {remaining > 0 ? <Text style={styles.previewMore}>{t.goalDetail.moreRows(remaining)}</Text> : null}
      </View>
    </Card>
  );
}

export default function GoalDetailScreen() {
  const theme = useTheme();
  const colors = theme.colors;
  const language = useLanguage();
  const t = useT();
  const { labelFont } = theme;
  const styles = useMemo(
    () => createGoalDetailStyles(colors, labelFont, language),
    [colors, labelFont, language],
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

      <Text style={[styles.description, proseLayout(language)]}>{goalDescription(goal, language)}</Text>

      <GoalTodayDuaCard
        arabic={todayDua?.arabic ?? ''}
        language={language}
        onCount={countToday}
        openCounterLabel={t.goalDetail.openCounter(tapWeight)}
        styles={{
          todayCard: styles.todayCard,
          overline: styles.overline,
          arabic: styles.arabic,
          translation: styles.translation,
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
        translation={todayDua ? duaTranslation(todayDua, language) : ''}
      />

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
                <Text style={styles.planTitle}>{dua ? duaPreview(dua, language) : ''}</Text>
                <Text style={styles.planArabic}>{dua?.arabic}</Text>
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
                <Text style={styles.referenceMeta}>{dua ? duaPreview(dua, language) : ''}</Text>
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
          <PdfPreview goal={goal} orientation={previewOrientation} styles={styles} colors={colors} language={language} />
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
  language: Language,
) {
  const isUrdu = language === 'ur';
  return StyleSheet.create({
  done: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.oliveDeep,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  doneText: {
    color: colors.card,
    fontFamily: displayFont,
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: colors.muted,
    fontFamily: displayFont,
    fontStyle: isUrdu ? 'normal' : 'italic',
    lineHeight: isUrdu ? 26 : undefined,
  },
  todayCard: {
    gap: spacing.md,
    overflow: 'visible',
  },
  overline: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  arabic: {
    color: colors.ink,
    fontSize: 32,
    lineHeight: 48,
    textAlign: 'right',
  },
  translation: {
    color: colors.muted,
    fontFamily: displayFont,
    fontSize: isUrdu ? 17 : undefined,
    fontStyle: isUrdu ? 'normal' : 'italic',
    lineHeight: isUrdu ? 26 : undefined,
  },
  progressLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressNumber: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 30,
  },
  target: {
    color: colors.muted,
    fontSize: 16,
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
  },
  primary: {
    alignItems: 'center',
    backgroundColor: colors.olive,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  primaryText: {
    color: colors.card,
    fontFamily: displayFont,
    fontSize: 16,
  },
  plan: {
    gap: spacing.sm,
  },
  planRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
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
  },
  planTitle: {
    color: colors.ink,
    fontFamily: displayFont,
  },
  planArabic: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'right',
  },
  planTarget: {
    color: colors.muted,
  },
  references: {
    gap: spacing.md,
  },
  referenceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  referenceCopy: {
    flex: 1,
  },
  referenceTitle: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 15,
  },
  referenceMeta: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontWeight: '800',
  },
  printImageWrap: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  previewPage: {
    backgroundColor: colors.cream,
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.sm,
    minHeight: 420,
    padding: spacing.md,
  },
  previewPageLandscape: {
    minHeight: 260,
  },
  previewPageTitle: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 22,
  },
  previewDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  calendarCell: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    minWidth: 54,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  calendarLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  calendarNumber: {
    color: colors.oliveDeep,
    fontFamily: displayFont,
    fontSize: 18,
  },
  previewRow: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  previewDay: {
    color: colors.oliveDeep,
    fontWeight: '800',
    width: 24,
  },
  previewCopy: {
    flex: 1,
  },
  previewDua: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 12,
  },
  previewArabic: {
    color: colors.muted,
    fontSize: 13,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  previewTarget: {
    color: colors.oliveDark,
    fontWeight: '800',
  },
  previewMore: {
    color: colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: spacing.md,
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
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.md,
  },
  generateText: {
    color: colors.card,
    fontWeight: '800',
  },
  exportRow: {
    flexDirection: 'row',
    gap: spacing.md,
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
    textAlign: 'center',
  },
});
}

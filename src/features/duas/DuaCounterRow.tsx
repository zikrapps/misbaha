import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { countStateColor } from '@/src/features/duas/countStateColor';
import { DuaContentBody } from '@/src/features/duas/DuaContentBody';
import { DuaTargetProgress } from '@/src/features/duas/DuaTargetProgress';
import { duaArabic, duaPreview, duaTitle } from '@/src/i18n/duaText';
import { arabicBlockLayout, lineHeightFor, proseFontStyle } from '@/src/i18n/textLayout';
import { formatNumber } from '@/src/i18n/format';
import { useLanguage, useT } from '@/src/i18n/strings';
import { AppTypography, raisedShadow, radii, spacing, useTheme } from '@/src/theme/theme';
import { DuaRecord } from '@/src/types/misbaha';

type DuaCounterRowProps = {
  dua: DuaRecord;
  count: number;
  tapWeight: number;
  expanded: boolean;
  /** True when any row on the screen is expanded and screen-wide counting is active. */
  countingActive: boolean;
  completeAnimationKey?: number;
  onToggleExpanded: () => void;
  onIncrement: () => void;
  onOpen: () => void;
  onReset: () => void;
};

function previewArabic(text: string) {
  return text.split(/\s+/).slice(0, 5).join(' ');
}

export function DuaCounterRow({
  dua,
  count,
  tapWeight,
  expanded,
  countingActive,
  completeAnimationKey = 0,
  onToggleExpanded,
  onOpen,
  onReset,
}: DuaCounterRowProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo } = theme;
  const language = useLanguage();
  const t = useT();
  const styles = useMemo(() => createStyles(typo, language), [typo, language]);
  const { labelFont, arabicFont, proseLayout, proseInlineLayout, mirrorRow, arabicLayout } = theme;
  const passThrough = countingActive;

  const reset = () => {
    Alert.alert(t.duas.resetTitle, t.duas.resetBody(duaTitle(dua, language)), [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.common.reset, style: 'destructive', onPress: onReset },
    ]);
  };

  const countColor = countStateColor(count, dua.target, colors);

  const receded = countingActive && !expanded;

  return (
    <Card
      pointerEvents={passThrough ? 'box-none' : 'auto'}
      style={[
        styles.card,
        receded && styles.cardReceded,
        expanded && styles.cardRaised,
        expanded && { backgroundColor: colors.white },
      ]}
    >
      <View pointerEvents={passThrough ? 'box-none' : 'auto'} style={styles.row}>
        <Pressable
          accessibilityLabel={expanded ? t.duas.collapse : t.duas.expand}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          hitSlop={8}
          onPress={onToggleExpanded}
          style={[styles.expandButton, { backgroundColor: colors.cream, borderColor: colors.line, zIndex: 2 }]}
        >
          <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
            <Icon name="chevronDown" color={colors.oliveDark} size={22} strokeWidth={2.4} />
          </View>
        </Pressable>

        <View pointerEvents={passThrough ? 'box-none' : 'auto'} style={styles.duaArea}>
          <Text style={[styles.title, proseLayout, { color: colors.muted, fontFamily: labelFont }]}>
            {duaTitle(dua, language)}
          </Text>
          {expanded ? (
            <DuaContentBody
              dua={dua}
              language={language}
              labelFont={labelFont}
              colors={colors}
              textStyles={{
                arabic: [styles.arabic, arabicLayout, { color: colors.ink, fontFamily: arabicFont }],
                translation: [styles.translation, proseLayout, { color: colors.muted, fontFamily: labelFont }],
                meta: [styles.meta, proseLayout, { color: colors.oliveDark, fontFamily: labelFont }],
                link: styles.link,
                linkRow: styles.linkRow,
              }}
            />
          ) : (
            <>
              <View style={styles.arabicBlock}>
                <Text style={[styles.arabic, arabicLayout, { color: colors.ink, fontFamily: arabicFont }]}>
                  {previewArabic(duaArabic(dua, language))}
                </Text>
              </View>
              <Text style={[styles.translation, proseLayout, { color: colors.muted, fontFamily: labelFont }]}>
                {duaPreview(dua, language)}
              </Text>
            </>
          )}
        </View>

        <View
          pointerEvents={passThrough ? 'none' : 'auto'}
          style={[styles.counterWrap, { borderColor: countColor, backgroundColor: colors.card }]}
        >
          <Text style={[styles.count, { color: countColor }]}>{formatNumber(count)}</Text>
          <Text style={[styles.target, { color: colors.muted }]}>/{formatNumber(dua.target)}</Text>
        </View>
      </View>

      <View pointerEvents={passThrough ? 'box-none' : 'auto'} style={[styles.footer, { borderTopColor: colors.line }]}>
        {expanded ? (
          <DuaTargetProgress
            completeAnimationKey={completeAnimationKey}
            fillStyle={[styles.progressFill, { backgroundColor: colors.olive }]}
            progress={count}
            target={dua.target}
            trackStyle={[styles.progressTrack, { backgroundColor: colors.line }]}
          />
        ) : null}
        <View style={[styles.footerRow, mirrorRow]}>
          <View style={styles.hintWrap}>
            <Text
              pointerEvents={passThrough ? 'none' : 'auto'}
              style={[styles.hint, proseLayout, { color: colors.muted, fontFamily: labelFont }]}
            >
              {expanded ? t.duas.expandedCountHint(tapWeight) : t.duas.expandToCount}
            </Text>
          </View>
          <View pointerEvents={passThrough ? 'box-none' : 'auto'} style={[styles.actions, mirrorRow]}>
          <Pressable onPress={onOpen} style={[styles.actionButton, mirrorRow, { backgroundColor: colors.oliveDeep }]}>
            <Icon name="open" color={colors.card} size={13} />
            <Text style={[styles.actionText, proseInlineLayout, { color: colors.card, fontFamily: labelFont }]}>
              {t.common.open}
            </Text>
          </Pressable>
          <Pressable onPress={reset} style={[styles.actionButton, mirrorRow, { backgroundColor: colors.oliveDeep }]}>
            <Icon name="reset" color={colors.card} size={13} />
            <Text style={[styles.actionText, proseInlineLayout, { color: colors.card, fontFamily: labelFont }]}>
              {t.common.reset}
            </Text>
          </Pressable>
        </View>
        </View>
      </View>
    </Card>
  );
}

function createStyles(typo: AppTypography, language: 'en' | 'ur') {
  const isUrdu = language === 'ur';
  const translationStyle = proseFontStyle(language);
  return StyleSheet.create({
    card: {
      gap: spacing.sm,
    },
    cardRaised: {
      ...raisedShadow,
      transform: [{ translateY: -4 }],
      zIndex: 2,
    },
    cardReceded: {
      elevation: 0,
      opacity: 0.78,
      shadowOpacity: 0,
      shadowRadius: 0,
      transform: [{ scale: 0.985 }],
    },
    row: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.sm,
    },
    expandButton: {
      alignItems: 'center',
      borderRadius: radii.pill,
      borderWidth: 1,
      height: 36,
      justifyContent: 'center',
      marginTop: spacing.xs,
      width: 36,
    },
    duaArea: {
      alignItems: 'stretch',
      flex: 1,
      gap: spacing.xs,
      minWidth: 0,
      paddingVertical: spacing.xs,
    },
    title: {
      fontSize: typo.caption,
      lineHeight: lineHeightFor(language, typo.caption, 1.3),
    },
    arabicBlock: arabicBlockLayout,
    arabic: {
      fontSize: typo.arabic,
      lineHeight: Math.round(typo.arabic * 1.55),
    },
    translation: {
      fontSize: isUrdu ? typo.body : typo.small,
      fontStyle: translationStyle,
      lineHeight: isUrdu ? Math.round(typo.body * 1.55) : Math.round(typo.small * 1.35),
    },
    meta: {
      fontSize: typo.small,
      lineHeight: Math.round(typo.small * 1.4),
    },
    link: {
      fontSize: typo.small,
      fontWeight: '700',
      lineHeight: Math.round(typo.small * 1.4),
    },
    linkRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    counterWrap: {
      alignItems: 'center',
      borderRadius: radii.pill,
      borderWidth: 1.5,
      height: 58,
      justifyContent: 'center',
      width: 58,
    },
    count: {
      fontSize: Math.round(17 * (isUrdu ? 1.2 : 1)),
      fontWeight: '800',
    },
    target: {
      fontSize: typo.micro,
    },
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: spacing.sm,
      paddingTop: spacing.sm,
    },
    footerRow: {
      alignItems: 'center',
      gap: spacing.sm,
      justifyContent: 'space-between',
    },
    progressTrack: {
      borderRadius: radii.pill,
      flex: 1,
      height: 6,
      overflow: 'hidden',
      width: '100%',
    },
    progressFill: {
      height: 6,
    },
    hintWrap: {
      flex: 1,
      minWidth: 0,
    },
    hint: {
      fontSize: typo.caption,
      lineHeight: Math.round(typo.caption * 1.45),
    },
    actions: {
      alignItems: 'center',
      flexShrink: 0,
      gap: spacing.xs,
    },
    actionButton: {
      alignItems: 'center',
      borderRadius: radii.pill,
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    actionText: {
      fontSize: typo.caption,
      fontWeight: '700',
    },
  });
}

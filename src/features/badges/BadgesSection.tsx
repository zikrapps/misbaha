import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { BADGE_SET_SIZE, TOTAL_BADGES } from '@/src/data/badges';
import { badgeDescription, badgeName } from '@/src/i18n/badgeText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { BadgeBrowserMode, BadgeBrowserModal } from './BadgeBrowserModal';
import { BadgeMedal } from './BadgeMedal';
import { useBadgeBoard } from './useBadgeBoard';

const BADGES_PER_ROW = 2;

export function BadgesSection() {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseLayout, mirrorRow } = theme;
  const t = useT();
  const language = useLanguage();
  const board = useBadgeBoard();
  const [browser, setBrowser] = useState<BadgeBrowserMode | null>(null);

  const baseIndex = board.visibleSetIndex * BADGE_SET_SIZE;
  const rows = Array.from({ length: BADGE_SET_SIZE / BADGES_PER_ROW }, (_, rowIndex) =>
    board.visibleBadges.slice(rowIndex * BADGES_PER_ROW, (rowIndex + 1) * BADGES_PER_ROW),
  );

  return (
    <Card style={styles.card}>
      <Text style={[styles.progress, proseLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.body }]}>
        {t.badges.progress(board.earnedCount, TOTAL_BADGES)}
      </Text>
      <Text style={[styles.hint, proseLayout, { color: colors.muted, fontSize: typo.small }]}>
        {t.badges.revealHint}
      </Text>

      <View style={[styles.actions, mirrorRow]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setBrowser('earned')}
          style={[styles.action, { backgroundColor: colors.oliveDeep, borderColor: colors.oliveDark }]}
        >
          <Text style={[styles.actionText, { color: colors.white, fontFamily: labelFont, fontSize: typo.small }]}>
            {t.badges.viewEarned}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setBrowser('all')}
          style={[styles.action, styles.actionGhost, { backgroundColor: colors.cream, borderColor: colors.line }]}
        >
          <Text style={[styles.actionText, { color: colors.oliveDeep, fontFamily: labelFont, fontSize: typo.small }]}>
            {t.badges.viewAll}
          </Text>
        </Pressable>
      </View>

      {rows.map((row, rowIndex) => (
        <View key={`badge-row-${rowIndex}`} style={[styles.row, mirrorRow]}>
          {row.map((badge, columnIndex) => {
            const earned = board.earned[baseIndex + rowIndex * BADGES_PER_ROW + columnIndex];
            return (
              <View key={badge.id} style={styles.cell}>
                <BadgeMedal badge={badge} earned={earned} />
                <Text
                  style={[styles.name, { color: earned ? colors.ink : colors.muted, fontFamily: labelFont, fontSize: typo.small }]}
                  numberOfLines={1}
                >
                  {badgeName(badge)}
                </Text>
                <Text
                  style={[styles.description, { color: earned ? colors.oliveDark : colors.muted, fontSize: typo.caption }]}
                  numberOfLines={2}
                >
                  {badgeDescription(badge, language)}
                </Text>
              </View>
            );
          })}
        </View>
      ))}

      <BadgeBrowserModal visible={browser !== null} mode={browser ?? 'earned'} onClose={() => setBrowser(null)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  progress: {
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: -spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionGhost: {
    borderWidth: 1,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  cell: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 11,
    textAlign: 'center',
  },
});

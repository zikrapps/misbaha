import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { TOTAL_BADGES } from '@/src/data/badges';
import { useT } from '@/src/i18n/strings';
import { spacing, useTheme } from '@/src/theme/theme';
import { BadgeMedal } from './BadgeMedal';
import { useBadgeBoard } from './useBadgeBoard';

export function BadgeSummaryCard() {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseLayout, labelDecoration, mirrorRow } = theme;
  const t = useT();
  const board = useBadgeBoard();

  return (
    <Card style={styles.card}>
      <View style={[styles.row, mirrorRow]}>
        <View style={styles.copy}>
          <Text style={[styles.label, proseLayout, labelDecoration, { color: colors.muted, fontSize: typo.micro }]}>
            {t.badges.title}
          </Text>
          <Text style={[styles.value, proseLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle }]}>
            {t.badges.earnedCount(board.earnedCount)}
          </Text>
          <Text style={[styles.hint, proseLayout, { color: colors.muted, fontSize: typo.caption }]}>
            {board.earnedCount === 0 ? t.badges.empty : t.badges.progress(board.earnedCount, TOTAL_BADGES)}
          </Text>
        </View>
        {board.latestEarned.length > 0 ? (
          <View style={[styles.medals, mirrorRow]}>
            {board.latestEarned.map((badge) => (
              <BadgeMedal key={badge.id} badge={badge} earned size={56} />
            ))}
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 21,
  },
  hint: {
    fontSize: 11,
  },
  medals: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

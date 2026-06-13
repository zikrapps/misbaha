import { useMemo } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BADGE_SET_SIZE, BadgeDef, badges, TOTAL_BADGES } from '@/src/data/badges';
import { badgeDescription, badgeName } from '@/src/i18n/badgeText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { BadgeMedal } from './BadgeMedal';
import { useBadgeBoard } from './useBadgeBoard';

export type BadgeBrowserMode = 'earned' | 'all';

type BadgeBrowserModalProps = {
  visible: boolean;
  mode: BadgeBrowserMode;
  onClose: () => void;
};

type Row = { badge: BadgeDef; earned: boolean; setIndex: number };

export function BadgeBrowserModal({ visible, mode, onClose }: BadgeBrowserModalProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, mirrorRow, proseLayout, labelDecoration } = theme;
  const t = useT();
  const language = useLanguage();
  const board = useBadgeBoard();

  const rows = useMemo<Row[]>(() => {
    const all = badges.map((badge, index) => ({
      badge,
      earned: board.earned[index],
      setIndex: Math.floor(index / BADGE_SET_SIZE),
    }));
    return mode === 'earned' ? all.filter((row) => row.earned) : all;
  }, [board.earned, mode]);

  const title = mode === 'earned' ? t.badges.earnedTitle : t.badges.allTitle;

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: colors.cream }]}>
          <View style={[styles.header, mirrorRow, { borderBottomColor: colors.line }]}>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, proseLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle + 5 }]}>
                {title}
              </Text>
              <Text style={[styles.progress, proseLayout, { color: colors.muted, fontSize: typo.small }]}>
                {t.badges.progress(board.earnedCount, TOTAL_BADGES)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.common.done}
              hitSlop={8}
              onPress={onClose}
              style={[styles.close, { backgroundColor: colors.oliveDeep, borderColor: colors.oliveDark }]}
            >
              <Text style={[styles.closeText, { color: colors.white, fontFamily: labelFont, fontSize: typo.body }]}>
                {t.common.done}
              </Text>
            </Pressable>
          </View>

        {rows.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, proseLayout, { color: colors.muted, fontSize: typo.body }]}>
              {t.badges.none}
            </Text>
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(row) => row.badge.id}
            contentContainerStyle={styles.list}
            initialNumToRender={12}
            windowSize={9}
            renderItem={({ item, index }) => {
              const showDivider = mode === 'all' && (index === 0 || rows[index - 1].setIndex !== item.setIndex);
              return (
                <View>
                  {showDivider ? (
                    <Text style={[styles.divider, labelDecoration, { color: colors.oliveDark, fontSize: typo.micro }]}>
                      {t.badges.setDivider(item.setIndex + 1)}
                    </Text>
                  ) : null}
                  <View style={[styles.row, mirrorRow, { backgroundColor: colors.card, borderColor: colors.line }]}>
                    <BadgeMedal badge={item.badge} earned={item.earned} size={56} />
                    <View style={styles.rowCopy}>
                      <Text
                        style={[styles.name, { color: item.earned ? colors.ink : colors.muted, fontFamily: labelFont, fontSize: typo.body }]}
                        numberOfLines={1}
                      >
                        {badgeName(item.badge)}
                      </Text>
                      <Text style={[styles.desc, { color: colors.muted, fontSize: typo.small }]} numberOfLines={2}>
                        {badgeDescription(item.badge, language)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.status,
                        labelDecoration,
                        { color: item.earned ? colors.olive : colors.muted, fontSize: typo.micro },
                      ]}
                    >
                      {item.earned ? t.badges.earnedLabel : t.badges.lockedLabel}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 20,
  },
  progress: {
    fontSize: 12,
    marginTop: 2,
  },
  close: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  list: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  divider: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  row: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
  },
  desc: {
    fontSize: 12,
  },
  status: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgeDef, badgesById } from '@/src/data/badges';
import { badgeDescription, badgeName } from '@/src/i18n/badgeText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { BadgeMedal } from './BadgeMedal';
import { useBadgeBoard } from './useBadgeBoard';

/**
 * Watches earned badges and shows a celebratory popup over whatever screen the
 * user is on whenever a new one is unlocked. Badges already earned when the app
 * mounts form the baseline and never trigger a popup.
 */
export function BadgeUnlockHost() {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseCenterLayout, labelDecoration } = theme;
  const t = useT();
  const language = useLanguage();
  const board = useBadgeBoard();
  const knownRef = useRef<Set<string> | null>(null);
  const [queue, setQueue] = useState<BadgeDef[]>([]);

  useEffect(() => {
    if (knownRef.current === null) {
      knownRef.current = new Set(board.earnedIds);
      return;
    }
    const known = knownRef.current;
    const fresh = board.earnedIds.filter((id) => !known.has(id));
    if (fresh.length === 0) return;
    fresh.forEach((id) => known.add(id));
    setQueue((current) => [...current, ...fresh.map((id) => badgesById[id])]);
  }, [board.earnedIds]);

  const current = queue[0];
  if (!current) return null;

  const dismiss = () => setQueue((q) => q.slice(1));

  return (
    <Modal animationType="fade" transparent visible onRequestClose={dismiss}>
      <View style={[styles.backdrop, { backgroundColor: 'rgba(55, 44, 36, 0.58)' }]}>
        <SafeAreaView style={styles.safe}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Text style={[styles.eyebrow, proseCenterLayout, labelDecoration, { color: colors.oliveDark, fontSize: typo.micro }]}>
              {t.badges.unlockTitle}
            </Text>
            <View style={styles.medal}>
              <BadgeMedal badge={current} earned size={168} />
            </View>
            <Text style={[styles.name, proseCenterLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle + 4 }]}>
              {badgeName(current)}
            </Text>
            <Text style={[styles.desc, proseCenterLayout, { color: colors.muted, fontSize: typo.small }]}>
              {badgeDescription(current, language)}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={dismiss}
              style={[styles.cta, { backgroundColor: colors.oliveDeep, borderColor: colors.oliveDark }]}
            >
              <Text style={[styles.ctaText, { color: colors.white, fontFamily: labelFont, fontSize: typo.body }]}>
                {t.badges.unlockCta}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  safe: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    width: '100%',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  medal: {
    marginVertical: spacing.sm,
  },
  name: {
    fontSize: 19,
  },
  desc: {
    fontSize: 12,
  },
  cta: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    width: '100%',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

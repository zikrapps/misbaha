import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg from 'react-native-svg';

import {
  dhikrDistanceKm,
  dhikrSeconds,
  journeyProgress,
  milestonesFor,
  travelerNode,
} from '@/src/features/insights/dhikrDistance';
import { EarthScene, EARTH_VIEW } from '@/src/features/insights/EarthScene';
import { SpaceScene, SPACE_VIEW } from '@/src/features/insights/SpaceScene';
import { formatDistanceKm, journeyCaption } from '@/src/i18n/journeyText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';

type JourneySummaryProps = {
  kind: 'earth' | 'space';
  counts: Record<string, number>;
};

const FRAME = {
  earth: { background: '#2a2210', view: EARTH_VIEW, label: '#e7d7b0', valueColor: '#fff7e2', caption: '#e7d7b0' },
  space: { background: '#0c1024', view: SPACE_VIEW, label: '#aab2d6', valueColor: '#ffffff', caption: '#cdd3ef' },
} as const;

export function JourneySummary({ kind, counts }: JourneySummaryProps) {
  const theme = useTheme();
  const t = useT();
  const language = useLanguage();

  const { distanceKm, seconds, milestones, progress, travelerT } = useMemo(() => {
    const km = dhikrDistanceKm(counts);
    const list = milestonesFor(kind);
    const prog = journeyProgress(list, km);
    return {
      distanceKm: km,
      seconds: dhikrSeconds(counts),
      milestones: list,
      progress: prog,
      travelerT: travelerNode(prog, list.length + 1),
    };
  }, [counts, kind]);

  const frame = FRAME[kind];
  if (!frame) return null;

  const label = kind === 'space' ? t.journey.spaceLabel : t.journey.earthLabel;

  return (
    <View style={[styles.wrap, { backgroundColor: frame.background }]}>
      <View style={styles.copy}>
        <Text style={[styles.label, theme.proseLayout, theme.labelDecoration, { color: frame.label, fontFamily: theme.labelFont }]}>
          {label}
        </Text>
        <Text style={[styles.statValue, theme.proseLayout, { color: frame.valueColor, fontFamily: theme.labelFont }]}>
          {formatDistanceKm(distanceKm, language)}
        </Text>
        <Text
          style={[
            styles.caption,
            theme.proseLayout,
            { color: frame.caption, fontFamily: theme.labelFont, lineHeight: theme.labelLineHeight(11, 1.4) },
          ]}
        >
          {journeyCaption(kind, milestones, progress, distanceKm, seconds, language)}
        </Text>
      </View>

      <Svg
        viewBox={`0 0 ${frame.view.width} ${frame.view.height}`}
        preserveAspectRatio="xMidYMid slice"
        style={[styles.scene, { aspectRatio: frame.view.width / frame.view.height }]}
      >
        {kind === 'space' ? (
          <SpaceScene milestones={milestones} progress={progress} travelerT={travelerT} language={language} />
        ) : (
          <EarthScene milestones={milestones} progress={progress} travelerT={travelerT} language={language} />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    paddingTop: spacing.lg,
  },
  scene: {
    width: '100%',
  },
  copy: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    zIndex: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 30,
    marginTop: spacing.xs,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: spacing.xs,
    maxWidth: 320,
    opacity: 0.92,
  },
});

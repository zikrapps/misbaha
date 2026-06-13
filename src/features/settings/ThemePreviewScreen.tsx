import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { PREVIEW_HEIGHT, PREVIEW_WIDTH, ThemePreviewPage } from '@/src/features/settings/themeCarouselConfig';
import { ThemeColors } from '@/src/theme/palette';
import { radii } from '@/src/theme/theme';

type ThemePreviewScreenProps = {
  colors: ThemeColors;
  page: ThemePreviewPage;
};

function Bar({
  width,
  height = 3,
  color,
  style,
  opacity = 1,
}: {
  width: number | `${number}%`;
  height?: number;
  color: string;
  style?: object;
  opacity?: number;
}) {
  return (
    <View
      style={[
        { backgroundColor: color, borderRadius: 2, height, opacity, width },
        style,
      ]}
    />
  );
}

function PreviewHeader({ colors }: { colors: ThemeColors }) {
  return (
    <View style={styles.head}>
      <Bar width="52%" height={7} color={colors.ink} />
      <Bar width="38%" height={4} color={colors.muted} style={styles.headSub} opacity={0.55} />
    </View>
  );
}

function PreviewTabBar({ colors, activeTab }: { colors: ThemeColors; activeTab: number }) {
  return (
    <View style={[styles.tabs, { backgroundColor: colors.oliveDeep, borderTopColor: colors.oliveDark }]}>
      {[0, 1, 2, 3].map((tab) => {
        const active = tab === activeTab;
        return (
          <View key={tab} style={styles.tab}>
            <View style={[styles.tabIcon, { backgroundColor: active ? colors.white : colors.sand }]} />
            <Bar
              width={14}
              height={2}
              color={active ? colors.white : colors.sand}
              opacity={active ? 0.7 : 0.5}
            />
          </View>
        );
      })}
    </View>
  );
}

function PreviewCard({
  colors,
  children,
  style,
  borderColor,
  borderWidth = 1,
}: {
  colors: ThemeColors;
  children: React.ReactNode;
  style?: object;
  borderColor?: string;
  borderWidth?: number;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.parchment,
          borderColor: borderColor ?? colors.line,
          borderWidth,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function TodayPreview({ colors }: { colors: ThemeColors }) {
  return (
    <>
      <PreviewHeader colors={colors} />
      <View style={[styles.hero, { backgroundColor: colors.oliveDeep }]}>
        <View style={styles.heroStat}>
          <Bar width="70%" height={3} color={colors.sand} opacity={0.7} />
          <Bar width="55%" height={8} color={colors.card} style={styles.heroVal} />
        </View>
        <View style={styles.heroStat}>
          <Bar width="70%" height={3} color={colors.sand} opacity={0.7} />
          <Bar width="55%" height={8} color={colors.card} style={styles.heroVal} />
        </View>
      </View>
      <Bar width="44%" height={3} color={colors.muted} style={styles.section} opacity={0.45} />
      <View style={styles.grid2}>
        <PreviewCard colors={colors}>
          <View style={[styles.chip, { backgroundColor: colors.cream, borderColor: colors.line }]} />
          <Bar width="60%" color={colors.oliveDark} style={styles.cardLine} />
          <Bar width="80%" color={colors.ink} style={styles.cardLine} />
          <Bar width="45%" color={colors.muted} style={styles.cardLine} />
        </PreviewCard>
        <PreviewCard colors={colors}>
          <View style={[styles.chip, { backgroundColor: colors.cream, borderColor: colors.line }]} />
          <Bar width="60%" color={colors.oliveDark} style={styles.cardLine} />
          <Bar width="80%" color={colors.ink} style={styles.cardLine} />
        </PreviewCard>
      </View>
      <PreviewCard colors={colors} style={styles.chartCard}>
        <Bar width="55%" height={3} color={colors.ink} />
        <Svg width="100%" height={36} viewBox="0 0 90 36" style={styles.chartSvg}>
          <Path
            d="M0,30 C15,28 20,18 35,20 C50,22 60,8 75,12 C82,14 88,10 90,8 L90,36 L0,36 Z"
            fill={colors.oliveDeep}
            opacity={0.2}
          />
          <Path
            d="M0,30 C15,28 20,18 35,20 C50,22 60,8 75,12 C82,14 88,10 90,8"
            fill="none"
            stroke={colors.oliveDeep}
            strokeLinecap="round"
            strokeWidth={2.5}
          />
        </Svg>
      </PreviewCard>
    </>
  );
}

function TasbeehPreview({ colors }: { colors: ThemeColors }) {
  const tileColors = [colors.olive, colors.blush, colors.sand, colors.oliveDeep];
  return (
    <>
      <PreviewHeader colors={colors} />
      <View style={[styles.totalRow, { borderBottomColor: colors.line }]}>
        <Bar width="38%" height={3} color={colors.muted} />
        <Bar width="22%" height={4} color={colors.oliveDark} />
      </View>
      <View style={styles.grid2}>
        {tileColors.map((tileColor, index) => (
          <View key={index} style={[styles.tile, { backgroundColor: tileColor }]}>
            <Bar width="28%" height={2} color={index === 2 ? colors.ink : colors.white} opacity={0.65} style={styles.tileEye} />
            <Bar width="55%" height={4} color={index === 2 ? colors.ink : colors.white} style={styles.tileTitle} />
          </View>
        ))}
      </View>
      <PreviewCard colors={colors} borderColor={colors.oliveDark} borderWidth={1.5} style={styles.duaRaised}>
        <View style={styles.duaRow}>
          <View style={[styles.chev, { backgroundColor: colors.oliveDeep }]} />
          <View style={styles.duaLines}>
            <Bar width="35%" height={3} color={colors.muted} opacity={0.55} />
            <Bar width="90%" height={3} color={colors.ink} style={styles.cardLine} />
            <Bar width="65%" height={3} color={colors.muted} style={styles.cardLine} />
          </View>
          <View style={[styles.counter, { backgroundColor: colors.card, borderColor: colors.olive }]} />
        </View>
      </PreviewCard>
      <PreviewCard colors={colors} style={styles.duaCollapsed}>
        <View style={styles.duaRow}>
          <View style={[styles.chev, { backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1 }]} />
          <View style={styles.duaLines}>
            <Bar width="35%" height={3} color={colors.muted} opacity={0.55} />
            <Bar width="90%" height={3} color={colors.ink} style={styles.cardLine} opacity={0.6} />
          </View>
          <View style={[styles.counterSm, { backgroundColor: colors.card, borderColor: colors.line }]} />
        </View>
      </PreviewCard>
    </>
  );
}

function GoalsPreview({ colors }: { colors: ThemeColors }) {
  return (
    <>
      <PreviewHeader colors={colors} />
      <Bar width="44%" height={3} color={colors.muted} style={styles.section} opacity={0.45} />
      <View style={styles.grid2}>
        <View style={[styles.goalTile, { backgroundColor: colors.parchment, borderColor: colors.line }]} />
        <View style={[styles.goalTile, { backgroundColor: colors.parchment, borderColor: colors.line }]} />
      </View>
      <View style={[styles.surprise, { backgroundColor: colors.oliveDeep }]}>
        <View style={[styles.surpriseIcon, { backgroundColor: colors.card }]} />
        <View style={styles.surpriseCopy}>
          <Bar width="75%" height={5} color={colors.card} />
          <Bar width="90%" height={4} color={colors.sand} style={styles.cardLine} opacity={0.65} />
        </View>
      </View>
      <Bar width="44%" height={3} color={colors.muted} style={styles.section} opacity={0.45} />
      <View style={styles.grid2}>
        <PreviewCard colors={colors} style={styles.suggestedTile}>
          <Bar width="80%" color={colors.ink} />
          <Bar width="60%" color={colors.muted} style={styles.cardLine} />
        </PreviewCard>
        <PreviewCard colors={colors} style={styles.suggestedTile}>
          <Bar width="80%" color={colors.ink} />
          <Bar width="45%" color={colors.muted} style={styles.cardLine} />
        </PreviewCard>
      </View>
    </>
  );
}

function VisualizePreview({ colors }: { colors: ThemeColors }) {
  return (
    <>
      <PreviewHeader colors={colors} />
      <View style={[styles.toggle, { backgroundColor: colors.parchment, borderColor: colors.line }]}>
        <View style={[styles.toggleSeg, { backgroundColor: colors.oliveDeep }]} />
        <View style={styles.toggleSeg} />
        <View style={styles.toggleSeg} />
      </View>
      <PreviewCard colors={colors} style={styles.growthCard}>
        <View style={styles.growthRow}>
          <View style={[styles.sprout, { backgroundColor: colors.moss }]} />
          <View style={styles.growthCopy}>
            <Bar width="40%" height={3} color={colors.oliveDark} />
            <Bar width="30%" height={6} color={colors.ink} style={styles.cardLine} />
          </View>
        </View>
      </PreviewCard>
      <View style={[styles.viz, { backgroundColor: colors.cream }]}>
        <View style={[styles.hill, { backgroundColor: colors.moss }]} />
        <View style={[styles.tree, { backgroundColor: colors.olive, left: '28%' }]} />
        <View style={[styles.treeLg, { backgroundColor: colors.oliveDark, left: '48%' }]} />
        <View style={[styles.treeSm, { backgroundColor: colors.olive, left: '66%' }]} />
      </View>
      <View style={styles.statsRow}>
        {[0.5, 0.4, 0.35].map((width) => (
          <PreviewCard key={width} colors={colors} style={styles.statTile}>
            <Bar width="60%" height={2} color={colors.muted} />
            <Bar width={`${width * 100}%`} height={4} color={colors.ink} style={styles.cardLine} />
          </PreviewCard>
        ))}
      </View>
    </>
  );
}

function SettingsPreview({ colors }: { colors: ThemeColors }) {
  return (
    <>
      <View style={styles.settingsHead}>
        <View>
          <Bar width={52} height={7} color={colors.ink} />
          <Bar width={38} height={4} color={colors.muted} style={styles.headSub} opacity={0.55} />
        </View>
        <Bar width={22} height={5} color={colors.oliveDark} style={styles.doneBar} />
      </View>
      <Bar width="44%" height={3} color={colors.muted} style={styles.section} opacity={0.45} />
      <PreviewCard colors={colors} style={styles.dialCard}>
        <View style={[styles.dialRing, { borderColor: colors.line, borderTopColor: colors.olive }]} />
        <Bar width="70%" height={3} color={colors.line} />
      </PreviewCard>
      <Bar width="44%" height={3} color={colors.muted} style={styles.section} opacity={0.45} />
      <View style={styles.langRow}>
        <View style={[styles.langOpt, { backgroundColor: colors.oliveDeep, borderColor: colors.oliveDark }]} />
        <View style={[styles.langOpt, { backgroundColor: colors.parchment, borderColor: colors.line }]} />
      </View>
      <Bar width="44%" height={3} color={colors.muted} style={styles.section} opacity={0.45} />
      <PreviewCard colors={colors} borderColor={colors.oliveDark} borderWidth={2} style={styles.themeCard}>
        <View style={styles.swatchGrid}>
          <View style={[styles.swatchBar, { backgroundColor: colors.oliveDeep }]} />
          <View style={[styles.swatchBar, { backgroundColor: colors.sand }]} />
          <View style={[styles.swatchBar, { backgroundColor: colors.blush }]} />
        </View>
        <Bar width="80%" color={colors.ink} style={styles.cardLine} />
        <Bar width="60%" color={colors.muted} style={styles.cardLine} />
      </PreviewCard>
    </>
  );
}

const PAGE_ACTIVE_TAB: Record<ThemePreviewPage, number> = {
  today: 0,
  tasbeeh: 1,
  goals: 2,
  visualize: 3,
  settings: -1,
};

export function ThemePreviewScreen({ colors, page }: ThemePreviewScreenProps) {
  const body =
    page === 'today' ? (
      <TodayPreview colors={colors} />
    ) : page === 'tasbeeh' ? (
      <TasbeehPreview colors={colors} />
    ) : page === 'goals' ? (
      <GoalsPreview colors={colors} />
    ) : page === 'visualize' ? (
      <VisualizePreview colors={colors} />
    ) : (
      <SettingsPreview colors={colors} />
    );

  const activeTab = PAGE_ACTIVE_TAB[page];

  return (
    <View style={[styles.screen, { backgroundColor: colors.cream }]}>
      <View style={styles.body}>{body}</View>
      {activeTab >= 0 ? <PreviewTabBar colors={colors} activeTab={activeTab} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    borderRadius: radii.md,
    height: PREVIEW_HEIGHT,
    overflow: 'hidden',
    width: PREVIEW_WIDTH,
  },
  body: {
    flex: 1,
    gap: 4,
    minHeight: 0,
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingTop: 7,
  },
  head: {
    marginBottom: 1,
  },
  headSub: {
    marginTop: 3,
  },
  hero: {
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 8,
  },
  heroStat: {
    flex: 1,
  },
  heroVal: {
    marginTop: 4,
  },
  section: {
    marginTop: 2,
  },
  grid2: {
    flexDirection: 'row',
    gap: 4,
  },
  card: {
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    padding: 5,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 8,
    width: 18,
  },
  cardLine: {
    marginTop: 4,
  },
  chartCard: {
    flex: 1,
    minHeight: 0,
  },
  chartSvg: {
    marginTop: 3,
  },
  totalRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  tile: {
    borderRadius: 6,
    flex: 1,
    height: 28,
    position: 'relative',
  },
  tileEye: {
    left: 5,
    position: 'absolute',
    top: 5,
  },
  tileTitle: {
    bottom: 6,
    left: 5,
    position: 'absolute',
  },
  duaRaised: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  duaCollapsed: {
    opacity: 0.5,
    paddingVertical: 4,
  },
  duaRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 4,
  },
  chev: {
    borderRadius: radii.pill,
    height: 10,
    width: 10,
  },
  duaLines: {
    flex: 1,
    minWidth: 0,
  },
  counter: {
    borderRadius: radii.pill,
    borderWidth: 1.5,
    height: 18,
    width: 18,
  },
  counterSm: {
    borderRadius: radii.pill,
    borderWidth: 1.5,
    height: 14,
    width: 14,
  },
  goalTile: {
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    height: 34,
    opacity: 0.85,
  },
  surprise: {
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    padding: 8,
  },
  surpriseIcon: {
    borderRadius: radii.pill,
    height: 14,
    width: 14,
  },
  surpriseCopy: {
    flex: 1,
  },
  suggestedTile: {
    minHeight: 32,
  },
  toggle: {
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 2,
  },
  toggleSeg: {
    borderRadius: radii.pill,
    flex: 1,
    height: 10,
  },
  growthCard: {
    paddingVertical: 6,
  },
  growthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  sprout: {
    borderRadius: radii.pill,
    height: 22,
    width: 22,
  },
  growthCopy: {
    flex: 1,
  },
  viz: {
    borderRadius: 7,
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  hill: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    bottom: 0,
    height: '55%',
    left: '10%',
    opacity: 0.35,
    position: 'absolute',
    width: '80%',
  },
  tree: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    bottom: '28%',
    height: 18,
    position: 'absolute',
    width: 14,
  },
  treeLg: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    bottom: '28%',
    height: 22,
    position: 'absolute',
    width: 16,
  },
  treeSm: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    bottom: '28%',
    height: 14,
    position: 'absolute',
    width: 11,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 1,
  },
  statTile: {
    flex: 1,
    padding: 4,
  },
  settingsHead: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doneBar: {
    marginTop: 2,
  },
  dialCard: {
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  dialRing: {
    borderRadius: radii.pill,
    borderWidth: 3,
    height: 36,
    width: 36,
  },
  langRow: {
    flexDirection: 'row',
    gap: 4,
  },
  langOpt: {
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    height: 22,
  },
  themeCard: {
    flex: 1,
    minHeight: 0,
  },
  swatchGrid: {
    flexDirection: 'row',
    gap: 3,
  },
  swatchBar: {
    borderRadius: 3,
    flex: 1,
    height: 8,
  },
  tabs: {
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: 5,
    paddingHorizontal: 2,
    paddingTop: 4,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  tabIcon: {
    borderRadius: radii.pill,
    height: 4,
    width: 4,
  },
});

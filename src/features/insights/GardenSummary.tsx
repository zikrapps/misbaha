import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { duas } from '@/src/data/duas';
import { buildGardenLandscape } from '@/src/features/insights/gardenLandscape';
import { MountainTree } from '@/src/features/insights/MountainTree';
import { buildGardenTrees, countGardenTrees } from '@/src/features/insights/gardenTrees';
import { getGardenZoom } from '@/src/features/insights/gardenZoom';
import { gardenZoomCaption } from '@/src/i18n/gardenText';
import { formatNumber } from '@/src/i18n/format';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';

type GardenSummaryProps = {
  total: number;
  counts: Record<string, number>;
};

const duaIds = duas.map((dua) => dua.id);

function GardenGradients() {
  return (
    <Defs>
      <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#6e7f96" />
        <Stop offset="0.45" stopColor="#b8a88a" />
        <Stop offset="1" stopColor="#e8c47a" />
      </LinearGradient>
      <RadialGradient id="gSun" cx="88%" cy="18%" rx="22%" ry="22%">
        <Stop offset="0" stopColor="#fff4c8" stopOpacity="0.95" />
        <Stop offset="0.45" stopColor="#f0c86a" stopOpacity="0.55" />
        <Stop offset="1" stopColor="#e8c47a" stopOpacity="0" />
      </RadialGradient>
      <LinearGradient id="gHaze" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#c8d4e4" stopOpacity="0.35" />
        <Stop offset="1" stopColor="#e8c47a" stopOpacity="0.12" />
      </LinearGradient>
      <LinearGradient id="gWater" x1="0" y1="0" x2="0.2" y2="1">
        <Stop offset="0" stopColor="#6a8ea8" />
        <Stop offset="0.55" stopColor="#4a6d86" />
        <Stop offset="1" stopColor="#2f4f62" />
      </LinearGradient>
      <LinearGradient id="gRidgeLight" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#e8c078" />
        <Stop offset="1" stopColor="#c49352" />
      </LinearGradient>
      <LinearGradient id="gRidgeShadow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#2a3a42" />
        <Stop offset="1" stopColor="#1a262c" />
      </LinearGradient>
      <LinearGradient id="gBarren" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#c9a066" />
        <Stop offset="0.55" stopColor="#a88452" />
        <Stop offset="1" stopColor="#6e5a3e" />
      </LinearGradient>
    </Defs>
  );
}

function ValleyScene({
  trees,
  isBarren,
}: {
  trees: ReturnType<typeof buildGardenTrees>;
  isBarren: boolean;
}) {
  return (
    <>
      <Path
        d="M0 118 L28 102 L62 110 L98 94 L142 104 L188 88 L232 98 L278 86 L318 96 L360 90 L360 228 L0 228 Z"
        fill="#8fa3b5"
        opacity={0.72}
      />
      <Path
        d="M0 128 L36 114 L78 122 L118 108 L162 118 L208 106 L252 116 L296 104 L338 112 L360 108 L360 228 L0 228 Z"
        fill="#7a92a4"
        opacity={0.58}
      />
      <Path
        d="M0 108 C18 98 42 112 58 128 C72 142 68 162 52 178 C38 192 18 200 0 206 Z"
        fill="url(#gWater)"
      />
      <Path
        d="M8 132 C22 126 34 138 28 152 C24 162 14 168 8 164 Z"
        fill="#8eb0c8"
        opacity={0.35}
      />
      <Ellipse cx={24} cy={168} rx={18} ry={4} fill="#1a3038" opacity={0.2} />
      <Path
        d="M52 148 C88 128 128 142 168 124 C208 108 248 124 288 112 C312 106 336 114 360 108 L360 228 L52 228 Z"
        fill="url(#gRidgeShadow)"
        opacity={0.92}
      />
      <Path
        d="M52 148 C88 128 128 142 168 124 C208 108 248 124 288 112 C312 106 336 114 360 108"
        stroke="url(#gRidgeLight)"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      />
      <Path
        d="M0 168 C48 152 96 172 148 158 C200 144 252 168 308 152 C334 146 352 154 360 150 L360 228 L0 228 Z"
        fill="url(#gBarren)"
      />
      <Path
        d="M0 182 C56 168 108 188 164 174 C218 160 272 184 328 170 C346 166 360 172 360 168 L360 228 L0 228 Z"
        fill="#8a7048"
        opacity={0.55}
      />
      {isBarren &&
        [42, 98, 156, 214, 268, 318].map((x, i) => (
          <Circle
            key={x}
            cx={x}
            cy={186 + (i % 3) * 4}
            r={1.2 + (i % 2)}
            fill="#6e5a42"
            opacity={0.35}
          />
        ))}
      {trees.map((tree) => (
        <MountainTree key={tree.id} x={tree.x} y={tree.y} scale={tree.scale} />
      ))}
      <Path
        d="M0 198 C72 182 132 208 204 192 C268 178 318 200 360 188 L360 228 L0 228 Z"
        fill="#1e2a30"
        opacity={0.42}
      />
    </>
  );
}

function PanoramaScene({
  worldWidth,
  worldHeight,
  rangeLayers,
  fill,
  trees,
}: {
  worldWidth: number;
  worldHeight: number;
  rangeLayers: number;
  fill: number;
  trees: ReturnType<typeof buildGardenTrees>;
}) {
  const { ridges, valleys, lakes } = useMemo(
    () => buildGardenLandscape(worldWidth, worldHeight, rangeLayers, fill),
    [worldWidth, worldHeight, rangeLayers, fill],
  );
  const isBarren = trees.length === 0 || fill < 0.45;

  return (
    <>
      {ridges.map((ridge, index) =>
        ridge.path ? (
          <Path key={`ridge-${index}`} d={ridge.path} fill={ridge.fill} opacity={ridge.opacity} />
        ) : null,
      )}
      {valleys.map((valley, index) => (
        <Path key={`valley-${index}`} d={valley.path} fill={valley.fill} opacity={valley.opacity} />
      ))}
      {lakes.map((lake, index) => (
        <Path key={`lake-${index}`} d={lake.path} fill="url(#gWater)" opacity={lake.opacity} />
      ))}
      {ridges.map((ridge, index) =>
        ridge.capPath ? (
          <Path
            key={`cap-${index}`}
            d={ridge.capPath}
            stroke="url(#gRidgeLight)"
            strokeWidth={3 + rangeLayers * 0.4}
            fill="none"
            strokeLinecap="round"
            opacity={ridge.capOpacity ?? 0.5}
          />
        ) : null,
      )}
      {isBarren &&
        Array.from({ length: Math.min(40, Math.floor(worldWidth / 36)) }, (_, i) => (
          <Circle
            key={`rock-${i}`}
            cx={(worldWidth / 40) * i + 12}
            cy={worldHeight * 0.78 + (i % 4) * 5}
            r={1 + (i % 2)}
            fill="#6e5a42"
            opacity={0.32}
          />
        ))}
      {trees.map((tree) =>
        tree.scale < 0.38 ? (
          <G key={tree.id}>
            <Ellipse cx={tree.x} cy={tree.y + 4} rx={5 * tree.scale} ry={2} fill="#1a2820" opacity={0.3} />
            <Circle cx={tree.x} cy={tree.y} r={4 * tree.scale + 2} fill="#2a5238" />
          </G>
        ) : (
          <MountainTree key={tree.id} x={tree.x} y={tree.y} scale={tree.scale} />
        ),
      )}
      <Path
        d={`M0 ${worldHeight * 0.88} C${worldWidth * 0.2} ${worldHeight * 0.82} ${worldWidth * 0.45} ${worldHeight * 0.9} ${worldWidth * 0.7} ${worldHeight * 0.84} C${worldWidth * 0.88} ${worldHeight * 0.8} ${worldWidth} ${worldHeight * 0.86} ${worldWidth} ${worldHeight * 0.88} L${worldWidth} ${worldHeight} L0 ${worldHeight} Z`}
        fill="#1e2a30"
        opacity={0.38}
      />
    </>
  );
}

export function GardenSummary({ total, counts }: GardenSummaryProps) {
  const theme = useTheme();
  const t = useT();
  const language = useLanguage();
  const treeCount = countGardenTrees(counts);
  const zoom = useMemo(() => getGardenZoom(treeCount), [treeCount]);
  const trees = useMemo(() => buildGardenTrees(counts, duaIds, zoom), [counts, zoom]);
  const isBarren = treeCount === 0;
  const isPanorama = zoom.t > 0;

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.oliveDeep }]}>
      <View style={styles.copy}>
        <Text
          style={[
            styles.label,
            theme.proseLayout,
            theme.labelDecoration,
            { color: theme.colors.sand, fontFamily: theme.labelFont },
          ]}
        >
          {t.garden.lifetime}
        </Text>
        <Text
          style={[
            styles.total,
            theme.proseLayout,
            { color: theme.colors.white, fontFamily: theme.labelFont },
          ]}
        >
          {formatNumber(total)}
        </Text>
        <Text
          style={[
            styles.caption,
            theme.proseLayout,
            {
              color: theme.colors.sand,
              fontFamily: theme.labelFont,
              lineHeight: theme.labelLineHeight(11, 1.4),
            },
          ]}
        >
          {gardenZoomCaption(zoom, treeCount, language)}
        </Text>
      </View>

      <Svg
        viewBox={`0 0 ${zoom.worldWidth} ${zoom.worldHeight}`}
        preserveAspectRatio="xMidYMid slice"
        style={[styles.scene, { aspectRatio: zoom.worldWidth / zoom.worldHeight }]}
      >
        <GardenGradients />
        <Rect x={0} y={0} width={zoom.worldWidth} height={zoom.worldHeight} fill="url(#gSky)" />
        <Rect x={0} y={0} width={zoom.worldWidth} height={zoom.worldHeight} fill="url(#gSun)" />
        <Rect x={0} y={0} width={zoom.worldWidth} height={zoom.worldHeight} fill="url(#gHaze)" />

        {isPanorama ? (
          <PanoramaScene
            worldWidth={zoom.worldWidth}
            worldHeight={zoom.worldHeight}
            rangeLayers={zoom.rangeLayers}
            fill={zoom.fill}
            trees={trees}
          />
        ) : (
          <ValleyScene trees={trees} isBarren={isBarren} />
        )}

        <Rect x={0} y={0} width={zoom.worldWidth} height={zoom.worldHeight} fill="#e8dcc8" opacity={0.08} />
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
  total: {
    fontSize: 26,
    marginTop: spacing.xs,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: spacing.xs,
    maxWidth: 300,
    opacity: 0.92,
  },
});

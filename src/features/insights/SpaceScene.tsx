import {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import type { JourneyProgress, Milestone } from '@/src/features/insights/dhikrDistance';
import { milestoneLabel } from '@/src/i18n/journeyText';
import { Language } from '@/src/types/misbaha';

export const SPACE_VIEW = { width: 360, height: 300 };

type Point = { x: number; y: number };

/** Trail node i (0 = Makkah on Earth) rising up the night sky. */
function spaceNode(i: number, count: number): Point {
  const f = count > 1 ? i / (count - 1) : 0;
  return {
    x: 156 + Math.sin(i * 0.95) * 30,
    y: 256 - f * 224,
  };
}

function pointAt(t: number, count: number): Point {
  const i0 = Math.max(0, Math.floor(t));
  const i1 = Math.min(count - 1, i0 + 1);
  const frac = t - i0;
  const a = spaceNode(i0, count);
  const b = spaceNode(i1, count);
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
}

const STARS: Array<{ x: number; y: number; r: number }> = [
  { x: 40, y: 40, r: 1.1 },
  { x: 96, y: 70, r: 0.8 },
  { x: 150, y: 30, r: 1.3 },
  { x: 210, y: 56, r: 0.9 },
  { x: 280, y: 36, r: 1.1 },
  { x: 320, y: 84, r: 0.8 },
  { x: 60, y: 120, r: 0.9 },
  { x: 300, y: 140, r: 1.2 },
  { x: 250, y: 110, r: 0.7 },
  { x: 110, y: 150, r: 0.8 },
  { x: 30, y: 190, r: 1.0 },
  { x: 330, y: 200, r: 0.9 },
];

function MilestoneGlyph({ id, x, y, reached }: { id: string; x: number; y: number; reached: boolean }) {
  const dim = reached ? 1 : 0.55;
  switch (id) {
    case 'atmosphere':
      return (
        <G opacity={dim}>
          <Ellipse cx={x} cy={y} rx={9} ry={3.6} fill="#9fb6cf" />
          <Ellipse cx={x + 6} cy={y - 1.5} rx={5} ry={3} fill="#bcd0e4" />
        </G>
      );
    case 'lowOrbit':
      return (
        <G opacity={dim}>
          <Rect x={x - 3} y={y - 3} width={6} height={6} rx={1.2} fill="#cfd7ea" />
          <Rect x={x - 9} y={y - 2} width={5} height={4} fill="#8a93b5" />
          <Rect x={x + 4} y={y - 2} width={5} height={4} fill="#8a93b5" />
        </G>
      );
    case 'geoOrbit':
      return (
        <G opacity={dim}>
          <Circle cx={x} cy={y} r={3} fill="#cfd7ea" />
          <Ellipse cx={x} cy={y} rx={9} ry={3.4} fill="none" stroke="#8a93b5" strokeWidth={1} />
        </G>
      );
    case 'moon':
      return (
        <G opacity={dim}>
          <Circle cx={x} cy={y} r={9} fill="#d7d3c4" />
          <Circle cx={x - 3} cy={y - 2} r={1.6} fill="#b9b4a2" />
          <Circle cx={x + 3} cy={y + 2} r={1.2} fill="#b9b4a2" />
          <Circle cx={x + 1} cy={y - 4} r={0.9} fill="#b9b4a2" />
        </G>
      );
    case 'mars':
      return (
        <G opacity={dim}>
          <Circle cx={x} cy={y} r={7} fill="#c1623a" />
          <Circle cx={x - 2} cy={y + 1} r={1.4} fill="#9c4a2a" />
          <Circle cx={x + 2.5} cy={y - 2} r={1} fill="#9c4a2a" />
        </G>
      );
    case 'sun':
      return (
        <G opacity={dim}>
          <Circle cx={x} cy={y} r={13} fill="#f6c24a" opacity={0.3} />
          <Circle cx={x} cy={y} r={8} fill="#f4b23c" />
          <Circle cx={x} cy={y} r={5} fill="#ffe08a" />
        </G>
      );
    default:
      return <Circle cx={x} cy={y} r={3} fill="#cfd7ea" opacity={dim} />;
  }
}

export function SpaceScene({
  milestones,
  progress,
  travelerT,
  language,
}: {
  milestones: Milestone[];
  progress: JourneyProgress;
  travelerT: number;
  language: Language;
}) {
  const count = milestones.length + 1;
  const nodes = Array.from({ length: count }, (_, i) => spaceNode(i, count));
  const walker = pointAt(travelerT, count);

  const fullPath = nodes.reduce(
    (d, p, i) => (i === 0 ? `M${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `${d} L${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
    '',
  );

  const reachedNode = Math.floor(travelerT);
  let reachedPath = `M${nodes[0].x.toFixed(1)} ${nodes[0].y.toFixed(1)}`;
  for (let i = 1; i <= reachedNode; i += 1) {
    reachedPath += ` L${nodes[i].x.toFixed(1)} ${nodes[i].y.toFixed(1)}`;
  }
  reachedPath += ` L${walker.x.toFixed(1)} ${walker.y.toFixed(1)}`;

  return (
    <>
      <Defs>
        <LinearGradient id="sSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0c1024" />
          <Stop offset="0.5" stopColor="#1b1c3e" />
          <Stop offset="1" stopColor="#2c2350" />
        </LinearGradient>
        <RadialGradient id="sGlow" cx="44%" cy="92%" rx="60%" ry="30%">
          <Stop offset="0" stopColor="#5b6cae" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#5b6cae" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="sEarth" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3a6ea5" />
          <Stop offset="1" stopColor="#1d3a5f" />
        </LinearGradient>
      </Defs>

      <Rect x={0} y={0} width={SPACE_VIEW.width} height={SPACE_VIEW.height} fill="url(#sSky)" />
      <Rect x={0} y={0} width={SPACE_VIEW.width} height={SPACE_VIEW.height} fill="url(#sGlow)" />

      {STARS.map((s) => (
        <Circle key={`${s.x}-${s.y}`} cx={s.x} cy={s.y} r={s.r} fill="#dfe4ff" opacity={0.8} />
      ))}

      {/* crescent moon accent */}
      <G opacity={0.85}>
        <Circle cx={316} cy={48} r={11} fill="#e8e3cf" />
        <Circle cx={311} cy={45} r={10} fill="#0c1024" />
      </G>

      {/* future trail */}
      <Path
        d={fullPath}
        stroke="#7d86bf"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeDasharray="1 7"
        fill="none"
        opacity={0.7}
      />
      {/* travelled trail */}
      <Path
        d={reachedPath}
        stroke="#e8c47a"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="2 7"
        fill="none"
      />

      {/* milestones */}
      {milestones.map((milestone, i) => {
        const node = nodes[i + 1];
        const reached = i <= progress.reachedIndex;
        const showLabel = reached || i === progress.nextIndex;
        return (
          <G key={milestone.id}>
            <MilestoneGlyph id={milestone.id} x={node.x} y={node.y} reached={reached} />
            {showLabel ? (
              <SvgText
                x={node.x + 18}
                y={node.y + 3}
                fill={reached ? '#f3ecd9' : '#aab2d6'}
                fontSize={9.5}
                fontWeight="600"
                textAnchor="start"
              >
                {milestoneLabel('space', milestone.id, language)}
              </SvgText>
            ) : null}
          </G>
        );
      })}

      {/* Earth horizon with Makkah */}
      <Path
        d={`M-40 300 C40 ${262} 320 ${262} 400 300 Z`}
        fill="url(#sEarth)"
      />
      <Path d={`M-40 300 C40 ${262} 320 ${262} 400 300`} stroke="#7fb0e0" strokeWidth={1.4} fill="none" opacity={0.6} />
      <G transform={`translate(${nodes[0].x}, ${nodes[0].y})`}>
        <Circle cx={0} cy={0} r={6} fill="#e8c47a" opacity={0.35} />
        <Rect x={-3.5} y={-3.5} width={7} height={7} rx={1} fill="#2a2622" />
        <Rect x={-3.5} y={-1.4} width={7} height={1.4} fill="#d9b25a" />
      </G>

      {/* traveller */}
      <G transform={`translate(${walker.x}, ${walker.y})`}>
        <Circle cx={0} cy={0} r={8} fill="#e8c47a" opacity={0.28} />
        <Circle cx={0} cy={0} r={3.4} fill="#fff7e2" stroke="#e8c47a" strokeWidth={1.6} />
      </G>
    </>
  );
}

import { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import type { JourneyProgress, Milestone } from '@/src/features/insights/dhikrDistance';
import { milestoneLabel } from '@/src/i18n/journeyText';
import { Language } from '@/src/types/misbaha';

export const EARTH_VIEW = { width: 360, height: 240 };

type Point = { x: number; y: number };

/** Trail node i (0 = Makkah) snaking from bottom-right up to top-left. */
function earthNode(i: number, count: number): Point {
  const f = count > 1 ? i / (count - 1) : 0;
  return {
    x: 322 - f * 288,
    y: 196 - f * 150 + Math.sin(i * 1.15) * 12,
  };
}

function pointAt(t: number, count: number): Point {
  const i0 = Math.max(0, Math.floor(t));
  const i1 = Math.min(count - 1, i0 + 1);
  const frac = t - i0;
  const a = earthNode(i0, count);
  const b = earthNode(i1, count);
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
}

export function EarthScene({
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
  const nodes = Array.from({ length: count }, (_, i) => earthNode(i, count));
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
        <LinearGradient id="eSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f5ecd2" />
          <Stop offset="0.55" stopColor="#ecd9af" />
          <Stop offset="1" stopColor="#ddc189" />
        </LinearGradient>
      </Defs>

      <Rect x={0} y={0} width={EARTH_VIEW.width} height={EARTH_VIEW.height} fill="url(#eSky)" />

      {/* faint topographic contours */}
      {[70, 110, 150, 190].map((y, i) => (
        <Path
          key={y}
          d={`M0 ${y} C90 ${y - 16} 180 ${y + 14} 270 ${y - 10} S360 ${y + 8} 360 ${y}`}
          stroke="#caac72"
          strokeWidth={1}
          fill="none"
          opacity={0.28 - i * 0.03}
        />
      ))}

      {/* future trail */}
      <Path
        d={fullPath}
        stroke="#b39a66"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray="1 7"
        fill="none"
        opacity={0.7}
      />
      {/* travelled trail */}
      <Path
        d={reachedPath}
        stroke="#c8922e"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeDasharray="2 7"
        fill="none"
      />

      {/* milestones */}
      {milestones.map((milestone, i) => {
        const node = nodes[i + 1];
        const reached = i <= progress.reachedIndex;
        const showLabel = reached || i === progress.nextIndex;
        const labelLeft = node.x > EARTH_VIEW.width - 96;
        return (
          <G key={milestone.id}>
            <Circle
              cx={node.x}
              cy={node.y}
              r={reached ? 4 : 3}
              fill={reached ? '#6f8f4e' : '#f5ecd2'}
              stroke={reached ? '#46612c' : '#a8946c'}
              strokeWidth={1.4}
            />
            {showLabel ? (
              <SvgText
                x={labelLeft ? node.x - 8 : node.x + 8}
                y={node.y + 3}
                fill="#4a3b2a"
                fontSize={9}
                fontWeight="600"
                textAnchor={labelLeft ? 'end' : 'start'}
              >
                {milestoneLabel('earth', milestone.id, language)}
              </SvgText>
            ) : null}
          </G>
        );
      })}

      {/* Makkah — Kaaba glyph + pin */}
      <G transform={`translate(${nodes[0].x}, ${nodes[0].y})`}>
        <Path d="M0 -4 C7 -4 9 4 0 13 C-9 4 -7 -4 0 -4 Z" fill="#c8922e" />
        <Circle cx={0} cy={-3} r={2.1} fill="#f5ecd2" />
        <Rect x={-6} y={13} width={12} height={11} rx={1.5} fill="#2a2622" />
        <Rect x={-6} y={16} width={12} height={2.2} fill="#d9b25a" />
        <SvgText x={0} y={34} fill="#4a3b2a" fontSize={9.5} fontWeight="700" textAnchor="middle">
          Makkah
        </SvgText>
      </G>

      {/* traveller */}
      <G transform={`translate(${walker.x}, ${walker.y})`}>
        <Circle cx={0} cy={0} r={7} fill="#c8922e" opacity={0.22} />
        <Circle cx={0} cy={0} r={3.4} fill="#fff7e2" stroke="#c8922e" strokeWidth={1.6} />
      </G>
    </>
  );
}

import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import { DayTimelineSlotId } from '@/src/types/misbaha';

type DayTimelineSlotIconProps = {
  slot: DayTimelineSlotId;
  color: string;
  size?: number;
};

const SKY_ARC = 'M 4.5 17.5 Q 12 5.5 19.5 17.5';

function Crescent({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <Path
      d={`M ${cx + r * 0.35} ${cy - r} A ${r} ${r} 0 1 0 ${cx + r * 0.35} ${cy + r} A ${r * 0.78} ${r * 0.78} 0 1 1 ${cx + r * 0.35} ${cy - r} Z`}
      fill={color}
    />
  );
}

function Star({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <Path
      d={`M${cx} ${cy - r}L${cx + r * 0.3} ${cy - r * 0.3}L${cx + r} ${cy}L${cx + r * 0.3} ${cy + r * 0.3}L${cx} ${cy + r}L${cx - r * 0.3} ${cy + r * 0.3}L${cx - r} ${cy}L${cx - r * 0.3} ${cy - r * 0.3}Z`}
      fill={color}
    />
  );
}

/** Day-arc icons — sun travels the sky path, then crescent and stars. */
export function DayTimelineSlotIcon({ slot, color, size = 26 }: DayTimelineSlotIconProps) {
  const sw = size * 0.072;
  const ink = {
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
  const arcInk = { ...ink, strokeWidth: sw * 0.9, opacity: 0.42 };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {slot === 'fajr' ? (
        <G>
          <Path d={SKY_ARC} {...arcInk} />
          <Circle cx={6.8} cy={14.8} r={2.8} fill={color} />
          <Line x1={4} y1={18.5} x2={20} y2={18.5} {...ink} />
        </G>
      ) : null}

      {slot === 'dhuhr' ? (
        <G>
          <Path d={SKY_ARC} {...arcInk} />
          <Circle cx={12} cy={7.2} r={3.2} fill={color} />
          <Line x1={4} y1={18.5} x2={20} y2={18.5} {...ink} />
        </G>
      ) : null}

      {slot === 'asr' ? (
        <G>
          <Path d={SKY_ARC} {...arcInk} />
          <Circle cx={16.8} cy={10.5} r={2.9} fill={color} />
          <Line x1={4} y1={18.5} x2={20} y2={18.5} {...ink} />
        </G>
      ) : null}

      {slot === 'maghrib' ? (
        <G>
          <Path d={SKY_ARC} {...arcInk} />
          <Circle cx={18.8} cy={16.2} r={2.5} fill={color} />
          <Line x1={4} y1={18.5} x2={20} y2={18.5} {...ink} />
        </G>
      ) : null}

      {slot === 'isha' ? (
        <G>
          <Path d={SKY_ARC} {...arcInk} opacity={0.28} />
          <Crescent cx={12} cy={12} r={4.5} color={color} />
          <Line x1={4} y1={18.5} x2={20} y2={18.5} {...ink} />
        </G>
      ) : null}

      {slot === 'night' ? (
        <G>
          <Star cx={8} cy={8.5} r={1.1} color={color} />
          <Star cx={13} cy={6.8} r={0.95} color={color} />
          <Star cx={17} cy={10.5} r={1.05} color={color} />
          <Star cx={11.5} cy={13.5} r={0.8} color={color} />
          <Circle cx={18.5} cy={15.5} r={0.55} fill={color} opacity={0.7} />
        </G>
      ) : null}
    </Svg>
  );
}

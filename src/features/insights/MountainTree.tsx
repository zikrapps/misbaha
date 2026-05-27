import { G, Path, Ellipse } from 'react-native-svg';

type MountainTreeProps = {
  x: number;
  y: number;
  scale?: number;
};

/** Dense evergreen cluster for sunlit hillside. */
export function MountainTree({ x, y, scale = 1 }: MountainTreeProps) {
  const s = scale;
  const trunk = '#3d2a1a';
  const shadow = '#1a2820';
  const dark = '#1a3a28';
  const mid = '#2a5238';
  const light = '#3d6b48';
  const highlight = '#4f7f58';

  return (
    <G transform={`translate(${x}, ${y}) scale(${s})`}>
      <Ellipse cx={0} cy={14} rx={16} ry={3.2} fill={shadow} opacity={0.35} />
      <Path d="M-2 12 L-1 -2 L1 -2 L2 12 Z" fill={trunk} />
      <Path
        d="M0 -18 C-14 -8 -18 4 -12 14 C-6 20 6 20 12 14 C18 4 14 -8 0 -18 Z"
        fill={dark}
      />
      <Ellipse cx={-9} cy={2} rx={11} ry={13} fill={mid} />
      <Ellipse cx={9} cy={1} rx={10} ry={12} fill={mid} />
      <Ellipse cx={0} cy={-6} rx={12} ry={14} fill={light} />
      <Ellipse cx={-5} cy={-10} rx={8} ry={9} fill={highlight} opacity={0.55} />
      <Path
        d="M-16 8 C-8 2 8 2 16 8"
        stroke={dark}
        strokeWidth={1.2}
        fill="none"
        opacity={0.4}
      />
    </G>
  );
}

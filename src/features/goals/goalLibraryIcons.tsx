import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/src/theme/theme';

export const goalLibraryIconNames = [
  'gl-sunrise',
  'gl-moon',
  'gl-beads',
  'gl-tasbih',
  'gl-scroll',
  'gl-dawn',
  'gl-drop',
  'gl-heart',
  'gl-shield',
  'gl-star',
  'gl-seed',
  'gl-book',
  'gl-lantern',
  'gl-dove',
  'gl-flame',
  'gl-prayer',
  'gl-cloud',
  'gl-hand',
  'gl-gem',
  'gl-tree',
  'gl-sprout',
  'gl-wind',
  'gl-wave',
  'gl-mount',
  'gl-key',
  'gl-ring',
  'gl-compass',
  'gl-crown',
  'gl-home',
  'gl-path',
  'gl-crescent',
  'gl-gift',
  'gl-hourglass',
  'gl-arch',
  'gl-minaret',
  'gl-muharram',
  'gl-safar',
  'gl-rabi1',
  'gl-rabi2',
  'gl-jumada1',
  'gl-jumada2',
  'gl-rajab',
  'gl-shaban',
  'gl-ramadan',
  'gl-shawwal',
  'gl-dhul-qadah',
  'gl-dhul-hijjah',
] as const;

export type GoalLibraryIconName = (typeof goalLibraryIconNames)[number];

const iconNameSet = new Set<string>(goalLibraryIconNames);

export function isGoalLibraryIcon(name: string | undefined): name is GoalLibraryIconName {
  return Boolean(name && iconNameSet.has(name));
}

type GoalLibraryIconProps = {
  name: GoalLibraryIconName;
  color?: string;
  size?: number;
};

export function GoalLibraryIcon({ name, color, size = 18 }: GoalLibraryIconProps) {
  const theme = useTheme();
  const stroke = color ?? theme.colors.oliveDark;
  const s = { stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 2 };
  const fill = stroke;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'gl-sunrise' ? (
        <G {...s}>
          <Path d="M4 16h16M6.5 13a5.5 5.5 0 0 1 11 0M12 5v3" />
          <Path d="M8.5 8.5 12 5l3.5 3.5" />
        </G>
      ) : null}
      {name === 'gl-moon' ? (
        <Path
          d="M9 5.5a7 7 0 1 0 0 13 5.5 5.5 0 1 1 0-13z"
          fill={fill}
        />
      ) : null}
      {name === 'gl-beads' ? (
        <G {...s}>
          <Path d="M5 14c3 4 11 4 14 0" />
          {[6, 9, 12, 15, 18].map((x) => (
            <Circle key={x} cx={x} cy={14} r={1.3} fill={fill} stroke="none" />
          ))}
        </G>
      ) : null}
      {name === 'gl-tasbih' ? (
        <G {...s}>
          <Circle cx={12} cy={6} r={2.2} />
          <Path d="M12 8.2v11M9.5 19.5h5" />
          <Circle cx={12} cy={12} r={1.2} fill={fill} stroke="none" />
        </G>
      ) : null}
      {name === 'gl-scroll' ? (
        <G {...s}>
          <Path d="M7 5h8a3 3 0 0 1 3 3v10a3 3 0 0 0-3-3H7z" />
          <Path d="M7 5a3 3 0 0 0-3 3v10a3 3 0 0 1 3-3" />
        </G>
      ) : null}
      {name === 'gl-dawn' ? (
        <G {...s}>
          <Path d="M4 17h16M8 14l4-7 4 7" />
          <Circle cx={18} cy={7} r={2} />
        </G>
      ) : null}
      {name === 'gl-drop' ? (
        <Path d="M12 4c-3 5-6 8-6 11a6 6 0 0 0 12 0c0-3-3-6-6-11z" {...s} />
      ) : null}
      {name === 'gl-heart' ? (
        <Path
          d="M12 20s-7-4.4-7-9.2C5 7.8 7.2 6 9.6 6c1.4 0 2.4.7 3.4 1.8C14 6.7 15 6 16.4 6 18.8 6 21 7.8 21 10.8 21 15.6 12 20 12 20z"
          {...s}
        />
      ) : null}
      {name === 'gl-shield' ? (
        <Path d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3z" {...s} />
      ) : null}
      {name === 'gl-star' ? (
        <Path
          d="m12 4 1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8L12 4z"
          {...s}
        />
      ) : null}
      {name === 'gl-seed' ? (
        <G {...s}>
          <Path d="M12 20c-4-3-6-7-6-10a6 6 0 0 1 12 0c0 3-2 7-6 10z" />
          <Path d="M12 10V6" />
        </G>
      ) : null}
      {name === 'gl-book' ? (
        <G {...s}>
          <Path d="M5 5h7a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V5z" />
          <Path d="M19 5h-4v13h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
        </G>
      ) : null}
      {name === 'gl-lantern' ? (
        <G {...s}>
          <Path d="M9 4h6l1 3H8l1-3zM8 7h8v10a4 4 0 0 1-8 0V7z" />
          <Path d="M10 20h4" />
        </G>
      ) : null}
      {name === 'gl-dove' ? (
        <G {...s}>
          <Path d="M4 12c2-1 4-1 6 1 2-2 5-2 8 0-2 3-5 6-9 7-1-2-2-5-5-8z" />
          <Path d="M7 11l-2-2" />
        </G>
      ) : null}
      {name === 'gl-flame' ? (
        <Path d="M12 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-4-4-5-4-9zM12 18v2" {...s} />
      ) : null}
      {name === 'gl-prayer' ? (
        <G fill={fill}>
          <Path d="M6 20V9.5C6 6.5 8.6 4 12 4s6 2.5 6 5.5V20H6z" />
          <Rect x={11.6} y={7.5} width={0.8} height={2.2} />
        </G>
      ) : null}
      {name === 'gl-cloud' ? (
        <Path d="M7 17h9a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6 1.8A3.5 3.5 0 0 0 7 17z" {...s} />
      ) : null}
      {name === 'gl-hand' ? (
        <G {...s}>
          <Path d="M8 11V5M11 11V4M14 11V5M17 11v6a5 5 0 0 1-10 0v-4l3-2" />
        </G>
      ) : null}
      {name === 'gl-gem' ? (
        <G {...s}>
          <Path d="M6 9 12 4l6 5-6 11L6 9z" />
          <Path d="M6 9h12M9 9l3 11 3-11" />
        </G>
      ) : null}
      {name === 'gl-tree' ? (
        <G {...s}>
          <Circle cx={12} cy={9} r={4} />
          <Path d="M12 13v7M9 20h6" />
        </G>
      ) : null}
      {name === 'gl-sprout' ? (
        <G {...s}>
          <Path d="M12 20V8M12 11c-3-2.5-5.5-2.2-7-.5 2.5.5 4.5.3 7 .5M12 9c3-2.5 5.5-2.2 7-.5-2.5.5-4.5.3-7 .5" />
        </G>
      ) : null}
      {name === 'gl-wind' ? (
        <G {...s}>
          <Path d="M4 8h11a3 3 0 1 0-3-3M4 12h14a3 3 0 1 1-3 3M4 16h9" />
        </G>
      ) : null}
      {name === 'gl-wave' ? (
        <G {...s}>
          <Path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        </G>
      ) : null}
      {name === 'gl-mount' ? (
        <G {...s}>
          <Path d="M4 18 10 8l4 6 3-4 3 8H4z" />
        </G>
      ) : null}
      {name === 'gl-key' ? (
        <G {...s}>
          <Circle cx={9} cy={11} r={3.5} />
          <Path d="M12 11h7M16 11v3" />
        </G>
      ) : null}
      {name === 'gl-ring' ? (
        <G {...s}>
          <Circle cx={12} cy={13} r={5} />
          <Path d="M10.5 8l1.5-3 1.5 3" />
        </G>
      ) : null}
      {name === 'gl-compass' ? (
        <G {...s}>
          <Circle cx={12} cy={12} r={8} />
          <Path d="m12 8 2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
        </G>
      ) : null}
      {name === 'gl-crown' ? (
        <G {...s}>
          <Path d="M4 17h16l-2-9-4 4-2-5-2 5-4-4-2 9z" />
          <Path d="M6 19h12" />
        </G>
      ) : null}
      {name === 'gl-home' ? (
        <G {...s}>
          <Path d="M4 11 12 5l8 6v8H4v-8z" />
          <Path d="M10 19v-5h4v5" />
        </G>
      ) : null}
      {name === 'gl-path' ? (
        <G {...s}>
          <Circle cx={6} cy={18} r={2} />
          <Circle cx={18} cy={6} r={2} />
          <Path d="M8 16c3-6 5-8 10-10" strokeDasharray="2 2" />
        </G>
      ) : null}
      {name === 'gl-crescent' ? (
        <G fill={fill}>
          <Path d="M8 6a6.5 6.5 0 1 0 0 12 4.5 4.5 0 1 1 0-12z" />
        </G>
      ) : null}
      {name === 'gl-gift' ? (
        <G {...s}>
          <Rect x={5} y={10} width={14} height={9} rx={1.5} />
          <Path d="M12 10v9M5 10h14M8.5 10c-2 0-2.5-3 0-3.5s2-1 3.5 0M15.5 10c2 0 2.5-3 0-3.5s-2-1-3.5 0" />
        </G>
      ) : null}
      {name === 'gl-hourglass' ? (
        <G {...s}>
          <Path d="M7 4h10v3l-5 5 5 5v3H7v-3l5-5-5-5V4z" />
        </G>
      ) : null}
      {name === 'gl-arch' ? (
        <G {...s}>
          <Path d="M5 18V11a7 7 0 0 1 14 0v7" />
          <Path d="M5 18h14" />
        </G>
      ) : null}
      {name === 'gl-minaret' ? (
        <G {...s}>
          <Path d="M12 4v2M10 20h4M11 6h2v14h-2zM9 9h6M8.5 12h7" />
          <Circle cx={12} cy={4} r={1.2} fill={fill} stroke="none" />
        </G>
      ) : null}
      {renderHilalIcon(name, s, fill)}
    </Svg>
  );
}

function renderHilalIcon(name: GoalLibraryIconName, s: object, fill: string) {
  const hilalNames: GoalLibraryIconName[] = [
    'gl-muharram',
    'gl-safar',
    'gl-rabi1',
    'gl-rabi2',
    'gl-jumada1',
    'gl-jumada2',
    'gl-rajab',
    'gl-shaban',
    'gl-ramadan',
    'gl-shawwal',
    'gl-dhul-qadah',
    'gl-dhul-hijjah',
  ];
  const index = hilalNames.indexOf(name);
  if (index < 0) return null;
  const dots = index + 1;
  return (
    <G {...s}>
      <Path d="M8 6.5a6 6 0 1 0 0 11 4.2 4.2 0 1 1 0-11z" fill={fill} stroke="none" />
      {Array.from({ length: Math.min(dots, 4) }, (_, i) => (
        <Circle key={i} cx={16 + (i % 2) * 2.5} cy={8 + Math.floor(i / 2) * 3.5} r={0.9} fill={fill} stroke="none" />
      ))}
    </G>
  );
}

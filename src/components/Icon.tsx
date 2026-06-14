import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { colors, useTheme } from '@/src/theme/theme';

export type IconName =
  | 'back'
  | 'beads'
  | 'check'
  | 'chevronDown'
  | 'export'
  | 'gear'
  | 'globe'
  | 'goal'
  | 'haptic'
  | 'leaf'
  | 'link'
  | 'moonStars'
  | 'open'
  | 'plus'
  | 'prayerMat'
  | 'quran'
  | 'reset'
  | 'search'
  | 'shuffle'
  | 'sound'
  | 'sprout'
  | 'sunrise'
  | 'visualize';

type IconProps = {
  name: IconName;
  color?: string;
  size?: number;
  strokeWidth?: number;
};

export function Icon({ name, color, size = 24, strokeWidth = 2.15 }: IconProps) {
  const theme = useTheme();
  const strokeColor = color ?? theme.colors.oliveDeep;
  const strokeProps = {
    stroke: strokeColor,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'gear' ? (
        <G {...strokeProps}>
          <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <Circle cx={12} cy={12} r={3} />
        </G>
      ) : null}
      {name === 'beads' ? (
        <G {...strokeProps}>
          <Path d="M4.5 14.5c3.2 4.2 12.2 4.2 15 0" />
          {[5, 8, 11, 14, 17, 19].map((x, index) => (
            <Circle key={x} cx={x} cy={14.5 + (index % 2 ? 1.1 : 0)} r={1.45} fill={strokeColor} stroke="none" />
          ))}
          <Path d="M12 14V5M12 5c1.7 1.3 3.3 1.2 4.8-.2M12 8.2c-1.8-1-3.3-.9-4.7.4" />
        </G>
      ) : null}
      {name === 'goal' ? (
        <G {...strokeProps}>
          <Path d="M12 20V4M12 5.5c2.4 1.6 4.3 1.6 6.2.1v7.7c-2 1.5-4.1 1.5-6.2-.1M12 9c-2.2-1.4-4.2-1.4-6.2.1v7.7c2-1.5 4.1-1.5 6.2.1" />
        </G>
      ) : null}
      {name === 'globe' ? (
        <G {...strokeProps}>
          <Circle cx={12} cy={12} r={8.2} />
          <Path d="M4.2 12h15.6" />
          <Path d="M12 3.8c2.4 2.6 3.8 5.8 3.8 8.2s-1.4 5.6-3.8 8.2c-2.4-2.6-3.8-5.8-3.8-8.2S9.6 6.4 12 3.8Z" />
        </G>
      ) : null}
      {name === 'visualize' ? (
        <G {...strokeProps}>
          <Path d="M4 19V5" />
          <Rect x={6} y={12} width={2.8} height={7} rx={1.2} fill={strokeColor} stroke="none" />
          <Rect x={11} y={8} width={2.8} height={11} rx={1.2} fill={strokeColor} stroke="none" />
          <Rect x={16} y={5} width={2.8} height={14} rx={1.2} fill={strokeColor} stroke="none" />
          <Path d="M5 19h15" />
        </G>
      ) : null}
      {name === 'sprout' ? (
        <G {...strokeProps}>
          <Path d="M12 20V7" />
          <Path d="M12 11c-3.2-3-6.2-2.7-8-.2 3 .7 5.4.4 8 .2Z" />
          <Path d="M12 8.7c3.3-3 6.2-2.7 8-.1-3 .7-5.4.4-8 .1Z" />
          <Path d="M12 15c2-2 4-2.3 6-1.1-1.9 1.4-3.8 1.8-6 1.1Z" />
        </G>
      ) : null}
      {name === 'reset' ? (
        <G {...strokeProps}>
          <Path d="M7.2 7.1A7 7 0 1 1 5.7 15" />
          <Path d="M7.2 7.1H3.8V3.7" />
        </G>
      ) : null}
      {name === 'search' ? (
        <G {...strokeProps}>
          <Circle cx={11} cy={11} r={6.5} />
          <Path d="M16 16l4 4" />
        </G>
      ) : null}
      {name === 'link' ? (
        <G {...strokeProps}>
          <Path d="M9.5 14.5 14.5 9.5" />
          <Path d="M10.5 7.4 12 5.9a4 4 0 0 1 5.7 5.7l-1.5 1.5" />
          <Path d="M13.5 16.6 12 18.1a4 4 0 0 1-5.7-5.7l1.5-1.5" />
        </G>
      ) : null}
      {name === 'open' ? (
        <G {...strokeProps}>
          <Path d="M6 18 18 6M11 6h7v7" />
          <Path d="M18 17.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.5" />
        </G>
      ) : null}
      {name === 'plus' ? (
        <G {...strokeProps}>
          <Path d="M12 5v14M5 12h14" />
        </G>
      ) : null}
      {name === 'shuffle' ? (
        <G {...strokeProps}>
          <Path d="M4 7h3.2c4.5 0 4.7 10 9.2 10H20" />
          <Path d="M4 17h3.2c1.4 0 2.3-.9 3.1-2.1M14 8.7c.7-1 1.5-1.7 2.4-1.7H20M17.5 4.5 20 7l-2.5 2.5M17.5 14.5 20 17l-2.5 2.5" />
        </G>
      ) : null}
      {name === 'export' ? (
        <G {...strokeProps}>
          <Path d="M12 15V4M8.5 7.5 12 4l3.5 3.5" />
          <Path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" />
        </G>
      ) : null}
      {name === 'sound' ? (
        <G {...strokeProps}>
          <Path d="M5 10v4h3l4 3.3V6.7L8 10H5Z" />
          <Path d="M16 9c1.2 1.7 1.2 4.3 0 6M18.5 7c2.3 2.8 2.3 7.2 0 10" />
        </G>
      ) : null}
      {name === 'haptic' ? (
        <G {...strokeProps}>
          <Rect x={8} y={3} width={8} height={18} rx={2} />
          <Path d="M5 8c-1 2.2-1 5.8 0 8M19 8c1 2.2 1 5.8 0 8" />
        </G>
      ) : null}
      {name === 'back' ? (
        <G {...strokeProps}>
          <Path d="M15 5 8 12l7 7" />
        </G>
      ) : null}
      {name === 'check' ? (
        <G {...strokeProps}>
          <Path d="m5 12.5 4.2 4.2L19 7" />
        </G>
      ) : null}
      {name === 'chevronDown' ? (
        <G {...strokeProps}>
          <Path d="M6 9l6 6 6-6" />
        </G>
      ) : null}
      {name === 'leaf' ? (
        <G {...strokeProps}>
          <Path d="M5 15.5C6 7.5 13 4.5 20 5c-.3 7.2-4.5 12.2-12.6 12.3" />
          <Path d="M5 19c3-5 7.4-8 13-10" />
        </G>
      ) : null}
      {name === 'quran' ? (
        <G fill={strokeColor}>
          <Path d="M11.4 7.7C8.7 6.1 5.3 6.1 2.7 7.5v8.3c2.6-1.4 6-1.4 8.7.2z" />
          <Path d="M12.6 7.7c2.7-1.6 6.1-1.6 8.7-.2v8.3c-2.6-1.4-6-1.4-8.7.2z" />
          <Path d="M5 16.1h1.9l6.5 4.6h-1.9z" />
          <Path d="M19 16.1h-1.9l-6.5 4.6h1.9z" />
        </G>
      ) : null}
      {name === 'prayerMat' ? (
        <G fill={strokeColor}>
          <Path
            fillRule="evenodd"
            d="M4.5 21V10.8C4.5 6.7 7.9 3.6 12 3.6s7.5 3.1 7.5 7.2V21zM7.3 21v-9.9C7.3 8.3 9.4 6.1 12 6.1s4.7 2.2 4.7 5V21z"
          />
          <Rect x={11.7} y={6} width={0.6} height={3.1} />
          <Path d="M12 8.9 13.6 10.3 13.6 12.1 12 13.5 10.4 12.1 10.4 10.3Z" />
          <Rect x={11.6} y={13.4} width={0.8} height={1} />
        </G>
      ) : null}
      {name === 'sunrise' ? (
        <G fill={strokeColor}>
          <Path d="M6.2 14a5.8 5.8 0 0 1 11.6 0z" />
          <Rect x={3} y={15.5} width={18} height={1.5} rx={0.75} />
          <Rect x={6.6} y={18.2} width={10.8} height={1.4} rx={0.7} />
          <G stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round">
            <Path d="M12 6.4V3.8" />
            <Path d="M7.9 7.7 6.4 6.2" />
            <Path d="M16.1 7.7 17.6 6.2" />
            <Path d="M5.8 10.6 3.9 9.8" />
            <Path d="M18.2 10.6 20.1 9.8" />
          </G>
        </G>
      ) : null}
      {name === 'moonStars' ? (
        <G fill={strokeColor}>
          <Path d="M8 4.3a8 8 0 1 0 0 15.4 6.2 6.2 0 0 1 0-15.4z" />
          <Path d="M16 4.9 16.7 6.7 18.6 6.7 17.1 7.9 17.7 9.7 16 8.6 14.3 9.7 14.9 7.9 13.4 6.7 15.3 6.7Z" />
          <Path d="M17.4 12.2 17.85 13.4 19.05 13.85 17.85 14.3 17.4 15.5 16.95 14.3 15.75 13.85 16.95 13.4Z" />
        </G>
      ) : null}
    </Svg>
  );
}

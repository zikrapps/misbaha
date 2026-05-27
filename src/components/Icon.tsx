import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { colors, useTheme } from '@/src/theme/theme';

export type IconName =
  | 'back'
  | 'beads'
  | 'check'
  | 'chevronDown'
  | 'export'
  | 'gear'
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
        <G {...strokeProps}>
          <Path d="M4.8 20 9 16.2M19.2 20 15 16.2" strokeWidth={1.2} />
          <Path d="M12 8.5v9.2" />
          <Path d="M12 9.1c-2.5-1.5-5.4-1.7-7.8 0v8.5c2.4-1.5 5.3-1.3 7.8.3" />
          <Path d="M12 9.1c2.5-1.5 5.4-1.7 7.8 0v8.5c-2.4-1.5-5.3-1.3-7.8.3" />
          <Path d="M5.7 11.6h4.6M5.9 13.4h4.4M5.7 15.2h4.6" strokeWidth={0.95} />
          <Path d="M13.7 11.6h4.6M13.7 13.4h4.4M13.7 15.2h4.6" strokeWidth={0.95} />
          <Path d="M12 6.4V3.2M8.7 6.6 7.1 4.9M15.3 6.6 16.9 4.9" strokeWidth={1.25} />
          <Path d="M10.4 5.4 9.6 3.6M13.6 5.4l.8-1.8" strokeWidth={1.05} />
        </G>
      ) : null}
      {name === 'prayerMat' ? (
        <G {...strokeProps}>
          <Path d="M6.6 3.8h10.8v16.4H6.6z" />
          <Path d="M8.3 5.5h7.4v13H8.3z" strokeWidth={0.95} />
          <Path d="M9.5 13.2V9.6a2.5 2.5 0 0 1 5 0v3.6z" strokeWidth={1.2} />
          <Path d="M12 7.7v1.3" strokeWidth={1.05} />
          <Path d="M11.4 9.3 12 10l.6-.7" strokeWidth={1.05} />
          <Circle cx={12} cy={11.1} r={0.55} fill={strokeColor} stroke="none" />
          <Path d="M9.7 15.6h4.6M10.2 17h3.6" strokeWidth={0.9} />
          <Path d="M7.6 3.8V2.7M9.4 3.8V2.5M11.2 3.8V2.7M12.8 3.8V2.5M14.6 3.8V2.7M16.4 3.8V2.5" strokeWidth={0.95} />
          <Path d="M7.6 20.2v1.1M9.4 20.2v1.3M11.2 20.2v1.1M12.8 20.2v1.3M14.6 20.2v1.1M16.4 20.2v1.3" strokeWidth={0.95} />
        </G>
      ) : null}
      {name === 'sunrise' ? (
        <G {...strokeProps}>
          <Path d="M2 19h20" />
          <Path d="M3.5 19c1.4-2 2.9-2 4.4 0M8.5 19c1.5-2.6 3.4-2.6 5 0M14 19c1-1.5 2.4-1.5 3.4 0" strokeWidth={1.05} />
          <Path d="M7 19a5 5 0 0 1 10 0" />
          <Path d="M9.3 19a2.7 2.7 0 0 1 5.4 0" strokeWidth={1.15} />
          <Path d="M12 9V5.6" strokeWidth={1.35} />
          <Path d="M7.3 11 5.6 9.3M16.7 11l1.7-1.7" strokeWidth={1.35} />
          <Path d="M3.8 14.4H1.8M22.2 14.4h-2" strokeWidth={1.35} />
          <Path d="M4.6 11.9 3.2 11.2M19.4 11.9l1.4-.7" strokeWidth={1.15} />
          <Path d="M9.4 9.8 8.7 8M14.6 9.8l.7-1.8" strokeWidth={1.15} />
        </G>
      ) : null}
      {name === 'moonStars' ? (
        <G {...strokeProps}>
          <Path d="M17 4.2a7.8 7.8 0 1 0 0 15.6 6 6 0 0 1 0-15.6z" />
          <Path d="M15.6 8.4a3.6 3.6 0 0 0 0 7.2" strokeWidth={1.0} />
          <Path
            d="m6.6 6.5.65 1.7 1.7.65-1.7.65-.65 1.7-.65-1.7L4.25 8.85l1.7-.65z"
            fill={strokeColor}
            stroke="none"
          />
          <Path
            d="m4 14.2.45 1.15 1.15.45-1.15.45-.45 1.15-.45-1.15L2.4 15.8l1.15-.45z"
            fill={strokeColor}
            stroke="none"
          />
          <Path
            d="m9.4 18.2.35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35z"
            fill={strokeColor}
            stroke="none"
          />
          <Circle cx={9.5} cy={4.6} r={0.65} fill={strokeColor} stroke="none" />
          <Circle cx={2.6} cy={10.5} r={0.55} fill={strokeColor} stroke="none" />
          <Circle cx={11.2} cy={11.4} r={0.45} fill={strokeColor} stroke="none" />
        </G>
      ) : null}
    </Svg>
  );
}

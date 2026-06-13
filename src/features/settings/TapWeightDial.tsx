import { useAudioPlayer } from 'expo-audio';
import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import { formatNumber } from '@/src/i18n/format';
import { useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';

type TapWeightDialProps = {
  value: number;
  clickSoundEnabled: boolean;
  onChange: (value: number) => void;
};

const MIN = 1;
const MAX = 10;

const SIZE = 260;
const ARC_HEIGHT = 188;
const KNOB_R = 23;
/** Keep the knob circle inside the SVG viewBox on every screen width. */
const VIEW_PAD = KNOB_R + 8;
const VIEW_W = SIZE + VIEW_PAD * 2;
const VIEW_H = ARC_HEIGHT + VIEW_PAD;
const CX = VIEW_PAD + SIZE / 2;
const CY = 132;
const RADIUS = 104;
const BAND = 24;
const START_ANGLE = 160;
const SWEEP = 220;

const TRACK_PAD = 18;
const TRACK_W = SIZE - TRACK_PAD * 2;
const TRACK_LEFT = VIEW_PAD + TRACK_PAD;
const THUMB_W = 38;
const THUMB_H = 22;

const TICKS = Array.from({ length: MAX }, (_, index) => index + 1);

const toRad = (deg: number) => (deg * Math.PI) / 180;
const clamp = (n: number) => Math.min(MAX, Math.max(MIN, n));

const angleForValue = (value: number) => START_ANGLE + ((value - MIN) / (MAX - MIN)) * SWEEP;

const pointOnArc = (angleDeg: number, radius: number) => ({
  x: CX + Math.cos(toRad(angleDeg)) * radius,
  y: CY + Math.sin(toRad(angleDeg)) * radius,
});

/** A single pointed-almond petal pointing up from (cx, cy) out to radius R. */
function petalUp(cx: number, cy: number, R: number, ri: number, hw: number) {
  const c1 = ri + (R - ri) * 0.25;
  const c2 = ri + (R - ri) * 0.75;
  return `M ${cx} ${cy - ri} C ${cx + hw} ${cy - c1} ${cx + hw} ${cy - c2} ${cx} ${cy - R} C ${cx - hw} ${cy - c2} ${cx - hw} ${cy - c1} ${cx} ${cy - ri} Z`;
}

/** Eight-petal line-art rosette (knob & slider thumb). */
function Rosette({ cx, cy, r, color, strokeWidth }: { cx: number; cy: number; r: number; color: string; strokeWidth: number }) {
  const d = petalUp(cx, cy, r, r * 0.14, r * 0.34);
  return (
    <G>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <Path
          key={a}
          d={d}
          rotation={a}
          originX={cx}
          originY={cy}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <Circle cx={cx} cy={cy} r={Math.max(0.8, r * 0.1)} fill={color} />
    </G>
  );
}

/** Four-petal filled quatrefoil (arc end-caps). */
function Quatrefoil({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const d = petalUp(cx, cy, r, r * 0.22, r * 0.46);
  return (
    <G>
      {[0, 90, 180, 270].map((a) => (
        <Path key={a} d={d} rotation={a} originX={cx} originY={cy} fill={color} />
      ))}
    </G>
  );
}

export function TapWeightDial({ value, clickSoundEnabled, onChange }: TapWeightDialProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const player = useAudioPlayer(require('../../../assets/click.wav'));

  const [layoutWidth, setLayoutWidth] = useState(VIEW_W);
  const layoutWidthRef = useRef(VIEW_W);
  layoutWidthRef.current = layoutWidth;
  const lastRef = useRef(value);
  lastRef.current = value;
  const clickRef = useRef(clickSoundEnabled);
  clickRef.current = clickSoundEnabled;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const apply = (next: number) => {
    const clamped = clamp(Math.round(next));
    if (clamped === lastRef.current) {
      return;
    }
    lastRef.current = clamped;
    onChangeRef.current(clamped);
    if (clickRef.current) {
      player.seekTo(0).then(() => player.play()).catch(() => undefined);
    }
  };

  const arcPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => valueFromArc(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onPanResponderMove: (evt) => valueFromArc(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      }),
    [],
  );

  const trackPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => valueFromTrack(evt.nativeEvent.locationX),
        onPanResponderMove: (evt) => valueFromTrack(evt.nativeEvent.locationX),
      }),
    [],
  );

  function svgX(locationX: number) {
    return locationX * (VIEW_W / layoutWidthRef.current);
  }

  function valueFromTrack(locationX: number) {
    const fraction = (svgX(locationX) - TRACK_LEFT) / TRACK_W;
    apply(MIN + fraction * (MAX - MIN));
  }

  function valueFromArc(locationX: number, locationY: number) {
    const scale = VIEW_W / layoutWidthRef.current;
    const sx = locationX * scale;
    const sy = locationY * scale;
    let theta = (Math.atan2(sy - CY, sx - CX) * 180) / Math.PI;
    if (theta < 0) {
      theta += 360;
    }
    if (theta > 20 && theta < START_ANGLE) {
      apply(theta <= 90 ? MAX : MIN);
      return;
    }
    const normalized = theta < START_ANGLE ? theta + 360 : theta;
    const fraction = (normalized - START_ANGLE) / SWEEP;
    apply(MIN + fraction * (MAX - MIN));
  }

  const bandStart = pointOnArc(START_ANGLE, RADIUS);
  const bandEnd = pointOnArc(START_ANGLE + SWEEP, RADIUS);
  const bandPath = `M ${bandStart.x} ${bandStart.y} A ${RADIUS} ${RADIUS} 0 1 1 ${bandEnd.x} ${bandEnd.y}`;
  const knob = pointOnArc(angleForValue(value), RADIUS);

  const thumbX = TRACK_LEFT + ((value - MIN) / (MAX - MIN)) * TRACK_W;
  const layoutScale = layoutWidth / VIEW_W;
  const trackLeft = TRACK_LEFT * layoutScale;
  const thumbLeft = thumbX * layoutScale - THUMB_W / 2;

  return (
    <View
      style={styles.wrap}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        layoutWidthRef.current = width;
        setLayoutWidth(width);
      }}
      accessible
      accessibilityRole="adjustable"
      accessibilityValue={{ min: MIN, max: MAX, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') {
          apply(value + 1);
        } else if (event.nativeEvent.actionName === 'decrement') {
          apply(value - 1);
        }
      }}
    >
      <View style={styles.arc}>
        <View style={StyleSheet.absoluteFill} {...arcPan.panHandlers} />
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          pointerEvents="none"
        >
          <Path
            d={bandPath}
            stroke={colors.sand}
            strokeWidth={BAND}
            strokeLinecap="round"
            fill="none"
            opacity={0.6}
          />
          {TICKS.map((tick) => {
            const angle = angleForValue(tick);
            const inner = pointOnArc(angle, RADIUS - 6);
            const outer = pointOnArc(angle, RADIUS + 6);
            return (
              <Line
                key={tick}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={colors.oliveDark}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.45}
              />
            );
          })}
          <Quatrefoil cx={bandStart.x} cy={bandStart.y} r={7} color={colors.blush} />
          <Quatrefoil cx={bandEnd.x} cy={bandEnd.y} r={7} color={colors.blush} />
          <Circle
            cx={knob.x}
            cy={knob.y}
            r={KNOB_R}
            fill={colors.oliveDark}
            stroke={colors.cream}
            strokeWidth={1.5}
            strokeOpacity={0.3}
          />
          <Rosette cx={knob.x} cy={knob.y} r={13} strokeWidth={1.4} color={colors.cream} />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={[styles.value, { color: colors.oliveDark, fontFamily: theme.fonts.display }]}>
            {formatNumber(value)}
          </Text>
          <Text style={[styles.caption, { color: colors.oliveDark }]}>{t.settings.perTap}</Text>
        </View>
      </View>

      <View style={styles.sliderArea} {...trackPan.panHandlers}>
        <View style={[styles.track, { backgroundColor: colors.line, marginHorizontal: trackLeft }]} />
        <View
          style={[
            styles.trackFill,
            {
              backgroundColor: colors.blush,
              left: trackLeft,
              width: Math.max(0, thumbX * layoutScale - trackLeft),
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            { backgroundColor: colors.oliveDark, left: thumbLeft },
          ]}
          pointerEvents="none"
        >
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Rosette cx={10} cy={10} r={7} strokeWidth={1} color={colors.cream} />
          </Svg>
        </View>
      </View>

      <View style={[styles.scale, { paddingHorizontal: Math.max(0, trackLeft - 4) }]}>
        {[MIN, 5, MAX].map((label) => (
          <Text key={label} style={[styles.scaleLabel, { color: colors.oliveDark, fontFamily: theme.fonts.display }]}>
            {formatNumber(label)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.md,
    maxWidth: VIEW_W,
    width: '100%',
  },
  arc: {
    aspectRatio: VIEW_W / VIEW_H,
    overflow: 'visible',
    width: '100%',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  value: {
    fontSize: 54,
    lineHeight: 60,
  },
  caption: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sliderArea: {
    height: 36,
    justifyContent: 'center',
    width: '100%',
  },
  track: {
    borderRadius: radii.pill,
    height: 4,
  },
  trackFill: {
    borderRadius: radii.pill,
    height: 4,
    position: 'absolute',
  },
  thumb: {
    alignItems: 'center',
    borderRadius: THUMB_H / 2,
    height: THUMB_H,
    justifyContent: 'center',
    position: 'absolute',
    width: THUMB_W,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  scaleLabel: {
    fontSize: 16,
  },
});

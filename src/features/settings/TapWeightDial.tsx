import { useAudioPlayer } from 'expo-audio';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { formatNumber } from '@/src/i18n/format';
import { useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';

type TapWeightDialProps = {
  value: number;
  clickSoundEnabled: boolean;
  onChange: (value: number) => void;
};

export function TapWeightDial({ value, clickSoundEnabled, onChange }: TapWeightDialProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const player = useAudioPlayer(require('../../../assets/click.wav'));
  const ticks = useMemo(() => Array.from({ length: 10 }, (_, index) => index + 1), []);
  const angle = -135 + ((value - 1) / 9) * 270;

  const update = (next: number) => {
    onChange(next);
    if (clickSoundEnabled) {
      player.seekTo(0).then(() => player.play()).catch(() => undefined);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.dial}>
        <Svg width={230} height={230} viewBox="0 0 230 230">
          <Circle cx={115} cy={115} r={100} fill={colors.sand} opacity={0.72} />
          <Circle cx={115} cy={115} r={70} fill={colors.card} opacity={0.8} />
          {ticks.map((tick) => {
            const tickAngle = (-135 + ((tick - 1) / 9) * 270) * (Math.PI / 180);
            const x1 = 115 + Math.cos(tickAngle) * 86;
            const y1 = 115 + Math.sin(tickAngle) * 86;
            const x2 = 115 + Math.cos(tickAngle) * 94;
            const y2 = 115 + Math.sin(tickAngle) * 94;
            return <Line key={tick} x1={x1} x2={x2} y1={y1} y2={y2} stroke={colors.oliveDark} strokeWidth={2} />;
          })}
          <Line
            x1={115}
            x2={115 + Math.cos((angle * Math.PI) / 180) * 72}
            y1={115}
            y2={115 + Math.sin((angle * Math.PI) / 180) * 72}
            stroke={colors.blush}
            strokeLinecap="round"
            strokeWidth={4}
          />
          <Circle cx={115} cy={115} r={42} fill={colors.olive} />
        </Svg>
        <View style={styles.center}>
          <Text style={[styles.value, { color: colors.card, fontFamily: theme.fonts.display }]}>{formatNumber(value)}</Text>
          <Text style={[styles.caption, { color: colors.card }]}>{t.settings.perTap}</Text>
        </View>
      </View>
      <View style={styles.pills}>
        {ticks.map((tick) => (
          <Pressable
            key={tick}
            onPress={() => update(tick)}
            style={[
              styles.pill,
              { backgroundColor: colors.card, borderColor: colors.line },
              tick === value && { backgroundColor: colors.olive },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                { color: colors.oliveDark },
                tick === value && { color: colors.card },
              ]}
            >
              {formatNumber(tick)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  dial: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    position: 'absolute',
  },
  value: {
    fontSize: 34,
  },
  caption: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  pill: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  pillText: {
    fontWeight: '800',
  },
});

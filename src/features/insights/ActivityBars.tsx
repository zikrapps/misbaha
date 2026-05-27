import { StyleSheet, View } from 'react-native';

import { radii, useTheme } from '@/src/theme/theme';

type ActivityBarsProps = {
  values: number[];
};

export function ActivityBars({ values }: ActivityBarsProps) {
  const { colors } = useTheme();
  const max = Math.max(1, ...values);

  return (
    <View style={styles.wrap}>
      {values.map((value, index) => (
        <View key={`${index}-${value}`} style={styles.slot}>
          <View
            style={[
              styles.bar,
              {
                height: 12 + (value / max) * 72,
                backgroundColor: index > values.length - 4 ? colors.blush : colors.olive,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 3,
    height: 96,
  },
  slot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: radii.sm,
    minHeight: 4,
  },
});

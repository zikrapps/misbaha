import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/src/theme/theme';

type GoalGridProps = {
  children: ReactNode;
};

/** Two goal tiles per row. */
export function GoalGrid({ children }: GoalGridProps) {
  return <View style={styles.grid}>{children}</View>;
}

type GoalGridItemProps = {
  children: ReactNode;
  fullWidth?: boolean;
};

export function GoalGridItem({ children, fullWidth }: GoalGridItemProps) {
  return <View style={[styles.item, fullWidth && styles.itemFull]}>{children}</View>;
}

const GUTTER = spacing.sm;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GUTTER / 2,
  },
  item: {
    alignItems: 'stretch',
    marginBottom: GUTTER,
    paddingHorizontal: GUTTER / 2,
    width: '50%',
  },
  itemFull: {
    width: '100%',
  },
});

import { Pressable, StyleSheet } from 'react-native';

import { radii, shadow, useTheme } from '@/src/theme/theme';
import { Icon, IconName } from './Icon';

type IconButtonProps = {
  name: IconName;
  onPress: () => void;
  testID?: string;
};

export function IconButton({ name, onPress, testID }: IconButtonProps) {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={[styles.button, { backgroundColor: colors.oliveDeep, borderColor: colors.oliveDark }]}
    >
      <Icon name={name} color={colors.white} size={20} strokeWidth={2.35} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    height: 40,
    justifyContent: 'center',
    width: 40,
    ...shadow,
  },
});

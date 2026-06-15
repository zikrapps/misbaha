import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';

type TabBarButtonProps = BottomTabBarButtonProps & {
  testID: string;
};

/** Tab bar button with a stable testID for DevLoop / XCUITest. */
export function TabBarButton({ testID, ...props }: TabBarButtonProps) {
  return <PlatformPressable {...props} testID={testID} />;
}

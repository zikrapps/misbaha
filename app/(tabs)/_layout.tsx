import { Tabs, router } from 'expo-router';

import { Icon, IconName } from '@/src/components/Icon';
import { useT } from '@/src/i18n/strings';
import { TAB_BAR_HEIGHT_EN, TAB_BAR_HEIGHT_UR } from '@/src/theme/tabBar';
import { useTheme } from '@/src/theme/theme';

const tabIcon = (name: IconName) =>
  function TabIcon({ color, focused }: { color: string; focused: boolean }) {
    return <Icon name={name} color={color} size={focused ? 25 : 22} />;
  };

export default function TabsLayout() {
  const theme = useTheme();
  const colors = theme.colors;
  const t = useT();
  const isUrdu = theme.language === 'ur';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.sand,
        tabBarStyle: {
          backgroundColor: colors.oliveDeep,
          borderTopColor: colors.oliveDark,
          // Naskh labels sit taller than Latin; give the bar more room in Urdu
          // so descenders and the larger type aren't clipped.
          height: isUrdu ? TAB_BAR_HEIGHT_UR : TAB_BAR_HEIGHT_EN,
          paddingBottom: isUrdu ? 16 : 14,
          paddingTop: 10,
          position: 'absolute',
          ...(isUrdu ? { flexDirection: 'row-reverse' as const } : {}),
        },
        tabBarLabelStyle: {
          fontFamily: theme.labelFont,
          fontSize: isUrdu ? theme.typo.micro + 2 : theme.typo.caption,
          lineHeight: isUrdu ? theme.labelLineHeight(theme.typo.micro + 2, 1.4) : undefined,
          ...theme.proseCenterLayout,
        },
        tabBarIconStyle: isUrdu ? { marginBottom: 2 } : undefined,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabs.today, tabBarIcon: tabIcon('sprout') }} />
      <Tabs.Screen name="duas" options={{ title: t.tabs.tasbeeh, tabBarIcon: tabIcon('beads') }} />
      <Tabs.Screen
        name="goals"
        options={{ title: t.tabs.goals, tabBarIcon: tabIcon('goal') }}
        listeners={{
          tabPress: () => {
            router.replace('/goals');
          },
        }}
      />
      <Tabs.Screen name="insights" options={{ title: t.tabs.visualize, tabBarIcon: tabIcon('visualize') }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

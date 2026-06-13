import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BadgeDef } from '@/src/data/badges';
import { badgeSvgXml } from './badgeArt';

type BadgeMedalProps = {
  badge: BadgeDef;
  earned: boolean;
  /** Fixed pixel size; when omitted the medal fills its (square) container. */
  size?: number;
};

export function BadgeMedal({ badge, earned, size }: BadgeMedalProps) {
  const xml = badgeSvgXml(badge, earned);
  if (size !== undefined) {
    return <SvgXml xml={xml} width={size} height={size} />;
  }
  return (
    <View style={{ width: '100%', aspectRatio: 1 }}>
      <SvgXml xml={xml} width="100%" height="100%" />
    </View>
  );
}

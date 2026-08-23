import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';

export type OutlineIconName = keyof typeof MaterialCommunityIcons.glyphMap;

type OutlineIconProps = {
  name: OutlineIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function OutlineIcon({ name, size = 22, color = '#A1000B', style }: OutlineIconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}

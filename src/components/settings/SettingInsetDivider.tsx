import { View } from 'react-native';

import { settingDividerStyle } from './settingStyles';
import { useThemeColors } from '@/hooks/useThemeColors';

export function SettingInsetDivider() {
  const c = useThemeColors();

  return <View style={[settingDividerStyle(), { backgroundColor: c.borderNeutral }]} />;
}

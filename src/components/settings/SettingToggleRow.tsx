import { Switch } from 'react-native';

import { AppText } from '../AppText';
import { BaseSettingItem } from './BaseSettingItem';
import { settingRowLabelStyle } from './settingStyles';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
};

export function SettingToggleRow({ label, value, onToggle }: Props) {
  const c = useThemeColors();

  return (
    <BaseSettingItem accessibilityLabel={label}>
      <AppText variant="body" style={settingRowLabelStyle()} numberOfLines={1}>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: c.surfaceMuted, true: c.primary }}
        thumbColor={value ? c.onPrimary : c.inkTertiary}
        ios_backgroundColor={c.surfaceMuted}
        accessibilityLabel={label}
      />
    </BaseSettingItem>
  );
}

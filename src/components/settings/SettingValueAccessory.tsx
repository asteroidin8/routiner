import { View } from 'react-native';

import { AppIcon } from '../AppIcon';
import { AppText } from '../AppText';
import { SETTING_CHEVRON_SIZE, settingValueAccessoryStyle } from './settingStyles';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  value?: string;
  unset?: boolean;
  showChevron?: boolean;
};

/** value + chevron — baseline·center 정렬 통일 */
export function SettingValueAccessory({ value, unset, showChevron = true }: Props) {
  const c = useThemeColors();

  if (value === undefined && !showChevron) {
    return null;
  }

  return (
    <View style={settingValueAccessoryStyle()}>
      {value !== undefined && (
        <AppText variant="body" tone={unset ? 'tertiary' : 'secondary'} numberOfLines={1}>
          {value}
        </AppText>
      )}
      {showChevron && <AppIcon name="ChevronRight" size={SETTING_CHEVRON_SIZE} color={c.inkTertiary} />}
    </View>
  );
}

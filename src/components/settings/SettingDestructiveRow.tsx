import { AppText } from '../AppText';
import { BaseSettingItem } from './BaseSettingItem';
import { settingRowLabelStyle } from './settingStyles';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  label: string;
  onPress: () => void;
};

/** 파괴적 행 — danger 라벨, 확인 다이얼로그에서 destructive 버튼 */
export function SettingDestructiveRow({ label, onPress }: Props) {
  const c = useThemeColors();

  return (
    <BaseSettingItem onPress={onPress} accessibilityLabel={label}>
      <AppText
        variant="body"
        style={[settingRowLabelStyle(), { color: c.danger, fontWeight: '500' }]}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </BaseSettingItem>
  );
}

/** @alias SettingDestructiveRow */
export const SettingDangerRow = SettingDestructiveRow;

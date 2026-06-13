import { Pressable } from 'react-native';

import { AppText } from './AppText';
import { spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  label: string;
  onPress: () => void;
};

/** 데이터 등 — 카드 없이 destructive 행 */
export function SettingDestructiveRow({ label, onPress }: Props) {
  const c = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: spacing.screen,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <AppText variant="body" style={{ color: c.danger, fontWeight: '500' }}>
        {label}
      </AppText>
    </Pressable>
  );
}

import { Switch, View } from 'react-native';

import { AppText } from './AppText';
import { spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
};

export function SettingToggleRow({ label, description, value, onToggle }: Props) {
  const c = useThemeColors();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.card,
        paddingVertical: spacing.item,
        gap: 12,
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={description ? `${label}, ${description}` : label}
    >
      <View style={{ flex: 1 }}>
        <AppText variant="body">{label}</AppText>
        {description && (
          <AppText variant="caption" tone="tertiary" style={{ marginTop: 3, lineHeight: 17 }}>
            {description}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: c.surfaceMuted, true: c.ink }}
        thumbColor={c.surface}
      />
    </View>
  );
}

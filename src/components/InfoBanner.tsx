import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { radius, spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

type Props = {
  title: string;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function InfoBanner({ title, icon = 'UserCircle', onPress, style, accessibilityLabel }: Props) {
  const c = useThemeColors();

  const wrapStyle: ViewStyle = {
    backgroundColor: c.surfaceSubtle,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: spacing.card,
    paddingVertical: spacing.md,
  };

  const row = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <AppIcon name={icon} size={18} color={c.inkTertiary} />
      <AppText variant="caption" tone="secondary" style={{ flex: 1, fontWeight: '600' }} numberOfLines={1}>
        {title}
      </AppText>
      {onPress && <AppIcon name="ChevronRight" size={16} color={c.inkDisabled} />}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        style={({ pressed }) => [wrapStyle, { opacity: pressed ? 0.88 : 1 }, style]}
      >
        {row}
      </Pressable>
    );
  }

  return <View style={[wrapStyle, style]}>{row}</View>;
}

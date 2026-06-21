import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { radius, spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

type Props = {
  title: string;
  description?: string;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

function bannerStyle(c: ReturnType<typeof useThemeColors>): ViewStyle {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: c.surfaceSubtle,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: spacing.card,
    paddingVertical: spacing.sm,
  };
}

function BannerContent({ title, description, icon = 'UserCircle', showChevron }: Pick<Props, 'title' | 'description' | 'icon'> & { showChevron?: boolean }) {
  const c = useThemeColors();

  return (
    <>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: c.surfaceMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppIcon name={icon} size={18} color={c.inkTertiary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="caption" tone="secondary" style={{ fontWeight: '600' }} numberOfLines={2}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="caption" tone="tertiary" numberOfLines={1}>
            {description}
          </AppText>
        ) : null}
      </View>
      {showChevron && (
        <AppIcon name="ChevronRight" size={16} color={c.inkDisabled} />
      )}
    </>
  );
}

export function InfoBanner({ title, description, icon, onPress, style, accessibilityLabel }: Props) {
  const c = useThemeColors();
  const baseStyle = bannerStyle(c);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        style={({ pressed }) => [baseStyle, { opacity: pressed ? 0.88 : 1 }, style]}
      >
        <BannerContent title={title} description={description} icon={icon} showChevron />
      </Pressable>
    );
  }

  return (
    <View style={[baseStyle, style]}>
      <BannerContent title={title} description={description} icon={icon} />
    </View>
  );
}

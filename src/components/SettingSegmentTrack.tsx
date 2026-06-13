import { Pressable, View } from 'react-native';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { radius, spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

export type SegmentOption<T extends string | boolean> = {
  value: T;
  label: string;
  icon?: IconName;
};

type Props<T extends string | boolean> = {
  options: SegmentOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allowDeselect?: boolean;
  /** full: 카드 전체 너비 세그먼트 (테마) */
  layout?: 'inline' | 'full';
};

export function SettingSegmentTrack<T extends string | boolean>({
  options,
  value,
  onChange,
  allowDeselect = false,
  layout = 'full',
}: Props<T>) {
  const c = useThemeColors();
  const stackedIcon = layout === 'full' && options.some((o) => o.icon);

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: layout === 'inline' ? 1 : undefined,
        backgroundColor: c.surfaceMuted,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: c.borderStrong,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => {
              if (allowDeselect && selected) onChange(null);
              else onChange(opt.value);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.label}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: layout === 'full' ? 44 : 40,
              flexDirection: stackedIcon ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: stackedIcon ? 4 : 5,
              paddingHorizontal: spacing.sm,
              paddingVertical: 8,
              borderRadius: radius.sm,
              backgroundColor: selected ? c.ink : c.surface,
              borderWidth: selected ? 0 : 1,
              borderColor: c.borderStrong,
              opacity: pressed ? 0.88 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            {opt.icon && (
              <AppIcon
                name={opt.icon}
                size={layout === 'full' ? 16 : 14}
                color={selected ? c.surface : c.inkTertiary}
              />
            )}
            <AppText
              variant="caption"
              style={{
                fontWeight: selected ? '700' : '600',
                color: selected ? c.surface : c.ink,
              }}
            >
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

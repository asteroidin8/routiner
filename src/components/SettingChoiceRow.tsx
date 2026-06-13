import { View } from 'react-native';

import { AppText } from './AppText';
import { SettingSegmentTrack, type SegmentOption } from './SettingSegmentTrack';
import { spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props<T extends string | boolean> = {
  label: string;
  options: SegmentOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allowDeselect?: boolean;
};

/** 신체 정보 카드 — 라벨 + 전체 너비 버튼 트랙 */
export function SettingChoiceRow<T extends string | boolean>({
  label,
  options,
  value,
  onChange,
  allowDeselect = false,
}: Props<T>) {
  const c = useThemeColors();
  const unset = value == null;

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: c.border,
        paddingHorizontal: spacing.card,
        paddingTop: spacing.card,
        paddingBottom: spacing.card,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="body">{label}</AppText>
        {unset && (
          <AppText variant="caption" tone="tertiary">
            선택해 주세요
          </AppText>
        )}
      </View>
      <SettingSegmentTrack
        layout="full"
        options={options}
        value={value}
        onChange={onChange}
        allowDeselect={allowDeselect}
      />
    </View>
  );
}

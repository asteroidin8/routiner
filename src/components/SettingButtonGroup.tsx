import { View } from 'react-native';

import { SettingSegmentTrack, type SegmentOption } from './SettingSegmentTrack';
import { spacing } from '@/constants/spacing';

type Props<T extends string | boolean> = {
  options: SegmentOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allowDeselect?: boolean;
};

/** 테마 — 버튼 전용 카드 (여백 최소) */
export function SettingButtonGroup<T extends string | boolean>({
  options,
  value,
  onChange,
  allowDeselect = false,
}: Props<T>) {
  return (
    <View style={{ padding: spacing.sm }}>
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

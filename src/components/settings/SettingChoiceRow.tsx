import { AppText } from '../AppText';
import { BaseSettingItem } from './BaseSettingItem';
import { SettingSegmentTrack, type SegmentOption } from './SettingSegmentTrack';
import { settingRowLabelStyle, settingValueAccessoryStyle } from './settingStyles';

type Props<T extends string | boolean> = {
  label: string;
  options: SegmentOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allowDeselect?: boolean;
};

export function SettingChoiceRow<T extends string | boolean>({
  label,
  options,
  value,
  onChange,
  allowDeselect = false,
}: Props<T>) {
  return (
    <BaseSettingItem accessibilityLabel={label}>
      <AppText variant="body" style={settingRowLabelStyle()} numberOfLines={1}>
        {label}
      </AppText>
      <SettingSegmentTrack
        layout="inline"
        options={options}
        value={value}
        onChange={onChange}
        allowDeselect={allowDeselect}
      />
    </BaseSettingItem>
  );
}

/** inline segment가 trailing 영역을 쓰는 choice row */
export function SettingSegmentRow<T extends string | boolean>(props: Props<T>) {
  return <SettingChoiceRow {...props} />;
}

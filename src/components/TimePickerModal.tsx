import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { DrumPicker, type DrumItem } from './DrumPicker';
import { SheetModal, SheetPrimaryButton } from './SheetModal';
import { spacing } from '@/constants/spacing';

const HOURS_24: DrumItem[] = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${String(i).padStart(2, '0')}시`,
}));

const HOURS_12: DrumItem[] = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: `${i === 0 ? 12 : i}시`,
}));

const AM_PM_ITEMS: DrumItem[] = [
  { value: 0, label: '오전' },
  { value: 1, label: '오후' },
];

const MINUTES: DrumItem[] = Array.from({ length: 12 }, (_, i) => ({
  value: i * 5,
  label: `${String(i * 5).padStart(2, '0')}분`,
}));

type Props = {
  visible: boolean;
  selectedTime: string | null;
  title?: string;
  timeFormat?: '12h' | '24h';
  onConfirm: (time: string | null) => void;
  onClose: () => void;
};

function parseTime(value: string | null) {
  if (!value) return { hour: 9, minute: 0 };
  const [hStr, mStr] = value.split(':');
  const hour = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10);
  const safeHour = Number.isFinite(hour) ? Math.min(23, Math.max(0, hour)) : 9;
  const safeMinute = snapMinute(Number.isFinite(minute) ? minute : 0);
  return { hour: safeHour, minute: safeMinute };
}

function snapMinute(minute: number) {
  return Math.round(minute / 5) * 5;
}

export function TimePickerModal({
  visible,
  selectedTime,
  title = '알림 시간',
  timeFormat = '24h',
  onConfirm,
  onClose,
}: Props) {
  const parsed = parseTime(selectedTime);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(snapMinute(parsed.minute));

  useEffect(() => {
    if (visible) {
      const next = parseTime(selectedTime);
      setHour(next.hour);
      setMinute(snapMinute(next.minute));
    }
  }, [visible, selectedTime]);

  const is12h = timeFormat === '12h';
  const ampm = Math.floor(hour / 12);
  const hour12 = hour % 12;

  function handleConfirm() {
    onConfirm(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  }

  function handleClear() {
    onConfirm(null);
  }

  return (
    <SheetModal
      visible={visible}
      onClose={onClose}
      title={title}
      footer={
        <>
          <SheetPrimaryButton label="확인" onPress={handleConfirm} />
          <SheetPrimaryButton label="알림 없음" onPress={handleClear} />
        </>
      }
    >
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {is12h ? (
          <>
            <DrumPicker
              items={AM_PM_ITEMS}
              selected={ampm}
              onSelect={(v) => setHour(v * 12 + hour12)}
              width={64}
            />
            <DrumPicker
              items={HOURS_12}
              selected={hour12}
              onSelect={(v) => setHour(ampm * 12 + v)}
            />
            <DrumPicker items={MINUTES} selected={minute} onSelect={setMinute} />
          </>
        ) : (
          <>
            <DrumPicker items={HOURS_24} selected={hour} onSelect={setHour} />
            <DrumPicker items={MINUTES} selected={minute} onSelect={setMinute} />
          </>
        )}
      </View>
    </SheetModal>
  );
}

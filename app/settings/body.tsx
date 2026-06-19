import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { DecimalWheelPicker } from '@/components/settings/DecimalWheelPicker';
import { GroupCard, InsetDivider, PageHeader, Row } from '@/components/settings/MyScreenUI';
import { WheelPicker } from '@/components/WheelPicker';
import { radius, spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useUserStore } from '@/stores/useUserStore';
import { formatMetric } from '@/utils/formatMetric';

const AGE_VALUES = Array.from({ length: 83 }, (_, i) => i + 10);

type PickerType = 'height' | 'weight' | 'targetWeight' | 'age' | null;

const METRIC_LIMITS = {
  height: { min: 120, max: 220, defaultValue: 170, unit: 'cm', title: '키 선택' },
  weight: { min: 30, max: 180, defaultValue: 70, unit: 'kg', title: '체중 선택' },
  targetWeight: { min: 30, max: 180, defaultValue: 65, unit: 'kg', title: '목표 체중 선택' },
} as const;

type GenderValue = 'male' | 'female' | 'none';

const GENDER_OPTIONS: { value: GenderValue; label: string }[] = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'none', label: '미설정' },
];

function genderToValue(isMale: boolean | null): GenderValue {
  if (isMale === true) return 'male';
  if (isMale === false) return 'female';
  return 'none';
}

function valueToGender(value: GenderValue): boolean | null {
  if (value === 'male') return true;
  if (value === 'female') return false;
  return null;
}

export default function SettingsBodyScreen() {
  const c = useThemeColors();
  const { profile, setHeight, setWeight, setTargetWeight, setAge, setIsMale } = useUserStore();
  const [pickerType, setPickerType] = useState<PickerType>(null);

  const genderValue = genderToValue(profile.isMale);

  function getDecimalPickerProps() {
    switch (pickerType) {
      case 'height':
        return { ...METRIC_LIMITS.height, selected: profile.heightCm ?? METRIC_LIMITS.height.defaultValue };
      case 'weight':
        return { ...METRIC_LIMITS.weight, selected: profile.weightKg ?? METRIC_LIMITS.weight.defaultValue };
      case 'targetWeight':
        return { ...METRIC_LIMITS.targetWeight, selected: profile.targetWeightKg ?? METRIC_LIMITS.targetWeight.defaultValue };
      default:
        return { ...METRIC_LIMITS.height, selected: METRIC_LIMITS.height.defaultValue };
    }
  }

  function handleDecimalConfirm(value: number) {
    switch (pickerType) {
      case 'height': setHeight(value); break;
      case 'weight': setWeight(value); break;
      case 'targetWeight': setTargetWeight(value); break;
    }
    setPickerType(null);
  }

  function handleAgeConfirm(value: number) {
    setAge(value);
    setPickerType(null);
  }

  const decimalPicker = getDecimalPickerProps();
  const isAgePicker = pickerType === 'age';
  const isDecimalPicker = pickerType === 'height' || pickerType === 'weight' || pickerType === 'targetWeight';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }} edges={['top']}>
      <PageHeader title="신체 정보" onBack={() => router.back()} />

      <View style={{ padding: spacing.screen, gap: spacing.section }}>
        <GroupCard>
          <Row label="키" value={formatMetric(profile.heightCm, 'cm')} unset={profile.heightCm == null} onPress={() => setPickerType('height')} />
          <InsetDivider />
          <Row label="체중" value={formatMetric(profile.weightKg, 'kg')} unset={profile.weightKg == null} onPress={() => setPickerType('weight')} />
          <InsetDivider />
          <Row label="목표 체중" value={formatMetric(profile.targetWeightKg, 'kg')} unset={profile.targetWeightKg == null} onPress={() => setPickerType('targetWeight')} />
        </GroupCard>

        <GroupCard>
          <Row
            label="나이"
            value={profile.ageYears != null ? `${profile.ageYears}세` : '미설정'}
            unset={profile.ageYears == null}
            onPress={() => setPickerType('age')}
          />
          <InsetDivider />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, paddingHorizontal: spacing.card }}>
            <AppText variant="body">성별</AppText>
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {GENDER_OPTIONS.map((opt) => {
                const selected = genderValue === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setIsMale(valueToGender(opt.value))}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.xs + 2,
                      borderRadius: radius.sm,
                      backgroundColor: selected ? c.primary : 'transparent',
                    }}
                  >
                    <AppText variant="caption" style={{
                      fontWeight: selected ? '700' : '400',
                      color: selected ? c.onPrimary : c.inkTertiary,
                    }}>
                      {opt.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </GroupCard>
      </View>

      <DecimalWheelPicker
        visible={isDecimalPicker}
        min={decimalPicker.min}
        max={decimalPicker.max}
        selectedValue={decimalPicker.selected}
        unit={decimalPicker.unit}
        title={decimalPicker.title}
        onConfirm={handleDecimalConfirm}
        onClose={() => setPickerType(null)}
      />

      <WheelPicker
        visible={isAgePicker}
        title="나이 선택"
        values={AGE_VALUES}
        selectedValue={profile.ageYears ?? 30}
        unit="세"
        onConfirm={handleAgeConfirm}
        onClose={() => setPickerType(null)}
      />
    </SafeAreaView>
  );
}

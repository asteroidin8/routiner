import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Divider } from '@/components/Divider';
import { WheelPicker } from '@/components/WheelPicker';
import {
  estimateCaloriesBurned,
  getFastingMessage,
} from '@/constants/fastingMessages';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useFastingStore } from '@/stores/useFastingStore';
import { useUserStore } from '@/stores/useUserStore';

const GOAL_HOURS = Array.from({ length: 72 }, (_, i) => i + 1);
const PRESETS = [12, 16, 18, 24] as const;

function formatElapsed(ms: number) {
  const totalSec = Math.floor(Math.abs(ms) / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatOverElapsed(ms: number) {
  const totalSec = Math.floor(Math.abs(ms) / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `+${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDatetime(startTs: number, targetTs: number) {
  const start = new Date(startTs);
  const target = new Date(targetTs);
  const startDay = start.getDate();
  const endDay = target.getDate();
  const isDiff = startDay !== endDay || start.getMonth() !== target.getMonth();

  function fmt(d: Date, showDay: boolean) {
    const h = d.getHours();
    const min = d.getMinutes();
    const ampm = h < 12 ? '오전' : '오후';
    const timeStr = `${ampm} ${h % 12 || 12}:${String(min).padStart(2, '0')}`;
    return showDay ? `${d.getMonth() + 1}/${d.getDate()} ${timeStr}` : timeStr;
  }

  if (isDiff) {
    return `${fmt(start, true)} 시작 → ${fmt(target, true)} 완료 예정`;
  }
  return `${fmt(start, false)} 시작 → ${fmt(target, false)} 완료 예정`;
}

export default function FastingScreen() {
  const c = useThemeColors();
  const { status, startedAt, goalHours, setGoalHours, startFasting, stopFasting } =
    useFastingStore();
  const { profile } = useUserStore();
  const [now, setNow] = useState(Date.now());
  const [pickerVisible, setPickerVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const elapsedMs = status === 'fasting' && startedAt ? now - startedAt : 0;
  const goalMs = goalHours * 3_600_000;
  const isOverGoal = elapsedMs >= goalMs;
  const progress = Math.min(elapsedMs / goalMs, 1);
  const completionTs = startedAt ? startedAt + goalMs : null;

  const calories =
    profile.weightKg && profile.heightCm
      ? estimateCaloriesBurned({
          weightKg: profile.weightKg,
          heightCm: profile.heightCm,
          ageYears: profile.ageYears ?? 30,
          isMale: profile.isMale ?? true,
          elapsedMs,
        })
      : null;

  const phaseMessage = status === 'fasting' ? getFastingMessage(elapsedMs) : null;

  function handleAbandon() {
    Alert.alert(
      '단식 포기',
      '정말 포기하시겠어요?\n지금까지의 기록은 자동으로 보존돼요.',
      [
        { text: '계속 단식', style: 'cancel' },
        {
          text: '포기',
          style: 'destructive',
          onPress: () => stopFasting('abandoned'),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <AppText variant="title">단식</AppText>

        {/* 타이머 영역 */}
        <View style={{ alignItems: 'center', gap: 6 }}>
          {/* 메인 타이머 */}
          <AppText
            variant="display"
            style={{ fontSize: 64, letterSpacing: -3, lineHeight: 72 }}
          >
            {formatElapsed(elapsedMs)}
          </AppText>

          {/* 초과 표시 */}
          {isOverGoal && status === 'fasting' && (
            <View
              style={{
                backgroundColor: c.surfaceSubtle,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <AppText variant="caption" tone="secondary" style={{ fontWeight: '600' }}>
                {formatOverElapsed(elapsedMs - goalMs)} 초과
              </AppText>
            </View>
          )}

          {/* 시작 → 완료 예정 한 줄 표시 */}
          {status === 'fasting' && startedAt && completionTs && (
            <AppText
              variant="caption"
              tone="tertiary"
              style={{ textAlign: 'center', marginTop: 2 }}
            >
              {formatDatetime(startedAt, completionTs)}
            </AppText>
          )}
        </View>

        {/* 진행 바 */}
        <View
          style={{
            height: 3,
            backgroundColor: c.surfaceMuted,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: 3,
              width: `${progress * 100}%`,
              backgroundColor: c.ink,
              borderRadius: 2,
            }}
          />
        </View>

        {/* 과학 멘트 + 칼로리 */}
        {status === 'fasting' && (
          <View style={{ gap: 4 }}>
            {phaseMessage && (
              <AppText variant="body" tone="secondary" style={{ textAlign: 'center' }}>
                {phaseMessage}
              </AppText>
            )}
            {calories !== null && (
              <AppText variant="caption" tone="tertiary" style={{ textAlign: 'center' }}>
                약 {calories} kcal 소모
              </AppText>
            )}
          </View>
        )}

        <Divider />

        {/* 목표 설정 (단식 중이 아닐 때만) */}
        {status === 'idle' && (
          <View style={{ gap: 12 }}>
            <AppText variant="caption" tone="tertiary">
              목표 시간
            </AppText>

            {/* 프리셋 버튼 */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {PRESETS.map((h) => (
                <Pressable
                  key={h}
                  onPress={() => setGoalHours(h)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: goalHours === h ? c.ink : c.border,
                    backgroundColor: goalHours === h ? c.surfaceSubtle : 'transparent',
                    alignItems: 'center',
                  }}
                >
                  <AppText
                    variant="caption"
                    tone={goalHours === h ? 'primary' : 'tertiary'}
                    style={goalHours === h ? { fontWeight: '700' } : {}}
                  >
                    {h}h
                  </AppText>
                </Pressable>
              ))}

              {/* 직접 입력 */}
              <Pressable
                onPress={() => setPickerVisible(true)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: !PRESETS.includes(goalHours as (typeof PRESETS)[number])
                    ? c.ink
                    : c.border,
                  backgroundColor: !PRESETS.includes(goalHours as (typeof PRESETS)[number])
                    ? c.surfaceSubtle
                    : 'transparent',
                  alignItems: 'center',
                }}
              >
                <AppText
                  variant="caption"
                  tone={
                    !PRESETS.includes(goalHours as (typeof PRESETS)[number]) ? 'primary' : 'tertiary'
                  }
                >
                  직접
                </AppText>
              </Pressable>
            </View>

            {!PRESETS.includes(goalHours as (typeof PRESETS)[number]) && (
              <AppText variant="caption" tone="secondary" style={{ textAlign: 'center' }}>
                목표: {goalHours}시간
              </AppText>
            )}
          </View>
        )}

        {/* 액션 버튼 */}
        {status === 'idle' ? (
          <Pressable
            onPress={startFasting}
            style={{
              backgroundColor: c.ink,
              borderRadius: 14,
              paddingVertical: 18,
              alignItems: 'center',
            }}
          >
            <AppText variant="body" style={{ color: c.surface, fontWeight: '700' }}>
              단식 시작
            </AppText>
          </Pressable>
        ) : isOverGoal ? (
          /* 목표 달성 이후: 완료 버튼만 표시 */
          <Pressable
            onPress={() => stopFasting('completed')}
            style={{
              backgroundColor: c.ink,
              borderRadius: 14,
              paddingVertical: 18,
              alignItems: 'center',
            }}
          >
            <AppText variant="body" style={{ color: c.surface, fontWeight: '700' }}>
              단식 완료
            </AppText>
          </Pressable>
        ) : (
          /* 단식 중 (미달성): 포기 버튼만 표시 */
          <Pressable
            onPress={handleAbandon}
            style={{
              borderWidth: 1,
              borderColor: c.border,
              borderRadius: 14,
              paddingVertical: 18,
              alignItems: 'center',
            }}
          >
            <AppText variant="body" tone="tertiary">
              단식 포기
            </AppText>
          </Pressable>
        )}
      </ScrollView>

      {/* 목표 시간 휠 피커 */}
      <WheelPicker
        visible={pickerVisible}
        title="목표 시간 선택"
        values={GOAL_HOURS}
        selectedValue={goalHours}
        unit="시간"
        onConfirm={(v) => {
          setGoalHours(v);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

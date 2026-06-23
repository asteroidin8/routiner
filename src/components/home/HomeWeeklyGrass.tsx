import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { getGrassColor, getGrassNeonGlow, getCellBorderRadius } from '@/constants/grassTheme';
import { opacity, radius, spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRoutineCompletionStore } from '@/stores/useRoutineCompletionStore';
import { useRoutineStore } from '@/stores/useRoutineStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { getWeekDayDots, toDateStr, type DayDotStatus } from '@/utils/homeDailyBoard';

const CELL_SIZE = 14;
const CELL_SIZE_TODAY = 16;
const CELL_GAP = 6;

function cellColor(status: DayDotStatus, c: ReturnType<typeof useThemeColors>, grassHex: string) {
  switch (status) {
    case 'full':
      return { bg: grassHex, border: grassHex, glow: true };
    case 'partial':
      return { bg: grassHex, border: c.borderStrong, glow: false };
    case 'empty':
      return { bg: c.surfaceSubtle, border: c.borderStrong, glow: false };
    default:
      return { bg: 'transparent', border: c.border, glow: false };
  }
}

/** 홈 — 이번 주 7칸 잔디 */
export function HomeWeeklyGrass() {
  const c = useThemeColors();
  const grassColor = useSettingsStore((s) => s.grassColor);
  const grassShape = useSettingsStore((s) => s.grassShape);
  const grassHex = getGrassColor(grassColor);
  const { routines } = useRoutineStore();
  const { isCompleted } = useRoutineCompletionStore();

  const todayStr = toDateStr(new Date());
  const weekDots = getWeekDayDots(routines, isCompleted);

  return (
    <View>
      <View
        style={{
          backgroundColor: c.surfaceSubtle,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: c.border,
          paddingHorizontal: spacing.item,
          paddingVertical: spacing.card,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {weekDots.map((dot, index) => {
            const isToday = dot.dateStr === todayStr;
            const colors = cellColor(dot.status, c, grassHex);
            const cellSize = isToday ? CELL_SIZE_TODAY : CELL_SIZE;
            const partial = dot.status === 'partial';
            const statusA11y =
              dot.status === 'full'
                ? '전체 완료'
                : dot.status === 'partial'
                  ? '일부 완료'
                  : dot.status === 'empty'
                    ? '미완료'
                    : '기록 없음';
            return (
              <View
                key={dot.dateStr}
                style={{ flex: 1, alignItems: 'center', gap: CELL_GAP }}
                accessibilityLabel={`${dot.weekdayLabel} ${statusA11y}`}
              >
                <View
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: getCellBorderRadius(grassShape, cellSize),
                    backgroundColor: colors.bg,
                    opacity: partial ? opacity.partial : 1,
                    borderWidth: isToday ? 1.5 : (dot.status === 'none' || dot.status === 'empty' ? 1 : 0),
                    borderColor: isToday ? grassHex : colors.border,
                    ...(colors.glow ? {
                      shadowColor: getGrassNeonGlow(grassHex),
                      shadowOpacity: 0.6,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 3,
                    } : {}),
                  }}
                />
                <AppText
                  variant="caption"
                  tone={isToday ? 'secondary' : 'tertiary'}
                  style={{ fontWeight: isToday ? '600' : '400' }}
                >
                  {dot.weekdayLabel}
                </AppText>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

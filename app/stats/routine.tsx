import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { EmptyIllustration } from '@/components/EmptyIllustration';
import { StatsSummaryCard } from '@/components/stats/StatsSummaryCard';
import { PageHeader } from '@/components/settings/MyScreenUI';
import { STATS_LABELS } from '@/constants/statsLabels';
import { spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRoutineCompletionStore } from '@/stores/useRoutineCompletionStore';
import { useRoutineStore } from '@/stores/useRoutineStore';

const L = STATS_LABELS;

export default function RoutineDetailScreen() {
  const c = useThemeColors();
  const { routines } = useRoutineStore();
  const { getStreak, isCompleted } = useRoutineCompletionStore();

  const now = new Date();
  const todayWeekday = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const todayRoutines = routines.filter((r) => r.repeatDays.includes(todayWeekday));
  const maxStreak = routines.reduce((max, r) => Math.max(max, getStreak(r.id, r.repeatDays)), 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }} edges={['top']}>
      <PageHeader title={L.detailRoutine} onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={{
          padding: spacing.screen,
          gap: spacing.section,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatsSummaryCard label={L.totalRoutines} value={`${routines.length}${L.countUnit}`} />
          <StatsSummaryCard label={L.todayRoutines} value={`${todayRoutines.length}${L.countUnit}`} />
          <StatsSummaryCard
            label={L.maxStreak}
            value={maxStreak > 0 ? `${maxStreak}${L.dayUnit}` : '-'}
          />
        </View>

        {routines.length > 0 ? (
          <View style={{ gap: 8 }}>
            {routines.map((r) => {
              const streak = getStreak(r.id, r.repeatDays);
              const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
              const done = isCompleted(r.id, todayStr);
              return (
                <Card key={r.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <AppText variant="body" style={{ fontWeight: '600' }}>
                      {r.name}
                    </AppText>
                    <AppText variant="caption" tone="tertiary">
                      {streak > 0 ? `${streak}${L.dayUnit} ${L.maxStreak}` : L.maxStreak + ' -'}
                    </AppText>
                  </View>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: done ? c.primary : c.surfaceMuted,
                    }}
                  />
                </Card>
              );
            })}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
            <EmptyIllustration variant="routine" size={48} />
            <AppText variant="body" tone="tertiary">{L.noRecords}</AppText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

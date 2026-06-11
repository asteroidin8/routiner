import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useFastingStore } from '@/stores/useFastingStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

const NOTIFICATION_ID = 'fasting-progress';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowList: false,
  }),
});

async function requestPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('fasting', {
      name: '단식 진행',
      importance: Notifications.AndroidImportance.LOW,
      enableVibrate: false,
      showBadge: false,
    });
  }
  await Notifications.requestPermissionsAsync();
}

function formatElapsed(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${h}시간 ${m}분 진행 중`;
}

export function useFastingNotification() {
  const { status, startedAt, goalHours } = useFastingStore();
  const { foregroundServiceEnabled } = useSettingsStore();

  useEffect(() => {
    if (!foregroundServiceEnabled) {
      Notifications.dismissNotificationAsync(NOTIFICATION_ID).catch(() => {});
      return;
    }

    if (status !== 'fasting' || !startedAt) {
      Notifications.dismissNotificationAsync(NOTIFICATION_ID).catch(() => {});
      return;
    }

    requestPermissions();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const goalMs = goalHours * 3_600_000;
      const progress = Math.min(elapsed / goalMs, 1);
      const isOver = elapsed > goalMs;

      Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: isOver ? `목표 달성! ${formatElapsed(elapsed)}` : `단식 중 · ${Math.round(progress * 100)}%`,
          body: formatElapsed(elapsed),
          sticky: true,
          ...(Platform.OS === 'android' && {
            categoryIdentifier: undefined,
            color: '#000000',
            priority: Notifications.AndroidNotificationPriority.LOW,
          }),
        },
        trigger: null,
      }).catch(() => {});
    }, 10_000);

    // 즉시 첫 알림
    const elapsed = Date.now() - startedAt;
    Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: `단식 중 · ${Math.round(Math.min(elapsed / (goalHours * 3_600_000), 1) * 100)}%`,
        body: formatElapsed(elapsed),
        sticky: true,
      },
      trigger: null,
    }).catch(() => {});

    return () => {
      clearInterval(interval);
    };
  }, [status, startedAt, goalHours, foregroundServiceEnabled]);
}

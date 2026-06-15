import {
  SettingSection,
  SettingToggleRow,
  SettingsScaffold,
} from '@/components/settings';
import { NOTIFICATION_COPY } from '@/constants/settingsOptions';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { requestNotificationPermission } from '@/utils/notificationPermission';

export default function SettingsNotificationsScreen() {
  const {
    foregroundServiceEnabled,
    toggleForegroundService,
    routineNotificationsEnabled,
    setRoutineNotifications,
    todoNotificationsEnabled,
    setTodoNotifications,
  } = useSettingsStore();

  async function handleRoutineNotifications(enabled: boolean) {
    if (enabled && !(await requestNotificationPermission())) return;
    setRoutineNotifications(enabled);
  }

  async function handleTodoNotifications(enabled: boolean) {
    if (enabled && !(await requestNotificationPermission())) return;
    setTodoNotifications(enabled);
  }

  async function handleForegroundServiceToggle() {
    if (!foregroundServiceEnabled && !(await requestNotificationPermission())) return;
    toggleForegroundService();
  }

  const copy = NOTIFICATION_COPY;

  return (
    <SettingsScaffold title="알림">
      <SettingSection title="알림">
        <SettingToggleRow
          label={copy.fastingBar.label}
          value={foregroundServiceEnabled}
          onToggle={() => {
            handleForegroundServiceToggle();
          }}
        />
        <SettingToggleRow
          label={copy.routine.label}
          value={routineNotificationsEnabled}
          onToggle={handleRoutineNotifications}
        />
        <SettingToggleRow
          label={copy.todo.label}
          value={todoNotificationsEnabled}
          onToggle={handleTodoNotifications}
        />
      </SettingSection>
    </SettingsScaffold>
  );
}

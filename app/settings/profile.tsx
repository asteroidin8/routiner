import { router } from 'expo-router';

import { SettingRow, SettingSection, SettingsScaffold } from '@/components/settings';
import { useUserStore } from '@/stores/useUserStore';
import { getProfileRowValue } from '@/utils/profileSummary';

export default function SettingsProfileScreen() {
  const { profile } = useUserStore();
  const summary = getProfileRowValue(profile);

  return (
    <SettingsScaffold title="프로필">
      <SettingSection title="프로필">
        <SettingRow
          label="신체 정보"
          value={summary.value}
          unset={summary.unset}
          onPress={() => router.push('/settings/body')}
        />
      </SettingSection>
    </SettingsScaffold>
  );
}

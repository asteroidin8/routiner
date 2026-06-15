import { AppIcon } from '@/components/AppIcon';
import {
  SettingRow,
  SettingSection,
  SettingsScaffold,
} from '@/components/settings';
import { THEME_OPTIONS } from '@/constants/settingsOptions';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function SettingsThemeScreen() {
  const c = useThemeColors();
  const { themeMode, setThemeMode } = useSettingsStore();

  return (
    <SettingsScaffold title="테마">
      <SettingSection title="테마">
        {THEME_OPTIONS.map((opt) => (
          <SettingRow
            key={opt.mode}
            label={opt.label}
            showChevron={false}
            onPress={() => setThemeMode(opt.mode)}
            trailing={
              themeMode === opt.mode ? <AppIcon name="Check" size={18} color={c.ink} /> : null
            }
          />
        ))}
      </SettingSection>
    </SettingsScaffold>
  );
}

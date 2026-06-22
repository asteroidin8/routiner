import { useRef } from 'react';
import { useColorScheme } from 'react-native';

import { colors, type ThemeColors } from '@/constants/colors';
import { deriveThemeColors } from '@/constants/grassTheme';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const grassColor = useSettingsStore((s) => s.grassColor);

  const scheme =
    themeMode === 'system' ? (systemScheme ?? 'dark') : themeMode;
  const isDark = scheme === 'dark';

  const cacheRef = useRef<{ key: string; value: ThemeColors } | null>(null);
  const key = `${isDark ? 'd' : 'l'}_${grassColor}`;

  if (cacheRef.current?.key !== key) {
    const base = isDark ? colors.dark : colors.light;
    const derived = deriveThemeColors(grassColor, isDark);
    cacheRef.current = {
      key,
      value: derived ? { ...base, ...derived } : base,
    };
  }

  return cacheRef.current.value;
}

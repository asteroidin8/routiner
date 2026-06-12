import { Pressable, View } from 'react-native';

import { AppText } from './AppText';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  message: string;
  onDismiss: () => void;
  visible: boolean;
};

export function Coachmark({ message, onDismiss, visible }: Props) {
  const c = useThemeColors();
  if (!visible) return null;

  return (
    <Pressable
      onPress={onDismiss}
      style={{
        position: 'absolute',
        bottom: 72,
        left: 20,
        right: 20,
        zIndex: 100,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${message}. 탭하여 닫기`}
    >
      <View
        style={{
          backgroundColor: c.ink,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <AppText variant="caption" style={{ color: c.surface, lineHeight: 18 }}>
          {message}
        </AppText>
        <AppText variant="caption" style={{ color: c.inkDisabled, marginTop: 4 }}>
          탭하여 닫기
        </AppText>
      </View>
    </Pressable>
  );
}

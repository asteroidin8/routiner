import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function SpringModal({ visible, onClose, children }: Props) {
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(400);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 200 });
      sheetTranslateY.value = withSpring(0, { damping: 22, stiffness: 220 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 180 });
      sheetTranslateY.value = withTiming(400, { duration: 200 });
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View
          style={[{ ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.4)' }, backdropStyle]}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="닫기"
          />
        </Animated.View>
        <Animated.View style={sheetStyle}>{children}</Animated.View>
      </View>
    </Modal>
  );
}

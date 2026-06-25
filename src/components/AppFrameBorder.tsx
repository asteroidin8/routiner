import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FRAME_SIDE = 2;
const FRAME_MIN = 4;

type Props = {
  color: string;
  children: ReactNode;
};

/** 장식용 테두리 — overlay로 그려 flex 레이아웃/inset 변화에 영향받지 않음 */
export function AppFrameBorder({ color, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top || FRAME_MIN, backgroundColor: color }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: insets.bottom || FRAME_MIN, backgroundColor: color }} />
        <View style={[styles.left, { backgroundColor: color }]} />
        <View style={[styles.right, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  left: { position: 'absolute', top: 0, bottom: 0, left: 0, width: FRAME_SIDE },
  right: { position: 'absolute', top: 0, bottom: 0, right: 0, width: FRAME_SIDE },
});

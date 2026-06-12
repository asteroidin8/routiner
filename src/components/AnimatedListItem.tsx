import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

type Props = {
  itemKey: string;
  index?: number;
  children: React.ReactNode;
};

export function AnimatedListItem({ itemKey, index = 0, children }: Props) {
  return (
    <Animated.View
      key={itemKey}
      entering={FadeInDown.delay(Math.min(index * 40, 200)).duration(280).springify().damping(18)}
      exiting={FadeOutUp.duration(200)}
      layout={LinearTransition.springify().damping(20)}
    >
      {children}
    </Animated.View>
  );
}

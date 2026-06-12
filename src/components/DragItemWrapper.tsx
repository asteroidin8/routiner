import { View } from 'react-native';

type Props = {
  isActive: boolean;
  children: React.ReactNode;
};

export function DragItemWrapper({ isActive, children }: Props) {
  return (
    <View
      style={{
        opacity: isActive ? 0.95 : 1,
        transform: [{ scale: isActive ? 1.025 : 1 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: isActive ? 6 : 0 },
        shadowOpacity: isActive ? 0.14 : 0,
        shadowRadius: isActive ? 10 : 0,
        elevation: isActive ? 6 : 0,
        zIndex: isActive ? 2 : 0,
        borderRadius: isActive ? 12 : 0,
      }}
    >
      {children}
    </View>
  );
}

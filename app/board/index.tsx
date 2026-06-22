import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/settings/MyScreenUI';
import { spacing } from '@/constants/spacing';
import { useAuth } from '@/contexts/AuthProvider';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useBoardStore } from '@/stores/useBoardStore';
import { fetchMyBoards } from '@/services/board/boardService';

export default function BoardListScreen() {
  const c = useThemeColors();
  const { user } = useAuth();
  const boards = useBoardStore((s) => s.boards);
  const members = useBoardStore((s) => s.members);

  useEffect(() => {
    if (user?.id) void fetchMyBoards(user.id);
  }, [user?.id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: spacing.screen }}>
        <PageHeader title="보드" onBack={() => router.back()} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Pressable
            onPress={() => router.push('/board/join')}
            hitSlop={8}
            style={{ padding: 4 }}
            accessibilityLabel="보드 참가"
          >
            <AppIcon name="UserPlus" size={20} color={c.inkTertiary} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/board/create')}
            hitSlop={8}
            style={{ padding: 4 }}
            accessibilityLabel="보드 만들기"
          >
            <AppIcon name="Plus" size={20} color={c.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          { padding: spacing.screen, gap: spacing.md },
          boards.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {boards.length === 0 ? (
          <EmptyState
            variant="stats"
            message={'보드를 만들거나\n초대 코드로 참가해보세요'}
          />
        ) : (
          boards.map((board) => {
            const boardMembers = members[board.id] ?? [];
            return (
              <Card
                key={board.id}
                pressable
                onPress={() => router.push(`/board/${board.id}`)}
              >
                <View style={{ gap: spacing.xs }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <AppText variant="body" style={{ fontWeight: '600', flex: 1 }}>
                      {board.name}
                    </AppText>
                    <AppIcon name="ChevronRight" size={16} color={c.inkDisabled} />
                  </View>
                  <AppText variant="caption" tone="tertiary">
                    {boardMembers.map((m) => m.nickname).join(', ')} · {boardMembers.length}/{board.maxMembers}명
                  </AppText>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

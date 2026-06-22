import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { PageHeader } from '@/components/settings/MyScreenUI';
import { radius, spacing } from '@/constants/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useFollowStore } from '@/stores/useFollowStore';
import {
  followUser,
  searchUsers,
  unfollowUser,
} from '@/services/social/followService';
import type { FollowUser } from '@/types';

export default function SearchScreen() {
  const c = useThemeColors();
  const following = useFollowStore((s) => s.following);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (q.length < 2) return;
    setLoading(true);
    const { users } = await searchUsers(q);
    setResults(users);
    setSearched(true);
    setLoading(false);
  }, [query]);

  const isFollowing = (userId: string) =>
    following.some((f) => f.userId === userId);

  const handleToggleFollow = useCallback(
    async (user: FollowUser) => {
      if (isFollowing(user.userId)) {
        await unfollowUser(user.userId);
        useFollowStore.getState().removeFollowing(user.userId);
      } else {
        await followUser(user.userId);
        useFollowStore.getState().addFollowing(user);
      }
    },
    [following],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }} edges={['top']}>
      <PageHeader title="친구 검색" onBack={() => router.back()} />

      <View style={{ padding: spacing.screen, gap: spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: c.surfaceSubtle,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: c.border,
            paddingHorizontal: spacing.sm,
            gap: spacing.xs,
          }}
        >
          <AppIcon name="Search" size={18} color={c.inkDisabled} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            placeholder="닉네임으로 검색"
            placeholderTextColor={c.inkDisabled}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              flex: 1,
              height: 44,
              color: c.ink,
              fontSize: 15,
            }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(''); setResults([]); setSearched(false); }} hitSlop={8}>
              <AppIcon name="X" size={16} color={c.inkDisabled} />
            </Pressable>
          )}
        </View>

        {loading && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator color={c.primary} />
          </View>
        )}

        {!loading && searched && results.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <AppText variant="body" tone="tertiary">
              검색 결과가 없어요
            </AppText>
          </View>
        )}

        {!loading &&
          results.map((user) => (
            <View
              key={user.userId}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: c.borderNeutral,
              }}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="body" style={{ fontWeight: '600' }}>
                  {user.nickname}
                </AppText>
              </View>
              <Pressable
                onPress={() => void handleToggleFollow(user)}
                hitSlop={8}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: radius.md,
                  backgroundColor: isFollowing(user.userId) ? c.surfaceMuted : c.primary,
                }}
              >
                <AppText
                  variant="caption"
                  style={{
                    fontWeight: '600',
                    color: isFollowing(user.userId) ? c.inkSecondary : '#000',
                  }}
                >
                  {isFollowing(user.userId) ? '팔로잉' : '팔로우'}
                </AppText>
              </Pressable>
            </View>
          ))}
      </View>
    </SafeAreaView>
  );
}

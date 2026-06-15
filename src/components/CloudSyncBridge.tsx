import { useAuth } from '@/contexts/AuthProvider';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

/** 로그인 시 Realtime 구독 활성화 */
export function CloudSyncBridge() {
  const { user } = useAuth();
  useRealtimeSync();
  if (!user) return null;
  return null;
}

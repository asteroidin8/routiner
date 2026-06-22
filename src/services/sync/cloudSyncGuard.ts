/** 로컬 push/pull 중 Realtime echo가 store를 다시 갱신하지 않도록 억제 */
let suppressedDepth = 0;

export function isCloudSyncSuppressed(): boolean {
  return suppressedDepth > 0;
}

export async function withCloudSyncSuppressed<T>(fn: () => Promise<T>): Promise<T> {
  suppressedDepth++;
  try {
    return await fn();
  } finally {
    suppressedDepth--;
  }
}

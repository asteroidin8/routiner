# 루틴 체크 풀림/복원 반복 문제

## 화면 이름
통계 월간 잔디 → 날짜 상세 모달 (StatsDayDetailModal)

## 문제점 요약
루틴 체크를 토글하면 체크가 풀렸다가 다시 되는 현상이 반복적으로 발생.

## 근본 원인 분석

`pushLocalToCloud`의 completions push 로직:

```typescript
// 문제의 코드 (수정 전)
await supabase.from('routine_completions').delete().eq('user_id', userId);  // ← 전체 DELETE
// ... 직후 전체 INSERT
```

**전체 DELETE → 전체 INSERT** 방식으로 동기화하고 있었음.

이 흐름이 일으키는 연쇄 반응:

```
1. 사용자 체크 토글 → completions store 변경
2. 2.5초 후 push 시작
3. 서버에서 모든 completions DELETE → Realtime이 각 row에 DELETE 이벤트 발사
4. 직후 전체 INSERT → Realtime이 각 row에 INSERT 이벤트 발사  
5. push 함수 완료 → withCloudSyncSuppressed 해제 → guard = false
6. DELETE echo 도착 (guard 해제 후) → 로컬에서 key 삭제 → 체크 풀림!
7. INSERT echo 도착 → 로컬에 다시 추가 → 체크 복원!
```

guard가 push 함수 실행 중에만 활성화되므로, push 완료 후 도착하는 Realtime echo를 차단할 수 없었음. 근본적으로 **DELETE+INSERT 전체 교체 방식이 Realtime과 양립 불가능**한 구조.

## 개선 제안

### 1. completions push에서 전체 DELETE 제거

**수정 전:**
```typescript
await supabase.from('routine_completions').delete().eq('user_id', userId);
const completionRows = Object.entries(completions).map(...);
if (completionRows.length > 0) {
  await supabase.from('routine_completions').upsert(completionRows);
}
```

**수정 후:**
```typescript
const completionRows = Object.entries(completions).map(...);
if (completionRows.length > 0) {
  await supabase.from('routine_completions').upsert(completionRows);
}
```

upsert만 사용하면 기존 row는 업데이트, 새 row는 삽입. DELETE echo가 발생하지 않음.

### 2. 체크 해제 시 서버 row 개별 삭제

체크 해제 시 로컬에서 key를 삭제하지만, 서버에는 해당 row가 남아있었음.
`toggleCompletion`에서 체크 해제 시 해당 completion_key만 서버에서 삭제하도록 추가.

**수정 후:**
```typescript
toggleCompletion: (routineId, date) => {
  const key = makeKey(routineId, date);
  const wasCompleted = !!get().completions[key];
  set((s) => { ... });
  if (wasCompleted) {
    // 체크 해제 → 서버에서 해당 row만 삭제
    supabase.from('routine_completions').delete().eq('completion_key', key);
  }
},
```

## 예상 효과
- 체크 토글 시 깜빡임 완전 제거
- Realtime DELETE echo로 인한 store 갱신 제거
- push 시 네트워크 비용 절감 (전체 DELETE+INSERT → upsert만)

## 재발 방지
- **원칙:** Realtime이 활성화된 테이블에서는 전체 DELETE+INSERT 패턴 금지
- 항상 개별 row 단위 upsert/delete 사용
- 다른 테이블(routines, todos 등)은 이미 upsert만 사용하므로 이 문제 없음

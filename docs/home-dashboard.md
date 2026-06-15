# 홈 대시보드 UI — zndi (잔디)

> `docs/design-system.md` · `docs/copy-guide.md`

## 잔디 탭 = 오늘 요약

1. **TopBar** — zndi · 날짜 · 🔥 연속 · 설정
2. **DailySummaryRow** — 루틴/할일 바로가기
3. **오늘의 잔디** — 오늘 루틴 체크
4. **이번 주 잔디** — 7칸만
5. **단식 카드**

## 통계 탭 = 회고

1. **나의 잔디** — 42일 ContributionGrid
2. **Bento** — 연속 · 이번 달 · 달성률
3. 단식·월간 캘린더 등 기존 통계

## 컴포넌트

| 파일 | 탭 |
|------|-----|
| `HomeTopBar` · `HomeTodayRoutines` · `HomeWeeklyGrass` | 잔디 |
| `ContributionGrid` · `StatsBentoStats` | 통계 |

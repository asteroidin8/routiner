# Routiner 출시·로드맵

> **아키텍처:** 로컬(AsyncStorage/Zustand) = **1차 저장** · Supabase = **클라우드 백업 + Realtime**  
> **로그인:** Google 주 · Email OTP 보조  
> **Realtime:** 1차 다기기 · 2차 공유(추후)  
> **최종 갱신:** 2026-06-13

---

## 완성도

| 구분 | % | 상태 |
|------|---|------|
| v1 로컬 | ~89% | EAS·실기 QA [⏸] |
| Supabase MVP | ~70% | 코드 [x] · 대시보드 SQL·Google [ ] |
| 출시 통합 | ~75% | |

---

## 아키텍처

```
[앱] Zustand persist (AsyncStorage)  ← 항상 1차
        ↕ push/pull (로그인 시)
[Supabase] Postgres + RLS + Realtime
        ↕ Google OAuth / Email OTP
```

| 데이터 | 로컬 | 클라우드 |
|--------|------|----------|
| 프로필·루틴·할일·완료·단식 | [x] | [x] upsert |
| Realtime | — | [x] routines/todos/completions |
| 오프라인 | [x] | 백업 큐(수동 push) |

---

## Phase 0 — 출시 게이트 [⏸]

- EAS Android (7/1) · iOS credentials · 실기 QA

---

## Phase 2 — Supabase MVP

| # | 작업 | 상태 |
|---|------|------|
| 2-1 | client + SecureStore | [x] |
| 2-2 | SQL·RLS migration | [x] 파일 · [ ] Dashboard 실행 |
| 2-3 | Google OAuth | [x] 코드 · [ ] GCP+Supabase 설정 |
| 2-4 | Email OTP | [x] |
| 2-5 | 설정 «계정·클라우드» | [x] |
| 2-6 | push/pull sync | [x] |
| 2-7 | Realtime → Zustand | [x] |
| 2-8 | OAuth 가이드 | [x] `docs/google-oauth-setup.md` |
| 2-9 | 개인정보 Supabase 조항 | [ ] |
| 2-10 | 자동 push (변경 시) | [ ] |

### Dashboard 수동 작업 (사용자)

1. SQL Editor → `supabase/migrations/20260613_initial.sql` 실행
2. Auth → Google Provider + Web Client ID/Secret
3. Auth → Redirect URLs: `routiner://auth/callback`
4. Realtime publication 확인

---

## Phase 1 — v1 polish

| # | 작업 | 상태 |
|---|------|------|
| 1-5 | Sentry DSN | [~] |
| 1-6 | CI lint | [ ] |
| 1-7 | a11y | [ ] |
| 1-8 | Settings UI 안정화 | [ ] |

---

## Phase 3 — v1.1+

Freemium IAP · 루틴 상한 · 고급 통계 · 위젯 · Realtime 공유(2차)

---

## 우선순위

```
[사용자] Supabase SQL + Google Provider 설정
[앱]     자동 sync · privacy 조항 · Settings UI
[⏸]     EAS 빌드 · 실기 QA
```

---

## 진행 로그

| 일시 | 작업 |
|------|------|
| 2026-06-13 | Supabase Auth·Sync·Realtime·설정 계정 (#83–#84) |

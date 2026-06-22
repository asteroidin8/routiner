-- Fix: board_members 자기참조 RLS 무한재귀 해결
-- is_board_member() security definer 함수로 우회

-- 1) Helper function (RLS를 우회해서 멤버십 확인)
CREATE OR REPLACE FUNCTION is_board_member(p_board_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.board_members
    WHERE board_id = p_board_id AND user_id = auth.uid()
  );
$$;

-- 2) board_members: 기존 자기참조 SELECT 정책 교체
DROP POLICY IF EXISTS "board_members_select" ON public.board_members;

CREATE POLICY "board_members_select" ON public.board_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR is_board_member(board_id)
  );

-- 3) boards: 기존 멤버 조회 정책도 함수로 교체
DROP POLICY IF EXISTS "boards_select_member" ON public.boards;

CREATE POLICY "boards_select_member" ON public.boards
  FOR SELECT USING (
    is_board_member(id)
  );

-- 4) board_daily_progress: 함수로 교체
DROP POLICY IF EXISTS "board_progress_select" ON public.board_daily_progress;

CREATE POLICY "board_progress_select" ON public.board_daily_progress
  FOR SELECT USING (
    is_board_member(board_id)
  );

-- 5) board_routines: 함수로 교체
DROP POLICY IF EXISTS "board_routines_select" ON public.board_routines;

CREATE POLICY "board_routines_select" ON public.board_routines
  FOR SELECT USING (
    is_board_member(board_id)
  );

DROP POLICY IF EXISTS "board_routines_insert" ON public.board_routines;

CREATE POLICY "board_routines_insert" ON public.board_routines
  FOR INSERT WITH CHECK (
    auth.uid() = created_by
    AND is_board_member(board_id)
  );

-- 6) board_verification_logs: 함수로 교체
DROP POLICY IF EXISTS "bvl_select" ON public.board_verification_logs;

CREATE POLICY "bvl_select" ON public.board_verification_logs
  FOR SELECT USING (
    is_board_member(board_id)
  );

DROP POLICY IF EXISTS "bvl_insert" ON public.board_verification_logs;

CREATE POLICY "bvl_insert" ON public.board_verification_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND is_board_member(board_id)
  );

-- Fix: boards 관련 테이블에 authenticated 역할 권한 부여
-- SQL로 생성한 테이블은 GRANT가 필요함

GRANT ALL ON public.boards TO authenticated;
GRANT ALL ON public.board_members TO authenticated;
GRANT ALL ON public.board_daily_progress TO authenticated;

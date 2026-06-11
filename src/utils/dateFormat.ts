/**
 * 'YYYY-MM-DD' 형식의 마감일을 상대적 표현으로 변환
 * 오늘: "오늘"
 * 내일: "내일"
 * 이후: "D-3" 형식
 * 지난 날: "D+2" 형식 (초과)
 */
export function formatDueDate(dueDate: string): { label: string; isOverdue: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays === 0) return { label: '오늘', isOverdue: false };
  if (diffDays === 1) return { label: '내일', isOverdue: false };
  if (diffDays > 1) return { label: `D-${diffDays}`, isOverdue: false };
  return { label: `D+${Math.abs(diffDays)}`, isOverdue: true };
}

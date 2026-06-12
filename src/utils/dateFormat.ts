export type DueUrgency = 'normal' | 'soon' | 'today' | 'overdue';

export function formatDueDate(dueDate: string): {
  label: string;
  isOverdue: boolean;
  urgency: DueUrgency;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays === 0) return { label: '오늘', isOverdue: false, urgency: 'today' };
  if (diffDays === 1) return { label: '내일', isOverdue: false, urgency: 'soon' };
  if (diffDays === 2) return { label: '모레', isOverdue: false, urgency: 'soon' };
  if (diffDays > 1 && diffDays <= 3) {
    return { label: `D-${diffDays}`, isOverdue: false, urgency: 'soon' };
  }
  if (diffDays > 3) return { label: `D-${diffDays}`, isOverdue: false, urgency: 'normal' };
  return { label: `D+${Math.abs(diffDays)}`, isOverdue: true, urgency: 'overdue' };
}

export function getDueDateColor(urgency: DueUrgency): string | undefined {
  if (urgency === 'overdue') return '#EF4444';
  if (urgency === 'today') return '#F59E0B';
  if (urgency === 'soon') return '#D97706';
  return undefined;
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

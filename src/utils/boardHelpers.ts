import { localDateStr } from './dateFormat';

export function getWeekDates(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(localDateStr(d));
  }
  return dates;
}

export function getMonthDates(): string[] {
  const today = new Date();
  const dates: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(localDateStr(d));
  }
  return dates;
}

export function ratioToLevel(ratio: number): number {
  if (ratio >= 1) return 4;
  if (ratio >= 0.75) return 3;
  if (ratio >= 0.5) return 2;
  if (ratio > 0) return 1;
  return 0;
}

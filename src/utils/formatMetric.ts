/** 신체 측정값 표시 (소수 1자리 입력 지원) */
export function formatMetric(value: number | null, unit: string) {
  if (value == null) return '미설정';
  const rounded = Math.round(value * 10) / 10;
  const hasFraction = Math.round(rounded * 10) % 10 !== 0;
  const text = hasFraction ? rounded.toFixed(1) : String(Math.round(rounded));
  return `${text} ${unit}`;
}

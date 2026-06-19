export type GrassLevelInfo = {
  level: number;
  name: string;
  min: number;
  max: number | null;
};

const LEVELS: GrassLevelInfo[] = [
  { level: 1, name: '새싹', min: 0, max: 30 },
  { level: 2, name: '풀잎', min: 31, max: 100 },
  { level: 3, name: '잔디밭', min: 101, max: 300 },
  { level: 4, name: '정원', min: 301, max: 700 },
  { level: 5, name: '숲', min: 701, max: 1500 },
  { level: 6, name: '생태계', min: 1501, max: null },
];

export function getGrassLevel(totalGrass: number): GrassLevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalGrass >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

export type GrassColorId = 'green' | 'cherry' | 'ocean' | 'lavender' | 'sunset' | 'flame' | 'gold';
export type GrassCellShape = 'default' | 'pixel' | 'circle' | 'diamond';

export type GrassColorPreset = {
  id: GrassColorId;
  name: string;
  hex: string;
  price: number | null;
};

export type GrassCellSkin = {
  id: GrassCellShape;
  name: string;
  desc: string;
  price: number | null;
};

export const GRASS_COLORS: GrassColorPreset[] = [
  { id: 'green',    name: '기본',    hex: '#22C55E', price: null },
  { id: 'cherry',   name: '벚꽃',    hex: '#F472B6', price: 1000 },
  { id: 'ocean',    name: '오션',    hex: '#38BDF8', price: 1000 },
  { id: 'lavender', name: '라벤더',  hex: '#A78BFA', price: 1000 },
  { id: 'sunset',   name: '선셋',    hex: '#FB923C', price: 1000 },
  { id: 'flame',    name: '불꽃',    hex: '#EF4444', price: 1500 },
  { id: 'gold',     name: '골드',    hex: '#EAB308', price: 1500 },
];

export const GRASS_CELL_SKINS: GrassCellSkin[] = [
  { id: 'default', name: '기본',    desc: '네온 글로우',       price: null },
  { id: 'pixel',   name: '픽셀',    desc: '8bit 깜빡임',      price: 1500 },
  { id: 'circle',  name: '서클',    desc: '펄스 애니메이션',   price: 1500 },
  { id: 'diamond', name: '다이아',  desc: '반짝임 효과',       price: 1500 },
];

export function getGrassColor(id: GrassColorId): string {
  return GRASS_COLORS.find((c) => c.id === id)?.hex ?? '#22C55E';
}

export function getGrassNeonGlow(hex: string): string {
  return `${hex}80`;
}

export const GRASS_OPACITY = [0, 0.2, 0.4, 0.65, 1.0] as const;

export function getCellBorderRadius(shape: GrassCellShape, size: number): number {
  switch (shape) {
    case 'pixel':   return 2;
    case 'circle':  return size / 2;
    case 'diamond': return size / 6;
    default:        return size / 4;
  }
}

export function getCellTransform(shape: GrassCellShape): { rotate?: string; scale?: number } {
  if (shape === 'diamond') return { rotate: '45deg' };
  return {};
}

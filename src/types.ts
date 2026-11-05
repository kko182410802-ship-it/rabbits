export type BunnyAccessory =
  | 'ribbon'
  | 'flower'
  | 'crown'
  | 'carrot'
  | 'star'
  | 'glasses'
  | 'clover'
  | 'strawberry'
  | 'headphones'
  | 'heart'
  | 'cap'
  | 'bell';

export interface BunnyTheme {
  furColor: string;
  furHighlight: string;
  earInnerColor: string;
  bibBg: string;
  bibBorder: string;
  textColor: string;
  accessory: BunnyAccessory;
  accentColor: string;
}

export interface Participant {
  id: string;
  name: string;
  theme: BunnyTheme;
}

export interface BunnyRunner extends Participant {
  laneIndex: number;
  x: number; // 0 to 1000
  hopCycle: number;
  isAirborne: boolean;
  speed: number;
  finished: boolean;
  finishTime: number | null;
  finishRank: number | null;
  burstType: 'normal' | 'spurt' | 'curious';
  burstRemaining: number;
}

export type GameStage = 'SETUP' | 'READY' | 'COUNTDOWN' | 'RACING' | 'FINISHED';

export const ACCESSORY_LABELS: Record<BunnyAccessory, string> = {
  ribbon: '🎀 리본',
  flower: '🌸 벚꽃',
  crown: '👑 왕관',
  carrot: '🥕 당근',
  star: '⭐️ 별',
  glasses: '👓 안경',
  clover: '🍀 네잎클로버',
  strawberry: '🍓 딸기',
  headphones: '🎧 헤드폰',
  heart: '💖 하트',
  cap: '🧢 캡모자',
  bell: '🔔 방울',
};

// 24 curated pastel palettes for bunnies
export const PASTEL_PALETTES = [
  { fur: '#FFF0F5', highlight: '#FFFFFF', inner: '#FFB6C1', bib: '#FFFFFF', border: '#FFAAA6', text: '#881337', accent: '#FB7185' }, // Strawberry Milk Pink
  { fur: '#E0F2FE', highlight: '#F0F9FF', inner: '#BAE6FD', bib: '#FFFFFF', border: '#7DD3FC', text: '#0369A1', accent: '#38BDF8' }, // Sky Pastel Blue
  { fur: '#F3E8FF', highlight: '#FAF5FF', inner: '#E9D5FF', bib: '#FFFFFF', border: '#D8B4FE', text: '#6B21A8', accent: '#A855F7' }, // Lavender Cloud
  { fur: '#ECFDF5', highlight: '#F0FDF4', inner: '#A7F3D0', bib: '#FFFFFF', border: '#6EE7B7', text: '#047857', accent: '#34D399' }, // Mint Sherbet
  { fur: '#FEF9C3', highlight: '#FEFCE8', inner: '#FDE047', bib: '#FFFFFF', border: '#FACC15', text: '#854D0E', accent: '#EAB308' }, // Buttercup Yellow
  { fur: '#FFEDD5', highlight: '#FFF7ED', inner: '#FED7AA', bib: '#FFFFFF', border: '#FDBA74', text: '#9A3412', accent: '#FB923C' }, // Peach Cream
  { fur: '#FCE7F3', highlight: '#FDF2F8', inner: '#FBCFE8', bib: '#FFFFFF', border: '#F472B6', text: '#9D174D', accent: '#EC4899' }, // Cherry Blossom
  { fur: '#E0E7FF', highlight: '#EEF2FF', inner: '#C7D2FE', bib: '#FFFFFF', border: '#818CF8', text: '#3730A3', accent: '#6366F1' }, // Periwinkle Blue
  { fur: '#F1F5F9', highlight: '#FFFFFF', inner: '#CBD5E1', bib: '#FFFFFF', border: '#94A3B8', text: '#1E293B', accent: '#64748B' }, // Snow White / Mist
  { fur: '#CCFBF1', highlight: '#F0FDFA', inner: '#99F6E4', bib: '#FFFFFF', border: '#5EEAD4', text: '#115E59', accent: '#14B8A6' }, // Pastel Teal
  { fur: '#FDF2E9', highlight: '#FFFDF9', inner: '#FAD7BD', bib: '#FFFFFF', border: '#F5B07A', text: '#7C2D12', accent: '#EA580C' }, // Apricot Mousse
  { fur: '#EDE9FE', highlight: '#F5F3FF', inner: '#DDD6FE', bib: '#FFFFFF', border: '#C4B5FD', text: '#5B21B6', accent: '#8B5CF6' }, // Lilac Mist
  { fur: '#E2E8F0', highlight: '#F8FAFC', inner: '#FCA5A5', bib: '#FFFFFF', border: '#CBD5E1', text: '#334155', accent: '#EF4444' }, // Grey Bunny with Pink Ears
  { fur: '#FEF3C7', highlight: '#FFFBEB', inner: '#FDE68A', bib: '#FFFFFF', border: '#F59E0B', text: '#78350F', accent: '#D97706' }, // Honey Vanilla
  { fur: '#DCFCE7', highlight: '#F0FDF4', inner: '#BBF7D0', bib: '#FFFFFF', border: '#86EFAC', text: '#166534', accent: '#22C55E' }, // Clover Green
  { fur: '#FAE8FF', highlight: '#FDFAFF', inner: '#F5D0FE', bib: '#FFFFFF', border: '#E879F9', text: '#86198F', accent: '#D946EF' }, // Orchid Pink
  { fur: '#CFFAFE', highlight: '#ECFEFF', inner: '#A5F3FC', bib: '#FFFFFF', border: '#67E8F9', text: '#155E75', accent: '#06B6D4' }, // Ice Mint
  { fur: '#FDE68A', highlight: '#FEF08A', inner: '#FCD34D', bib: '#FFFFFF', border: '#FBBF24', text: '#713F12', accent: '#F59E0B' }, // Caramel Custard
  { fur: '#FFE4E6', highlight: '#FFF1F2', inner: '#FECDD3', bib: '#FFFFFF', border: '#FDA4AF', text: '#9F1239', accent: '#F43F5E' }, // Rose Petal
  { fur: '#E0E7FF', highlight: '#EEF2FF', inner: '#A5B4FC', bib: '#FFFFFF', border: '#6366F1', text: '#312E81', accent: '#4F46E5' }, // Baby Indigo
  { fur: '#F0FDFA', highlight: '#FFFFFF', inner: '#99F6E4', bib: '#FFFFFF', border: '#2DD4BF', text: '#134E4A', accent: '#0D9488' }, // Mint Sorbet
  { fur: '#FEF2F2', highlight: '#FFFFFF', inner: '#FECACA', bib: '#FFFFFF', border: '#F87171', text: '#7F1D1D', accent: '#DC2626' }, // Marshmallow Pink
  { fur: '#F5F5F4', highlight: '#FAFAF9', inner: '#E7E5E4', bib: '#FFFFFF', border: '#A8A29E', text: '#292524', accent: '#78716C' }, // Warm Grey
  { fur: '#FFF7ED', highlight: '#FFFFFF', inner: '#FFEDD5', bib: '#FFFFFF', border: '#FB923C', text: '#7C2D12', accent: '#C2410C' }, // Milk Tea
];

const ACCESSORIES: BunnyAccessory[] = [
  'ribbon',
  'flower',
  'crown',
  'carrot',
  'star',
  'glasses',
  'clover',
  'strawberry',
  'headphones',
  'heart',
  'cap',
  'bell',
];

export function generateBunnyTheme(index: number): BunnyTheme {
  const palette = PASTEL_PALETTES[index % PASTEL_PALETTES.length];
  const accessory = ACCESSORIES[index % ACCESSORIES.length];

  return {
    furColor: palette.fur,
    furHighlight: palette.highlight,
    earInnerColor: palette.inner,
    bibBg: palette.bib,
    bibBorder: palette.border,
    textColor: palette.text,
    accessory,
    accentColor: palette.accent,
  };
}

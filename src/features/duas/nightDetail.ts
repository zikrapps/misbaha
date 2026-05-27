/** Night remembrance hours: after Maghrib-ish through before Fajr. */
export function isNightDetailHours(date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 19 || hour < 5;
}

export type NightDetailPalette = {
  canvas: string;
  card: string;
  arabic: string;
  muted: string;
  faint: string;
  line: string;
  hold: string;
  controlBg: string;
  controlInk: string;
  motif: string;
  count: string;
  countBorder: string;
};

export const nightDetailPalette: NightDetailPalette = {
  canvas: '#0b0b0d',
  card: '#121214',
  arabic: '#f3f0e8',
  muted: '#45454b',
  faint: '#2c2c30',
  line: '#1e1e22',
  hold: 'rgba(170, 170, 176, 0.2)',
  controlBg: '#1c1c20',
  controlInk: '#7a7a82',
  motif: '#252528',
  count: '#5c5c62',
  countBorder: '#34343a',
};

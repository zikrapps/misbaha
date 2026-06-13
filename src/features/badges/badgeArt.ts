import { BadgeDef, BadgeFamilyId, BadgePaletteId } from '@/src/data/badges';

/**
 * Badge artwork as SVG XML strings. Each of the ten families has its own
 * silhouette (FR) and a unique emblem per tier (EM[family][tier]). Strings are
 * rendered by `BadgeMedal` through react-native-svg's `SvgXml`. Locked badges
 * reuse the same drawing recoloured to a grey ramp.
 */

type Shades = { dark: string; mid: string; light: string; cream: string };
type Emblem = (p: Shades, gg?: Shades, pl?: string) => string;

const pal: Record<BadgePaletteId, Shades> = {
  olive: { dark: '#2d4a22', mid: '#6f8f4e', light: '#c0d29a', cream: '#f3f6e6' },
  gold: { dark: '#6b4f15', mid: '#c9a227', light: '#ecd9a0', cream: '#fdf6e0' },
  night: { dark: '#1f2747', mid: '#44538c', light: '#aab6e0', cream: '#eef1fa' },
  rose: { dark: '#6e3028', mid: '#bf7b6e', light: '#ecc6ba', cream: '#fbeee8' },
  teal: { dark: '#173f39', mid: '#3f7d72', light: '#a5cfc5', cream: '#e9f4f1' },
};

const g = pal.gold;
const RO = pal.rose;
const NI = pal.night;
const lf = '#6f8f4e';
const M = '#f1e9c8';
const MC = '#d6cc9b';
const CR = '#e2d8aa';

const C = (x: number, y: number, r: number, f: string, s?: string, w?: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${s ? ` stroke="${s}" stroke-width="${w || 1.5}"` : ''}/>`;
const DC = (x: number, y: number, r: number, s: string, w: number, dash: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${s}" stroke-width="${w}" stroke-dasharray="${dash}"/>`;
const P = (d: string, f: string, s?: string, w?: number) =>
  `<path d="${d}" fill="${f}"${s ? ` stroke="${s}" stroke-width="${w || 1.5}" stroke-linecap="round" stroke-linejoin="round"` : ''}/>`;
const L = (a: number, b: number, c: number, d: number, s: string, w?: number) =>
  `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${s}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
const RECT = (x: number, y: number, w: number, h: number, rx: number, f: string, s?: string, sw?: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"${s ? ` stroke="${s}" stroke-width="${sw || 1}"` : ''}/>`;
const EL = (x: number, y: number, rx: number, ry: number, rot: number, f: string, s?: string, w?: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''} fill="${f}"${s ? ` stroke="${s}" stroke-width="${w || 1.2}"` : ''}/>`;
const SP = (n: number, R: number, r: number, f: string, s?: string | null, cx = 0, cy = 0, w?: number) => {
  const pts = [];
  for (let i = 0; i < 2 * n; i += 1) {
    const a = ((-90 + (i * 180) / n) * Math.PI) / 180;
    const rad = i % 2 ? r : R;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${f}"${s ? ` stroke="${s}" stroke-width="${w || 1.2}" stroke-linejoin="round"` : ''}/>`;
};
const RING = (n: number, R: number, rad: number, f: string, s?: string | null, cx = 0, cy = 0, ph = -90) => {
  let o = '';
  for (let i = 0; i < n; i += 1) {
    const a = ((ph + (i * 360) / n) * Math.PI) / 180;
    o += C(+(cx + R * Math.cos(a)).toFixed(1), +(cy + R * Math.sin(a)).toFixed(1), rad, f, s || undefined, 0.8);
  }
  return o;
};
const PET = (n: number, len: number, wd: number, f: string, s?: string, ph = 0) => {
  let o = '';
  for (let i = 0; i < n; i += 1) {
    o += `<ellipse cx="0" cy="${-len * 0.62}" rx="${wd}" ry="${len * 0.5}" transform="rotate(${ph + (i * 360) / n})" fill="${f}"${s ? ` stroke="${s}" stroke-width="1"` : ''}/>`;
  }
  return o;
};
const RAYR = (n: number, r1: number, r2: number, s: string, w: number, ph = 0) => {
  let o = '';
  for (let i = 0; i < n; i += 1) {
    o += `<g transform="rotate(${ph + (i * 360) / n})">${L(0, -r1, 0, -r2, s, w)}</g>`;
  }
  return o;
};
const PG = (n: number, R: number, f: string, s?: string, w?: number, ph = -90, cx = 0, cy = 0) => {
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    const a = ((ph + (i * 360) / n) * Math.PI) / 180;
    pts.push(`${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${f}"${s ? ` stroke="${s}" stroke-width="${w || 1.5}" stroke-linejoin="round"` : ''}/>`;
};
const SPK = (x: number, y: number, r: number, f: string) =>
  P(`M${x},${y - r} L${x + r * 0.32},${y - r * 0.32} L${x + r},${y} L${x + r * 0.32},${y + r * 0.32} L${x},${y + r} L${x - r * 0.32},${y + r * 0.32} L${x - r},${y} L${x - r * 0.32},${y - r * 0.32} Z`, f);
const FLM = (x: number, y: number, s: number, f: string, sk?: string) =>
  P(`M${x},${y} C${x + 3 * s},${y - 4 * s} ${x + 2 * s},${y - 7 * s} ${x},${y - 10 * s} C${x - 2 * s},${y - 7 * s} ${x - 3 * s},${y - 4 * s} ${x},${y} Z`, f, sk, 0.8);
const BIRD = (x: number, y: number, s: number, c: string) =>
  P(`M${x - 4 * s},${y} Q${x - 2 * s},${y - 3 * s} ${x},${y} Q${x + 2 * s},${y - 3 * s} ${x + 4 * s},${y}`, 'none', c, 1.6);
const CRES = (x: number, y: number, r: number, off: number, fill: string, plate: string) =>
  C(x, y, r, fill) + C(x + off, y - off * 0.4, r * 0.85, plate);
const POLY = (n: number, R: number, ph: number) => {
  let d = '';
  for (let i = 0; i < n; i += 1) {
    const a = ((ph + (i * 360) / n) * Math.PI) / 180;
    d += (i ? 'L' : 'M') + (R * Math.cos(a)).toFixed(1) + ',' + (R * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
};
const STAR = (n: number, R: number, r: number, ph = -90) => {
  let d = '';
  for (let i = 0; i < 2 * n; i += 1) {
    const a = ((ph + (i * 180) / n) * Math.PI) / 180;
    const rad = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (rad * Math.cos(a)).toFixed(1) + ',' + (rad * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
};

const FR: Record<BadgeFamilyId, (p: Shades) => string> = {
  bead: (p) => C(0, 0, 84, p.mid, p.dark, 2.5) + RING(34, 77, 2.7, p.light, p.dark) + DC(0, 0, 62, p.cream, 1, '1 5'),
  praise: (p) => P(STAR(8, 84, 52), p.mid, p.dark, 2.5) + P(STAR(8, 70, 44), 'none', p.light, 1.4) + DC(0, 0, 52, p.cream, 1, '1 5'),
  rays: (p) => {
    let t = '';
    for (let i = 0; i < 16; i += 1) {
      const a = (i * 22.5 * Math.PI) / 180;
      const a1 = ((i * 22.5 - 6.5) * Math.PI) / 180;
      const a2 = ((i * 22.5 + 6.5) * Math.PI) / 180;
      t += P(
        `M${(66 * Math.cos(a1)).toFixed(1)},${(66 * Math.sin(a1)).toFixed(1)} L${(86 * Math.cos(a)).toFixed(1)},${(86 * Math.sin(a)).toFixed(1)} L${(66 * Math.cos(a2)).toFixed(1)},${(66 * Math.sin(a2)).toFixed(1)} Z`,
        p.mid,
        p.dark,
        1,
      );
    }
    return t + C(0, 0, 67, p.mid, p.dark, 2) + DC(0, 0, 60, p.light, 1.3, '');
  },
  moon: (p) =>
    P('M-50,64 L-50,-10 C-50,-46 -22,-54 0,-86 C22,-54 50,-46 50,-10 L50,64 Z', p.mid, p.dark, 2.5) +
    C(0, -88, 3, p.mid, p.dark, 1) +
    P('M-42,58 L-42,-10 C-42,-42 -18,-50 0,-76 C18,-50 42,-42 42,-10 L42,58 Z', 'none', p.light, 1.4),
  fruit: (p) =>
    P('M-56,-66 L56,-66 L56,-4 C56,42 30,64 0,80 C-30,64 -56,42 -56,-4 Z', p.mid, p.dark, 2.5) +
    P('M-48,-58 L48,-58 L48,-4 C48,36 26,55 0,69 C-26,55 -48,36 -48,-4 Z', 'none', p.light, 1.4),
  plant: (p) => P(POLY(6, 84, -90), p.mid, p.dark, 2.5) + P(POLY(6, 71, -90), 'none', p.light, 1.4) + RING(6, 77, 2.4, p.cream, null, 0, 0, -90),
  dawn: (p) =>
    P('M-52,70 L-52,-4 C-52,-52 52,-52 52,-4 L52,70 Z', p.mid, p.dark, 2.5) +
    P('M-44,64 L-44,-4 C-44,-43 44,-43 44,-4 L44,64 Z', 'none', p.light, 1.4),
  lantern: (p) =>
    RECT(-12, -80, 24, 11, 2, p.mid, p.dark, 1.5) +
    C(0, -84, 3, 'none', p.dark, 1.5) +
    P('M-40,-66 L40,-66 L54,0 L40,64 L-40,64 L-54,0 Z', p.mid, p.dark, 2.5) +
    P('M-33,-58 L33,-58 L45,0 L33,56 L-33,56 L-45,0 Z', 'none', p.light, 1.4) +
    RECT(-17, 64, 34, 10, 2, p.mid, p.dark, 1.5),
  burst: (p) => P(STAR(4, 88, 40), p.mid, p.dark, 2) + P(STAR(4, 60, 34, -45), p.light, p.dark, 1.2) + DC(0, 0, 40, p.cream, 1, '1 5'),
  compass: (p) => P(POLY(8, 84, 22.5), p.mid, p.dark, 2.5) + P(POLY(8, 70, 22.5), 'none', p.light, 1.4) + RING(8, 77, 2.2, p.cream, null, 0, 0, 22.5),
};

const PCY: Record<BadgeFamilyId, number> = { bead: 0, praise: 0, rays: 0, moon: -2, fruit: -4, plant: 0, dawn: 4, lantern: 0, burst: 0, compass: 0 };
const DARK_PLATE: Record<string, boolean> = { moon: true, lantern: true };

const EM: Record<BadgeFamilyId, Record<number, { n: string; f: Emblem }>> = {
  bead: {
    1: {
      n: 'First bead',
      f: (p) => {
        const bx = [-26, -23, -19, -14.5, -9];
        const by = [-13, -6, -0.5, 4, 7];
        let o = P('M-28,-18 C-22,14 22,14 28,-18', 'none', p.dark, 1.5);
        bx.forEach((x, i) => {
          o += C(x, by[i], 3.4, p.mid, p.dark, 0.8) + C(-x, by[i], 3.4, p.mid, p.dark, 0.8);
        });
        return o + C(0, 10.5, 8, g.mid, g.dark, 1.5) + C(-2.5, 8, 2.5, g.cream) + L(0, 18.5, 0, 21.5, p.dark, 1.2) + C(0, 23, 2.2, g.mid, g.dark, 0.6) + P('M0,25 L-4,31 M0,25 L0,31.8 M0,25 L4,31', 'none', p.dark, 1.2);
      },
    },
    2: { n: 'Three beads', f: (p) => L(-16, 2, 16, 2, p.dark, 1.5) + C(-10, 2, 5, p.mid, p.dark, 1) + C(0, 2, 5, p.mid, p.dark, 1) + C(10, 2, 5, p.mid, p.dark, 1) + C(-12, 0, 1.4, p.cream) + C(-2, 0, 1.4, p.cream) + C(8, 0, 1.4, p.cream) },
    3: { n: 'Seven on a string', f: (p) => P('M-26,-10 Q0,18 26,-10', 'none', p.dark, 1.5) + [[-24, -8.5], [-16, -2.5], [-8, 1.5], [0, 3.5], [8, 1.5], [16, -2.5], [24, -8.5]].map((b) => C(b[0], b[1], 3.6, p.mid, p.dark, 0.8)).join('') },
    4: { n: 'Bead bracelet', f: (p) => RING(12, 17, 3.4, p.mid, p.dark) + C(0, -17, 4.5, g.mid, g.dark, 1) },
    5: { n: 'Full misbaha', f: (p) => RING(16, 18, 3, p.mid, p.dark, 0, -3) + C(0, 15, 4, g.mid, g.dark, 1) + L(0, 19, 0, 23, p.dark, 1.2) + C(0, 24.5, 1.8, g.mid) + P('M0,26 L-3,30 M0,26 L0,30.5 M0,26 L3,30', 'none', p.dark, 1.1) },
    6: { n: 'Double strand', f: (p) => RING(14, 22, 2.8, p.mid, p.dark) + RING(9, 12, 2.8, p.light, p.dark) },
    7: { n: 'Crossed strands', f: (p) => L(-20, -20, 20, 20, p.dark, 1.4) + L(20, -20, -20, 20, p.dark, 1.4) + C(-14, -14, 3.4, p.mid, p.dark, 0.8) + C(14, 14, 3.4, p.mid, p.dark, 0.8) + C(-14, 14, 3.4, p.mid, p.dark, 0.8) + C(14, -14, 3.4, p.mid, p.dark, 0.8) + C(0, 0, 5, g.mid, g.dark, 1) },
    8: {
      n: 'Bead spiral',
      f: (p) => {
        let o = '';
        for (let i = 0; i < 11; i += 1) {
          const a = i * 0.85 - 1.57;
          const r = 4 + i * 2.2;
          o += C(+(r * Math.cos(a)).toFixed(1), +(r * Math.sin(a)).toFixed(1), 2.4 + i * 0.14, i % 3 ? p.mid : p.light, p.dark, 0.7);
        }
        return o;
      },
    },
    9: { n: 'Bowl of beads', f: (p) => C(-3, -5, 3.2, g.mid, g.dark, 0.7) + C(-10, -1, 3.2, p.light, p.dark, 0.7) + C(4, -4, 3.2, p.light, p.dark, 0.7) + C(11, -1, 3.2, p.mid, p.dark, 0.7) + C(0.5, 0, 3.2, p.mid, p.dark, 0.7) + P('M-19,2 Q-19,18 0,18 Q19,18 19,2 Z', p.mid, p.dark, 1.4) },
    10: { n: 'Pendant bead', f: (p) => P('M-22,-18 Q0,6 22,-18', 'none', p.dark, 1.5) + C(-16, -12, 2.8, p.mid, p.dark, 0.8) + C(16, -12, 2.8, p.mid, p.dark, 0.8) + P('M0,2 C7,10 7,20 0,24 C-7,20 -7,10 0,2 Z', g.mid, g.dark, 1.2) + C(-2, 10, 1.8, g.cream) },
    11: { n: 'Star of beads', f: (p) => RING(5, 22, 3.6, p.mid, p.dark) + RING(5, 9, 2.6, p.light, p.dark, 0, 0, -54) + C(0, 0, 3, g.mid, g.dark, 0.8) },
    12: { n: 'Bead heart', f: (p) => P('M0,24 C-24,6 -16,-14 0,-4 C16,-14 24,6 0,24', 'none', p.mid, 2.2) + C(-19, 2, 3, p.mid, p.dark, 0.8) + C(19, 2, 3, p.mid, p.dark, 0.8) + C(0, 15, 3, p.mid, p.dark, 0.8) + C(0, 4, 3.5, g.mid, g.dark, 0.8) },
    13: {
      n: 'Crescent of beads',
      f: (p) => {
        let o = '';
        for (let i = 0; i < 9; i += 1) {
          const a = ((115 + i * 16) * Math.PI) / 180;
          const rd = i === 0 || i === 8 ? 2 : i === 1 || i === 7 ? 2.7 : 3.3;
          o += C(+(21 * Math.cos(a)).toFixed(1), +(21 * Math.sin(a) - 4).toFixed(1), rd, i === 4 ? g.mid : p.mid, p.dark, 0.7);
        }
        return o;
      },
    },
    14: { n: 'Cascade', f: (p) => L(-12, -22, -12, 6, p.dark, 1.2) + C(-12, 10, 3.4, p.mid, p.dark, 0.8) + L(0, -22, 0, 16, p.dark, 1.2) + C(0, 20, 3.4, g.mid, g.dark, 0.8) + L(12, -22, 12, 10, p.dark, 1.2) + C(12, 14, 3.4, p.mid, p.dark, 0.8) + C(-12, -4, 2.4, p.light, p.dark, 0.7) + C(0, -2, 2.4, p.light, p.dark, 0.7) + C(12, 0, 2.4, p.light, p.dark, 0.7) },
    15: { n: 'Bead veil', f: (p) => L(-22, -20, 22, -20, p.dark, 2.2) + [[-18, 2], [-9, 10], [0, 16], [9, 10], [18, 2]].map((s, i) => L(s[0], -20, s[0], s[1], p.dark, 1.1) + C(s[0], s[1] + 3, 2.8, i === 2 ? g.mid : p.mid, p.dark, 0.7)).join('') },
    16: { n: 'Cut gem bead', f: (p) => PG(8, 19, p.mid, p.dark, 1.4, -67.5) + L(-7.3, -17.6, 7.3, 17.6, p.dark, 1) + L(7.3, -17.6, -7.3, 17.6, p.dark, 1) + L(-17.6, -7.3, 17.6, 7.3, p.dark, 1) + C(-5, -7, 2.5, p.cream) },
    17: { n: 'Orbiting beads', f: (p) => EL(0, 0, 26, 10, 0, 'none', p.dark, 1.3) + C(0, 0, 8, g.mid, g.dark, 1.2) + C(-2.5, -2.5, 2.2, g.cream) + C(-26, 0, 3, p.mid, p.dark, 0.8) + C(13, 8.7, 3, p.mid, p.dark, 0.8) + C(13, -8.7, 3, p.light, p.dark, 0.8) },
    18: { n: 'Bead tree', f: (p) => P('M-14,20 Q0,16 14,20', 'none', p.dark, 1.5) + L(0, 20, 0, 2, p.dark, 2.2) + P('M0,10 L-13,0 M0,4 L13,-6 M0,16 L9,9', 'none', p.dark, 1.8) + C(-13, -2, 3.2, p.mid, p.dark, 0.7) + C(13, -8, 3.2, p.mid, p.dark, 0.7) + C(9, 7, 3.2, p.mid, p.dark, 0.7) + C(0, -2, 3.4, g.mid, g.dark, 0.7) },
    19: { n: 'Treasure of beads', f: (p) => C(-8, -4, 2.6, g.mid, g.dark, 0.6) + C(2, -7, 2.6, p.light, p.dark, 0.6) + C(8, -3, 2.6, g.mid, g.dark, 0.6) + P('M-16,2 Q0,-14 16,2 Z', p.mid, p.dark, 1.4) + RECT(-16, 2, 32, 14, 2, p.mid, p.dark, 1.4) + C(0, 2, 2.2, g.mid) },
    20: { n: 'Bead crown', f: (p) => P('M-19,12 L-19,-4 L-9,4 L0,-10 L9,4 L19,-4 L19,12 Z', g.mid, g.dark, 1.4) + RECT(-19, 12, 38, 5, 1.5, g.light, g.dark, 1) + C(-19, -7, 3, p.mid, p.dark, 0.8) + C(0, -13, 3.4, p.mid, p.dark, 0.8) + C(19, -7, 3, p.mid, p.dark, 0.8) },
  },
  praise: {
    1: { n: 'Hundred praises', f: () => PET(3, 20, 8, g.mid, g.dark) + C(0, 0, 6, g.light, g.dark, 1) },
    2: { n: 'Four petals', f: () => PET(4, 20, 7, g.mid, g.dark) + C(0, 0, 5, g.dark) },
    3: { n: 'Five-point star', f: () => SP(5, 24, 10, g.mid, g.dark) },
    4: { n: 'Six petals', f: () => PET(6, 20, 6.5, g.light, g.dark) + C(0, 0, 5.5, g.mid, g.dark, 1) },
    5: { n: 'Seven-point star', f: () => SP(7, 24, 12, g.light, g.dark) + C(0, 0, 4, g.dark) },
    6: { n: 'Khatam seal', f: () => `<rect x="-16" y="-16" width="32" height="32" fill="none" stroke="${g.dark}" stroke-width="2"/><rect x="-16" y="-16" width="32" height="32" fill="none" stroke="${g.mid}" stroke-width="2" transform="rotate(45)"/>` + C(0, 0, 6, g.mid, g.dark, 1) },
    7: { n: 'Nine petals', f: () => PET(9, 21, 5, g.mid, g.dark) + C(0, 0, 6, g.light, g.dark, 1) },
    8: { n: 'Ten-point star', f: () => SP(10, 24, 15, g.mid, g.dark) + C(0, 0, 5, g.cream, g.dark, 1) },
    9: { n: 'Twelve-fold star', f: () => SP(12, 25, 18, g.light, g.dark) + SP(12, 14, 10, g.mid) },
    10: { n: 'Square and circle', f: () => RECT(-18, -18, 36, 36, 2, 'none', g.mid, 2) + C(0, 0, 18, 'none', g.dark, 2) + C(0, 0, 6, g.mid) },
    11: { n: 'Hexagon tile', f: () => PG(6, 20, 'none', g.dark, 2) + PG(6, 12, g.light, g.mid, 1.2, -60) + C(0, 0, 3, g.dark) },
    12: { n: 'Arabesque', f: () => [0, 90, 180, 270].map((a) => `<g transform="rotate(${a})">` + P('M0,-3 C12,-7 16,-17 8,-25', 'none', g.dark, 2) + P('M0,-3 C8,-5 10,-11 6,-16', 'none', g.mid, 1.4) + '</g>').join('') + C(0, 0, 4, g.mid, g.dark, 1) },
    13: { n: 'Sunburst sixteen', f: () => RAYR(16, 12, 25, g.mid, 2) + C(0, 0, 9, g.mid, g.dark, 1.2) },
    14: { n: 'Zigzag rings', f: () => SP(12, 26, 21, 'none', g.dark, 0, 0, 1.5) + SP(12, 17, 12, 'none', g.mid, 0, 0, 1.5) + C(0, 0, 4, g.dark) },
    15: { n: 'Endless knot', f: () => `<rect x="-14" y="-14" width="28" height="28" rx="6" fill="none" stroke="${g.dark}" stroke-width="2"/><rect x="-14" y="-14" width="28" height="28" rx="6" fill="none" stroke="${g.mid}" stroke-width="2" transform="rotate(45)"/>` + C(0, 0, 3.5, g.dark) },
    16: { n: 'Octagon cross', f: () => PG(8, 22, 'none', g.dark, 2, -67.5) + P('M-6,-18 L6,-18 L6,-6 L18,-6 L18,6 L6,6 L6,18 L-6,18 L-6,6 L-18,6 L-18,-6 L-6,-6 Z', g.mid, g.dark, 1.2) },
    17: { n: 'Stacked arches', f: () => P('M-16,-4 A8 8 0 0 1 0,-4 A8 8 0 0 1 16,-4', 'none', g.dark, 1.8) + P('M-20,8 A6.7 6.7 0 0 1 -6.6,8 A6.6 6.6 0 0 1 6.6,8 A6.7 6.7 0 0 1 20,8', 'none', g.mid, 1.8) + P('M-22,20 A5.5 5.5 0 0 1 -11,20 A5.5 5.5 0 0 1 0,20 A5.5 5.5 0 0 1 11,20 A5.5 5.5 0 0 1 22,20', 'none', g.dark, 1.8) + C(0, -14, 2.5, g.mid) },
    18: { n: 'Girih star', f: () => SP(10, 26, 16, 'none', g.dark, 0, 0, 1.8) + PG(5, 9, g.mid, g.dark, 1) },
    19: { n: 'Double rosette', f: () => PET(8, 22, 5.5, g.light, g.dark) + PET(8, 13, 4, g.mid, g.dark, 22.5) + C(0, 0, 4, g.dark) },
    20: { n: 'Grand shamsa', f: () => SP(16, 27, 19, g.mid, g.dark, 0, 0, 1) + C(0, 0, 10, g.cream, g.dark, 1) + RING(8, 15, 1.5, g.dark) + C(0, 0, 3, g.dark) },
  },
  rays: {
    1: { n: 'Week of light', f: () => RAYR(8, 12, 20, pal.olive.dark, 2.4) + C(0, 0, 11, g.mid, g.dark, 1.2) + C(-3, -3, 3, g.cream) },
    2: { n: 'Single flame', f: (p) => RECT(-4, -2, 8, 20, 1.5, p.mid, p.dark, 1) + L(0, -2, 0, -5, p.dark, 1.2) + FLM(0, -5, 0.9, g.mid, g.dark) + L(-9, 18, 9, 18, p.dark, 2) },
    3: { n: 'Clay lamp', f: (p) => P('M-16,4 Q0,16 16,4 Q18,2 14,0 L-14,0 Q-18,2 -16,4 Z', p.mid, p.dark, 1.2) + FLM(14, -1, 0.8, g.mid, g.dark) + C(-16, 2, 4, 'none', p.dark, 1.6) },
    4: { n: 'First light', f: (p) => L(-24, 8, 24, 8, p.dark, 2) + P('M-14,8 A14 7 0 0 1 14,8 Z', g.mid, g.dark, 1) + L(0, -4, 0, -9, p.dark, 1.8) + L(-10, -2, -13, -6, p.dark, 1.8) + L(10, -2, 13, -6, p.dark, 1.8) },
    5: { n: 'Morning dew', f: (p) => P('M0,-14 C8,-2 10,6 0,12 C-10,6 -8,-2 0,-14 Z', p.light, p.dark, 1.5) + C(-3, 2, 2, p.cream) + C(17, -15, 6, g.mid, g.dark, 1) + L(17, -25, 17, -22, p.dark, 1.5) + L(8, -19, 10.5, -17.5, p.dark, 1.5) },
    6: { n: 'Valley sun', f: (p) => C(0, 2, 8, g.mid, g.dark, 1) + L(0, -9, 0, -13, p.dark, 1.6) + P('M-30,16 Q-14,-2 2,16 Z', p.mid) + P('M-2,16 Q14,0 30,16 Z', p.light) + L(-30, 16, 30, 16, p.dark, 1.5) },
    7: { n: 'High noon', f: (p) => RAYR(12, 15, 22, p.dark, 2) + C(0, 0, 11, g.mid, g.dark, 1.2) },
    8: { n: 'Sun and cloud', f: (p) => C(-6, -6, 10, g.mid, g.dark, 1) + P('M-8,8 Q-8,0 0,2 Q2,-4 9,-1 Q17,-3 17,4 Q22,8 14,10 L-4,10 Q-10,10 -8,8 Z', p.cream, p.dark, 1.3) },
    9: { n: 'Window light', f: (p) => P('M-12,16 L-12,-6 A12 12 0 0 1 12,-6 L12,16 Z', 'none', p.dark, 2) + L(0, -17, 0, 16, p.dark, 1.2) + L(-12, 0, 12, 0, p.dark, 1.2) + L(15, -12, 24, -3, g.mid, 2) + L(16, 2, 24, 10, g.mid, 2) },
    10: { n: 'After the rain', f: (p) => P('M-20,14 A20 20 0 0 1 20,14', 'none', p.mid, 3) + P('M-14,14 A14 14 0 0 1 14,14', 'none', g.mid, 3) + P('M-8,14 A8 8 0 0 1 8,14', 'none', p.light, 3) + L(-24, 14, 24, 14, p.dark, 1.5) },
    11: { n: 'Day and night', f: (p, gg, pl) => L(0, -20, 0, 20, p.dark, 1.2) + P('M-2,-12 A12 12 0 0 0 -2,12 Z', g.mid, g.dark, 1) + L(-16, 0, -20, 0, p.dark, 1.5) + L(-13, -9, -16, -12, p.dark, 1.5) + L(-13, 9, -16, 12, p.dark, 1.5) + CRES(11, 0, 8, 3.5, p.light, pl || p.cream) },
    12: { n: 'Path of the sun', f: (p) => [[-24, 14], [-19, 4], [-11, -3], [11, -3], [19, 4], [24, 14]].map((d) => C(d[0], d[1], 1.6, p.dark)).join('') + C(0, -6, 7, g.mid, g.dark, 1) + L(-26, 18, 26, 18, p.dark, 2) },
    13: { n: 'Four seasons', f: (p) => C(-10, -10, 5, g.mid, g.dark, 1) + `<g transform="translate(-10,-10)">` + RAYR(4, 6.5, 10, p.dark, 1.5) + '</g>' + C(10, -10, 5, g.mid, g.dark, 1) + `<g transform="translate(10,-10)">` + RAYR(6, 6.5, 10, p.dark, 1.5) + '</g>' + C(-10, 10, 5, g.mid, g.dark, 1) + `<g transform="translate(-10,10)">` + RAYR(8, 6.5, 10, p.dark, 1.5) + '</g>' + C(10, 10, 5, g.mid, g.dark, 1) + `<g transform="translate(10,10)">` + RAYR(12, 6.5, 10, p.dark, 1.2) + '</g>' },
    14: { n: 'Mirrored sun', f: (p) => C(0, -8, 8, g.mid, g.dark, 1) + L(-20, 6, 20, 6, p.dark, 1.5) + L(-6, 10, 6, 10, g.mid, 2) + L(-4, 14, 4, 14, g.mid, 1.6) + L(-2, 18, 2, 18, g.mid, 1.2) },
    15: { n: 'Waves of light', f: (p) => [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<g transform="rotate(${a})">` + P('M0,-12 c3,-3 -3,-6 0,-10', 'none', p.dark, 1.8) + '</g>').join('') + C(0, 0, 9, g.mid, g.dark, 1.2) },
    16: { n: 'Ring of fire', f: (p) => C(0, 0, 14, 'none', g.mid, 5) + C(0, 0, 18.5, 'none', p.dark, 1) + C(0, 0, 9.5, 'none', p.dark, 1) + RAYR(12, 21, 24, p.dark, 1.4) },
    17: { n: 'Aurora', f: (p) => P('M-14,-16 q6,8 0,16 q-6,8 0,16', 'none', p.light, 4) + P('M0,-19 q6,8 0,16 q-6,8 0,19', 'none', g.mid, 4) + P('M14,-16 q6,8 0,16 q-6,8 0,16', 'none', p.mid, 4) + C(-22, -8, 1.3, p.dark) + C(22, 4, 1.3, p.dark) },
    18: { n: 'Sun halo', f: () => C(0, 0, 8, g.mid, g.dark, 1) + C(0, 0, 15, 'none', pal.olive.mid, 1.6) + C(0, 0, 21, 'none', pal.olive.light, 1.6) },
    19: { n: 'Fan of rays', f: (p) => [[-26, 3], [-19, -8], [-10, -15], [0, -18], [10, -15], [19, -8], [26, 3]].map((e, i) => L(0, 18, e[0], e[1], i % 2 ? p.mid : g.mid, 2.2)).join('') + C(0, 18, 4, p.dark) },
    20: { n: 'Golden hour', f: (p) => C(8, -6, 7, g.mid, g.dark, 1) + L(8, -17, 8, -20, p.dark, 1.6) + L(-2, -12, -4, -14, p.dark, 1.6) + L(18, -12, 20, -14, p.dark, 1.6) + BIRD(-12, -12, 1, p.dark) + BIRD(-3, -18, 0.8, p.dark) + P('M-28,14 Q-10,2 6,14 Z', p.mid) + P('M0,14 Q16,4 28,14 Z', p.light) + L(-28, 14, 28, 14, p.dark, 1.5) },
  },
  moon: {
    1: { n: 'Full moon', f: () => C(0, 1.5, 18, M, MC, 1.4) + C(5.5, -4, 3.5, CR) + C(-7, 5.5, 4.2, CR) + C(4, 11, 2.4, CR) + SP(5, 2.5, 1, M, null, -22, -14) + SP(5, 2.2, 0.9, M, null, 22, 12) },
    2: { n: 'Waxing sliver', f: (p, gg, pl) => CRES(0, 0, 16, 6, M, pl || p.dark) },
    3: { n: 'Crescent and star', f: (p, gg, pl) => CRES(-3, 0, 14, 5, M, pl || p.dark) + SP(5, 5, 2, M, null, 14, -8) },
    4: { n: 'Half moon', f: () => C(0, 0, 16, 'none', MC, 1.2) + P('M0,-16 A16 16 0 0 1 0,16 Z', M) },
    5: { n: 'Gibbous moon', f: (p) => C(0, 0, 15, M) + EL(-12, 0, 7, 15, 0, p.dark) + C(4, -5, 2.6, CR) + C(7, 4, 2, CR) },
    6: { n: 'Star cradle', f: () => P('M-17,-4 Q0,20 17,-4 Q0,6 -17,-4 Z', M, MC, 1) + SP(5, 6, 2.4, M, null, 0, -10) },
    7: { n: 'Mirrored moon', f: (p) => C(0, -7, 10, M) + C(3, -9, 2, CR) + L(-16, 8, 16, 8, p.light, 1.2) + EL(0, 14, 8, 3, 0, 'none', M, 1.5) + EL(0, 19, 5, 2, 0, 'none', MC, 1.2) },
    8: { n: 'Three-star arc', f: (p, gg, pl) => CRES(-4, 4, 13, 5, M, pl || p.dark) + SP(5, 4, 1.6, M, null, 10, -14) + SP(5, 3, 1.2, M, null, 16, -6) + SP(5, 2.4, 1, M, null, 19, 3) },
    9: { n: 'Veiled moon', f: (p) => C(0, -2, 13, M) + C(-4, -9, 2.2, CR) + RECT(-22, 0, 44, 7, 3.5, p.mid, p.light, 0.8) },
    10: { n: 'Haloed moon', f: (p) => C(0, 0, 24, 'none', p.mid, 1) + C(0, 0, 19, 'none', p.light, 1.2) + C(0, 0, 12, M) + C(4, -4, 2.4, CR) + C(-4, 3, 1.8, CR) },
    11: { n: 'Moon in the star', f: (p, gg, pl) => SP(5, 26, 11, 'none', p.light, 0, 0, 1.6) + CRES(0, 2, 8, 3.5, M, pl || p.dark) },
    12: { n: 'Phase trio', f: (p, gg, pl) => CRES(-16, 0, 7, 3, M, pl || p.dark) + P('M0,-7 A7 7 0 0 1 0,7 Z', M) + C(0, 0, 7, 'none', MC, 1) + C(16, 0, 7, M) },
    13: { n: 'Palm night', f: (p) => P('M-8,18 Q-6,6 -4,-4', 'none', p.light, 2.2) + P('M-4,-4 Q-14,-10 -20,-5 M-4,-4 Q4,-14 10,-12 M-4,-4 Q-12,-16 -16,-15 M-4,-4 Q6,-8 12,-4', 'none', p.light, 1.8) + C(12, -12, 8, M) + C(14, -14, 1.8, CR) },
    14: { n: 'Desert night', f: (p, gg, pl) => CRES(-6, -10, 9, 4, M, pl || p.dark) + SP(5, 3.5, 1.4, M, null, 12, -16) + P('M-26,12 Q-10,2 4,12 Q16,4 26,12 L26,20 L-26,20 Z', p.mid, p.light, 0.8) },
    15: { n: 'Falling star', f: (p, gg, pl) => CRES(-8, 6, 11, 4.5, M, pl || p.dark) + L(8, -18, 18, -8, M, 2) + L(4, -21, 12, -13, p.light, 1.5) + SPK(21, -5, 5, M) },
    16: { n: 'Cratered face', f: () => C(0, 0, 17, M, MC, 1) + C(6, -7, 3.4, CR) + C(-7, -4, 2.6, CR) + C(2, 4, 2, CR) + C(-3, 9, 3, CR) + C(9, 6, 2.2, CR) + C(-10, 5, 1.6, CR) },
    17: { n: 'Moonlit orbit', f: (p) => C(0, 0, 11, M) + C(3, -3, 2.2, CR) + RING(8, 21, 1.8, p.light) },
    18: { n: 'Minaret moon', f: (p) => P('M-4,20 L-4,-6 L0,-12 L4,-6 L4,20 Z', p.light) + L(-7, 0, 7, 0, p.light, 2) + C(0, -15, 1.3, M) + C(13, -12, 7.5, M) + C(15, -14, 1.6, CR) },
    19: { n: 'Supermoon', f: (p) => C(0, 0, 27, 'none', p.light, 1) + C(0, 0, 20, M, MC, 1.2) + C(7, -8, 4, CR) + C(-8, -5, 3, CR) + C(3, 5, 2.4, CR) + C(-4, 11, 3.4, CR) + C(11, 7, 2.6, CR) + SP(5, 2.5, 1, M, null, -26, -18) + SP(5, 2.5, 1, M, null, 26, 16) },
    20: { n: 'Seven stars', f: (p, gg, pl) => CRES(-6, 4, 12, 5, M, pl || p.dark) + SP(5, 4, 1.6, M, null, 10, -16) + SP(5, 3, 1.2, M, null, 18, -8) + SP(5, 2.5, 1, M, null, 21, 2) + SP(5, 3, 1.2, M, null, 16, 12) + SP(5, 2.5, 1, M, null, 6, -22) + SP(5, 2, 0.8, M, null, -6, -19) + SP(5, 2, 0.8, M, null, -16, -12) },
  },
  fruit: {
    1: { n: 'First fruit', f: (p) => P('M0,-13 L-3,-18 L0,-15 L3,-18 Z', p.dark) + C(0, 2, 14, p.mid, p.dark, 1.5) + EL(11, -9, 6, 3, -35, lf) + C(-5, -2, 2, p.cream) + C(3, 3, 1.6, p.cream) },
    2: { n: 'Twin dates', f: (p) => P('M0,-16 L-6,-6 M0,-16 L6,-6', 'none', p.dark, 1.6) + EL(-7, 4, 5, 9, 8, p.mid, p.dark, 1) + EL(7, 4, 5, 9, -8, p.mid, p.dark, 1) + C(-6.5, -5, 2, lf) + C(6.5, -5, 2, lf) },
    3: { n: 'Fig', f: (p) => P('M0,-14 C2,-10 10,-8 11,2 C12,12 4,16 0,16 C-4,16 -12,12 -11,2 C-10,-8 -2,-10 0,-14 Z', p.mid, p.dark, 1.3) + L(0, -18, 0, -13, p.dark, 2) + C(-4, 4, 2, p.cream) },
    4: { n: 'Grape cluster', f: (p) => L(0, -18, 0, -10, p.dark, 1.6) + EL(8, -15, 6, 3, -25, lf) + [[-5, -6], [5, -6], [-10, 1], [0, 1], [10, 1], [-5, 8], [5, 8], [0, 15]].map((b) => C(b[0], b[1], 4.6, p.mid, p.dark, 0.8)).join('') },
    5: { n: 'Olive sprig', f: (p) => P('M-18,12 Q0,2 18,-10', 'none', lf, 2) + EL(-8, 4, 5, 2, -30, lf) + EL(10, -4, 5, 2, -30, lf) + C(-4, 9, 3.6, p.dark) + C(5, 2, 3.6, p.mid, p.dark, 0.8) + C(14, -5, 3.6, p.dark) },
    6: { n: 'Orange', f: (p) => C(0, 2, 13, p.mid, p.dark, 1.2) + C(0, -9, 1.5, p.dark) + EL(7, -12, 6, 3, -30, lf) + C(-5, -2, 2, p.cream) },
    7: { n: 'Apple', f: (p) => P('M0,-8 C10,-16 20,-6 16,6 C13,16 4,18 0,14 C-4,18 -13,16 -16,6 C-20,-6 -10,-16 0,-8 Z', p.mid, p.dark, 1.3) + L(0, -9, 0, -15, p.dark, 2) + EL(6, -14, 5.5, 2.8, -30, lf) },
    8: { n: 'Pear', f: (p) => P('M0,-16 C5,-16 7,-10 8,-4 C14,2 12,14 0,15 C-12,14 -14,2 -8,-4 C-7,-10 -5,-16 0,-16 Z', p.mid, p.dark, 1.3) + L(0, -16, 0, -20, p.dark, 2) + C(-4, 4, 2, p.cream) },
    9: { n: 'Cherries', f: (p) => P('M0,-16 L-8,2 M0,-16 L9,0', 'none', p.dark, 1.6) + C(-8, 8, 6, p.mid, p.dark, 1) + C(9, 6, 6, p.mid, p.dark, 1) + EL(3, -14, 5, 2.5, -20, lf) + C(-10, 6, 1.6, p.cream) + C(7, 4, 1.6, p.cream) },
    10: { n: 'Pomegranate half', f: (p) => P('M-4,-6 L-5,-12 L-1,-8 L2,-12 L4,-6 Z', p.dark) + P('M-14,-4 Q-14,16 0,16 Q14,16 14,-4 Z', p.mid, p.dark, 1.3) + P('M-11,-2 Q-11,13 0,13 Q11,13 11,-2 Z', p.cream) + [[-6, 2], [0, 2], [6, 2], [-3, 7], [3, 7], [0, 11], [-7, 7], [7, 7]].map((b) => C(b[0], b[1], 2, p.mid)).join('') },
    11: { n: 'Watermelon slice', f: (p) => P('M-18,-8 A20 20 0 0 1 18,-8 L0,16 Z', p.mid, p.dark, 1.2) + P('M-18,-8 A20 20 0 0 1 18,-8', 'none', lf, 3) + EL(-5, -4, 1.6, 2.4, 20, p.dark) + EL(5, -4, 1.6, 2.4, -20, p.dark) + EL(0, 3, 1.6, 2.4, 0, p.dark) },
    12: { n: 'Wheat sheaf', f: (p) => L(0, 18, 0, -14, lf, 1.8) + L(-9, 18, -6, -8, lf, 1.6) + L(9, 18, 6, -8, lf, 1.6) + [[-2.5, -14], [2.5, -14], [-2.5, -9], [2.5, -9], [-2.5, -4], [2.5, -4]].map((s) => EL(s[0], s[1], 1.8, 3.2, s[0] < 0 ? -20 : 20, g.mid, g.dark, 0.6)).join('') + EL(-7.5, -8, 1.6, 2.8, -25, g.mid, g.dark, 0.6) + EL(7.5, -8, 1.6, 2.8, 25, g.mid, g.dark, 0.6) + L(-5, 8, 5, 8, p.dark, 1.6) },
    13: { n: 'Lemon bough', f: (p) => P('M-16,-10 Q0,-6 14,2', 'none', p.dark, 1.8) + EL(-8, -12, 5, 2.4, -20, lf) + EL(2, -10, 5, 2.4, 15, lf) + P('M2,4 Q14,-2 16,6 Q14,16 4,14 Q-4,10 2,4 Z', g.mid, g.dark, 1.2) + C(13, 3, 1.6, g.cream) },
    14: { n: 'Sweet melon', f: (p) => EL(0, 2, 15, 11, 0, p.mid, p.dark, 1.3) + P('M-8,-7 Q-11,2 -8,11', 'none', p.dark, 1) + L(0, -9, 0, 13, p.dark, 1) + P('M8,-7 Q11,2 8,11', 'none', p.dark, 1) + L(0, -9, 0, -14, p.dark, 1.8) },
    15: { n: 'Peach', f: (p) => C(0, 2, 13, p.mid, p.dark, 1.2) + P('M0,-11 Q3,2 0,15', 'none', p.dark, 1.2) + L(0, -11, 0, -16, p.dark, 1.8) + EL(6, -14, 5, 2.5, -25, lf) },
    16: { n: 'Strawberry', f: (p) => P('M0,16 C-12,8 -14,-4 -8,-8 L8,-8 C14,-4 12,8 0,16 Z', p.mid, p.dark, 1.3) + P('M-8,-8 L-4,-13 L0,-8 L4,-13 L8,-8 Z', lf) + C(-4, -2, 1, p.cream) + C(4, -2, 1, p.cream) + C(0, 4, 1, p.cream) + C(-5, 6, 1, p.cream) + C(5, 6, 1, p.cream) },
    17: { n: 'Mulberries', f: (p) => L(0, -18, -2, -8, p.dark, 1.6) + EL(8, -14, 5, 2.4, -25, lf) + [[-5, -4], [1, -5], [-8, 2], [-2, 1], [4, 0], [-5, 7], [1, 6], [-2, 12]].map((b) => C(b[0], b[1], 3, p.mid, p.dark, 0.7)).join('') },
    18: { n: 'Fruit bowl', f: (p) => C(-8, -3, 5.5, p.mid, p.dark, 0.8) + C(3, -5, 5, g.mid, g.dark, 0.8) + C(11, -1, 4.5, lf, '#44572a', 0.8) + P('M-18,2 Q-18,16 0,16 Q18,16 18,2 Z', p.light, p.dark, 1.3) },
    19: { n: 'Laden basket', f: (p) => C(-9, -6, 4.5, p.mid, p.dark, 0.8) + C(0, -9, 4.5, g.mid, g.dark, 0.8) + C(9, -6, 4.5, lf, '#44572a', 0.8) + C(-16, 4, 3.5, p.mid, p.dark, 0.8) + P('M-14,-2 L14,-2 L10,14 L-10,14 Z', p.light, p.dark, 1.3) + L(-12, 3, 12, 3, p.dark, 1) + L(-11, 8, 11, 8, p.dark, 1) },
    20: { n: 'Orchard tree', f: (p) => P('M-3,18 L-2,4 L2,4 L3,18 Z', p.dark) + C(0, -6, 16, lf, '#44572a', 1.3) + C(-7, -9, 2.6, p.mid) + C(6, -12, 2.6, p.mid) + C(9, -2, 2.6, p.mid) + C(-9, 0, 2.6, p.mid) + C(0, 2, 2.6, p.mid) + C(-1, -16, 2.6, p.mid) + L(-14, 18, 14, 18, p.dark, 1.5) },
  },
  plant: {
    1: {
      n: 'Gardener',
      f: (p) => {
        const lv = [[-6, 14, -45, 0], [6, 12, 45, 1], [-9, 5, -40, 1], [9, 3, 40, 0], [-10, -4, -35, 0], [10, -6, 35, 1], [-8, -12, -30, 1], [8, -13, 30, 0], [-4, -19, -20, 0], [4, -20, 20, 1]];
        let o = P('M-20,25 Q0,14 20,25 Z', p.dark) + P('M0,24 C-2,10 2,-4 0,-21', 'none', p.dark, 2.2);
        lv.forEach((e) => {
          o += EL(e[0], e[1], 5, 2.4, e[2], e[3] ? p.mid : p.light);
        });
        [[0, -28.5], [3.3, -26.1], [2, -22.2], [-2, -22.2], [-3.3, -26.1]].forEach((c) => {
          o += C(c[0], c[1], 2.6, RO.mid, RO.dark, 0.5);
        });
        return o + C(0, -25, 2, g.mid);
      },
    },
    2: { n: 'Watering can', f: (p) => RECT(-10, -4, 18, 14, 2, p.mid, p.dark, 1.2) + P('M-10,0 L-20,-8 L-17,-10 L-8,-4 Z', p.mid, p.dark, 1) + C(12, 3, 6, 'none', p.dark, 1.6) + C(-21, -4, 1.4, p.dark) + C(-19, 0, 1.4, p.dark) },
    3: { n: 'Three seeds', f: (p) => P('M-18,12 Q0,2 18,12 L18,16 L-18,16 Z', p.dark) + EL(-8, 5, 3, 4, 15, p.mid, p.dark, 1) + EL(0, 1, 3, 4, 0, p.light, p.dark, 1) + EL(8, 5, 3, 4, -15, p.mid, p.dark, 1) },
    4: { n: 'First sprout', f: (p) => P('M-10,2 L10,2 L7,16 L-7,16 Z', p.mid, p.dark, 1.2) + RECT(-12, -2, 24, 4, 1, p.dark) + L(0, -2, 0, -12, p.dark, 1.8) + EL(-4, -13, 5, 2.5, -35, p.mid) + EL(4, -13, 5, 2.5, 35, p.light) },
    5: { n: 'Trowel and seedling', f: (p) => L(14, -16, 8, -6, p.dark, 2.5) + P('M8,-6 L14,2 L4,8 L1,0 Z', p.light, p.dark, 1) + P('M-18,14 Q-10,10 -2,14', 'none', p.dark, 1.5) + L(-10, 13, -10, 2, p.dark, 1.8) + EL(-13, 0, 4.5, 2.2, -35, p.mid) + EL(-7, 0, 4.5, 2.2, 35, p.light) },
    6: { n: 'Potted bloom', f: (p) => P('M-8,4 L8,4 L6,16 L-6,16 Z', p.mid, p.dark, 1.2) + L(0, 4, 0, -6, p.dark, 1.6) + `<g transform="translate(0,-12)">` + PET(5, 7, 3, RO.mid, RO.dark) + C(0, 0, 2.6, g.mid) + '</g>' },
    7: { n: 'Rose', f: (p) => L(0, 6, 0, 20, lf, 2) + EL(-5, 14, 5, 2.2, -30, lf) + `<g transform="translate(0,-4)">` + PET(5, 10, 5, RO.mid, RO.dark) + C(0, 0, 4, RO.dark) + '</g>' },
    8: { n: 'Tulip trio', f: () => P('M0,18 L0,-4 M-12,18 Q-12,8 -4,2 M12,18 Q12,8 4,2', 'none', lf, 1.8) + P('M-4,-4 L-4,-12 L-1.5,-8 L0,-13 L1.5,-8 L4,-12 L4,-4 Q0,-1 -4,-4 Z', g.mid, g.dark, 0.8) + P('M-16,2 L-16,-6 L-13.5,-2 L-12,-7 L-10.5,-2 L-8,-6 L-8,2 Q-12,5 -16,2 Z', RO.mid, RO.dark, 0.8) + P('M8,2 L8,-6 L10.5,-2 L12,-7 L13.5,-2 L16,-6 L16,2 Q12,5 8,2 Z', RO.mid, RO.dark, 0.8) },
    9: { n: 'Trellis vine', f: (p) => L(-12, -16, -12, 16, p.light, 1.4) + L(0, -16, 0, 16, p.light, 1.4) + L(12, -16, 12, 16, p.light, 1.4) + L(-16, -6, 16, -6, p.light, 1.4) + L(-16, 6, 16, 6, p.light, 1.4) + P('M-12,16 Q-4,6 0,-2 Q4,-10 12,-14', 'none', p.dark, 2) + EL(-7, 8, 4.5, 2.2, -40, p.mid) + EL(3, -4, 4.5, 2.2, 40, p.mid) + EL(9, -13, 4.5, 2.2, -20, p.mid) },
    10: { n: 'Berry bush', f: (p) => P('M-3,18 L-2,8 L2,8 L3,18 Z', p.dark) + C(0, -2, 14, p.mid, p.dark, 1.3) + C(-6, -6, 2.2, RO.mid) + C(5, -8, 2.2, RO.mid) + C(8, 0, 2.2, RO.mid) + C(-8, 2, 2.2, RO.mid) + C(0, 4, 2.2, RO.mid) + L(-16, 18, 16, 18, p.dark, 1.5) },
    11: { n: 'Young tree', f: (p) => P('M-2,18 L-1.5,2 L1.5,2 L2,18 Z', p.dark) + C(0, -7, 13, p.light, p.dark, 1.2) + C(-4, -10, 3.5, p.mid) + C(5, -4, 3, p.mid) + L(-12, 18, 12, 18, p.dark, 1.5) },
    12: { n: 'Topiary', f: (p) => P('M-8,8 L8,8 L6,18 L-6,18 Z', p.mid, p.dark, 1.2) + L(0, 8, 0, 2, p.dark, 2) + C(0, -9, 11, p.mid, p.dark, 1.2) + C(-4, -12, 2, p.light) + C(4, -6, 2, p.light) + C(2, -14, 2, p.light) },
    13: { n: 'Flower bed', f: (p) => L(-22, 14, 22, 14, p.dark, 2.5) + [-15, -5, 5, 15].map((x, i) => L(x, 14, x, 4, lf, 1.5) + `<g transform="translate(${x},0)">` + PET(5, 5, 2.2, i % 2 ? RO.mid : g.mid, i % 2 ? RO.dark : g.dark) + C(0, 0, 1.8, p.dark) + '</g>').join('') },
    14: { n: 'Butterfly garden', f: (p) => L(-12, 18, -12, 2, lf, 1.8) + `<g transform="translate(-12,-3)">` + PET(5, 6, 2.6, RO.mid, RO.dark) + C(0, 0, 2.2, g.mid) + '</g>' + EL(9, -8, 5, 7, -25, RO.mid, RO.dark, 0.8) + EL(19, -8, 5, 7, 25, RO.light, RO.dark, 0.8) + EL(14, -6, 1.5, 5.5, 0, p.dark) + P('M13,-11 Q11,-16 9,-17 M15,-11 Q17,-16 19,-17', 'none', p.dark, 1) },
    15: { n: 'The pollinator', f: (p) => `<g transform="translate(-10,6)">` + PET(6, 7, 3, RO.mid, RO.dark) + C(0, 0, 2.6, g.mid) + '</g>' + EL(10, -8, 6, 4.5, 20, g.mid, g.dark, 1) + L(7, -11, 9, -5, p.dark, 1.4) + L(11, -12, 13, -6, p.dark, 1.4) + EL(5, -14, 4, 2.4, -25, p.cream, p.dark, 0.7) + EL(13, -15, 4, 2.4, 5, p.cream, p.dark, 0.7) + C(-2, -2, 0.9, p.dark) + C(2, -5, 0.9, p.dark) },
    16: { n: 'Garden fountain', f: (p) => EL(0, 14, 16, 4, 0, p.light, p.dark, 1.2) + RECT(-3, 2, 6, 10, 0, p.mid, p.dark, 1) + EL(0, 2, 8, 2.5, 0, p.light, p.dark, 1) + L(0, -2, 0, -10, NI.light, 1.8) + P('M0,-10 Q-8,-4 -10,6', 'none', NI.light, 1.5) + P('M0,-10 Q8,-4 10,6', 'none', NI.light, 1.5) },
    17: { n: 'Vine arch', f: (p) => P('M-14,18 L-14,-2 A14 14 0 0 1 14,-2 L14,18', 'none', p.dark, 2.5) + EL(-14, 6, 4, 2, -30, p.mid) + EL(-11, -8, 4, 2, -60, p.mid) + EL(0, -17, 4, 2, 0, p.mid) + EL(11, -8, 4, 2, 60, p.mid) + EL(14, 6, 4, 2, 30, p.mid) + C(0, -12, 1.8, RO.mid) },
    18: { n: 'Date palm', f: (p) => P('M-2,18 Q0,4 2,-8', 'none', p.dark, 3) + P('M2,-8 Q-10,-16 -18,-10 M2,-8 Q14,-16 20,-10 M2,-8 Q-6,-20 -12,-19 M2,-8 Q10,-20 14,-18 M2,-8 Q0,-22 -2,-22', 'none', lf, 2) + C(-1, -4, 2, g.mid) + C(3, -3, 2, g.mid) + C(1, 0, 2, g.mid) + L(-10, 18, 10, 18, p.dark, 1.5) },
    19: { n: 'Cypress walk', f: (p) => P('M-14,16 L-10,-8 L-6,16 Z', p.mid) + P('M-4,16 L0,-16 L4,16 Z', p.dark) + P('M6,16 L10,-8 L14,16 Z', p.mid) + L(-18, 16, 18, 16, p.dark, 1.6) },
    20: { n: 'Garden gate', f: (p) => RECT(-22, -6, 13, 22, 0, p.light, p.dark, 1.2) + RECT(9, -6, 13, 22, 0, p.light, p.dark, 1.2) + P('M-9,16 L-9,-2 A9 9 0 0 1 9,-2 L9,16', 'none', p.dark, 2) + L(0, -11, 0, 16, p.dark, 1) + EL(-16, -9, 4, 2, -20, p.mid) + EL(16, -9, 4, 2, 20, p.mid) + SPK(0, -19, 3.5, g.mid) + L(-26, 16, 26, 16, p.dark, 2) },
  },
  dawn: {
    1: {
      n: 'Dawn reciter',
      f: (p) => {
        let o = L(-21, 11.2, 21, 11.2, p.dark, 2) + P('M-11.2,11.2 A11.2 11.2 0 0 1 11.2,11.2 Z', p.mid, p.dark, 1.4);
        [-65, -32, 0, 32, 65].forEach((a) => {
          o += `<g transform="translate(0,11.2)"><g transform="rotate(${a})">` + L(0, -15.4, 0, -22.4, p.dark, 2.5) + '</g></g>';
        });
        return o;
      },
    },
    2: { n: 'Morning bird', f: (p) => EL(0, 0, 8, 6, -15, p.mid, p.dark, 1) + C(7, -6, 4, p.mid, p.dark, 1) + P('M11,-6 L15,-5 L11,-3.5 Z', g.mid) + P('M-7,3 L-16,8 L-8,-1 Z', p.dark) + C(8, -7, 0.9, p.dark) + L(-2, 6, -2, 11, p.dark, 1.2) + L(2, 6, 2, 11, p.dark, 1.2) + C(-16, -14, 5, g.mid, g.dark, 1) },
    3: { n: 'Dew on the leaf', f: (p) => EL(0, 4, 16, 8, -20, lf, '#44572a', 1.2) + L(-12, 13, 12, -5, '#44572a', 1) + P('M8,-12 C12,-6 12,-2 8,0 C4,-2 4,-6 8,-12 Z', NI.light, NI.mid, 1) },
    4: { n: 'Morning star', f: (p) => L(-24, 10, 24, 10, p.dark, 2) + P('M-10,10 A10 5 0 0 1 10,10 Z', p.mid) + SPK(0, -8, 9, g.mid) + SPK(14, -16, 3.5, p.mid) },
    5: { n: 'Half-risen sun', f: (p) => L(-26, 8, 26, 8, p.dark, 2) + P('M-13,8 A13 13 0 0 1 13,8 Z', g.mid, g.dark, 1.2) + L(0, -12, 0, -20, p.dark, 2) + L(-13, -7, -19, -13, p.dark, 2) + L(13, -7, 19, -13, p.dark, 2) + L(-22, 2, -28, 0, p.dark, 2) + L(22, 2, 28, 0, p.dark, 2) },
    6: { n: 'Birdsong', f: (p) => L(-18, 8, 18, 5, p.dark, 2.2) + EL(-12, 6, 4, 2, -20, lf) + EL(-2, 1, 5, 4, -15, p.mid, p.dark, 1) + C(2.5, -3, 2.6, p.mid, p.dark, 1) + P('M5,-3 L8,-2.4 L5,-1.4 Z', g.mid) + C(14, -14, 1.6, p.dark) + L(15.6, -14, 15.6, -21, p.dark, 1.1) + C(20, -9, 1.6, p.dark) + L(21.6, -9, 21.6, -16, p.dark, 1.1) },
    7: { n: 'Prayer mat', f: (p) => RECT(-13, -18, 26, 36, 2, p.mid, p.dark, 1.4) + P('M-7,14 L-7,-4 A7 7 0 0 1 7,-4 L7,14', 'none', p.cream, 1.5) + C(0, -6, 2, g.mid) + L(-13, -21, -13, -18, p.dark, 1) + L(-7, -21, -7, -18, p.dark, 1) + L(0, -21, 0, -18, p.dark, 1) + L(7, -21, 7, -18, p.dark, 1) + L(13, -21, 13, -18, p.dark, 1) },
    8: { n: 'Misty hills', f: (p) => P('M-26,14 Q-10,-4 6,14 Z', p.mid) + P('M-2,14 Q14,0 26,14 Z', p.light) + L(-16, 4, -4, 4, p.cream, 2) + L(2, 0, 14, 0, p.cream, 2) + L(-8, 8, 8, 8, p.cream, 2) + C(16, -12, 5, g.mid, g.dark, 1) },
    9: { n: 'Toward the light', f: (p) => C(14, -12, 8, g.mid, g.dark, 1) + L(14, -24, 14, -27, p.dark, 1.5) + L(3, -18, 1, -20, p.dark, 1.5) + BIRD(-10, 2, 1.2, p.dark) + BIRD(-2, 10, 1, p.dark) },
    10: { n: 'Open window', f: (p) => RECT(-14, -16, 28, 32, 1, 'none', p.dark, 2) + L(0, -16, 0, 16, p.dark, 1.4) + L(-14, 0, 14, 0, p.dark, 1.4) + C(-6, 8, 5, g.mid) + L(6, -10, 12, -4, g.mid, 1.8) + L(8, -12, 12, -8, g.mid, 1.4) },
    11: { n: 'Minaret dawn', f: (p) => P('M-14,18 L-14,-8 L-11,-14 L-8,-8 L-8,18 Z', p.mid, p.dark, 1) + L(-17, -4, -5, -4, p.dark, 1.5) + C(-11, -17, 1.4, g.mid) + P('M2,18 A12 12 0 0 1 26,18 Z', g.mid, g.dark, 1) + L(14, -2, 14, -8, p.dark, 1.8) + L(5, 2, 1, -2, p.dark, 1.8) + L(23, 2, 27, -2, p.dark, 1.8) + L(-20, 18, 28, 18, p.dark, 1.5) },
    12: { n: 'Light through clouds', f: (p) => P('M-14,-8 Q-14,-16 -4,-14 Q0,-20 8,-16 Q16,-18 14,-8 Q18,-4 10,-4 L-10,-4 Q-18,-4 -14,-8 Z', p.cream, p.dark, 1.2) + P('M-8,-4 L-14,16 L-6,16 Z', g.light) + P('M2,-4 L0,16 L8,16 Z', g.light) + P('M10,-4 L16,16 L22,16 Z', g.light) },
    13: { n: 'Morning glory', f: (p) => P('M-10,-10 Q0,-16 10,-10 Q14,2 0,6 Q-14,2 -10,-10 Z', p.mid, p.dark, 1.2) + P('M0,6 L0,-13 M-8,-9 L4,3 M8,-9 L-4,3', 'none', p.cream, 1) + P('M0,6 Q-2,14 -8,18', 'none', lf, 2) + EL(-10, 14, 4, 2, -40, lf) },
    14: { n: 'The handoff', f: (p, gg, pl) => CRES(-14, 8, 7, 3, p.mid, pl || p.cream) + C(12, -4, 8, g.mid, g.dark, 1) + L(12, -16, 12, -19, p.dark, 1.5) + L(2, -9, 0, -11, p.dark, 1.5) + L(22, -9, 24, -11, p.dark, 1.5) + C(-6, -12, 1.2, p.dark) + C(0, -15, 1.2, p.dark) + C(6, -16, 1.2, p.dark) },
    15: { n: 'Lark ascending', f: (p) => P('M0,18 C-12,14 -10,4 0,4 C8,4 8,-4 2,-6 C-3,-8 -2,-14 4,-14', 'none', p.mid, 1.6) + BIRD(8, -18, 1.2, p.dark) + C(0, 18, 1.8, p.dark) },
    16: { n: 'Gate of dawn', f: (p) => P('M-13,18 L-13,-4 A13 13 0 0 1 13,-4 L13,18', 'none', p.dark, 2.5) + C(0, 4, 7, g.mid, g.dark, 1) + L(0, -6, 0, -10, p.dark, 1.6) + L(-8, 0, -11, -2, p.dark, 1.6) + L(8, 0, 11, -2, p.dark, 1.6) + L(-19, 18, 19, 18, p.dark, 2) },
    17: { n: 'Sunrise sail', f: (p) => C(-15, -8, 6, g.mid, g.dark, 1) + L(-15, -17, -15, -20, p.dark, 1.4) + P('M-8,8 L8,8 L5,12 L-5,12 Z', p.dark) + L(0, 8, 0, -8, p.dark, 1.5) + P('M1,-8 L10,6 L1,6 Z', p.cream, p.dark, 1) + P('M-24,16 q4,-3 8,0 q4,3 8,0 q4,-3 8,0 q4,3 8,0 q4,-3 8,0 q4,3 8,0', 'none', NI.mid, 1.6) },
    18: { n: 'Sea of dawn', f: (p) => C(0, -8, 9, g.mid, g.dark, 1.2) + L(-22, 4, 22, 4, p.dark, 1.5) + L(-3, 8, 3, 8, g.mid, 2.4) + L(-5, 12, 5, 12, g.mid, 2) + L(-7, 16, 7, 16, g.mid, 1.6) + P('M-20,9 q3,-2 6,0 M14,9 q3,-2 6,0', 'none', p.mid, 1.4) },
    19: { n: 'Dawn chorus', f: (p) => P('M-12,16 A12 12 0 0 1 12,16 Z', g.mid, g.dark, 1) + L(0, 0, 0, -5, p.dark, 1.8) + L(-10, 3, -14, 0, p.dark, 1.8) + L(10, 3, 14, 0, p.dark, 1.8) + L(-17, 10, -21, 9, p.dark, 1.8) + L(17, 10, 21, 9, p.dark, 1.8) + BIRD(-14, -10, 1, p.dark) + BIRD(0, -17, 1.2, p.dark) + BIRD(14, -10, 1, p.dark) + L(-18, 16, 18, 16, p.dark, 1.6) },
    20: { n: 'Dawn mandala', f: (p) => PET(8, 17, 4.5, p.light, p.dark) + C(0, 0, 8, g.mid, g.dark, 1) + RAYR(16, 26, 30, p.mid, 1.5) },
  },
  lantern: {
    1: {
      n: 'Night lantern',
      f: (p) =>
        DC(0, 0, 26, g.mid, 1.5, '1.5 7') +
        L(0, -28, 0, -21, g.mid, 1.2) +
        DC(0, -28, 1.8, g.mid, 1.2, '') +
        C(0, -18, 3, g.mid) +
        C(1.2, -18.6, 2.4, p.dark) +
        P('M-8,-11 Q0,-19 8,-11 Z', p.mid, g.mid, 1.2) +
        RECT(-6.5, -11, 13, 2.5, 0, g.mid) +
        P('M-8,-8.5 L8,-8.5 L11,12 L-11,12 Z', p.mid, p.light, 1) +
        P('M-6,-6 L6,-6 L8,10 L-8,10 Z', g.light, g.mid, 0.8) +
        P('M-6,-6 L8,8 M6,-6 L-8,8 M0,-6 L-7,1 M0,-6 L7,1', 'none', p.mid, 0.9) +
        P('M0,8 C3,4 2,1 0,-2 C-2,1 -3,4 0,8', g.mid, g.dark, 0.6) +
        RECT(-11.5, 12, 23, 3.5, 1, g.mid, g.dark, 0.6) +
        P('M-9.5,15.5 L-8,19 L-6.5,15.5 Z', g.mid) +
        P('M-1.5,15.5 L0,19 L1.5,15.5 Z', g.mid) +
        P('M6.5,15.5 L8,19 L9.5,15.5 Z', g.mid),
    },
    2: { n: 'Candlestick', f: (p) => EL(0, 16, 10, 3, 0, g.mid, g.dark, 1) + RECT(-1.5, 8, 3, 8, 0, g.mid) + RECT(-3.5, -8, 7, 16, 1, M, MC, 1) + L(0, -8, 0, -10, p.light, 1) + FLM(0, -10, 0.9, g.mid, g.dark) },
    3: { n: 'Clay oil lamp', f: (p) => P('M-14,6 Q-16,0 -10,-2 Q0,-6 8,-2 L16,2 Q18,4 14,6 Q0,12 -14,6 Z', p.mid, p.light, 1) + FLM(15, 0, 0.8, g.mid, g.dark) + C(-15, 2, 3.5, 'none', p.light, 1.5) + EL(0, 10, 8, 2, 0, p.light) },
    4: { n: 'Hurricane lamp', f: (p) => EL(0, 16, 8, 2.5, 0, g.mid) + P('M-6,14 Q-12,4 -6,-6 L6,-6 Q12,4 6,14 Z', 'none', p.light, 1.5) + RECT(-5, -10, 10, 4, 1, g.mid) + C(0, -13, 2.5, 'none', g.mid, 1.5) + FLM(0, 8, 0.9, g.mid, g.dark) },
    5: { n: 'Hanging lamp', f: (p) => L(0, -26, 0, -16, g.mid, 1.2) + C(0, -27, 1.5, 'none', g.mid, 1) + P('M0,-14 C10,-10 12,0 8,8 Q4,14 0,16 Q-4,14 -8,8 C-12,0 -10,-10 0,-14 Z', p.mid, g.mid, 1.2) + L(-9, 0, 9, 0, g.mid, 1.5) + C(0, 4, 3.5, M) },
    6: { n: 'Star lantern', f: (p) => L(0, -24, 0, -14, g.mid, 1.2) + SP(5, 16, 8, p.mid, g.mid, 0, 2, 1.5) + C(0, 2, 4, M) },
    7: { n: 'Candelabra', f: () => L(0, 14, 0, -4, g.mid, 2.5) + P('M0,0 Q-12,0 -12,-10 M0,0 Q12,0 12,-10', 'none', g.mid, 2.2) + EL(0, 16, 9, 2.5, 0, g.mid) + FLM(0, -6, 0.8, M, MC) + FLM(-12, -12, 0.8, M, MC) + FLM(12, -12, 0.8, M, MC) },
    8: { n: 'Twin lanterns', f: (p) => P('M-15,-8 Q-11,-12 -7,-8 Z', p.mid, g.mid, 1) + P('M-15,-7 L-7,-7 L-5.5,6 L-16.5,6 Z', p.mid, p.light, 1) + C(-11, 0, 2.5, M) + P('M9,-6 Q12,-9 15,-6 Z', p.mid, g.mid, 1) + P('M9,-5 L15,-5 L16.5,5 L7.5,5 Z', p.mid, p.light, 1) + C(12, 0, 2, M) + L(-11, -15, -11, -11, g.mid, 1.2) + L(12, -12, 12, -8, g.mid, 1.2) },
    9: { n: 'Torchlight', f: (p) => P('M-2,18 L-4,-2 L4,-2 L2,18 Z', p.light) + L(-4, 2, 4, 2, p.dark, 1.5) + P('M-7,-2 L7,-2 L5,-8 L-5,-8 Z', g.mid) + FLM(0, -8, 1.6, g.mid, g.dark) + FLM(0, -10, 0.8, M) },
    10: { n: 'Lighthouse', f: (p) => P('M-6,18 L-4,-6 L4,-6 L6,18 Z', p.light, p.mid, 1) + L(-5, 8, 5, 8, p.mid, 2.4) + L(-4.5, 0, 4.5, 0, p.mid, 2.4) + RECT(-4, -12, 8, 6, 0, g.mid) + P('M-5,-12 L0,-17 L5,-12 Z', p.light) + L(6, -9, 16, -13, g.mid, 2) + L(-6, -9, -16, -13, g.mid, 2) + L(-9, 18, 9, 18, p.light, 2) },
    11: { n: 'Filigree lamp', f: (p) => L(0, -24, 0, -16, g.mid, 1.2) + P('M-8,-14 Q0,-20 8,-14 Z', p.mid, g.mid, 1) + P('M-9,-13 Q-11,8 0,12 Q11,8 9,-13 Z', p.mid, g.mid, 1.2) + C(-4, -6, 1.3, M) + C(4, -6, 1.3, M) + C(0, 0, 1.3, M) + C(-4, 5, 1.3, M) + C(4, 5, 1.3, M) + P('M0,12 L0,17', 'none', g.mid, 1.4) + C(0, 18.5, 1.5, g.mid) },
    12: { n: 'Firefly jar', f: (p) => RECT(-9, -8, 18, 22, 4, 'none', p.light, 1.5) + RECT(-10, -12, 20, 4, 1.5, g.mid) + C(-4, -2, 1.6, M) + C(4, 2, 1.6, M) + C(-2, 7, 1.6, M) + C(5, -4, 1.2, M) + C(0, 11, 1.2, M) + C(-4, -2, 3.4, 'none', M, 0.5) },
    13: { n: 'Brazier', f: (p) => P('M-13,-2 Q-13,8 0,8 Q13,8 13,-2 Z', p.mid, p.light, 1) + L(-8, 8, -12, 16, p.light, 1.8) + L(8, 8, 12, 16, p.light, 1.8) + L(0, 8, 0, 16, p.light, 1.8) + FLM(-5, -2, 0.8, g.mid, g.dark) + FLM(3, -3, 1, g.mid, g.dark) + FLM(8, -2, 0.6, M) + P('M0,-14 q4,-4 0,-8', 'none', p.light, 1.3) },
    14: { n: 'Street lamp', f: (p) => L(0, 18, 0, -10, p.light, 2) + L(-6, 18, 6, 18, p.light, 2.5) + P('M-6,-10 L6,-10 L4,-18 L-4,-18 Z', 'none', p.light, 1.5) + C(0, -14, 3, M) + C(0, -20, 1.5, g.mid) },
    15: { n: 'Harbor lantern', f: () => RECT(-8, -10, 16, 20, 2, 'none', g.mid, 1.8) + P('M-5,-10 A6 6 0 0 1 5,-10', 'none', g.mid, 1.6) + L(0, -10, 0, 10, g.mid, 1) + L(-8, 0, 8, 0, g.mid, 1) + FLM(0, 5, 0.8, M, MC) + L(-8, 13, 8, 13, g.mid, 1.8) },
    16: { n: 'Chandelier', f: () => L(0, -22, 0, -14, g.mid, 1.5) + C(0, -12, 2.5, g.mid) + P('M0,-12 Q-14,-10 -14,-2 M0,-12 Q14,-10 14,-2 M0,-12 Q-6,-8 -6,0 M0,-12 Q6,-8 6,0', 'none', g.mid, 1.6) + FLM(-14, -2, 0.7, M, MC) + FLM(-6, 0, 0.7, M, MC) + FLM(6, 0, 0.7, M, MC) + FLM(14, -2, 0.7, M, MC) + P('M0,-12 L0,-4', 'none', g.mid, 1.2) + C(0, -2, 1.8, M) },
    17: { n: 'Row of flames', f: () => [[-20, 14], [-10, 9], [0, 6], [10, 9], [20, 14]].map((t) => RECT(t[0] - 3, t[1], 6, 4, 1, g.mid) + FLM(t[0], t[1], 0.7, M, MC)).join('') },
    18: { n: 'Festival lights', f: () => P('M-26,-12 Q0,4 26,-12', 'none', g.mid, 1.3) + [[-18, -7.5], [-6, -3.5], [6, -3.5], [18, -7.5]].map((b, i) => L(b[0], b[1], b[0], b[1] + 5, g.mid, 1) + P(`M${b[0]},${b[1] + 5} C${b[0] + 4},${b[1] + 9} ${b[0] + 3},${b[1] + 13} ${b[0]},${b[1] + 14} C${b[0] - 3},${b[1] + 13} ${b[0] - 4},${b[1] + 9} ${b[0]},${b[1] + 5} Z`, i % 2 ? M : g.mid, g.dark, 0.6)).join('') },
    19: { n: 'The beacon', f: (p) => P('M-5,18 L-3,-4 L3,-4 L5,18 Z', p.light) + L(-7, 18, 7, 18, p.light, 2) + P('M-6,-4 L6,-4 L4,-9 L-4,-9 Z', g.mid) + FLM(0, -9, 1.2, g.mid, g.dark) + `<g transform="translate(0,-12)">` + RAYR(8, 9, 17, g.mid, 1.8) + '</g>' },
    20: { n: 'Grand lamp', f: (p) => L(0, -30, 0, -22, g.mid, 1.2) + C(0, -31, 1.5, 'none', g.mid, 1) + P('M-10,-14 Q0,-22 10,-14 Z', p.mid, g.mid, 1.2) + P('M-7,-12 C-16,-6 -16,6 -9,12 Q0,18 9,12 C16,6 16,-6 7,-12 Z', p.mid, g.mid, 1.4) + P('M-12,-4 Q0,0 12,-4', 'none', g.mid, 1.2) + P('M-11,6 Q0,10 11,6', 'none', g.mid, 1.2) + C(-5, 1, 1.6, M) + C(0, 3, 1.6, M) + C(5, 1, 1.6, M) + P('M0,16 L0,20', 'none', g.mid, 1.4) + C(0, 22, 1.8, g.mid) },
  },
  burst: {
    1: { n: 'Thousand lights', f: () => SP(4, 22, 7, g.mid, g.dark, 0, 0, 1.2) + SP(4, 16, 6, g.light, null, 0, 0) + C(0, 0, 4, g.dark) },
    2: { n: 'Twin sparks', f: () => SPK(-8, 4, 9, g.mid) + SPK(10, -8, 6, g.light) },
    3: { n: 'Triple cluster', f: () => SP(5, 10, 4, g.mid, g.dark, 0, -8, 1) + SP(5, 8, 3.2, g.mid, null, -12, 8) + SP(5, 6, 2.4, g.light, null, 11, 9) },
    4: { n: 'Little burst', f: () => RAYR(8, 7, 16, g.mid, 2.2) + C(0, 0, 4, g.dark) },
    5: { n: 'Constellation', f: () => P('M-18,8 L-8,-4 L2,6 L12,-6 L20,4', 'none', g.mid, 1.2) + C(-18, 8, 2.4, g.dark) + C(-8, -4, 2.4, g.dark) + C(12, -6, 2.4, g.dark) + C(20, 4, 2.4, g.dark) + SP(5, 5, 2, g.mid, null, 2, 6) },
    6: { n: 'Comet', f: () => P('M-6,5 Q8,-2 22,-14', 'none', g.mid, 2.5) + P('M-7,10 Q6,6 18,-2', 'none', g.light, 2) + C(-10, 8, 5, g.mid, g.dark, 1) + SPK(20, -18, 3, g.light) },
    7: { n: 'Ring of eight', f: () => { let o = ''; for (let i = 0; i < 8; i += 1) { const a = (i * 45 * Math.PI) / 180; o += SP(5, 3.4, 1.4, g.mid, null, +(18 * Math.cos(a)).toFixed(1), +(18 * Math.sin(a)).toFixed(1)); } return o + C(0, 0, 3, g.dark); } },
    8: { n: 'Spiral galaxy', f: () => C(0, 0, 4.5, g.mid) + P('M4,-2 C14,-8 20,2 12,10', 'none', g.mid, 2) + P('M-4,2 C-14,8 -20,-2 -12,-10', 'none', g.mid, 2) + C(16, 8, 1.4, g.dark) + C(-16, -8, 1.4, g.dark) + C(8, -12, 1.4, g.light) + C(-8, 12, 1.4, g.light) },
    9: { n: 'Firework', f: () => RAYR(10, 8, 19, g.mid, 1.8) + RING(10, 21, 1.6, g.dark, null, 0, 0, -72) + C(0, 0, 3, g.dark) },
    10: { n: 'Double burst', f: () => `<g transform="translate(-8,-6)">` + RAYR(8, 5, 12, g.mid, 2) + '</g>' + `<g transform="translate(10,8)">` + RAYR(8, 4, 9, g.light, 1.6) + '</g>' + C(-8, -6, 2.5, g.dark) + C(10, 8, 2, g.dark) },
    11: { n: 'Star shower', f: () => L(-20, -12, -10, -2, g.light, 1.6) + L(-8, -18, 2, -8, g.mid, 1.6) + L(6, -20, 16, -10, g.light, 1.6) + SPK(-7, 1, 4.5, g.mid) + SPK(5, -5, 4, g.mid) + SPK(19, -7, 4.5, g.mid) },
    12: { n: 'Nebula', f: () => P('M-16,0 Q-18,-12 -4,-12 Q2,-18 10,-12 Q20,-10 16,0 Q20,10 6,10 Q-4,16 -10,8 Q-18,10 -16,0 Z', g.light, g.mid, 1.2) + C(-8, -4, 1.5, g.dark) + C(2, -6, 1.5, g.dark) + C(8, 2, 1.5, g.dark) + C(-3, 4, 1.5, g.dark) + SPK(14, -14, 3, g.mid) },
    13: { n: 'Orbit rings', f: () => EL(0, 0, 24, 9, 25, 'none', g.mid, 1.4) + EL(0, 0, 24, 9, -25, 'none', g.mid, 1.4) + SP(5, 7, 3, g.mid, g.dark, 0, 0, 1) + C(18, 8, 1.8, g.dark) + C(-18, 8, 1.8, g.dark) },
    14: { n: 'Lantern sky', f: () => [[-18, -10], [-8, -18], [4, -14], [14, -18], [20, -6], [-22, 2], [12, 4], [-12, 8], [2, 12], [18, 14]].map((d) => C(d[0], d[1], 1.5, g.mid)).join('') + SPK(-2, -2, 9, g.mid) },
    15: { n: 'Radiant cross', f: () => L(0, -28, 0, -10, g.mid, 2.2) + L(0, 10, 0, 28, g.mid, 2.2) + L(-28, 0, -10, 0, g.mid, 2.2) + L(10, 0, 28, 0, g.mid, 2.2) + RAYR(4, 9, 17, g.light, 1.6, 45) + C(0, 0, 6, g.mid, g.dark, 1.2) },
    16: { n: 'Twin galaxies', f: () => C(-10, 6, 3, g.mid) + P('M-7,4 C-2,0 -2,10 -8,11', 'none', g.mid, 1.6) + P('M-13,8 C-18,12 -18,2 -12,1', 'none', g.mid, 1.6) + C(12, -8, 2.4, g.dark) + P('M14,-10 C19,-14 19,-4 13,-3', 'none', g.dark, 1.4) + P('M10,-6 C5,-2 5,-12 11,-13', 'none', g.dark, 1.4) + C(-20, -14, 1.2, g.light) + C(20, 12, 1.2, g.light) },
    17: { n: 'Nested stars', f: () => SP(5, 26, 11, 'none', g.mid, 0, 0, 1.6) + SP(5, 16, 7, 'none', g.dark, 0, 0, 1.3) + SP(5, 8, 3.4, g.mid) },
    18: { n: 'Dome of stars', f: () => P('M-22,14 A22 22 0 0 1 22,14', 'none', g.dark, 2) + L(-26, 14, 26, 14, g.dark, 1.5) + SP(5, 4, 1.6, g.mid, null, 0, -8) + SP(5, 3, 1.2, g.mid, null, -12, 2) + SP(5, 3, 1.2, g.mid, null, 12, 2) + C(-6, 8, 1.2, g.dark) + C(6, 8, 1.2, g.dark) },
    19: { n: 'Supernova', f: () => C(0, 0, 5, g.dark) + C(0, 0, 11, 'none', g.mid, 2) + C(0, 0, 18, 'none', g.light, 1.6) + RAYR(8, 20, 27, g.mid, 1.6) + SPK(22, -18, 3, g.light) + SPK(-22, 16, 3, g.light) },
    20: { n: 'The cosmos', f: () => C(0, 0, 3.5, g.dark) + P('M3,-1 C13,-7 19,3 11,11', 'none', g.mid, 2) + P('M-3,1 C-13,7 -19,-3 -11,-11', 'none', g.mid, 2) + SPK(-18, -12, 5, g.mid) + SPK(16, 14, 4, g.mid) + L(10, -20, 22, -12, g.light, 1.5) + C(-8, 14, 1.3, g.dark) + C(20, -2, 1.3, g.dark) + C(-20, 4, 1.3, g.dark) + C(6, -14, 1.3, g.dark) },
  },
  compass: {
    1: { n: 'Explorer', f: (p) => DC(0, 0, 24, p.dark, 2, '2 17.6') + P('M-19,0 L0,-5.6 L19,0 L0,5.6 Z', p.light, p.dark, 1) + P('M0,-22 L5.6,0 L0,22 L-5.6,0 Z', p.mid, p.dark, 1.4) + C(0, 0, 3, p.dark) },
    2: { n: 'First steps', f: (p) => EL(-8, 6, 4, 7, -12, p.mid, p.dark, 1) + C(-11, -3, 1.3, p.dark) + C(-8, -4, 1.3, p.dark) + C(-5, -3, 1.3, p.dark) + EL(8, -6, 4, 7, -12, p.mid, p.dark, 1) + C(11, -15, 1.3, p.dark) + C(8, -16, 1.3, p.dark) + C(5, -15, 1.3, p.dark) },
    3: { n: 'Walking staff', f: (p) => L(-6, 20, 4, -20, p.dark, 2.2) + C(10, -14, 6, p.mid, p.dark, 1.2) + L(4, -20, 7, -17, p.dark, 1.5) },
    4: { n: 'Field flask', f: (p) => C(0, 2, 12, p.mid, p.dark, 1.4) + C(0, 2, 7, 'none', p.light, 1.2) + RECT(-2.5, -14, 5, 5, 0, p.dark) + RECT(-3.5, -17, 7, 3, 1, g.mid) + P('M-11,-3 Q-16,-14 -4,-13', 'none', p.dark, 1.5) },
    5: { n: 'The map', f: (p) => RECT(-16, -10, 32, 20, 2, p.light, p.dark, 1.3) + EL(-16, 0, 2.5, 10, 0, p.mid, p.dark, 1) + EL(16, 0, 2.5, 10, 0, p.mid, p.dark, 1) + C(-9, 4, 1, p.dark) + C(-4, 1, 1, p.dark) + C(1, 3, 1, p.dark) + C(6, -1, 1, p.dark) + L(9, -6, 13, -2, RO.dark, 1.5) + L(13, -6, 9, -2, RO.dark, 1.5) },
    6: { n: 'Oasis', f: (p) => EL(0, 13, 13, 4, 0, NI.light, NI.mid, 1) + P('M-2,12 Q-1,2 2,-6', 'none', p.dark, 2.2) + P('M2,-6 Q-8,-12 -14,-7 M2,-6 Q12,-12 18,-7 M2,-6 Q-2,-16 -8,-16 M2,-6 Q8,-16 12,-15', 'none', p.mid, 2) },
    7: { n: 'Caravan camel', f: (p) => P('M-16,8 Q-15,0 -9,-2 Q-6,-7 -1,-3 Q2,-7 7,-3 Q13,-2 13,6 Z', p.mid, p.dark, 1) + P('M13,4 Q17,2 17,-6 L19,-7 L19,-3 Q18,4 14,7 Z', p.mid, p.dark, 1) + L(-13, 8, -13, 15, p.dark, 1.6) + L(-7, 8, -7, 15, p.dark, 1.6) + L(5, 8, 5, 15, p.dark, 1.6) + L(11, 8, 11, 15, p.dark, 1.6) + L(-20, 15, 20, 15, p.dark, 1.3) },
    8: { n: 'Sea of dunes', f: (p) => C(16, -10, 5, g.mid, g.dark, 1) + P('M-28,16 Q-12,-2 4,16 Z', p.mid) + P('M-4,16 Q12,2 28,16 Z', p.light) + L(-28, 16, 28, 16, p.dark, 1.5) },
    9: { n: 'Sailboat', f: (p) => P('M-10,10 L10,10 L6,15 L-6,15 Z', p.dark) + L(0, 10, 0, -14, p.dark, 1.5) + P('M1,-14 L12,8 L1,8 Z', p.light, p.dark, 1) + P('M-1,-10 L-9,8 L-1,8 Z', p.mid, p.dark, 1) + P('M-22,18 q4,-3 8,0 q4,3 8,0 q4,-3 8,0 q4,3 8,0 q4,-3 8,0', 'none', p.mid, 1.6) },
    10: { n: 'Anchor', f: (p) => C(0, -15, 3, 'none', p.dark, 2) + L(0, -12, 0, 10, p.dark, 2.2) + L(-7, -7, 7, -7, p.dark, 2) + P('M0,10 Q-10,10 -12,1 L-15,4 M0,10 Q10,10 12,1 L15,4', 'none', p.dark, 2.2) },
    11: { n: 'Summit flag', f: (p) => P('M-24,16 L-9,-6 L0,6 L10,16 Z', p.light, p.dark, 1) + P('M-2,16 L10,-12 L24,16 Z', p.mid, p.dark, 1) + L(10, -12, 10, -20, p.dark, 1.5) + P('M10,-20 L18,-17.5 L10,-15 Z', RO.mid) },
    12: { n: 'Telescope', f: (p) => P('M-14,8 L8,-10 L12,-5 L-10,12 Z', p.mid, p.dark, 1.2) + P('M-14,8 L-17,11 L-15,13 L-12,10 Z', p.dark) + L(-4, 10, -10, 20, p.dark, 1.6) + L(-4, 10, 4, 20, p.dark, 1.6) + SPK(16, -16, 4, g.mid) },
    13: { n: 'Astrolabe', f: (p) => C(0, -20, 2.5, 'none', p.dark, 1.6) + C(0, 2, 16, 'none', p.dark, 2) + C(0, 2, 11, 'none', p.mid, 1.2) + L(-13, 12, 13, -8, p.dark, 1.8) + C(0, 2, 2.2, p.dark) + L(-8, 15, -7, 13, p.dark, 1) + L(0, 18, 0, 16, p.dark, 1) + L(8, 15, 7, 13, p.dark, 1) },
    14: { n: 'Nomad tent', f: (p) => P('M-20,14 L0,-12 L20,14 Z', p.mid, p.dark, 1.3) + P('M-5,14 L0,3 L5,14 Z', p.cream) + L(0, -12, 0, -17, p.dark, 1.5) + P('M0,-17 L6,-15.5 L0,-14 Z', RO.mid) + L(-24, 14, 24, 14, p.dark, 1.3) },
    15: { n: 'The bridge', f: (p) => L(-26, 0, 26, 0, p.dark, 2) + P('M-18,0 A18 14 0 0 0 18,0', 'none', p.dark, 2) + L(-22, 0, -22, -5, p.dark, 1.5) + L(0, 0, 0, -5, p.dark, 1.5) + L(22, 0, 22, -5, p.dark, 1.5) + L(-26, -5, 26, -5, p.dark, 1.3) + P('M-22,16 q4,-3 8,0 q4,3 8,0 q4,-3 8,0 q4,3 8,0 q4,-3 8,0', 'none', p.mid, 1.6) },
    16: { n: 'The globe', f: (p) => C(0, 0, 16, 'none', p.dark, 1.8) + EL(0, 0, 8, 16, 0, 'none', p.mid, 1.2) + L(-16, 0, 16, 0, p.mid, 1.2) + P('M-14,-8 Q0,-4 14,-8 M-14,8 Q0,4 14,8', 'none', p.mid, 1) + P('M10,17 A16 16 0 0 0 16,12', 'none', p.dark, 1.5) + L(0, 16, 0, 20, p.dark, 1.5) + L(-5, 20, 5, 20, p.dark, 1.8) },
    17: { n: 'Sky voyage', f: (p) => C(0, -8, 12, p.mid, p.dark, 1.3) + EL(0, -8, 5, 12, 0, 'none', p.light, 1) + L(-7, 2, -4, 10, p.dark, 1.2) + L(7, 2, 4, 10, p.dark, 1.2) + RECT(-5, 10, 10, 6, 1, g.mid, g.dark, 0.8) },
    18: { n: 'Migration', f: (p) => BIRD(0, -10, 1.3, p.dark) + BIRD(-8, -4, 1.1, p.dark) + BIRD(8, -4, 1.1, p.dark) + BIRD(-16, 2, 1, p.dark) + BIRD(16, 2, 1, p.dark) + C(18, -16, 3.5, g.mid, g.dark, 0.8) },
    19: { n: 'Charted seas', f: (p) => C(0, 0, 18, 'none', p.mid, 1.3) + RING(6, 18, 1.6, p.dark) + SP(4, 8, 3, p.mid, p.dark, 0, 0, 1) + `<g transform="rotate(45)">` + SP(4, 5.5, 2, p.light) + '</g>' + C(0, 0, 1.6, p.dark) },
    20: { n: 'Seven journeys', f: (p) => C(0, 0, 14, 'none', p.dark, 1.6) + EL(0, 0, 7, 14, 0, 'none', p.mid, 1.1) + L(-14, 0, 14, 0, p.mid, 1.1) + EL(0, 0, 24, 8, -20, 'none', g.mid, 1.4) + SPK(20, -12, 4, g.mid) + C(-22, 8, 1.6, g.dark) + C(23, -2, 1.6, g.dark) },
  },
};

const GREY: Record<string, string> = {
  '#2d4a22': '#45423e', '#6b4f15': '#45423e', '#1f2747': '#45423e', '#6e3028': '#45423e', '#173f39': '#45423e', '#44572a': '#45423e',
  '#6f8f4e': '#8f8a82', '#c9a227': '#8f8a82', '#44538c': '#8f8a82', '#bf7b6e': '#8f8a82', '#3f7d72': '#8f8a82',
  '#c0d29a': '#cfc9bd', '#ecd9a0': '#cfc9bd', '#aab6e0': '#cfc9bd', '#ecc6ba': '#cfc9bd', '#a5cfc5': '#cfc9bd',
  '#f3f6e6': '#f5f1e8', '#fdf6e0': '#f5f1e8', '#eef1fa': '#f5f1e8', '#fbeee8': '#f5f1e8', '#e9f4f1': '#f5f1e8', '#f1e9c8': '#f5f1e8', '#e2d8aa': '#f5f1e8',
  '#d6cc9b': '#b4b2a9',
};

function colorizeLocked(svg: string): string {
  return svg.replace(/#[0-9a-f]{6}/gi, (hex) => GREY[hex.toLowerCase()] ?? '#8f8a82');
}

export function badgeEmblemName(badge: BadgeDef): string {
  return EM[badge.family][badge.tier].n;
}

function buildInner(badge: BadgeDef): string {
  const p = pal[badge.palette];
  const cy = PCY[badge.family];
  const dark = DARK_PLATE[badge.family];
  const plateFill = dark ? p.dark : p.cream;
  const plateStroke = dark ? p.light : p.dark;
  const accent = badge.palette === 'gold' ? p.dark : g.mid;
  const emblem = EM[badge.family][badge.tier].f(p, g, plateFill);
  return (
    `<g transform="translate(100,100)">` +
    FR[badge.family](p) +
    C(0, cy, 40, plateFill, plateStroke, 2) +
    DC(0, cy, 33, accent, 1, '2.5 3.5') +
    `<g transform="translate(0,${cy})">${emblem}</g>` +
    `</g>`
  );
}

const cache = new Map<string, string>();

export function badgeSvgXml(badge: BadgeDef, earned: boolean): string {
  const key = `${badge.family}-${badge.tier}-${earned ? 1 : 0}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const inner = buildInner(badge);
  const body = earned ? inner : `<g opacity="0.5">${colorizeLocked(inner)}</g>`;
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${body}</svg>`;
  cache.set(key, xml);
  return xml;
}

type RidgeLayer = {
  path: string;
  capPath?: string;
  fill: string;
  opacity: number;
  capOpacity?: number;
};

type ValleyLayer = {
  path: string;
  fill: string;
  opacity: number;
};

function ridgeY(
  x: number,
  worldWidth: number,
  baseY: number,
  amplitude: number,
  seed: number,
): number {
  const n = x / worldWidth;
  return (
    baseY +
    Math.sin(n * Math.PI * 5.2 + seed) * amplitude +
    Math.cos(n * Math.PI * 8.1 + seed * 1.7) * amplitude * 0.45 +
    Math.sin(n * Math.PI * 13 + seed * 0.4) * amplitude * 0.2
  );
}

function buildRidgePath(
  worldWidth: number,
  worldHeight: number,
  baseY: number,
  amplitude: number,
  seed: number,
): string {
  const step = Math.max(28, worldWidth / 14);
  let d = `M0 ${worldHeight}`;
  for (let x = 0; x <= worldWidth; x += step) {
    d += ` L${x} ${ridgeY(x, worldWidth, baseY, amplitude, seed).toFixed(1)}`;
  }
  d += ` L${worldWidth} ${worldHeight} Z`;
  return d;
}

function buildRidgeCap(worldWidth: number, baseY: number, amplitude: number, seed: number): string {
  const step = Math.max(32, worldWidth / 12);
  let d = `M0 ${ridgeY(0, worldWidth, baseY, amplitude, seed).toFixed(1)}`;
  for (let x = step; x <= worldWidth; x += step) {
    d += ` L${x} ${ridgeY(x, worldWidth, baseY, amplitude, seed).toFixed(1)}`;
  }
  return d;
}

/** Procedural ridges; valleys/lakes only emerge as more trees are planted. */
export function buildGardenLandscape(
  worldWidth: number,
  worldHeight: number,
  rangeLayers: number,
  fill: number,
): { ridges: RidgeLayer[]; valleys: ValleyLayer[]; lakes: { path: string; opacity: number }[] } {
  const greenery = Math.max(0, Math.min(1, fill));
  const ridges: RidgeLayer[] = [];
  const valleys: ValleyLayer[] = [];
  const lakes: { path: string; opacity: number }[] = [];

  const layerCount = Math.max(2, rangeLayers);
  const backPalette =
    greenery < 0.4
      ? ['#a89472', '#9a8468', '#8f7a5e', '#847052', '#7a6850', '#706048']
      : ['#8fa3b5', '#7a92a4', '#6d8496', '#5f7588', '#536878', '#4a5d6c'];
  const foreBarren = ['#c9a066', '#b89458', '#a88452'];

  for (let i = 0; i < layerCount; i += 1) {
    const depth = i / Math.max(1, layerCount - 1);
    const baseY = worldHeight * (0.38 + depth * 0.22);
    const amplitude = 8 + (1 - depth) * 22 + worldWidth * 0.008;
    const seed = i * 2.17 + worldWidth * 0.01;

    if (i < layerCount - 2) {
      ridges.push({
        path: buildRidgePath(worldWidth, worldHeight, baseY, amplitude, seed),
        fill: backPalette[i % backPalette.length],
        opacity: 0.55 + depth * 0.2,
      });
    } else if (i === layerCount - 2) {
      ridges.push({
        path: buildRidgePath(worldWidth, worldHeight, baseY, amplitude * 0.85, seed),
        fill: 'url(#gRidgeShadow)',
        opacity: 0.88,
        capPath: buildRidgeCap(worldWidth, baseY, amplitude * 0.85, seed),
        capOpacity: 0.82,
      });
    } else {
      ridges.push({
        path: buildRidgePath(worldWidth, worldHeight, baseY + 18, amplitude * 0.55, seed + 1),
        fill: foreBarren[i % foreBarren.length],
        opacity: 0.92,
      });
      ridges.push({
        path: buildRidgePath(worldWidth, worldHeight, baseY + 32, amplitude * 0.35, seed + 2.5),
        fill: '#8a7048',
        opacity: 0.5,
      });
    }

    if (greenery > 0.2 && i > 0 && i < layerCount - 1) {
      const valleyBase = baseY - 12;
      valleys.push({
        path: buildRidgePath(worldWidth, worldHeight, valleyBase, amplitude * 0.35, seed + 4.2),
        fill: i % 2 === 0 ? '#4a6d86' : '#3d5f74',
        opacity: (0.22 + depth * 0.12) * greenery,
      });
    }
  }

  if (greenery > 0.35) {
    const lakeCount = Math.max(1, Math.floor(worldWidth / 420));
    for (let l = 0; l < lakeCount; l += 1) {
      const x0 = (worldWidth / (lakeCount + 1)) * (l + 1) - 48;
      lakes.push({
        path: `M${x0} ${worldHeight * 0.48} C${x0 + 22} ${worldHeight * 0.42} ${x0 + 58} ${worldHeight * 0.52} ${x0 + 52} ${worldHeight * 0.62} C${x0 + 46} ${worldHeight * 0.72} ${x0 + 12} ${worldHeight * 0.76} ${x0 - 8} ${worldHeight * 0.68} C${x0 - 20} ${worldHeight * 0.62} ${x0 - 14} ${worldHeight * 0.54} ${x0} ${worldHeight * 0.48} Z`,
        opacity: (0.75 - l * 0.08) * greenery,
      });
    }
  }

  return { ridges, valleys, lakes };
}

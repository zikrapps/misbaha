export type GestureEvent = { x: number; y: number; translationX?: number; velocityX?: number };

type GestureCallbacks = {
  onEnd?: (event: GestureEvent) => void;
  onStart?: (event: GestureEvent) => void;
};

const callbacksByKey = new Map<string, GestureCallbacks>();

let tapCounter = 0;

export function resetGestureCallbacks() {
  callbacksByKey.clear();
  tapCounter = 0;
}

export function registerGestureCallbacks(key: string, callbacks: GestureCallbacks) {
  callbacksByKey.set(key, callbacks);
}

export function getGestureCallback(key: string, phase: 'onEnd' | 'onStart') {
  return callbacksByKey.get(key)?.[phase];
}

export function findGestureCallback(prefix: string, phase: 'onEnd' | 'onStart') {
  for (const [key, callbacks] of callbacksByKey) {
    if (key.startsWith(`${prefix}-`) && callbacks[phase]) {
      return callbacks[phase];
    }
  }
  return undefined;
}

export function nextGestureKey(prefix: string) {
  tapCounter += 1;
  return `${prefix}-${tapCounter}`;
}

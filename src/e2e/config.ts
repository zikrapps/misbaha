/** True when the app is built or run with EXPO_PUBLIC_E2E=1. */
export function isE2eEnabled(): boolean {
  return process.env.EXPO_PUBLIC_E2E === '1';
}

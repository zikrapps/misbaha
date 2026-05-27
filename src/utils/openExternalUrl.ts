import { Alert, Linking } from 'react-native';

/** Opens a URL when a handler exists; never throws to callers. */
export async function openExternalUrl(url: string, failureMessage?: string): Promise<boolean> {
  const trimmed = url?.trim();
  if (!trimmed) return false;

  try {
    const canOpen = await Linking.canOpenURL(trimmed);
    if (!canOpen) {
      if (failureMessage) Alert.alert(failureMessage);
      return false;
    }
    await Linking.openURL(trimmed);
    return true;
  } catch {
    if (failureMessage) Alert.alert(failureMessage);
    return false;
  }
}

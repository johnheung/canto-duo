import { Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/** Yes/no confirm that also works on web, where Alert buttons are unsupported. */
export function confirm(title: string, message: string, okLabel = 'OK'): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: okLabel, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

export function feedbackHaptic(correct: boolean): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(
    correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
  ).catch(() => {});
}

export function tapHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}

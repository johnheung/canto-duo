import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressState } from '@/lib/types';
import { initialState } from '@/lib/progress';

const STATE_KEY = 'cantoduo.state.v1';

export async function loadState(): Promise<ProgressState> {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  const base = initialState();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    // Merge so fields added in later versions get defaults.
    return { ...base, ...parsed, settings: { ...base.settings, ...parsed.settings } };
  } catch {
    return base;
  }
}

export async function saveState(state: ProgressState): Promise<void> {
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export async function clearState(): Promise<void> {
  await AsyncStorage.removeItem(STATE_KEY);
}

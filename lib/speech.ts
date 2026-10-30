import * as Speech from 'expo-speech';

const CANTONESE = ['zh-hk', 'yue-hk', 'yue', 'zh-yue'];

let voice: { language: string; identifier?: string } | null | undefined;

/** Finds a Cantonese voice on the device. Returns null when there is none. */
export async function detectCantoneseVoice(): Promise<string | null> {
  if (voice) return voice.language;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const match = voices.find((v) => CANTONESE.some((c) => v.language.toLowerCase().replace('_', '-').startsWith(c)));
    voice = match ? { language: match.language, identifier: match.identifier } : null;
  } catch {
    voice = null;
  }
  return voice?.language ?? null;
}

export function speak(text: string, slow = false): void {
  Speech.stop();
  Speech.speak(text, {
    language: voice?.language ?? 'zh-HK',
    voice: voice?.identifier,
    rate: slow ? 0.5 : 0.85,
  });
}

import { useCallback, useEffect, useState } from 'react';
import * as Speech from 'expo-speech';

const CANTONESE = ['zh-hk', 'yue-hk', 'yue', 'zh-yue'];

/** Where Android keeps its voices. Without a Cantonese one it reads characters in another voice. */
export const ANDROID_VOICE_STEPS =
  'Settings → System → Languages → Text-to-speech output → Speech Services by Google → ⚙ → Install voice data → Cantonese (Hong Kong).';

let voice: { language: string; identifier?: string } | null | undefined;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * The device's voices. Android's speech engine can report none while it is still
 * starting up, so an empty list is retried; a lookup that never answers (web with no
 * voices at all) counts as empty.
 */
async function listVoices(): Promise<Speech.Voice[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<Speech.Voice[]>((resolve) => {
      timer = setTimeout(() => resolve([]), 3000);
    });
    const voices = await Promise.race([Speech.getAvailableVoicesAsync(), timeout]);
    clearTimeout(timer);
    if (voices.length > 0) return voices;
    await sleep(1000);
  }
  return [];
}

/** Finds a Cantonese voice on the device. Returns null when there is none. */
export async function detectCantoneseVoice(): Promise<string | null> {
  // Only a found voice is cached, so a voice installed later is picked up on the next check.
  if (voice) return voice.language;
  try {
    const voices = await listVoices();
    const match = voices.find((v) => CANTONESE.some((c) => v.language.toLowerCase().replace('_', '-').startsWith(c)));
    voice = match ? { language: match.language, identifier: match.identifier } : null;
  } catch {
    voice = null;
  }
  return voice?.language ?? null;
}

/** The Cantonese voice: undefined while checking, null when there is none. */
export function useCantoneseVoice(): { voice: string | null | undefined; recheck: () => void } {
  const [found, setFound] = useState<string | null | undefined>(undefined);
  const recheck = useCallback(() => {
    setFound(undefined);
    detectCantoneseVoice().then(setFound);
  }, []);
  useEffect(recheck, [recheck]);
  return { voice: found, recheck };
}

export function speak(text: string, slow = false): void {
  Speech.stop();
  Speech.speak(text, {
    language: voice?.language ?? 'zh-HK',
    voice: voice?.identifier,
    rate: slow ? 0.5 : 0.85,
  });
}

import { Word } from '@/lib/types';

export const TONE_NAMES: Record<number, string> = {
  1: 'High level',
  2: 'High rising',
  3: 'Mid level',
  4: 'Low falling',
  5: 'Low rising',
  6: 'Low level',
};

export function syllables(jyutping: string): string[] {
  return jyutping.trim().split(/\s+/).filter(Boolean);
}

export function toneOf(syllable: string): number | undefined {
  const m = /([1-6])$/.exec(syllable);
  return m ? Number(m[1]) : undefined;
}

export function stripTone(syllable: string): string {
  return syllable.replace(/[1-6]$/, '');
}

export function normalizeJyutping(input: string, keepTones: boolean): string {
  let s = input.toLowerCase().replace(/[^a-z1-6]/g, '');
  if (!keepTones) s = s.replace(/[1-6]/g, '');
  return s;
}

/** Spacing and punctuation never matter; tones matter only when required. */
export function jyutpingMatches(input: string, expected: string, requireTones: boolean): boolean {
  const got = normalizeJyutping(input, requireTones);
  if (!got) return false;
  if (requireTones) return got === normalizeJyutping(expected, true);
  // When tones are optional, a tone the learner does type still has to be right.
  if (/[1-6]/.test(input)) return normalizeJyutping(input, true) === normalizeJyutping(expected, true);
  return got === normalizeJyutping(expected, false);
}

export function normalizeEnglish(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function englishAnswers(item: { english: string; alt?: string[] }): string[] {
  const parts = item.english.split('/').map((p) => p.trim());
  return [item.english, ...parts, ...(item.alt ?? [])].map(normalizeEnglish).filter(Boolean);
}

export function englishMatches(input: string, item: { english: string; alt?: string[] }): boolean {
  const got = normalizeEnglish(input);
  return !!got && englishAnswers(item).includes(got);
}

export function englishTokens(english: string): string[] {
  return english.split(/\s+/).filter(Boolean);
}

export function tokensMatch(given: string[], expected: string[]): boolean {
  return given.length === expected.length && given.every((t, i) => t.toLowerCase() === expected[i].toLowerCase());
}

/** Accepted token sequences for a sentence: the main English plus any alternates. */
export function sentenceAnswerTokens(sentence: { english: string; alt?: string[] }): string[][] {
  return [sentence.english, ...(sentence.alt ?? [])].map(englishTokens);
}

export function displayWord(word: Word): string {
  return `${word.hanzi} (${word.jyutping})`;
}

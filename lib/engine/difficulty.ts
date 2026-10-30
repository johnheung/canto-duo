import { DifficultyProfile, ExerciseKind, Level, ScriptMode, ScriptPreference } from '@/lib/types';

export const LEVELS: { id: Level; label: string; description: string }[] = [
  { id: 'beginner', label: 'Beginner', description: 'New to Cantonese. Lots of hints and Jyutping.' },
  { id: 'intermediate', label: 'Intermediate', description: 'I know some basics. Starts at Food & Drink.' },
  { id: 'advanced', label: 'Advanced', description: 'Push me. Starts at Time, fewer hints, tones required.' },
];

const LEVEL_BASE: Record<Level, number> = { beginner: 0, intermediate: 2, advanced: 4 };

/** Unit the learner can start from without taking a checkpoint. */
export const LEVEL_START_UNIT: Record<Level, number> = { beginner: 0, intermediate: 2, advanced: 4 };

export const MAX_SCORE = 10;

/**
 * Difficulty score from 0 (gentlest) to 10 (hardest). It rises with the chosen
 * level, how far into the course the lesson is, and how often it has been redone.
 */
export function difficultyScore(level: Level, unitIndex: number, crowns: number): number {
  const raw = LEVEL_BASE[level] + unitIndex * 0.75 + crowns;
  return Math.max(0, Math.min(MAX_SCORE, Math.round(raw * 4) / 4));
}

function lerp(from: number, to: number, score: number): number {
  return from + ((to - from) * score) / MAX_SCORE;
}

export function scriptForScore(score: number): ScriptMode {
  if (score < 3) return 'jyutping';
  if (score < 6.5) return 'both';
  return 'characters';
}

export function resolveScript(preference: ScriptPreference, score: number): ScriptMode {
  return preference === 'auto' ? scriptForScore(score) : preference;
}

export function buildProfile(score: number): DifficultyProfile {
  // Recognition exercises fade out as production exercises take over.
  const weights: Record<ExerciseKind, number> = {
    'mc-meaning': lerp(4, 0.75, score),
    'mc-cantonese': lerp(3, 1, score),
    listen: lerp(1, 2, score),
    match: lerp(1.5, 0.75, score),
    tone: score >= 1.5 ? lerp(0.25, 1.5, score) : 0,
    'build-en': lerp(1, 2.5, score),
    'build-yue': score >= 2 ? lerp(0, 3, score) : 0,
    type: score >= 4 ? lerp(-2, 3, score) : 0,
  };

  return {
    score,
    exerciseCount: Math.round(lerp(8, 13, score)),
    optionCount: score < 3 ? 3 : score < 6 ? 4 : 5,
    toneOptionCount: score < 3 ? 2 : score < 5 ? 3 : score < 7.5 ? 4 : 6,
    distractorTokens: Math.floor(lerp(0, 4.99, score)),
    similarDistractors: score >= 4,
    script: scriptForScore(score),
    requireTones: score >= 6,
    reviewWords: Math.round(lerp(0, 4, score)),
    weights,
  };
}

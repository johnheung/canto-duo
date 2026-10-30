import { WordProgress } from '@/lib/types';

const DAY = 24 * 60 * 60 * 1000;
/** Leitner box intervals in days. */
export const INTERVALS = [0, 1, 2, 4, 7, 15];
export const MAX_BOX = INTERVALS.length - 1;

export function reviewWord(prev: WordProgress | undefined, correct: boolean, now: number): WordProgress {
  const base = prev ?? { box: 0, due: now, seen: 0, correct: 0 };
  const box = correct ? Math.min(MAX_BOX, base.box + 1) : Math.max(0, base.box - 2);
  return {
    box,
    due: now + INTERVALS[box] * DAY,
    seen: base.seen + 1,
    correct: base.correct + (correct ? 1 : 0),
  };
}

/** 0–1 strength, for display. */
export function strength(p: WordProgress | undefined): number {
  return p ? p.box / MAX_BOX : 0;
}

/** Words seen before, most overdue and weakest first. */
export function wordsToReview(words: Record<string, WordProgress>, now: number, limit: number): string[] {
  return Object.entries(words)
    .sort(([, a], [, b]) => {
      const aDue = a.due <= now ? 0 : 1;
      const bDue = b.due <= now ? 0 : 1;
      return aDue - bDue || a.box - b.box || a.due - b.due;
    })
    .slice(0, limit)
    .map(([id]) => id);
}

export function dueCount(words: Record<string, WordProgress>, now: number): number {
  return Object.values(words).filter((w) => w.due <= now).length;
}

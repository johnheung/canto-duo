import { describe, expect, it } from '@jest/globals';
import { units } from '@/lib/content';
import {
  completeLesson,
  completeOnboarding,
  currentHearts,
  displayStreak,
  HEART_REFILL_MS,
  initialState,
  isCheckpointUnlocked,
  isLessonUnlocked,
  isUnitUnlocked,
  loseHeart,
  MAX_HEARTS,
} from '@/lib/progress';

const DAY = 86400000;
const T0 = new Date(2026, 0, 10, 12).getTime();

describe('progress', () => {
  it('starts later units for higher levels', () => {
    const s = completeOnboarding(initialState(T0), 'intermediate', 20);
    expect(isUnitUnlocked(s, 2)).toBe(true);
    expect(isUnitUnlocked(s, 3)).toBe(false);
    expect(isLessonUnlocked(s, units[0], 3)).toBe(true);
    expect(isLessonUnlocked(s, units[2], 1)).toBe(false);
    expect(s.settings.hearts).toBe(true);
  });

  it('unlocks lessons in order and the next unit after a checkpoint', () => {
    let s = completeOnboarding(initialState(T0), 'beginner', 20);
    expect(isLessonUnlocked(s, units[0], 1)).toBe(false);
    for (const l of units[0].lessons) {
      s = completeLesson(s, { kind: 'lesson', id: l.id, correct: 10, total: 10, mistakes: 0 }, T0, units.length).state;
    }
    expect(isLessonUnlocked(s, units[0], 3)).toBe(true);
    expect(isCheckpointUnlocked(s, units[0])).toBe(true);

    const fail = completeLesson(s, { kind: 'checkpoint', id: 'u1-checkpoint', unitIndex: 0, correct: 5, total: 10, mistakes: 5 }, T0, units.length);
    expect(fail.passed).toBe(false);
    expect(isUnitUnlocked(fail.state, 1)).toBe(false);

    const pass = completeLesson(s, { kind: 'checkpoint', id: 'u1-checkpoint', unitIndex: 0, correct: 9, total: 10, mistakes: 1 }, T0, units.length);
    expect(pass.passed).toBe(true);
    expect(isUnitUnlocked(pass.state, 1)).toBe(true);
  });

  it('caps crowns at 3 and awards a perfect bonus', () => {
    let s = initialState(T0);
    let xp = 0;
    for (let i = 0; i < 5; i++) {
      const r = completeLesson(s, { kind: 'lesson', id: 'u1-l1', correct: 10, total: 10, mistakes: 0 }, T0, units.length);
      s = r.state;
      xp = r.xpEarned;
    }
    expect(s.lessons['u1-l1'].crowns).toBe(3);
    expect(xp).toBe(15);
  });

  it('tracks streaks across days', () => {
    let s = initialState(T0);
    const done = (t: number) => completeLesson(s, { kind: 'practice', id: 'practice', correct: 1, total: 1, mistakes: 0 }, t, units.length).state;
    s = done(T0);
    s = done(T0 + 1000);
    expect(s.streak.count).toBe(1);
    s = done(T0 + DAY);
    expect(s.streak.count).toBe(2);
    expect(displayStreak(s, T0 + 2 * DAY)).toBe(2);
    expect(displayStreak(s, T0 + 3 * DAY)).toBe(0);
    s = done(T0 + 4 * DAY);
    expect(s.streak.count).toBe(1);
    expect(s.streak.best).toBe(2);
  });

  it('loses and refills hearts over time', () => {
    let s = initialState(T0);
    s = loseHeart(s, T0);
    s = loseHeart(s, T0);
    expect(currentHearts(s, T0)).toBe(MAX_HEARTS - 2);
    expect(currentHearts(s, T0 + HEART_REFILL_MS)).toBe(MAX_HEARTS - 1);
    expect(currentHearts(s, T0 + 10 * HEART_REFILL_MS)).toBe(MAX_HEARTS);
  });
});

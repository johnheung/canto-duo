import { describe, expect, it } from '@jest/globals';
import { allWords, resolveLesson, units } from '@/lib/content';
import { buildProfile, difficultyScore } from '@/lib/engine/difficulty';
import { generateLesson } from '@/lib/engine/generateLesson';
import { englishMatches, jyutpingMatches, syllables, toneOf } from '@/lib/engine/grading';
import { planLesson } from '@/lib/engine/plan';
import { seededRng } from '@/lib/engine/random';
import { reviewWord, wordsToReview } from '@/lib/engine/srs';
import { initialState } from '@/lib/progress';

describe('course content', () => {
  it('has unique word ids and valid Jyutping', () => {
    const ids = allWords.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const w of allWords) {
      for (const s of syllables(w.jyutping)) expect(toneOf(s)).toBeDefined();
      // One syllable per character.
      expect(syllables(w.jyutping)).toHaveLength([...w.hanzi].length);
    }
  });

  it('has 8 units of 4 lessons, each with 5 words and sentences', () => {
    expect(units).toHaveLength(8);
    for (const u of units) {
      expect(u.lessons).toHaveLength(4);
      for (const l of u.lessons) {
        expect(l.words).toHaveLength(5);
        expect(l.sentences.length).toBeGreaterThan(0);
        for (const s of l.sentences) {
          for (const t of s.tokens) expect(syllables(t.jyutping)).toHaveLength([...t.hanzi].length);
        }
      }
    }
  });
});

describe('difficulty', () => {
  it('rises with level, unit and crowns', () => {
    expect(difficultyScore('beginner', 0, 0)).toBe(0);
    expect(difficultyScore('beginner', 4, 0)).toBeGreaterThan(difficultyScore('beginner', 0, 0));
    expect(difficultyScore('beginner', 2, 2)).toBeGreaterThan(difficultyScore('beginner', 2, 0));
    expect(difficultyScore('advanced', 0, 0)).toBeGreaterThan(difficultyScore('intermediate', 0, 0));
    expect(difficultyScore('advanced', 7, 3)).toBe(10);
  });

  it('shifts from recognition to production as score rises', () => {
    const easy = buildProfile(0);
    const hard = buildProfile(10);
    expect(easy.weights.type).toBe(0);
    expect(easy.weights['build-yue']).toBe(0);
    expect(hard.weights.type).toBeGreaterThan(hard.weights['mc-meaning']);
    expect(hard.optionCount).toBeGreaterThan(easy.optionCount);
    expect(hard.exerciseCount).toBeGreaterThan(easy.exerciseCount);
    expect(easy.script).toBe('jyutping');
    expect(hard.script).toBe('characters');
    expect(hard.requireTones).toBe(true);
    expect(easy.requireTones).toBe(false);
  });
});

describe('generateLesson', () => {
  const lesson = units[2].lessons[0];

  it.each([0, 3, 6, 10])('builds a valid lesson at score %p', (score) => {
    const profile = buildProfile(score);
    const exercises = generateLesson({
      focusWords: lesson.words,
      focusSentences: lesson.sentences,
      newWordIds: new Set(lesson.words.map((w) => w.id)),
      wordPool: allWords,
      sentencePool: [],
      profile,
      rng: seededRng(score + 1),
    });
    expect(exercises).toHaveLength(profile.exerciseCount);
    expect(new Set(exercises.map((e) => e.id)).size).toBe(exercises.length);
    for (const ex of exercises) {
      if (ex.kind === 'mc-meaning') {
        expect(ex.options).toContain(ex.answer);
        expect(new Set(ex.options).size).toBe(ex.options.length);
      }
      if (ex.kind === 'mc-cantonese' || ex.kind === 'listen') {
        expect(ex.options.map((o) => o.id)).toContain(ex.answerId);
        expect(ex.options).toHaveLength(profile.optionCount);
      }
      if (ex.kind === 'tone') expect(ex.options).toContain(ex.answer);
      if (ex.kind === 'build-yue' || ex.kind === 'build-en') {
        expect(ex.bank.length).toBeGreaterThanOrEqual(ex.answer.length);
      }
    }
    // Every focus word is practised.
    const covered = new Set(exercises.flatMap((e) => e.wordIds));
    for (const w of lesson.words) expect(covered.has(w.id)).toBe(true);
  });

  it('introduces new words first', () => {
    const exercises = generateLesson({
      focusWords: lesson.words,
      focusSentences: lesson.sentences,
      newWordIds: new Set([lesson.words[0].id]),
      wordPool: allWords,
      sentencePool: [],
      profile: buildProfile(0),
      rng: seededRng(7),
    });
    expect(exercises[0]).toMatchObject({ kind: 'mc-meaning', isNew: true });
  });

  it('plans every lesson, checkpoint and practice without errors', () => {
    const state = initialState(0);
    for (const u of units) {
      for (const id of [...u.lessons.map((l) => l.id), `${u.id}-checkpoint`]) {
        const plan = planLesson(state, resolveLesson(id)!, seededRng(1), 0);
        expect(plan.exercises.length).toBeGreaterThan(5);
      }
    }
  });
});

describe('grading', () => {
  it('accepts Jyutping without tones unless required', () => {
    expect(jyutpingMatches('nei hou', 'nei5 hou2', false)).toBe(true);
    expect(jyutpingMatches('neihou', 'nei5 hou2', false)).toBe(true);
    expect(jyutpingMatches('nei5 hou2', 'nei5 hou2', true)).toBe(true);
    expect(jyutpingMatches('nei hou', 'nei5 hou2', true)).toBe(false);
    expect(jyutpingMatches('nei3 hou2', 'nei5 hou2', false)).toBe(false);
    expect(jyutpingMatches('', 'nei5 hou2', false)).toBe(false);
  });

  it('accepts English alternates and slash parts', () => {
    const w = { english: 'he / she', alt: ['him'] };
    expect(englishMatches('She', w)).toBe(true);
    expect(englishMatches('him!', w)).toBe(true);
    expect(englishMatches('they', w)).toBe(false);
    expect(englishMatches("o'clock", { english: "o'clock" })).toBe(true);
  });
});

describe('srs', () => {
  it('moves words up on correct and down on wrong answers', () => {
    let p = reviewWord(undefined, true, 0);
    expect(p.box).toBe(1);
    p = reviewWord(p, true, 0);
    p = reviewWord(p, true, 0);
    expect(p.box).toBe(3);
    p = reviewWord(p, false, 0);
    expect(p.box).toBe(1);
    expect(p.seen).toBe(4);
  });

  it('reviews overdue and weak words first', () => {
    const now = 10 * 86400000;
    const order = wordsToReview(
      {
        strongDue: { box: 4, due: now - 1, seen: 5, correct: 5 },
        weakFuture: { box: 0, due: now + 1, seen: 1, correct: 0 },
        weakDue: { box: 1, due: now - 1, seen: 2, correct: 1 },
      },
      now,
      3,
    );
    expect(order).toEqual(['weakDue', 'strongDue', 'weakFuture']);
  });
});

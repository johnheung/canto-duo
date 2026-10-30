import { Exercise, ProgressState, Sentence, Word } from '@/lib/types';
import { allSentences, allWords, contentBefore, getWord, LessonRef } from '@/lib/content';
import { buildProfile, difficultyScore } from '@/lib/engine/difficulty';
import { generateLesson } from '@/lib/engine/generateLesson';
import { Rng, shuffle } from '@/lib/engine/random';
import { wordsToReview } from '@/lib/engine/srs';
import { crownsFor } from '@/lib/progress';

export interface LessonPlan {
  exercises: Exercise[];
  score: number;
}

export const MIN_PRACTICE_WORDS = 4;

function sentencesUsing(words: Word[], pool: Sentence[]): Sentence[] {
  return pool.filter((s) => {
    const text = s.tokens.map((t) => t.hanzi).join('');
    return words.some((w) => text.includes(w.hanzi));
  });
}

/** Older words to mix in: weakest ones the learner has seen, else random. */
function pickReview(state: ProgressState, candidates: Word[], count: number, rng: Rng): Word[] {
  if (count <= 0 || candidates.length === 0) return [];
  const seen = candidates.filter((w) => state.words[w.id]);
  const weakest = [...seen].sort((a, b) => state.words[a.id].box - state.words[b.id].box);
  const rest = shuffle(candidates.filter((w) => !state.words[w.id]), rng);
  return [...weakest.slice(0, count), ...rest].slice(0, count);
}

export function planLesson(state: ProgressState, ref: LessonRef, rng: Rng, now: number): LessonPlan {
  const level = state.settings.level;

  if (ref.kind === 'lesson') {
    const score = difficultyScore(level, ref.unit.index, crownsFor(state, ref.lesson.id));
    const profile = buildProfile(score);
    const before = contentBefore(ref.unit.index, ref.lessonIndex);
    const reviewWords = pickReview(state, before.words, profile.reviewWords, rng);
    const exercises = generateLesson({
      focusWords: ref.lesson.words,
      focusSentences: ref.lesson.sentences,
      reviewWords,
      reviewSentences: profile.score >= 3 ? sentencesUsing(reviewWords, before.sentences).slice(0, 2) : [],
      newWordIds: new Set(ref.lesson.words.filter((w) => !state.words[w.id]).map((w) => w.id)),
      wordPool: allWords,
      sentencePool: allSentences,
      profile,
      rng,
    });
    return { exercises, score };
  }

  if (ref.kind === 'checkpoint') {
    // A checkpoint is a notch harder than the unit's lessons.
    const score = Math.min(10, difficultyScore(level, ref.unit.index, 1) + 1);
    const profile = buildProfile(score);
    const focusWords = ref.unit.lessons.flatMap((l) => l.words);
    const before = contentBefore(ref.unit.index, 0);
    const exercises = generateLesson({
      focusWords,
      focusSentences: ref.unit.lessons.flatMap((l) => l.sentences),
      reviewWords: pickReview(state, before.words, 3, rng),
      wordPool: allWords,
      sentencePool: allSentences,
      profile,
      rng,
      count: profile.exerciseCount + 3,
    });
    return { exercises, score };
  }

  const ids = wordsToReview(state.words, now, 8);
  const words = ids.map(getWord).filter((w): w is Word => !!w);
  const score = difficultyScore(level, state.unlockedUnitIndex, 0);
  if (words.length < MIN_PRACTICE_WORDS) return { exercises: [], score };
  const profile = buildProfile(score);
  const exercises = generateLesson({
    focusWords: words,
    focusSentences: sentencesUsing(words, allSentences).slice(0, 4),
    wordPool: allWords,
    sentencePool: allSentences,
    profile,
    rng,
    count: 10,
  });
  return { exercises, score };
}

import { DifficultyProfile, Exercise, ExerciseKind, Sentence, Token, Word } from '@/lib/types';
import { englishTokens, normalizeEnglish, stripTone, syllables, toneOf } from '@/lib/engine/grading';
import { Rng, shuffle, weightedPick } from '@/lib/engine/random';

export interface LessonInput {
  /** Words the lesson is about. */
  focusWords: Word[];
  focusSentences: Sentence[];
  /** Older material mixed in for review. */
  reviewWords?: Word[];
  reviewSentences?: Sentence[];
  /** Focus words the learner has never seen; these are introduced first. */
  newWordIds?: Set<string>;
  /** Every word in the course, used for wrong options. */
  wordPool: Word[];
  sentencePool: Sentence[];
  profile: DifficultyProfile;
  rng: Rng;
  count?: number;
}

const MAX_MATCH_PER_LESSON = 2;

function syllableBases(word: Word): string[] {
  return syllables(word.jyutping).map(stripTone);
}

function similarity(a: Word, b: Word): number {
  const sa = syllableBases(a);
  const sb = syllableBases(b);
  let score = sa.length === sb.length ? 1 : 0;
  if (sa.some((s) => sb.includes(s))) score += 2;
  if (a.hanzi.length === b.hanzi.length) score += 0.5;
  return score;
}

export function pickDistractors(target: Word, pool: Word[], count: number, similar: boolean, rng: Rng): Word[] {
  const targetEnglish = normalizeEnglish(target.english);
  const candidates = pool.filter(
    (w) => w.id !== target.id && w.hanzi !== target.hanzi && normalizeEnglish(w.english) !== targetEnglish,
  );
  if (!similar) return shuffle(candidates, rng).slice(0, count);
  return candidates
    .map((w) => ({ w, s: similarity(target, w) + rng() }))
    .sort((a, b) => b.s - a.s)
    .slice(0, count)
    .map((x) => x.w);
}

function toneOptions(answer: number, count: number, rng: Rng): number[] {
  const others = shuffle([1, 2, 3, 4, 5, 6].filter((t) => t !== answer), rng).slice(0, count - 1);
  return [answer, ...others].sort((a, b) => a - b);
}

export function generateLesson(input: LessonInput): Exercise[] {
  const { profile, rng, wordPool, sentencePool } = input;
  const focusWords = input.focusWords;
  const reviewWords = input.reviewWords ?? [];
  const sentences = [...input.focusSentences, ...(input.reviewSentences ?? [])];
  const count = input.count ?? profile.exerciseCount;
  const lessonWords = [...focusWords, ...reviewWords];

  const exercises: Exercise[] = [];
  const wordUses = new Map<string, number>();
  const sentenceUses = new Map<string, number>();
  let matchCount = 0;

  const use = (w: Word) => wordUses.set(w.id, (wordUses.get(w.id) ?? 0) + 1);

  // Least-used first, focus words favoured, random tie-break.
  const nextWord = (filter: (w: Word) => boolean = () => true): Word | undefined => {
    const candidates = lessonWords.filter(filter);
    if (candidates.length === 0) return undefined;
    const isFocus = new Set(focusWords.map((w) => w.id));
    return candidates
      .map((w) => ({ w, k: (wordUses.get(w.id) ?? 0) + (isFocus.has(w.id) ? 0 : 0.5) + rng() * 0.4 }))
      .sort((a, b) => a.k - b.k)[0].w;
  };

  const nextSentence = (): Sentence | undefined => {
    if (sentences.length === 0) return undefined;
    return sentences
      .map((s) => ({ s, k: (sentenceUses.get(s.id) ?? 0) + rng() * 0.4 }))
      .sort((a, b) => a.k - b.k)[0].s;
  };

  const id = () => `ex-${exercises.length}`;

  const wordOptions = (word: Word) =>
    shuffle([word, ...pickDistractors(word, wordPool, profile.optionCount - 1, profile.similarDistractors, rng)], rng);

  // Introduce unseen words first.
  const newWords = focusWords.filter((w) => input.newWordIds?.has(w.id)).slice(0, Math.ceil(count / 2));
  for (const word of newWords) {
    use(word);
    exercises.push({
      id: id(),
      kind: 'mc-meaning',
      word,
      wordIds: [word.id],
      isNew: true,
      answer: word.english,
      options: shuffle(
        [word.english, ...pickDistractors(word, wordPool, profile.optionCount - 1, false, rng).map((w) => w.english)],
        rng,
      ),
    });
  }

  const build = (kind: ExerciseKind): Exercise | undefined => {
    switch (kind) {
      case 'mc-meaning': {
        const word = nextWord();
        if (!word) return undefined;
        use(word);
        const options = wordOptions(word).map((w) => w.english);
        return { id: id(), kind, word, wordIds: [word.id], options, answer: word.english };
      }
      case 'mc-cantonese':
      case 'listen': {
        const word = nextWord();
        if (!word) return undefined;
        use(word);
        return { id: id(), kind, word, wordIds: [word.id], options: wordOptions(word), answerId: word.id };
      }
      case 'match': {
        const size = profile.score < 5 ? 4 : 5;
        if (matchCount >= MAX_MATCH_PER_LESSON) return undefined;
        const pairs: Word[] = [];
        for (const w of shuffle(lessonWords, rng)) {
          const clash = pairs.some(
            (p) => p.hanzi === w.hanzi || normalizeEnglish(p.english) === normalizeEnglish(w.english),
          );
          if (!clash) pairs.push(w);
          if (pairs.length === size) break;
        }
        if (pairs.length < 4) return undefined;
        matchCount++;
        pairs.forEach(use);
        return { id: id(), kind, pairs, wordIds: pairs.map((p) => p.id) };
      }
      case 'tone': {
        const word = nextWord((w) => syllables(w.jyutping).every((s) => toneOf(s) !== undefined));
        if (!word) return undefined;
        use(word);
        const syl = syllables(word.jyutping);
        const syllableIndex = Math.floor(rng() * syl.length);
        const answer = toneOf(syl[syllableIndex])!;
        return {
          id: id(),
          kind,
          word,
          wordIds: [word.id],
          syllableIndex,
          answer,
          options: toneOptions(answer, profile.toneOptionCount, rng),
        };
      }
      case 'type': {
        const word = nextWord();
        if (!word) return undefined;
        use(word);
        return { id: id(), kind, word, wordIds: [word.id], requireTones: profile.requireTones };
      }
      case 'build-en': {
        const sentence = nextSentence();
        if (!sentence) return undefined;
        sentenceUses.set(sentence.id, (sentenceUses.get(sentence.id) ?? 0) + 1);
        const answer = englishTokens(sentence.english);
        const lower = new Set(answer.map((t) => t.toLowerCase()));
        const extras = shuffle(
          [...new Set(sentencePool.flatMap((s) => englishTokens(s.english)))].filter((t) => !lower.has(t.toLowerCase())),
          rng,
        ).slice(0, profile.distractorTokens);
        return {
          id: id(),
          kind,
          sentence,
          wordIds: wordIdsIn(sentence, lessonWords),
          answer,
          bank: shuffle([...answer, ...extras], rng),
        };
      }
      case 'build-yue': {
        const sentence = nextSentence();
        if (!sentence) return undefined;
        sentenceUses.set(sentence.id, (sentenceUses.get(sentence.id) ?? 0) + 1);
        const answer = sentence.tokens.filter((t) => !isPunctuation(t));
        const used = new Set(answer.map((t) => t.hanzi));
        const seen = new Set<string>();
        const candidates: Token[] = [];
        for (const t of sentencePool.flatMap((s) => s.tokens)) {
          if (!used.has(t.hanzi) && !seen.has(t.hanzi) && !isPunctuation(t)) {
            seen.add(t.hanzi);
            candidates.push(t);
          }
        }
        const extras = shuffle(candidates, rng).slice(0, profile.distractorTokens);
        return {
          id: id(),
          kind,
          sentence,
          wordIds: wordIdsIn(sentence, lessonWords),
          answer,
          bank: shuffle([...answer, ...extras], rng),
        };
      }
    }
  };

  let guard = 0;
  while (exercises.length < count && guard++ < count * 10) {
    const recent = exercises.slice(-2).map((e) => e.kind);
    const weights = { ...profile.weights };
    // Avoid three of the same kind in a row.
    if (recent.length === 2 && recent[0] === recent[1]) weights[recent[0]] = 0;
    const kind = weightedPick(weights, rng);
    if (!kind) break;
    const ex = build(kind);
    if (ex) exercises.push(ex);
  }

  return exercises;
}

function isPunctuation(t: Token): boolean {
  return /^[，。！？,.!?]$/.test(t.hanzi);
}

function wordIdsIn(sentence: Sentence, words: Word[]): string[] {
  const text = sentence.tokens.map((t) => t.hanzi).join('');
  return words.filter((w) => text.includes(w.hanzi)).map((w) => w.id);
}

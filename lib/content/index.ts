import { Lesson, Sentence, Unit, Word } from '@/lib/types';
import { units } from '@/lib/content/course';

export { units };

export const allWords: Word[] = units.flatMap((u) => u.lessons.flatMap((l) => l.words));
export const allSentences: Sentence[] = units.flatMap((u) => u.lessons.flatMap((l) => l.sentences));

const wordMap = new Map(allWords.map((w) => [w.id, w]));
const wordUnitIndex = new Map<string, number>();
units.forEach((u) => u.lessons.forEach((l) => l.words.forEach((w) => wordUnitIndex.set(w.id, u.index))));

export function getWord(id: string): Word | undefined {
  return wordMap.get(id);
}

export function unitIndexOfWord(id: string): number {
  return wordUnitIndex.get(id) ?? 0;
}

export function checkpointId(unit: Unit): string {
  return `${unit.id}-checkpoint`;
}

export type LessonRef =
  | { kind: 'lesson'; unit: Unit; lesson: Lesson; lessonIndex: number }
  | { kind: 'checkpoint'; unit: Unit }
  | { kind: 'practice' };

export function resolveLesson(id: string): LessonRef | undefined {
  if (id === 'practice') return { kind: 'practice' };
  for (const unit of units) {
    if (id === checkpointId(unit)) return { kind: 'checkpoint', unit };
    const lessonIndex = unit.lessons.findIndex((l) => l.id === id);
    if (lessonIndex >= 0) return { kind: 'lesson', unit, lesson: unit.lessons[lessonIndex], lessonIndex };
  }
  return undefined;
}

/** Words and sentences from every lesson before the given position. */
export function contentBefore(unitIndex: number, lessonIndex: number): { words: Word[]; sentences: Sentence[] } {
  const words: Word[] = [];
  const sentences: Sentence[] = [];
  for (const unit of units) {
    unit.lessons.forEach((l, i) => {
      if (unit.index < unitIndex || (unit.index === unitIndex && i < lessonIndex)) {
        words.push(...l.words);
        sentences.push(...l.sentences);
      }
    });
  }
  return { words, sentences };
}

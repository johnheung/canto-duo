import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Level, ProgressState, Settings } from '@/lib/types';
import { clearState, loadState, saveState } from '@/lib/storage';
import { units } from '@/lib/content';
import { LEVEL_START_UNIT } from '@/lib/engine/difficulty';
import {
  CompletionKind,
  CompletionResult,
  completeLesson,
  completeOnboarding,
  initialState,
  loseHeart,
  recordAnswer,
} from '@/lib/progress';

interface ProgressContextValue {
  state: ProgressState;
  loading: boolean;
  onboard: (level: Level, dailyGoal: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  answer: (wordIds: string[], correct: boolean) => void;
  loseHeart: () => void;
  complete: (args: {
    kind: CompletionKind;
    id: string;
    unitIndex?: number;
    correct: number;
    total: number;
    mistakes: number;
  }) => CompletionResult;
  reset: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => initialState());
  const [loading, setLoading] = useState(true);
  // Latest state, so actions called in the same tick build on each other.
  const stateRef = useRef(state);

  const apply = useCallback((fn: (s: ProgressState) => ProgressState) => {
    stateRef.current = fn(stateRef.current);
    setState(stateRef.current);
  }, []);

  useEffect(() => {
    loadState().then((s) => {
      stateRef.current = s;
      setState(s);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) saveState(state);
  }, [state, loading]);

  const onboard = useCallback(
    (level: Level, dailyGoal: number) => apply((s) => completeOnboarding(s, level, dailyGoal)),
    [apply],
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) =>
      apply((s) => {
        const settings = { ...s.settings, ...patch };
        // Raising the level opens its starting unit; lowering it never locks anything.
        const unlockedUnitIndex = patch.level
          ? Math.max(s.unlockedUnitIndex, LEVEL_START_UNIT[patch.level])
          : s.unlockedUnitIndex;
        return { ...s, settings, unlockedUnitIndex };
      }),
    [apply],
  );

  const answer = useCallback(
    (wordIds: string[], correct: boolean) => apply((s) => recordAnswer(s, wordIds, correct, Date.now())),
    [apply],
  );

  const loseHeartAction = useCallback(() => apply((s) => loseHeart(s, Date.now())), [apply]);

  const complete = useCallback<ProgressContextValue['complete']>(
    (args) => {
      const result = completeLesson(stateRef.current, args, Date.now(), units.length);
      apply(() => result.state);
      return result;
    },
    [apply],
  );

  const reset = useCallback(async () => {
    await clearState();
    apply(() => initialState());
  }, [apply]);

  const value = useMemo(
    () => ({ state, loading, onboard, updateSettings, answer, loseHeart: loseHeartAction, complete, reset }),
    [state, loading, onboard, updateSettings, answer, loseHeartAction, complete, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { dailyGoal } from '@/src/data/dailyGoal';
import { presetGoals } from '@/src/data/presetGoals';
import { normalizeThemeId } from '@/src/theme/palette';
import {
  CountEvent,
  GoalPlan,
  GoalProgress,
  Language,
  normalizeLanguage,
  normalizeVisualization,
  ThemeId,
  VisualizationMode,
} from '@/src/types/misbaha';
import { todayKey } from './date';

type CountsByDua = Record<string, number>;
type DailyCounts = Record<string, CountsByDua>;

type MisbahaState = {
  counts: CountsByDua;
  dailyCounts: DailyCounts;
  events: CountEvent[];
  goals: GoalPlan[];
  goalProgress: GoalProgress;
  tapWeight: number;
  themeId: ThemeId;
  language: Language;
  visualization: VisualizationMode;
  clickSoundEnabled: boolean;
  hapticsEnabled: boolean;
  tutorialCompleted: boolean;
  tutorialVisible: boolean;
  tutorialSession: number;
  incrementDua: (duaId: string, amount: number, date?: string) => void;
  resetDua: (duaId: string, date?: string) => void;
  resetAllCounters: () => void;
  setTapWeight: (tapWeight: number) => void;
  setThemeId: (themeId: ThemeId) => void;
  setLanguage: (language: Language) => void;
  setVisualization: (visualization: VisualizationMode) => void;
  setClickSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  openTutorial: () => void;
  closeTutorial: () => void;
  saveGoal: (goal: GoalPlan) => void;
  startGoal: (goal: GoalPlan, date?: string) => string;
  incrementGoalDay: (goalId: string, day: number, amount: number) => void;
};

const clampTapWeight = (value: number) => Math.min(10, Math.max(1, Math.round(value)));

function safeNumberRecord(value: unknown): CountsByDua {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: CountsByDua = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) out[key] = raw;
  }
  return out;
}

function safeDailyCounts(value: unknown): DailyCounts {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: DailyCounts = {};
  for (const [date, dayValue] of Object.entries(value as Record<string, unknown>)) {
    out[date] = safeNumberRecord(dayValue);
  }
  return out;
}

function safeGoalProgress(value: unknown): GoalProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: GoalProgress = {};
  for (const [goalId, daysValue] of Object.entries(value as Record<string, unknown>)) {
    if (!daysValue || typeof daysValue !== 'object' || Array.isArray(daysValue)) continue;
    const days: Record<number, number> = {};
    for (const [dayKey, raw] of Object.entries(daysValue as Record<string, unknown>)) {
      const day = Number(dayKey);
      if (!Number.isInteger(day) || day < 1) continue;
      if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) days[day] = raw;
    }
    if (Object.keys(days).length > 0) out[goalId] = days;
  }
  return out;
}

function safeEvents(value: unknown): CountEvent[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (entry): entry is CountEvent =>
        Boolean(entry) &&
        typeof entry === 'object' &&
        typeof (entry as CountEvent).duaId === 'string' &&
        typeof (entry as CountEvent).amount === 'number' &&
        Number.isFinite((entry as CountEvent).amount),
    )
    .slice(0, 2000);
}

function resolveGoal(goalId: string, goals: GoalPlan[]): GoalPlan | undefined {
  if (goalId === dailyGoal.id) return dailyGoal;
  return goals.find((goal) => goal.id === goalId);
}

export function migratePersistedState(persisted: unknown) {
  if (!persisted || typeof persisted !== 'object') {
    return persisted;
  }

  const raw = persisted as Record<string, unknown>;
  return {
    ...raw,
    themeId: raw.themeId ? normalizeThemeId(String(raw.themeId)) : raw.themeId,
    language: normalizeLanguage(raw.language as Language | undefined),
    visualization: normalizeVisualization(raw.visualization as string | undefined),
    counts: raw.counts !== undefined ? safeNumberRecord(raw.counts) : raw.counts,
    dailyCounts: raw.dailyCounts !== undefined ? safeDailyCounts(raw.dailyCounts) : raw.dailyCounts,
    goalProgress: raw.goalProgress !== undefined ? safeGoalProgress(raw.goalProgress) : raw.goalProgress,
    events: raw.events !== undefined ? safeEvents(raw.events) : raw.events,
    tapWeight:
      typeof raw.tapWeight === 'number' && Number.isFinite(raw.tapWeight)
        ? clampTapWeight(raw.tapWeight)
        : raw.tapWeight,
    tutorialCompleted: raw.tutorialCompleted === true,
  };
}

export const useMisbahaStore = create<MisbahaState>()(
  persist(
    (set, get) => ({
      counts: {},
      dailyCounts: {},
      events: [],
      goals: presetGoals,
      goalProgress: {},
      tapWeight: 1,
      themeId: 'garden',
      language: 'en',
      visualization: 'garden',
      clickSoundEnabled: true,
      hapticsEnabled: true,
      tutorialCompleted: false,
      tutorialVisible: false,
      tutorialSession: 0,
      incrementDua: (duaId, amount, date = todayKey()) => {
        const safeAmount = Math.max(1, amount);
        const event: CountEvent = {
          id: `${duaId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          duaId,
          amount: safeAmount,
          date,
          createdAt: Date.now(),
        };

        set((state) => ({
          counts: {
            ...state.counts,
            [duaId]: (state.counts[duaId] ?? 0) + safeAmount,
          },
          dailyCounts: {
            ...state.dailyCounts,
            [date]: {
              ...(state.dailyCounts[date] ?? {}),
              [duaId]: (state.dailyCounts[date]?.[duaId] ?? 0) + safeAmount,
            },
          },
          events: [event, ...state.events].slice(0, 2000),
        }));
      },
      resetDua: (duaId, date = todayKey()) => {
        set((state) => {
          const nextCounts = { ...state.counts, [duaId]: 0 };
          const day = { ...(state.dailyCounts[date] ?? {}), [duaId]: 0 };
          return {
            counts: nextCounts,
            dailyCounts: { ...state.dailyCounts, [date]: day },
          };
        });
      },
      resetAllCounters: () => set({ counts: {}, dailyCounts: {}, events: [], goalProgress: {} }),
      setTapWeight: (tapWeight) => set({ tapWeight: clampTapWeight(tapWeight) }),
      setThemeId: (themeId) => set({ themeId: normalizeThemeId(themeId) }),
      setLanguage: (language) => set({ language: normalizeLanguage(language) }),
      setVisualization: (visualization) => set({ visualization: normalizeVisualization(visualization) }),
      setClickSoundEnabled: (clickSoundEnabled) => set({ clickSoundEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      openTutorial: () =>
        set((state) => ({
          tutorialVisible: true,
          tutorialSession: state.tutorialSession + 1,
        })),
      closeTutorial: () => set({ tutorialVisible: false, tutorialCompleted: true }),
      saveGoal: (goal) =>
        set((state) => ({
          goals: [goal, ...state.goals.filter((existing) => existing.id !== goal.id)],
        })),
      startGoal: (goal, date = todayKey()) => {
        const id =
          goal.id.startsWith('preset-') || goal.id.startsWith('lib-') ? `${goal.id}-${Date.now()}` : goal.id;
        const startedGoal = { ...goal, id, createdAt: Date.now(), startedAt: date, preset: false };
        get().saveGoal(startedGoal);
        return id;
      },
      incrementGoalDay: (goalId, day, amount) => {
        const state = get();
        const goal = resolveGoal(goalId, state.goals);
        if (!goal?.days.some((entry) => entry.day === day)) return;

        set({
          goalProgress: {
            ...state.goalProgress,
            [goalId]: {
              ...(state.goalProgress[goalId] ?? {}),
              [day]: (state.goalProgress[goalId]?.[day] ?? 0) + Math.max(1, amount),
            },
          },
        });
      },
    }),
    {
      name: 'misbaha-store',
      version: 5,
      migrate: (persisted) => migratePersistedState(persisted),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        counts: state.counts,
        dailyCounts: state.dailyCounts,
        events: state.events,
        goals: state.goals,
        goalProgress: state.goalProgress,
        tapWeight: state.tapWeight,
        themeId: state.themeId,
        language: state.language,
        visualization: state.visualization,
        clickSoundEnabled: state.clickSoundEnabled,
        hapticsEnabled: state.hapticsEnabled,
        tutorialCompleted: state.tutorialCompleted,
      }),
    },
  ),
);

export function getGoalDayProgress(goalId: string, day: number) {
  return useMisbahaStore.getState().goalProgress[goalId]?.[day] ?? 0;
}

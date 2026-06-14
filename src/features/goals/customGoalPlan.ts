import { duas } from '@/src/data/duas';
import { buildSeededGoalDays } from '@/src/data/goalLibrary';
import { GoalDay } from '@/src/types/misbaha';

export type CustomSlot = string | null;

export function duaTarget(duaId: string): number {
  if (duaId.includes('la-ilaha') || duaId.includes('astaghfirullah')) return 100;
  return duas.find((item) => item.id === duaId)?.target ?? 33;
}

export function buildRandomCustomSlots(duration: number, seed: number): CustomSlot[] {
  return buildSeededGoalDays(duration, `custom-plan-${seed}-${duration}`).map((day) => day.duaId);
}

export function slotsToGoalDays(slots: CustomSlot[]): GoalDay[] {
  const days: GoalDay[] = [];
  slots.forEach((duaId, index) => {
    if (!duaId) return;
    days.push({ day: index + 1, duaId, target: duaTarget(duaId) });
  });
  return days;
}

export function compactGoalDays(days: GoalDay[]): GoalDay[] {
  return days.map((day, index) => ({ ...day, day: index + 1 }));
}

export function addDuaToSlots(
  slots: CustomSlot[],
  duaId: string,
  replaceCursor: number,
): { slots: CustomSlot[]; nextCursor: number } {
  const next = [...slots];
  const blankIndex = next.findIndex((slot) => slot === null);
  if (blankIndex >= 0) {
    next[blankIndex] = duaId;
    return { slots: next, nextCursor: replaceCursor };
  }

  const index = replaceCursor % next.length;
  next[index] = duaId;
  return { slots: next, nextCursor: replaceCursor + 1 };
}

export function removeSlotAt(slots: CustomSlot[], day: number): CustomSlot[] {
  const next = [...slots];
  if (day < 1 || day > next.length) return next;
  next[day - 1] = null;
  return next;
}

export function filledSlotCount(slots: CustomSlot[]): number {
  return slots.filter(Boolean).length;
}

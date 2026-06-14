import {
  addDuaToSlots,
  buildRandomCustomSlots,
  compactGoalDays,
  filledSlotCount,
  removeSlotAt,
  slotsToGoalDays,
} from '@/src/features/goals/customGoalPlan';

describe('customGoalPlan', () => {
  it('builds random slots for the selected duration', () => {
    const slots = buildRandomCustomSlots(7, 3);
    expect(slots).toHaveLength(7);
    expect(slots.every(Boolean)).toBe(true);
  });

  it('fills the first blank slot when adding a dua', () => {
    const slots: (string | null)[] = ['a', null, 'c'];
    const result = addDuaToSlots(slots, 'new-dua', 0);
    expect(result.slots).toEqual(['a', 'new-dua', 'c']);
    expect(result.nextCursor).toBe(0);
  });

  it('replaces slots in order when there are no blanks', () => {
    const slots = ['a', 'b', 'c'];
    const first = addDuaToSlots(slots, 'x', 0);
    expect(first.slots[0]).toBe('x');

    const second = addDuaToSlots(first.slots, 'y', first.nextCursor);
    expect(second.slots[1]).toBe('y');
  });

  it('removes a dua from a day and compacts saved days', () => {
    const slots = removeSlotAt(['a', 'b', 'c'], 2);
    expect(slots).toEqual(['a', null, 'c']);
    expect(filledSlotCount(slots)).toBe(2);

    const days = compactGoalDays(slotsToGoalDays(slots));
    expect(days).toEqual([
      { day: 1, duaId: 'a', target: expect.any(Number) },
      { day: 2, duaId: 'c', target: expect.any(Number) },
    ]);
  });
});

import { duasById } from '@/src/data/duas';
import { dayTimelineDuasById } from '@/src/data/dayTimelineDuas';
import { DayTimelineSupplication, DuaRecord } from '@/src/types/misbaha';

const timelineDuaIdBySupplicationId: Record<string, string> = {
  'morning-remembrance': 'timeline-morning-remembrance',
  'evening-remembrance': 'timeline-evening-remembrance',
};

export function resolveTimelineDua(supplication: DayTimelineSupplication): DuaRecord | undefined {
  const id = supplication.duaId ?? timelineDuaIdBySupplicationId[supplication.id];
  if (!id) return undefined;
  return duasById[id] ?? dayTimelineDuasById[id];
}

export function truncateArabic(text: string, maxLength = 42): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}

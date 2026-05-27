export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addDays(start: string, offset: number) {
  const date = new Date(`${start}T00:00:00`);
  date.setDate(date.getDate() + offset);
  return todayKey(date);
}

export function lastThirtyDays(today = todayKey()) {
  return Array.from({ length: 30 }, (_, index) => addDays(today, index - 29));
}

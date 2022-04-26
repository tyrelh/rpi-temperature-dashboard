
export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getISODateStringFromDate(date: Date): string {
  let year = `${date.getFullYear()}`;
  let month = `${date.getMonth() + 1}`.length === 1 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`.length === 1 ? `0${date.getDate()}` : `${date.getDate()}`;
  return `${year}-${month}-${day}`
}

export function getTimeStringFromDate(date: Date): string {
  return date.toLocaleTimeString("us-EN").toLowerCase()
}

export function dateDiffInDays(a: Date, b: Date): number {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

export function subtractDaysFromDate(date: Date, days: number): Date {
  if (days == 0) {
    return date;
  }
  date.setDate(date.getDate() - 1);
  return subtractDaysFromDate(date, --days);
}

export function subtractMinutesFromDate(date: Date, minutes: number): Date {
  if (minutes == 0) {
    return date;
  }
  date.setMinutes(date.getMinutes() -1);
  return subtractMinutesFromDate(date, --minutes);
}
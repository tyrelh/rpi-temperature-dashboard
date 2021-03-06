import { Temperature } from "../DTOS/Temperature";

export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getISODateStringFromDate(date: Date): string {
  let year = `${date.getFullYear()}`;
  let month = `${date.getMonth() + 1}`.length === 1 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`.length === 1 ? `0${date.getDate()}` : `${date.getDate()}`;
  return `${year}-${month}-${day}`
}

export function getTimeStringFromDate(date: Date): string {
  return `${get12HourFrom24(date.getHours())}:${format2DigitMinutes(date.getMinutes())} ${getAmPmFrom24(date.getHours())}`
  // return date.toLocaleTimeString("us-EN").toLowerCase()
}

function get12HourFrom24(n: number): number {
  const hours = n % 12;
  return (n === 12 ? 12 : hours);
}

function getAmPmFrom24(n: number): string {
  if (n >= 12) {
    return "pm";
  }
  return "am";
}

function format2DigitMinutes(minutes: number): string {
  const minString = minutes.toString();
  return (minString.length == 1 ? `0${minString}` : minString)
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
  const dateCopy: Date = new Date(date);
  dateCopy.setDate(date.getDate() - 1)
  // console.log("Date subtracted to: ", dateCopy);
  return subtractDaysFromDate(dateCopy, --days);
}

export function subtractMinutesFromDate(date: Date, minutes: number): Date {
  if (minutes == 0) {
    return date;
  }
  date.setMinutes(date.getMinutes() -1);
  return subtractMinutesFromDate(date, --minutes);
}


export function sortListByTimes(ascending: boolean = false): (a: Temperature, b: Temperature) => number {
  return (a: Temperature, b: Temperature) => {
    switch(true) {
      case ascending ? a.time > b.time : a.time < b.time:
        return 1;
      case ascending ? a.time < b.time : a.time > b.time:
        return -1;
      default:
        return 0;
    };
  };
}
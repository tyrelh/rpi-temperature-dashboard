
export function getISODateStringFromDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function getTimeStringFromDate(date: Date): string {
  return date.toLocaleTimeString("us-EN").toLowerCase()
}
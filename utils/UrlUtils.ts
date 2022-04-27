
export function buildQueryParams(params: Map<string, string>): string {
  const esc = encodeURIComponent;
  let queries: string[] = []
  for (let [key, value] of params) {
    queries.push(esc(key) + "=" + esc(value))
  }
  if (queries.length == 0) {
    return ("");
  }
  return ("?" + queries.join("&"));
}
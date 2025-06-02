export function isExpired(last: string, days = 1) {
  const now = Date.now();
  const then = new Date(last).getTime();
  return now - then > days * 24 * 60 * 60 * 1000;
}
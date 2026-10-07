// Basic in-memory rate limiting implementation
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30; // 30 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Cleanup job to prevent memory leaks from stale IP entries
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap) {
      if (now > record.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);
}

export function checkRateLimit(
  ip: string,
  maxRequests: number = RATE_LIMIT_MAX,
  windowSecondsOrMs: number = RATE_LIMIT_WINDOW
): { allowed: boolean; retryAfter?: number } {
  const windowMs = windowSecondsOrMs < 1000 ? windowSecondsOrMs * 1000 : windowSecondsOrMs;
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
  }

  record.count += 1;
  return { allowed: true };
}

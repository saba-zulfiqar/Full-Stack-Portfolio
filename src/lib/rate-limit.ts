interface RateLimitStore {
  [key: string]: { count: number; expiresAt: number };
}

const store: RateLimitStore = {};

/**
 * Basic in-memory rate limiter for server routes.
 * @param identifier e.g. IP address or client ID
 * @param limit max requests allowed within window
 * @param windowMs window duration in milliseconds
 */
export function rateLimit(identifier: string, limit = 5, windowMs = 60 * 1000): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = store[identifier];

  if (!entry || entry.expiresAt < now) {
    store[identifier] = { count: 1, expiresAt: now + windowMs };
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

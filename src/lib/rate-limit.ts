type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): { success: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= options.limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { success: true, remaining: options.limit - existing.count, retryAfterSeconds: 0 };
}

// Opportunistic cleanup so the in-memory map does not grow unboundedly.
if (typeof globalThis !== "undefined") {
  const g = globalThis as unknown as { __alRateLimitCleanup?: boolean };
  if (!g.__alRateLimitCleanup) {
    g.__alRateLimitCleanup = true;
    setInterval(() => {
      const now = Date.now();
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
      }
    }, 10 * 60 * 1000).unref?.();
  }
}

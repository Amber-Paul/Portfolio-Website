/**
 * In-memory rate limiter.
 * Constraints:
 *   - Max entries: 10,000 (evicts oldest when exceeded)
 *   - Lookup: O(1) via Map
 *   - Cleanup: runs at most once per 60s to avoid blocking the event loop
 *   - Reset: per-IP window resets after RATE_LIMIT_WINDOW_MS (default 15 min)
 * Limitation: state is lost on server restart (documented in README).
 */

import type { RateLimitEntry } from "@/types";

const MAX_ENTRIES = 10_000;
const CLEANUP_INTERVAL_MS = 60_000;

const store = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

function evictOldest(): void {
  const firstKey = store.keys().next().value;
  if (firstKey !== undefined) store.delete(firstKey);
}

function maybeCleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of Array.from(store)) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  maybeCleanup();

  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "900000", 10);
  const max = parseInt(process.env.RATE_LIMIT_MAX ?? "5", 10);
  const now = Date.now();

  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    if (store.size >= MAX_ENTRIES) evictOldest();
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

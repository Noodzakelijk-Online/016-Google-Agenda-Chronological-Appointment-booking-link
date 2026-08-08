'use strict';

function createRateLimiter({ windowMs, publicLimit, adminLimit }) {
  const buckets = new Map();
  return function check(key, isAdmin) {
    const now = Date.now();
    const limit = isAdmin ? adminLimit : publicLimit;
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) bucket = { count: 0, resetAt: now + windowMs };
    bucket.count += 1;
    buckets.set(key, bucket);
    if (buckets.size > 5000) {
      for (const [id, value] of buckets) if (value.resetAt <= now) buckets.delete(id);
    }
    return { allowed: bucket.count <= limit, limit, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt };
  };
}

module.exports = { createRateLimiter };

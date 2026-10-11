import { describe, expect, it } from 'vitest';
import { LOCK_MS, MAX_FAILURES, evaluateAttempt, recordFailure } from '../src/rate-limit';

describe('login rate limit', () => {
	const now = 1_700_000_000_000;

	it('allows a first attempt', () => {
		expect(evaluateAttempt(null, now)).toEqual({ allowed: true });
	});

	it('locks after MAX_FAILURES failures', () => {
		let row = recordFailure(null, now);
		for (let i = 1; i < MAX_FAILURES; i++) {
			row = recordFailure(row, now + i);
		}

		expect(row.fail_count).toBe(MAX_FAILURES);
		expect(row.locked_until).toBe(now + (MAX_FAILURES - 1) + LOCK_MS);

		const decision = evaluateAttempt(row, now + (MAX_FAILURES - 1));
		expect(decision.allowed).toBe(false);
		if (decision.allowed) throw new Error('expected lock');
		expect(decision.retryAfterMs).toBe(LOCK_MS);
	});

	it('allows login again after the lock expires', () => {
		const locked = {
			fail_count: MAX_FAILURES,
			locked_until: now + LOCK_MS,
			last_attempt_at: now
		};

		expect(evaluateAttempt(locked, now + LOCK_MS + 1)).toEqual({ allowed: true });
	});
});

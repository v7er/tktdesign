export const MAX_FAILURES = 5;
export const LOCK_MS = 15 * 60 * 1000;

export type AttemptRow = {
	fail_count: number;
	locked_until: number | null;
	last_attempt_at: number;
};

export type AttemptDecision = { allowed: true } | { allowed: false; retryAfterMs: number };

export function evaluateAttempt(row: AttemptRow | null, now: number): AttemptDecision {
	if (!row || row.locked_until == null) return { allowed: true };
	if (now > row.locked_until) return { allowed: true };
	return { allowed: false, retryAfterMs: row.locked_until - now };
}

export function recordFailure(row: AttemptRow | null, now: number): AttemptRow {
	const fail_count = (row?.fail_count ?? 0) + 1;
	const locked_until = fail_count >= MAX_FAILURES ? now + LOCK_MS : null;
	return { fail_count, locked_until, last_attempt_at: now };
}

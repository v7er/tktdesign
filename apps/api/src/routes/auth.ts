import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import type { AppEnv } from '../env';
import { COOKIE, SESSION_MS } from '../auth';
import { clientIp } from '../client-ip';
import { createDb } from '../db/client';
import { loginAttempts, sessions } from '../db/schema';
import { evaluateAttempt, recordFailure } from '../rate-limit';
import { randomToken, sha256Hex, verifySecret } from '../secret';

export const authRoutes = new Hono<AppEnv>();

authRoutes.post('/login', async (c) => {
	const hash = c.env.ADMIN_SECRET_HASH;
	if (!hash) return c.json({ error: 'Máy chủ chưa cấu hình mật khẩu quản trị.' }, 500);

	const db = createDb(c.env.DB);
	const ip = clientIp(c.req.raw);
	const now = Date.now();
	const existing = await db.query.loginAttempts.findFirst({
		where: eq(loginAttempts.ip, ip)
	});

	const decision = evaluateAttempt(
		existing
			? {
					fail_count: existing.failCount,
					locked_until: existing.lockedUntil,
					last_attempt_at: existing.lastAttemptAt
				}
			: null,
		now
	);
	if (!decision.allowed) {
		c.header('Retry-After', String(Math.ceil(decision.retryAfterMs / 1000)));
		return c.json({ error: 'Thử quá nhiều lần. Vui lòng đợi rồi đăng nhập lại.' }, 429);
	}

	const body = await c.req.json().catch(() => null);
	const secret = typeof body?.secret === 'string' ? body.secret : '';
	const ok = secret.length > 0 && (await verifySecret(secret, hash));

	if (!ok) {
		const next = recordFailure(
			existing
				? {
						fail_count: existing.failCount,
						locked_until: existing.lockedUntil,
						last_attempt_at: existing.lastAttemptAt
					}
				: null,
			now
		);
		await db
			.insert(loginAttempts)
			.values({
				ip,
				failCount: next.fail_count,
				lockedUntil: next.locked_until,
				lastAttemptAt: next.last_attempt_at
			})
			.onConflictDoUpdate({
				target: loginAttempts.ip,
				set: {
					failCount: next.fail_count,
					lockedUntil: next.locked_until,
					lastAttemptAt: next.last_attempt_at
				}
			});
		return c.json({ error: 'Mật khẩu không đúng.' }, 401);
	}

	await db.delete(loginAttempts).where(eq(loginAttempts.ip, ip));
	const token = randomToken();
	const tokenHash = await sha256Hex(token);
	await db.insert(sessions).values({
		tokenHash,
		expiresAt: now + SESSION_MS,
		createdAt: now
	});

	const secure = new URL(c.req.url).protocol === 'https:';
	setCookie(c, COOKIE, token, {
		httpOnly: true,
		path: '/',
		sameSite: 'Lax',
		secure,
		maxAge: SESSION_MS / 1000
	});

	return c.json({ ok: true });
});

authRoutes.post('/logout', async (c) => {
	const token = getCookie(c, COOKIE);
	deleteCookie(c, COOKIE, { path: '/' });
	if (token) {
		const tokenHash = await sha256Hex(token);
		const db = createDb(c.env.DB);
		await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
	}
	return c.json({ ok: true });
});

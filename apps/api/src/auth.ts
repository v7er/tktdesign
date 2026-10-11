import { getCookie } from 'hono/cookie';
import type { MiddlewareHandler } from 'hono';
import { and, eq, gt } from 'drizzle-orm';
import { createDb } from './db/client';
import { sessions } from './db/schema';
import { sha256Hex } from './secret';
import type { AppEnv } from './env';

export const COOKIE = 'tkt_session';
export const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
	const token = getCookie(c, COOKIE);
	if (!token) return c.json({ error: 'Chưa đăng nhập.' }, 401);
	const tokenHash = await sha256Hex(token);
	const db = createDb(c.env.DB);
	const row = await db.query.sessions.findFirst({
		where: and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, Date.now())),
		columns: { tokenHash: true }
	});
	if (!row) return c.json({ error: 'Phiên đăng nhập hết hạn.' }, 401);
	await next();
};

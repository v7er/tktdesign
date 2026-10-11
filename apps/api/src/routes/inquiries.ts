import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import type { AppEnv } from '../env';
import { createDb } from '../db/client';
import { inquiries } from '../db/schema';
import { serializeInquiry } from '../db/serialize';
import { parseInquiry } from '../validate';

export const publicInquiryRoutes = new Hono<AppEnv>();
export const adminInquiryRoutes = new Hono<AppEnv>();

publicInquiryRoutes.post('/', async (c) => {
	const parsed = parseInquiry(await c.req.json().catch(() => null));
	if (!parsed.ok) return c.json({ error: parsed.error }, 400);
	const id = crypto.randomUUID();
	const db = createDb(c.env.DB);
	const d = parsed.data;
	await db.insert(inquiries).values({
		id,
		name: d.name,
		phone: d.phone,
		email: d.email,
		district: d.district,
		landAreaM2: d.land_area_m2,
		message: d.message,
		status: 'new',
		createdAt: Date.now()
	});
	return c.json({ ok: true, id }, 201);
});

adminInquiryRoutes.get('/', async (c) => {
	const db = createDb(c.env.DB);
	const rows = await db.query.inquiries.findMany({
		orderBy: [desc(inquiries.createdAt)]
	});
	return c.json({ inquiries: rows.map(serializeInquiry) });
});

adminInquiryRoutes.patch('/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.json().catch(() => null);
	const status = body?.status;
	if (!['new', 'read', 'archived'].includes(status)) {
		return c.json({ error: 'Trạng thái không hợp lệ.' }, 400);
	}
	const db = createDb(c.env.DB);
	const existing = await db.query.inquiries.findFirst({
		where: eq(inquiries.id, id),
		columns: { id: true }
	});
	if (!existing) return c.json({ error: 'Không tìm thấy liên hệ.' }, 404);
	await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
	const row = await db.query.inquiries.findFirst({ where: eq(inquiries.id, id) });
	return c.json({ inquiry: serializeInquiry(row!) });
});

adminInquiryRoutes.delete('/:id', async (c) => {
	const db = createDb(c.env.DB);
	await db.delete(inquiries).where(eq(inquiries.id, c.req.param('id')));
	return c.json({ ok: true });
});

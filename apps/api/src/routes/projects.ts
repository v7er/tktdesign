import { Hono } from 'hono';
import { and, asc, desc, eq, max } from 'drizzle-orm';
import type { AppEnv } from '../env';
import { createDb } from '../db/client';
import { uniqueSlug } from '../db/projects';
import { projectImages, projects } from '../db/schema';
import { serializeProject } from '../db/serialize';
import { parseProject } from '../validate';

export const publicProjectRoutes = new Hono<AppEnv>();
export const adminProjectRoutes = new Hono<AppEnv>();

publicProjectRoutes.get('/', async (c) => {
	const featured = c.req.query('featured') === '1';
	const category = c.req.query('category');
	const db = createDb(c.env.DB);
	const rows = await db.query.projects.findMany({
		where: and(
			eq(projects.status, 'published'),
			featured ? eq(projects.featured, true) : undefined,
			category ? eq(projects.category, category) : undefined
		),
		orderBy: [desc(projects.featured), asc(projects.sortOrder), desc(projects.year)],
		with: { images: { orderBy: [asc(projectImages.sortOrder)] } }
	});
	return c.json({
		projects: rows.map((row) => serializeProject(row, row.images))
	});
});

publicProjectRoutes.get('/:slug', async (c) => {
	const db = createDb(c.env.DB);
	const row = await db.query.projects.findFirst({
		where: and(eq(projects.slug, c.req.param('slug')), eq(projects.status, 'published')),
		with: { images: { orderBy: [asc(projectImages.sortOrder)] } }
	});
	if (!row) return c.json({ error: 'Không tìm thấy dự án.' }, 404);
	return c.json({ project: serializeProject(row, row.images) });
});

adminProjectRoutes.get('/', async (c) => {
	const db = createDb(c.env.DB);
	const rows = await db.query.projects.findMany({
		orderBy: [desc(projects.updatedAt)],
		with: { images: { orderBy: [asc(projectImages.sortOrder)] } }
	});
	return c.json({
		projects: rows.map((row) => serializeProject(row, row.images))
	});
});

adminProjectRoutes.get('/:id', async (c) => {
	const db = createDb(c.env.DB);
	const row = await db.query.projects.findFirst({
		where: eq(projects.id, c.req.param('id')),
		with: { images: { orderBy: [asc(projectImages.sortOrder)] } }
	});
	if (!row) return c.json({ error: 'Không tìm thấy dự án.' }, 404);
	return c.json({ project: serializeProject(row, row.images) });
});

adminProjectRoutes.post('/', async (c) => {
	const parsed = parseProject(await c.req.json().catch(() => null));
	if (!parsed.ok) return c.json({ error: parsed.error }, 400);
	const db = createDb(c.env.DB);
	const now = Date.now();
	const id = crypto.randomUUID();
	const slug = await uniqueSlug(db, parsed.data.slug);
	const p = parsed.data;
	await db.insert(projects).values({
		id,
		slug,
		title: p.title,
		summary: p.summary,
		description: p.description,
		location: p.location,
		year: p.year,
		category: p.category,
		landWidthM: p.land_width_m,
		landDepthM: p.land_depth_m,
		floorAreaM2: p.floor_area_m2,
		floors: p.floors,
		functions: p.functions,
		coverKey: null,
		featured: p.featured,
		status: p.status,
		sortOrder: 0,
		createdAt: now,
		updatedAt: now
	});
	const row = await db.query.projects.findFirst({ where: eq(projects.id, id) });
	return c.json({ project: serializeProject(row!) }, 201);
});

adminProjectRoutes.put('/:id', async (c) => {
	const id = c.req.param('id');
	const db = createDb(c.env.DB);
	const existing = await db.query.projects.findFirst({
		where: eq(projects.id, id),
		columns: { id: true }
	});
	if (!existing) return c.json({ error: 'Không tìm thấy dự án.' }, 404);
	const parsed = parseProject(await c.req.json().catch(() => null));
	if (!parsed.ok) return c.json({ error: parsed.error }, 400);
	const p = parsed.data;
	const slug = await uniqueSlug(db, p.slug, id);
	await db
		.update(projects)
		.set({
			slug,
			title: p.title,
			summary: p.summary,
			description: p.description,
			location: p.location,
			year: p.year,
			category: p.category,
			landWidthM: p.land_width_m,
			landDepthM: p.land_depth_m,
			floorAreaM2: p.floor_area_m2,
			floors: p.floors,
			functions: p.functions,
			featured: p.featured,
			status: p.status,
			updatedAt: Date.now()
		})
		.where(eq(projects.id, id));
	const row = await db.query.projects.findFirst({
		where: eq(projects.id, id),
		with: { images: { orderBy: [asc(projectImages.sortOrder)] } }
	});
	return c.json({ project: serializeProject(row!, row!.images) });
});

adminProjectRoutes.delete('/:id', async (c) => {
	const id = c.req.param('id');
	const db = createDb(c.env.DB);
	const row = await db.query.projects.findFirst({
		where: eq(projects.id, id),
		with: { images: true }
	});
	if (!row) return c.json({ error: 'Không tìm thấy dự án.' }, 404);
	const keys = [...row.images.map((i) => i.r2Key), row.coverKey].filter(Boolean) as string[];
	if (c.env.MEDIA) await Promise.all(keys.map((key) => c.env.MEDIA!.delete(key)));
	await db.delete(projectImages).where(eq(projectImages.projectId, id));
	await db.delete(projects).where(eq(projects.id, id));
	return c.json({ ok: true });
});

const ALLOWED_TYPES = new Map([
	['image/jpeg', 'jpg'],
	['image/png', 'png'],
	['image/webp', 'webp']
]);

adminProjectRoutes.post('/:id/images', async (c) => {
	const id = c.req.param('id');
	const db = createDb(c.env.DB);
	const row = await db.query.projects.findFirst({ where: eq(projects.id, id) });
	if (!row) return c.json({ error: 'Không tìm thấy dự án.' }, 404);

	const form = await c.req.formData();
	const file = form.get('file');
	if (!(file instanceof File)) return c.json({ error: 'Thiếu tệp ảnh.' }, 400);
	if (file.size > 8 * 1024 * 1024) return c.json({ error: 'Ảnh tối đa 8MB.' }, 400);
	const ext = ALLOWED_TYPES.get(file.type);
	if (!ext) return c.json({ error: 'Chỉ nhận JPEG, PNG hoặc WebP.' }, 400);

	if (!c.env.MEDIA) return c.json({ error: 'Kho ảnh R2 chưa bật trên Cloudflare.' }, 503);
	const imageId = crypto.randomUUID();
	const key = `projects/${id}/${imageId}.${ext}`;
	await c.env.MEDIA.put(key, await file.arrayBuffer(), {
		httpMetadata: { contentType: file.type }
	});

	const asCover = form.get('cover') === '1' || !row.coverKey;
	if (asCover) {
		await db.update(projects).set({ coverKey: key, updatedAt: Date.now() }).where(eq(projects.id, id));
	}

	const [agg] = await db
		.select({ m: max(projectImages.sortOrder) })
		.from(projectImages)
		.where(eq(projectImages.projectId, id));
	await db.insert(projectImages).values({
		id: imageId,
		projectId: id,
		r2Key: key,
		alt: file.name || '',
		sortOrder: (agg?.m ?? -1) + 1
	});

	const updated = await db.query.projects.findFirst({
		where: eq(projects.id, id),
		with: { images: { orderBy: [asc(projectImages.sortOrder)] } }
	});
	return c.json({ project: serializeProject(updated!, updated!.images) }, 201);
});

adminProjectRoutes.delete('/:id/images/:imageId', async (c) => {
	const id = c.req.param('id');
	const imageId = c.req.param('imageId');
	const db = createDb(c.env.DB);
	const img = await db.query.projectImages.findFirst({
		where: and(eq(projectImages.id, imageId), eq(projectImages.projectId, id))
	});
	if (!img) return c.json({ error: 'Không tìm thấy ảnh.' }, 404);
	if (c.env.MEDIA) await c.env.MEDIA.delete(img.r2Key);
	await db.delete(projectImages).where(eq(projectImages.id, imageId));
	const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
	if (project?.coverKey === img.r2Key) {
		const next = await db.query.projectImages.findFirst({
			where: eq(projectImages.projectId, id),
			orderBy: [asc(projectImages.sortOrder)]
		});
		await db
			.update(projects)
			.set({ coverKey: next?.r2Key ?? null, updatedAt: Date.now() })
			.where(eq(projects.id, id));
	}
	const updated = await db.query.projects.findFirst({
		where: eq(projects.id, id),
		with: { images: { orderBy: [asc(projectImages.sortOrder)] } }
	});
	return c.json({ project: serializeProject(updated!, updated!.images) });
});

import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const mediaRoutes = new Hono<AppEnv>();

mediaRoutes.get('/:key{.+}', async (c) => {
	const key = c.req.param('key');
	if (!key || key.includes('..')) return c.json({ error: 'Không tìm thấy tệp.' }, 404);
	if (!c.env.MEDIA) return c.json({ error: 'Kho ảnh chưa sẵn sàng.' }, 503);
	const object = await c.env.MEDIA.get(key);
	if (!object) return c.json({ error: 'Không tìm thấy tệp.' }, 404);
	const headers = new Headers();
	headers.set('etag', object.httpEtag);
	headers.set('cache-control', 'public, max-age=86400');
	const type = object.httpMetadata?.contentType || 'application/octet-stream';
	headers.set('content-type', type);
	return new Response(object.body, { headers });
});

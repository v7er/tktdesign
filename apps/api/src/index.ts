import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requireAdmin } from './auth';
import type { AppEnv } from './env';
import { authRoutes } from './routes/auth';
import { adminInquiryRoutes, publicInquiryRoutes } from './routes/inquiries';
import { mediaRoutes } from './routes/media';
import { adminProjectRoutes, publicProjectRoutes } from './routes/projects';

export function createApp() {
	const app = new Hono<AppEnv>();

	app.use(
		'/api/*',
		cors({
			origin: (origin) => origin || '*',
			credentials: true
		})
	);

	app.get('/api/health', (c) => c.json({ ok: true, service: 'tktdesign-api' }));
	app.route('/api/auth', authRoutes);
	app.route('/api/projects', publicProjectRoutes);
	app.route('/api/inquiries', publicInquiryRoutes);
	app.route('/api/media', mediaRoutes);

	const admin = new Hono<AppEnv>();
	admin.use('*', requireAdmin);
	admin.get('/me', (c) => c.json({ ok: true }));
	admin.route('/projects', adminProjectRoutes);
	admin.route('/inquiries', adminInquiryRoutes);
	app.route('/api/admin', admin);

	app.notFound((c) => c.json({ error: 'Không tìm thấy.' }, 404));
	return app;
}

const app = createApp();

export default {
	fetch: app.fetch
};

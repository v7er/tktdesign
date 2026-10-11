import { env } from 'cloudflare:workers';
import type { RequestHandler } from './$types';

const LOCAL_API = process.env.API_ORIGIN ?? 'http://127.0.0.1:8787';

const handle: RequestHandler = async ({ request, params, platform, url }) => {
	const rest = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetPath = `/api/${rest}${url.search}`;
	const api = env.API ?? platform?.env?.API;

	if (api) {
		const headers = new Headers(request.headers);
		headers.delete('host');
		const init: RequestInit = { method: request.method, headers };
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			init.body = request.body;
			Object.assign(init, { duplex: 'half' });
		}
		return unwrap(await api.fetch(new Request(`https://tktdesign-api.internal${targetPath}`, init)));
	}

	const headers = new Headers(request.headers);
	headers.delete('host');
	const init: RequestInit = {
		method: request.method,
		headers,
		redirect: 'manual'
	};
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		init.body = request.body;
		Object.assign(init, { duplex: 'half' });
	}
	return unwrap(await fetch(`${LOCAL_API}${targetPath}`, init));
};

function unwrap(res: Response): Response {
	const headers = new Headers(res.headers);
	headers.delete('content-encoding');
	headers.delete('content-length');
	return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;

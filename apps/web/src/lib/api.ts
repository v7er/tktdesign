export class ApiError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export async function api<T>(
	path: string,
	init: RequestInit & { fetch?: typeof fetch } = {}
): Promise<T> {
	const { fetch: f = fetch, ...rest } = init;
	const res = await f(path, {
		credentials: 'include',
		...rest,
		headers: {
			...(rest.body instanceof FormData ? {} : { 'content-type': 'application/json' }),
			...rest.headers
		}
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new ApiError((data as { error?: string }).error || 'Không gọi được máy chủ.', res.status);
	}
	return data as T;
}
